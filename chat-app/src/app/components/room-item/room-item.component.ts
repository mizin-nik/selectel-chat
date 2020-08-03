import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SocketIoService } from '@app/services/socket-io/socket-io.service';
import { UserModelI } from '@app/services/socket-io/socket-io.model';
import { StorageService } from '@app/services/storage/storage.service';
import { Subscription } from "rxjs";

@Component({
  selector: 'app-room-item',
  templateUrl: 'room-item.component.html',
  styleUrls: [`./room-item.component.scss`],
  encapsulation: ViewEncapsulation.None
})

export class RoomItemComponent implements OnInit {
  private RoomId: string;
  private RoomName: string;
  private RoomMessages: any;
  private RoomEntered: boolean;

  private onSocketRoomMessagesAdded$: Subscription;
  private onSocketRoomsAdded$: Subscription;

  public RoomMessageForm: FormGroup;

  constructor(
    private route: Router,
    private router: ActivatedRoute,
    private formBuilder: FormBuilder,
    private socketIo: SocketIoService,
    private storage: StorageService
  ) {
    this.RoomMessageForm = this.formBuilder.group({
      message: ['', Validators.required]
    });

    this.route.routeReuseStrategy.shouldReuseRoute = e =>{
      return false;
    };
  }

  ngOnInit(): void {

    this.router.paramMap.subscribe(
      value => {
        this.RoomId = value.get('id');

        this.storageEnteredRooms.forEach(item => {
          if (item === this.RoomId) {
            this.RoomEntered = true;
          }
        });

        this.onSocketRoomsAdded$ = this.socketIo.onSocketRooms().subscribe(
          value => {
            for (const i of Object.keys(value)) {
              if (value[i].id === this.RoomId) {
                this.RoomName = value[i].name;
              }
            }
          }
        );

        this.onSocketRoomMessagesAdded$ = this.socketIo.onSocketRoomMessagesAdded().subscribe(
          value => {
            this.RoomMessages = value.filter(item => {
              return item.room === this.RoomId;
            }).reverse();
          }
        );
      }
    );

    this.route.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        for (const key of Object.keys(this)) {
          if (key.split('$').length > 1 && this[key] instanceof Subscription) {
            this[key].unsubscribe();
          }
        }
      }
    });
  }

  onJoinRoom(): void {
    const sessionRooms = this.storageEnteredRooms || [];

    sessionRooms.push(this.RoomId);

    this.storage.setStorage({
      key: 'rooms',
      value: sessionRooms
    }, 'session').then(e => {
      this.RoomEntered = true;
      this.socketIo.joinRoom(this.RoomId);
    })
  }

  onLeaveRoom(): void {
    let sessionRooms = this.storageEnteredRooms || [];

    sessionRooms = sessionRooms.filter(item => {
      if (item !== this.RoomId) {
        return item;
      }
    });
    this.storage.setStorage({
      key: 'rooms',
      value: sessionRooms
    }, 'session').then(e => {
      this.socketIo.leaveRoom(this.RoomId);
      this.route.navigateByUrl('/rooms-view').catch();
    })
  }

  onSendMessage(): void {
    this.socketIo.sendMessage(this.RoomId, this.RoomMessageForm.controls.message.value);
    this.RoomMessageForm.controls.message.patchValue('');
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
