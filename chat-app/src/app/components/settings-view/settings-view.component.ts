import { Component, ViewEncapsulation } from '@angular/core';
import { DomService } from "@app/services/dom/dom.service";
import { PopupService } from '@app/services/popup/popup.service';
import { StorageService } from '@app/services/storage/storage.service';
import { UserModelI } from '@app/services/socket-io/socket-io.model';

/**
 * Components
 */
import { UserModelComponent } from '../user-model/user-model.component';

@Component({
  selector: 'app-settings-view',
  templateUrl: 'settings-view.component.html',
  styleUrls: [`./settings-view.component.scss`],
  encapsulation: ViewEncapsulation.None
})

export class SettingsViewComponent {
  public UserModel: UserModelI = null;

  constructor(
    private dom: DomService,
    private popup: PopupService,
    private storage: StorageService
  ) {
    this.onUserModel();
  }

  onUserModel(): void {
    try {
      this.UserModel = JSON.parse(this.storage.getStorage({ key: 'user' }, 'session'))
    } catch (e) {}
  }

  onChangeUserName(userModel: UserModelI): void {
    this.dom.initComponent(UserModelComponent, {
      inputData: {
        userModel: userModel
      },
      onClose: () => {
        this.popup.onCloseEvent();
        this.onUserModel();
      }
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
