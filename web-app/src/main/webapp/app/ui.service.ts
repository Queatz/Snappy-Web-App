declare var $: any;

import { Injectable, ComponentFactoryResolver, ComponentRef, ViewContainerRef, ComponentFactory, EventEmitter } from '@angular/core';
import { AppComponent } from './app.component';

@Injectable()
export class UiService {

    private appComponent: AppComponent;

    constructor(private resolver: ComponentFactoryResolver) { }

    public registerAppComponent(app: AppComponent) {
        this.appComponent = app;
    }

    /**
     * Shows a modal.  If the modal supports an onComplete event, it will automatically be removed.
     * Otherwise, you are responsible for removing your modal from the dom when closed.
     * 
     * @param component The modal to show
     */
    public show(component: any): ComponentRef<any> {
        let modal = this.appComponent.view.createComponent(this.resolver.resolveComponentFactory(component));

        if ('onComplete' in (modal.instance as any)) {
            ((modal.instance as any).onComplete as EventEmitter<any>).subscribe(
                () => modal.hostView.destroy()
            );
        }

        setTimeout(() => $(modal.location.nativeElement.querySelector('.modal')).modal('open'));

        return modal;
    }
}
