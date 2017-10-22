import { AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { InforService } from '../infor.service';
import { ApiService } from '../api.service';
import { LocalityService } from '../locality.service';
export declare class LocalityCardComponent implements AfterViewInit, OnDestroy {
    private inforService;
    private api;
    private elementRef;
    private localityService;
    locality: string;
    private position;
    subscribeEmail: string;
    constructor(inforService: InforService, api: ApiService, elementRef: ElementRef, localityService: LocalityService);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    private onLocalityFound(locality);
    subscribe(): void;
    resubscribe(): void;
    isSubscribed(): any;
    isAuthenticated(): boolean;
}
