import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SocketIoService } from './services/socket-io/socket-io.service';
import { StorageService } from './services/storage/storage.service';
import { routerTransition } from './app.animation';

@Component({
  selector: 'app-root',
  animations: [routerTransition],
  template: `
    <div class="pg-layer">
      <div class="pg-wrapper">
        <div class="pg-side">
          <app-side-view></app-side-view>
        </div>
        <div class="pg-content"[@routerTransition]="prepareRoute(outlet)">
          <router-outlet #outlet="outlet"></router-outlet>
        </div>
      </div>
    </div>
  `
})

export class AppComponent {
  constructor(
    public socketIo: SocketIoService,
    private storage: StorageService
  ) {
    this.socketIo.onSocketConnect();
    this.storage.clearStorage('session').catch();
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

}
