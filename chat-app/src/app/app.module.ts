import 'reflect-metadata';
/**
 * Angular.
 */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';


/**
 * Components
 */
import { AppComponent } from './app.component';
import { RoomCreateComponent } from './components/room-create/room-create.component';
import { RoomItemComponent } from './components/room-item/room-item.component';
import { RoomsViewComponent } from './components/rooms-view/rooms-view.component';
import { SideViewComponent } from './components/side-view/side-view.component';
import { UserModelComponent } from './components/user-model/user-model.component';
import { SettingsViewComponent } from './components/settings-view/settings-view.component'

/**
 * Services
 */
import { DomService } from './services/dom/dom.service';
import { PopupService } from './services/popup/popup.service';
import { SocketIoService } from './services/socket-io/socket-io.service';
import { StorageService } from './services/storage/storage.service';
import { TabsService } from './services/tabs/tabs.service';
import { CookieService } from 'ngx-cookie-service';

/**
 * Routes
 */
const routes: Routes = [
  {
    path: 'rooms-view',
    component: RoomsViewComponent,
    data: {
      animation: '_rooms'
    }
  },
  {
    path: 'rooms-view/:id',
    component: RoomItemComponent,
    data: {
      animation: '_rooms'
    }
  },
  {
    path: 'settings-view',
    component: SettingsViewComponent,
    data: {
      animation: '_settings'
    }
  },
  {
    path: '**',
    redirectTo: 'rooms-view',
    pathMatch: 'full',
  },
];

@NgModule({
  declarations: [
    AppComponent,
    SideViewComponent,
    RoomCreateComponent,
    RoomItemComponent,
    RoomsViewComponent,
    UserModelComponent,
    SettingsViewComponent
  ],
  entryComponents: [
    RoomCreateComponent,
    UserModelComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload'
    }),
  ],
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: '/'
    },
    DomService,
    PopupService,
    SocketIoService,
    StorageService,
    TabsService,
    CookieService
  ],
  bootstrap: [
    AppComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AppModule {
}
