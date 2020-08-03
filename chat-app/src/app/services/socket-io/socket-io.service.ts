import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { map, skipWhile } from 'rxjs/operators';
import { StorageService } from '../storage/storage.service';
import {
  InputEnteredI,
  RoomModelI, UserModelI
} from './socket-io.model';

declare var io: any;

@Injectable({
    providedIn: 'root'
})

export class SocketIoService {
  private SocketIO: any;

  private SocketIORooms$: BehaviorSubject<any> = new BehaviorSubject<any>( null);
  private SocketIOUser$: BehaviorSubject<any> = new BehaviorSubject<any>( null);

  private SocketIORoomUsersAdded$: BehaviorSubject<any> = new BehaviorSubject<any>( null);
  private SocketIORoomUsersRemoved$: BehaviorSubject<any> = new BehaviorSubject<any>( null);
  private SocketIORoomMessagesAdded$: BehaviorSubject<any> = new BehaviorSubject<any>( null);

  private SocketIOEntered$: BehaviorSubject<InputEnteredI> = new BehaviorSubject<InputEnteredI>( null);

  constructor(
    private storage: StorageService,
    private router: Router,
  ) {
  }

  onSocketConnect(): void {
    this.SocketIO = io.connect('http://localhost:3000');
    this.onSocketMessages();
  }

  onSocketMessages(): void {
    this.SocketIO.on('connect', () => {
      if (this.SocketIO.connected) {

        /**
         * массив новых комнат, либо одна комната
         */
        this.SocketIO.on('rooms:added', (data: any) => {
          const dataRooms = this.SocketIORooms$.getValue() || [];
          const sessionRooms = this.storageEnteredRooms || [];

          if (!data.length && data.hasOwnProperty('owner')) {
            dataRooms.push(data);
            sessionRooms.push(data.id);

            if (data.owner === this.storageUserModel.id) {
              this.storage.setStorage({ key: 'rooms', value: sessionRooms }, 'session').then(
                _ => this.router.navigateByUrl(`rooms-view/${data.id}`)
              );
            }
          } else {
            for (const i of Object.keys(data)) {
              dataRooms.push(data[i]);
            }
          }
          this.SocketIORooms$.next(dataRooms);
        });


        /**
         * массив измененных комнат, либо одна комната
         */
        this.SocketIO.on('rooms:changed', (data: any) => {
          // this.SocketIORoomsChanged$.next(data);
        });


        /**
         * массив удаленных комнат, либо одна комната
         */
        this.SocketIO.on('rooms:removed', (data: any) => {
          let dataRooms = this.SocketIORooms$.getValue() || [];

          dataRooms = dataRooms.filter(item => {
            if (item.id !== data.id) {
              return item;
            }
          });

          this.SocketIORooms$.next(dataRooms);
        });


        /**
         * массив новых пользователей, либо один пользователь
         */
        this.SocketIO.on('users:added', (data: any) => {
          let dataUsers = this.SocketIOUser$.getValue() || [];

          if (JSON.stringify(data) === '[]') {
            return;
          }
          if (data.length) {
            for (const i of Object.keys(data)) {
              dataUsers.push(data[i]);
            }
          } else {
            dataUsers.push(data);
          }

          this.SocketIOUser$.next(dataUsers);
        });


        /**
         * массив измененных пользователей, либо один пользователь
         */
        this.SocketIO.on('users:changed', (data: any) => {
          let dataUsers = this.SocketIOUser$.getValue() || [];

          for (const i of Object.keys(dataUsers)) {
            if (dataUsers[i].id === data.id) {
              dataUsers[i].name = data.name;
            }
          }

          this.SocketIOUser$.next(dataUsers);
        });


        /**
         * массив удаленных пользователей, либо один пользователь
         */
        this.SocketIO.on('users:removed', (data: any) => {
          let dataUsers = this.SocketIOUser$.getValue() || [];

          dataUsers = dataUsers.filter(item => {
            if (item.id !== data.id) {
              return item;
            }
          });

          this.SocketIOUser$.next(dataUsers);
        });

        /**
         * массив новых пользователей в комнате, либо один пользователь, вторым параметром идет id комнаты
         */
        this.SocketIO.on('room:users:added', (data: any) => {
          this.SocketIORoomUsersAdded$.next(data);
        });

        /**
         * массив удаленных пользователей в комнате, либо один пользователь, вторым параметром идет id комнаты
         */
        this.SocketIO.on('room:users:removed', (data: any) => {
          this.SocketIORoomUsersRemoved$.next(data);
        });

        /**
         * массив новых сообщений, либо одно сообщение вторым параметром идет id комнаты
         */
        this.SocketIO.on('room:messages:added', (data: any) => {
          const dataMessages = this.SocketIORoomMessagesAdded$.getValue() || [];

          if (!data.length && data.hasOwnProperty('createdAt')) {
            dataMessages.push(data);
          } else {
            for (const i of Object.keys(data)) {
              dataMessages.push(data[i]);
            }
          }

          this.SocketIORoomMessagesAdded$.next(dataMessages);
        });

        /**
         * модель пользователя
         */
        this.SocketIO.on('entered', (data: InputEnteredI) => {
          this.SocketIOEntered$.next(data);
        });
      }
    });
  }

  onSocketRooms(): Observable<any> {
    return this.SocketIORooms$.pipe(
      skipWhile( value => value === null)
    );
  }

  onSocketUser(): Observable<any> {
    return this.SocketIOUser$.pipe(
      skipWhile( value => value === null)
    );
  }

  onSocketEntered(): Observable<any> {
    return this.SocketIOEntered$.pipe(
      skipWhile( value => value === null)
    );
  }

  onSocketRoomUsersAdded(): Observable<any> {
    return this.SocketIORoomUsersAdded$.pipe(
      skipWhile( value => value === null)
    );
  }

  onSocketRoomUsersRemoved(): Observable<any> {
    return this.SocketIORoomUsersRemoved$.pipe(
      skipWhile( value => value === null)
    );
  }

  onSocketRoomMessagesAdded(): Observable<any> {
    return this.SocketIORoomMessagesAdded$.pipe(
      skipWhile( value => value === null)
    );
  }

  setName(value: string): void {
    this.SocketIO.emit('setName', value);
  }

  createRoom(value: string): void {
    this.SocketIO.emit('createRoom', value);
  }

  joinRoom(id: string): void {
    this.SocketIO.emit('joinRoom', id);
  }

  leaveRoom(id: string): void {
    this.SocketIO.emit('leaveRoom', id);
  }

  sendMessage(id: string, value: string): void {
    this.SocketIO.emit('sendMessage', id, value);
  }

  get storageEnteredRooms(): any {
    try {
      return JSON.parse(
        this.storage.getStorage({ key: 'rooms' }, 'session')
      ) || [];
    } catch (e) {
      return;
    }
  }

  get storageUserModel(): UserModelI {
    try {
      return JSON.parse(
        this.storage.getStorage({ key: 'user' }, 'session')
      )
    } catch (e) {}
  }
}
