import { Injectable, ComponentFactoryResolver, ComponentRef, ViewContainerRef, ComponentFactory } from '@angular/core';
import { AppComponent } from './app.component';

@Injectable()
export class UiService {

    private appComponent: AppComponent;

    constructor(private resolver: ComponentFactoryResolver) { }

    public registerAppComponent(app: AppComponent) {
        this.appComponent = app;
    }

    public show(component: any): ComponentRef<any> {
        return this.appComponent.view.createComponent(this.resolver.resolveComponentFactory(component));
    }
}
