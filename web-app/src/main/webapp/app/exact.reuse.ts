import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

export class ExactRouteReuseStrategy implements RouteReuseStrategy {
    shouldDetach(route: ActivatedRouteSnapshot): boolean { return false; }

    store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void {}

    shouldAttach(route: ActivatedRouteSnapshot): boolean { return false; }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle { return null; }

    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        if (curr.data && curr.data.reuse && future.data && future.data.reuse) {
            return true;
        }

        if(future.routeConfig !== curr.routeConfig) {
            return false;
        } else if(Object.keys(future.params).length !== Object.keys(curr.params).length ||
            Object.keys(future.queryParams).length !== Object.keys(curr.queryParams).length) {
            return false;
        } else {
            return Object.keys(future.params).every(k => future.params[k] === curr.params[k]) &&
            Object.keys(future.queryParams).every(k => future.queryParams[k] === curr.queryParams[k]);
        }
    }
}