uuid = require 'node-uuid'
_ = require 'underscore'

Backbone = require 'backbone'

io = require('socket.io')(3000)

# models
class User extends Backbone.Model
  constructor: (name) ->
    super {
      id  : uuid.v4()
      name: name
    }

class Room extends Backbone.Model

  constructor: (user, name) ->
    super {
      id   : uuid.v4()
      owner: user.id
      name : name
    }
    @messages = new Messages
    @users    = new Users

  createMessage: (user, body) ->
    message = new Message(@, user, body)
    @messages.add message
    message

  joinUser: (user) ->
    @users.add user

  leaveUser: (user) ->
    @users.remove user

class Message extends Backbone.Model

  constructor: (room, user, body) ->
    super {
      id       : uuid.v4()
      room     : room.id
      user     : user.id
      body     : body
      createdAt: Date.now()
    }

# collections
class Users extends Backbone.Collection
  model: User

class Rooms extends Backbone.Collection
  model: Room

class Messages extends Backbone.Collection
  model: Message
  comparator: 'createdAt'

# storage
USERS = new Users
ROOMS = new Rooms

# handlers
collectionHandler = (event, room = null, name, model) ->
  if room
    io.to(room).emit "#{name}:#{event}", model.toJSON(), room
  else
    io.sockets.emit "#{name}:#{event}", model.toJSON()

collectionAdd = (room = null, name, model) ->
  collectionHandler "added", room, name, model
collectionChange = (room = null, name, model) ->
  collectionHandler "changed", room, name, model
collectionRemove = (room = null, name, model) ->
  collectionHandler "removed", room, name, model

roomAddH = (room) ->
  room.messages.on 'add', _.bind(collectionAdd   , null, room.id, 'room:messages')
  room.users.on 'add'   , _.bind(collectionAdd   , null, room.id, 'room:users')
  room.users.on 'remove', _.bind(collectionRemove, null, room.id, 'room:users')

roomRemoveH = (room) ->
  room.messages.off()
  room.users.off()

# handler bindings
USERS.on 'add'   , _.bind(collectionAdd   , null, null, 'users')
USERS.on 'change', _.bind(collectionChange, null, null, 'users')
USERS.on 'remove', _.bind(collectionRemove, null, null, 'users')

ROOMS.on 'add'   , _.bind(collectionAdd   , null, null, 'rooms')
ROOMS.on 'change', _.bind(collectionChange, null, null, 'rooms')
ROOMS.on 'remove', _.bind(collectionRemove, null, null, 'rooms')

ROOMS.on 'add'   , roomAddH
ROOMS.on 'remove', roomRemoveH

USERS.on 'remove', (user) ->
  ROOMS.each (room) ->
    room.leaveUser user

# socket
io.on 'connection', (socket) =>

  user = socket.currentUser = new User('Anonymous')
  USERS.add user

  socket.emit 'entered'  , user.toJSON()
  socket.emit 'users:added', USERS.filter( (m) -> m != user ).map( (m) -> m.toJSON() )
  socket.emit 'rooms:added', ROOMS.toJSON()

  socket.on 'setName', (name, cb = ->) ->
    unless name
      cb('Name not specified')
      return

    user.set 'name', name
    cb(null)

  socket.on 'createRoom', (name, cb = ->) ->
    unless name
      cb('Name not specified')
      return

    room = new Room(user, name)
    ROOMS.add room

    socket.join(room.id)
    room.joinUser user

    cb(null)

  socket.on 'joinRoom', (roomId, cb = ->) ->
    room = ROOMS.get roomId
    unless room
      cb('Room not exists')
      return

    socket.join(room.id)
    room.joinUser user

    socket.emit 'room:users:added', room.users.toJSON(), room.id
    socket.emit 'room:messages:added', room.messages.last(10).map( (m) -> m.toJSON() ), room.id

    cb(null)

  socket.on 'leaveRoom', (roomId, cb = ->) ->
    room = ROOMS.get roomId
    unless room
      cb('Room not exists')
      return

    unless room.users.include(user)
      cb('First join to group')
      return

    if room.users.length == 1
      ROOMS.remove room
    else
      room.leaveUser user
      socket.emit 'room:users:removed', room.users.toJSON(), room.id
    socket.leave(room.id)

    cb(null)

  socket.on 'sendMessage', (roomId, body, cb = ->) ->
    unless body
      cb('Body not specified')
      return

    room = ROOMS.get roomId
    unless room
      cb('Room not exists')
      return

    unless room.users.include(user)
      cb('First join to group')
      return

    room.createMessage user, body

    cb(null)

  socket.on 'disconnect', ->
    USERS.remove user