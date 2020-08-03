import { Component, ViewEncapsulation, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EnteredPopupInterface } from '@app/services/popup/popup.model';
import { SocketIoService } from '@app/services/socket-io/socket-io.service';
import { StorageService } from '@app/services/storage/storage.service';


@Component({
  selector: 'app-user-model',
  templateUrl: 'user-model.component.html',
  styleUrls: [`./user-model.component.scss`],
  encapsulation: ViewEncapsulation.None
})

export class UserModelComponent implements OnInit {
  public UserModelForm: FormGroup;

  @Input() EnteredData: EnteredPopupInterface;

  constructor(
    private formBuilder: FormBuilder,
    private socketIo: SocketIoService,
    private storage: StorageService
  ) {
    this.UserModelForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.storage.setStorage({
      key: 'user',
      value: this.EnteredData.inputData.userModel
    }, 'session').then(_ => {
      this.UserModelForm.controls.name.patchValue(
        this.EnteredData.inputData.userModel.name || 'Anonymous'
      );
    });
  }

  onSave(): void {
    this.socketIo.setName(
      this.UserModelForm.controls.name.value
    );
    this.storage.setStorage({
      key: 'user',
      value: {
        id: this.EnteredData.inputData.userModel.id,
        name: this.UserModelForm.controls.name.value || 'Anonymous'
      }
    }, 'session').then( _ => this.onClose());
  }

  onClose(): void {
    this.EnteredData.onClose();
  }
}
