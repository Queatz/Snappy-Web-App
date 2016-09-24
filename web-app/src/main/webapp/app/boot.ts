import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode, provide } from '@angular/core';
import { NgLocalization } from '@angular/common';
import { Headers, HTTP_PROVIDERS, BaseRequestOptions, RequestOptions } from '@angular/http';
import { AppComponent } from './app.component';
import { InforService } from './infor.service';
import { ApiService } from './api.service';
import { TutorialService } from './tutorial.service';
import { APP_ROUTER_PROVIDERS } from './app.routes';

enableProdMode();

var firstHeaders = new Headers();
firstHeaders.append('Content-Type', 'application/json;charset=UTF-8');

class MyOptions extends BaseRequestOptions {
    headers: Headers = firstHeaders
}
class MyLocalization extends NgLocalization {
    getPluralCategory(value: any) { }
}

bootstrap(AppComponent, [
    APP_ROUTER_PROVIDERS,
    InforService,
    TutorialService,
    ApiService,
    HTTP_PROVIDERS,
    provide(RequestOptions, { useClass: MyOptions }),
    provide(NgLocalization, { useClass: MyLocalization })
]);