import 'reflect-metadata';
/**
 * Angular.
 */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: '/'
    },
  ],
  bootstrap: [
    AppComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AppModule {
}
