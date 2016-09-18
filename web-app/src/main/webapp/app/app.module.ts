import { NgModule, enableProdMode, provide } from '@angular/core';
import { NgLocalization } from '@angular/common';
import { Headers, HTTP_PROVIDERS, BaseRequestOptions, RequestOptions } from '@angular/http';
import { AppComponent } from './app.component';
import { InforService } from './infor.service';
import { ApiService } from './api.service';
import { routes, appRoutingProviders } from './app.routes';

enableProdMode();

var firstHeaders = new Headers();
firstHeaders.append('Content-Type', 'application/json;charset=UTF-8');

class MyOptions extends BaseRequestOptions {
    headers: Headers = firstHeaders
}
class MyLocalization extends NgLocalization {
    getPluralCategory(value: any): string {
    }
}

@NgModule({
    imports: [
        routing
    ],
    declarations: [
        AppComponent
    ],
    providers: [
        appRoutingProviders,
        InforService,
        ApiService,
        HTTP_PROVIDERS,
        provide(RequestOptions, { useClass: MyOptions }),
        provide(NgLocalization, { useClass: MyLocalization })
    ],
    bootstrap: [ AppComponent ]
})

export class AppModule { }
