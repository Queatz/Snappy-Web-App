import { OnInit } from '@angular/core';
import { InforService } from '../infor.service';
import { LocalityService } from '../locality.service';
export declare class IntroCardComponent implements OnInit {
    private inforService;
    private localityService;
    private locality;
    constructor(inforService: InforService, localityService: LocalityService);
    ngOnInit(): void;
    isAuthenticated(): boolean;
}
