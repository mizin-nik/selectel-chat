import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { DomService } from '@app/services/dom/dom.service';
import { PopupService } from '@app/services/popup/popup.service';
import { TabsService } from '@app/services/tabs/tabs.service';
import { SocketIoService } from '@app/services/socket-io/socket-io.service';
import { StorageService } from '@app/services/storage/storage.service';
import { UserModelI, RoomModelI } from '@app/services/socket-io/socket-io.model';

/**
 * Components
 */
import { RoomCreateComponent } from '../room-create/room-create.component';
import { UserModelComponent } from '../user-model/user-model.component';
import { Subscription } from "rxjs";

@Component({
  selector: 'app-side-view',
  templateUrl: 'side-view.component.html',
  styleUrls: [`./side-view.component.scss`],
  encapsulation: ViewEncapsulation.None
})

export class SideViewComponent implements OnInit, OnDestroy {
  private UsersList: Array<UserModelI> = [];
  private RoomsList: Array<RoomModelI> = [];

  private onSocketRooms$: Subscription;
  private onSocketUser$: Subscription;

  constructor(
    private dom: DomService,
    private popup: PopupService,
    private tabs: TabsService,
    private socketIo: SocketIoService,
    private storage: StorageService
  ) {}

  ngOnInit(): void {
    this.tabs.onInit();

    this.onSocketRooms$ = this.socketIo.onSocketRooms().subscribe(
      value => this.RoomsList = value
    );

    this.onSocketUser$ = this.socketIo.onSocketUser().subscribe(
      value => this.UsersList = value
    );

    this.socketIo.onSocketEntered().subscribe(
      value => this.onChangeUserName(value)
    );
  }

  ngOnDestroy(): void {
    for (const key of Object.keys(this)) {
      if (key.split('$').length > 1 && this[key] instanceof Subscription) {
        this[key].unsubscribe();
      }
    }
  }

  onCreateRoom(): void {
    this.dom.initComponent(RoomCreateComponent, {
      onClose: () => this.popup.onCloseEvent()
    }).then(
      resolve => {
        this.popup.configure({
          controls: true,
          blur: true,
          onCreate: () => {
            this.dom.insertComponent(resolve);
          },
          onClose: () => {
            this.dom.destroyComponent();
          }
        });
        this.popup.onBuild();
      }
    );
  }

  onChangeUserName(userModel: UserModelI): void {
    this.dom.initComponent(UserModelComponent, {
      inputData: {
        userModel: userModel
      },
      onClose: () => this.popup.onCloseEvent()
    }).then(
      resolve => {
        this.popup.configure({
          controls: true,
          blur: true,
          onCreate: () => {
            this.dom.insertComponent(resolve);
          },
          onClose: () => {
            this.dom.destroyComponent();
          }
        });
        this.popup.onBuild();
      }
    );
  }
}
