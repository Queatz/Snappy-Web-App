import { bootstrap }    from 'angular2/platform/browser';
import { enableProdMode, provide } from 'angular2/core';
import { NgLocalization } from 'angular2/common';
import { ROUTER_PROVIDERS } from 'angular2/router';
import { Headers, HTTP_PROVIDERS, BaseRequestOptions, RequestOptions } from 'angular2/http';
import { AppComponent } from './app.component';
import { InforService } from './infor.service';
import { ApiService } from './api.service';

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
    ROUTER_PROVIDERS,
    InforService,
    ApiService,
    HTTP_PROVIDERS,
    provide(RequestOptions, { useClass: MyOptions }),
    provide(NgLocalization, { useClass: MyLocalization })
]);