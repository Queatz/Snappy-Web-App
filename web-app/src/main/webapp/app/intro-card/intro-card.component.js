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
var infor_service_1 = require("../infor.service");
var locality_service_1 = require("../locality.service");
var IntroCardComponent = (function () {
    function IntroCardComponent(inforService, localityService) {
        this.inforService = inforService;
        this.localityService = localityService;
    }
    IntroCardComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.localityService.get(function (locality) {
            _this.locality = locality;
        });
    };
    IntroCardComponent.prototype.isAuthenticated = function () {
        return !!this.inforService.getInforUser();
    };
    return IntroCardComponent;
}());
IntroCardComponent = __decorate([
    core_1.Component({
        selector: 'intro-card',
        templateUrl: './intro-card.component.html',
        styleUrls: ['./intro-card.component.css']
    }),
    __metadata("design:paramtypes", [infor_service_1.InforService,
        locality_service_1.LocalityService])
], IntroCardComponent);
exports.IntroCardComponent = IntroCardComponent;
//# sourceMappingURL=intro-card.component.js.map