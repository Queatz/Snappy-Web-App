declare var require: any;
declare var $: any;
declare var _: any;
declare var Waves: any;
declare var Materialize: any;

import { Component, ComponentFactoryResolver, ViewContainerRef, OnInit, Input, Output, AfterViewInit, EventEmitter, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { WorldService } from './world.service';
import { InforService } from './infor.service';
import { PostUpdateModal } from './post-update.modal';

var checkFirst = true;

@Component({
    selector: 'thing-update',
    templateUrl: './thing-update.component.html',
    styleUrls: ['./thing-update.component.css']
})
export class ThingUpdateComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() public update;
    @Input() public resizeCallback;
    @Input() public isComment;

    private element: HTMLElement;
    private modal;
    private cr;
    private updateImage;
    private member;
    private __atWith;
    public postCommentMessage: string = '';

    comments: any[] = null;

    constructor(private inforService: InforService,
            private world: WorldService,
            private api: ApiService,
            private router: Router,
            private elementRef: ElementRef,
            private resolver: ComponentFactoryResolver,
            private view: ViewContainerRef) {
        this.element = elementRef.nativeElement;
    }

    ngOnInit() {
        if (this.update.kind === 'member') {
            this.member = this.update;
            this.update = this.update.source;
        }

        if (this.update.members) {
            this.comments = this.update.members.map(c => c.source).filter(c => c.kind === 'update');
        }
    }

    edit() {
        if (this.modal) {
            this.modal.modal('open');
            return;
        }

        var self = this;

        let ref = this.view.createComponent(this.resolver.resolveComponentFactory(PostUpdateModal));
        ref.instance.update = self.update;
        self.modal = $(ref.location.nativeElement).find('.modal');
        setTimeout(() => self.modal.modal('open'));
    }

    useAsCoverPhoto() {
        const me = this.inforService.getInforUser();

        if (!me) {
            return;
        }

        this.api.changeCoverPhoto(this.update.id).subscribe(() => {
            Materialize.toast('Cover photo updated', 4000);

            this.world.emit({
                thing: me.id,
                cover: this.update
            });

            this.router.navigate(['/', me.googleUrl]);
        });
    }

    ngAfterViewInit() {
        Waves.displayEffect();
        $(this.element).find('.tooltipped').tooltip({delay: 50});
        this.updateImage = this.api.earthImageUrl(this.update.id);
    }

    isMine() {
        return this.inforService.getInforUser() &&
            this.update.source.id === this.inforService.getInforUser().id;
    }

    like() {
        if (!this.inforService.getInforUser()) {
            Materialize.toast('Sign in', 4000);
            return;
        }

        this.api.like(this.update.id).subscribe(u => {
            if (u.success) {
                this.update.liked = true;
                this.update.likers += 1;
            }
        });
    }

    public postComment() {
        if (!this.postCommentMessage.trim()) {
            return;
        }

        this.api.earthPostUpdate(this.update.id, this.postCommentMessage)
            .then(comment => {
                Materialize.toast('Comment posted', 4000);
                this.postCommentMessage = '';
            }, () => {
                Materialize.toast('Comment post failed', 4000);
            });
    }

    ngOnDestroy() {
        $(this.element).find('.tooltipped').tooltip('remove');
    }

    public loaded() {
        if (this.resizeCallback) {
            this.resizeCallback();
        }
    }

    public atWith() {
        if (this.__atWith) {
            return this.__atWith;
        }

        if (!this.update.joins || !this.update.joins.length) {
            return null;
        }

        let result = {
            with: [],
            at: []
        };

        this.update.joins.forEach(join => {
            if (!join.source) {
                return;
            }

            switch (join.source.kind) {
                case 'person':
                    result.with.push({ person: join.source, isLast: false });
                    break;
                case 'hub':
                    result.at.push({ hub: join.source, going: this.update.going });
                    break;
            }
        });

        if (!result.with.length && !result.at.length) {
            return null;
        }

        if (result.with.length) {
            result.with[result.with.length - 1].isLast = true;
        }

        this.__atWith = result;

        return result;
    }

    personImg(update: any, sz: number = 48) {
        return this.api.getPhotoUrlFor(update.source, sz);
    }

    byId(update: any) {
        return update.id;
    }
}
