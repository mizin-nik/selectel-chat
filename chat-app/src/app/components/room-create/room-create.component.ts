import { Component, ViewEncapsulation, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EnteredPopupInterface } from '@app/services/popup/popup.model';
import { SocketIoService } from '@app/services/socket-io/socket-io.service';


@Component({
  selector: 'app-room-create',
  templateUrl: 'room-create.component.html',
  styleUrls: [`./room-create.component.scss`],
  encapsulation: ViewEncapsulation.None
})

export class RoomCreateComponent implements OnInit {
  public RoomModelForm: FormGroup;

  @Input() EnteredData: EnteredPopupInterface;

  constructor(
    private formBuilder: FormBuilder,
    private socketIo: SocketIoService,
  ) {
    this.RoomModelForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  onSave(): void {
    this.socketIo.createRoom(
      this.RoomModelForm.controls.name.value
    );
    this.onClose();
  }

  onClose(): void {
    this.EnteredData.onClose();
  }
}
