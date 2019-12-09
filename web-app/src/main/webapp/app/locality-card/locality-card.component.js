"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var util_1 = require("../util");
var infor_service_1 = require("../infor.service");
var api_service_1 = require("../api.service");
var locality_service_1 = require("../locality.service");
var LocalityCardComponent = (function () {
    function LocalityCardComponent(inforService, api, elementRef, localityService) {
        this.inforService = inforService;
        this.api = api;
        this.elementRef = elementRef;
        this.localityService = localityService;
    }
    LocalityCardComponent.prototype.ngAfterViewInit = function () {
        this.localityService.get(this.onLocalityFound.bind(this));
        $(this.elementRef.nativeElement).find('.tooltipped').tooltip({ enterDelay: 50, exitDelay: 25 });
    };
    LocalityCardComponent.prototype.ngOnDestroy = function () {
        $(this.elementRef.nativeElement).find('.tooltipped').tooltip('remove');
    };
    LocalityCardComponent.prototype.onLocalityFound = function (locality) {
        this.locality = locality;
    };
    LocalityCardComponent.prototype.subscribe = function () {
        var _this = this;
        if (!util_1.default.validateEmail(this.subscribeEmail)) {
            Materialize.toast('Enter an email address', 2000);
            return;
        }
        this.api.subscribeToLocality(this.position.coords, this.locality, this.subscribeEmail)
            .subscribe(function (json) {
            if (json.success) {
                _this.inforService.setSubscribedTo(_this.locality, true);
                Materialize.toast('Subscribed!', 4000);
            }
            else {
                Materialize.toast('That didn\'t work...', 4000);
            }
        }, function () {
            Materialize.toast('That didn\'t work...', 4000);
        });
    };
    LocalityCardComponent.prototype.resubscribe = function () {
        this.inforService.setSubscribedTo(this.locality, false);
    };
    LocalityCardComponent.prototype.isSubscribed = function () {
        return this.inforService.getSubscribedTo(this.locality);
    };
    LocalityCardComponent.prototype.isAuthenticated = function () {
        return !!this.inforService.getInforUser();
    };
    return LocalityCardComponent;
}());
LocalityCardComponent = __decorate([
    core_1.Component({
        selector: 'locality-card',
        templateUrl: './locality-card.component.html',
        styleUrls: ['./locality-card.component.css']
    }),
    __metadata("design:paramtypes", [infor_service_1.InforService,
        api_service_1.ApiService,
        core_1.ElementRef,
        locality_service_1.LocalityService])
], LocalityCardComponent);
exports.LocalityCardComponent = LocalityCardComponent;
//# sourceMappingURL=locality-card.component.js.map