declare var $;
declare var Waves;

import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { LocalityService } from '../locality.service';

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewInit {

    public topics: any = [
        {
            name: 'Community',
            recent: 0,
            ads: [
                {
                    name: 'New chocolate butter!',
                    description: 'You\'ll love our chocolate butter! PLEASE reply to get some for free - only today!'
                }
            ]
        },
        {
            name: 'Singles',
            recent: 0,
        },
        {
            name: 'Dating',
            recent: 0,
        },
        {
            name: 'Lunch',
            recent: 0,
        },
        {
            name: 'Gigs',
            recent: 0,
        },
        {
            name: 'Music',
            recent: 0,
        },
        {
            name: 'Art',
            recent: 12,
        },
        {
            name: 'Recruiting',
            recent: 0,
            ads: [
                {
                    name: 'New chocolate butter!',
                    description: 'You\'ll love our chocolate butter! PLEASE reply to get some for free - only today!'
                }, {
                    name: 'New chocolate butter!',
                    description: 'You\'ll love our chocolate butter! PLEASE reply to get some for free - only today!'
                }, {
                    name: 'New chocolate butter!',
                    description: 'You\'ll love our chocolate butter! PLEASE reply to get some for free - only today!'
                }, {
                    name: 'New chocolate butter!',
                    description: 'You\'ll love our chocolate butter! PLEASE reply to get some for free - only today!'
                }, {
                    name: 'New chocolate butter!',
                    description: 'You\'ll love our chocolate butter! PLEASE reply to get some for free - only today!'
                }
            ]
        },
        {
            name: 'Food',
            recent: 0,
        },
        {
            name: 'Tavern',
            recent: 0,
        },
        {
            name: 'News',
            recent: 0,
        },
        {
            name: 'Photography',
            recent: 0,
        },
        {
            name: 'Gaming',
            recent: 1,
        },
        {
            name: 'Tech',
            recent: 0,
        },
        {
            name: 'Trade',
            recent: 3,
        },
        {
            name: 'Events',
            recent: 0,
        },
        {
            name: 'Language',
            recent: 0,
        },
        {
            name: 'Parties',
            recent: 0,
        },
        {
            name: 'Classes',
            recent: 0,
        },
        {
            name: 'Ride Sharing',
            recent: 2,
        },
        {
            name: 'Housework',
            recent: 5,
        },
        {
            name: 'Collab',
            recent: 0,
        },
        {
            name: 'Roommates',
            recent: 0,
        },
        {
            name: 'Anime',
            recent: 8,
        },
        {
            name: 'Modeling',
            recent: 0,
        },
        {
            name: 'Film',
            recent: 1,
        }
    ];

    public chats: Array<any> = [{"message":"ferpokewrp ogewporgk powekgp oewkew g"},{"message":"ewrg pwoerg owerkg powergew rgwe poewrkg pwoergk ewprogk ewrg"},{"message":"ewrg ewrgpowerkg poewrkgpoewkr gpokewrgp kewrpg okewrgope wg"},{"message":"ewrg pweokrgpoewkg pokgp kewoprgkpwekrg porewkg perwkg poerwk gopewrg"},{"message":"wergpowekr gpoewrkg perwkgperwkgp oewrkgpoerkgp owerkgpoerwkg poerwkgpwergpowekr gpoewrkg perwkgperwkgp oewrkgpoerkgp owerkgpoerwkg poerwkgpv"},{"message":"geropgkwpe rkgprowekgo pwekgpoerwg"},{"message":"wergpowekr gpoewrkg perwkgperwkgp oewrkgpoerkgp owerkgpoerwkg poerwkgpwergpowekr gpoewrkg perwkgperwkgp oewrkgpoerkgp owerkgpoerwkg poerwkgpwergpowekr gpoewrkg perwkgperwkgp oewrkgpoerkgp owerkgpoerwkg poerwkgpwergpowekr gpoewrkg perwkgperwkgp oewrkgpoerkgp owerkgpoerwkg poerwkgpwergpowekr gpoewrkg perwkgperwkgp oewrkgpoerkgp owerkgpoerwkg poerwkgpwergpowekr gpoewrkg perwkgperwkgp oewrkgpoerkgp owerkgpoerwkg poerwkgpwergpowekr gpoewrkg perwkgperwkgp oewrkgpoerkgp owerkgpoerwkg poerwkgpwergpowekr gpoewrkg perwkgperwkgp oewrkgpoerkgp owerkgpoerwkg poerwkgpwergpowekr gpoewrkg perwkgperwkgp oewrkgpoerkgp owerkgpoerwkg poerwkgpwergpowekr gpoewrkg perwkgperwkgp oewrkgpoerkgp owerkgpoerwkg poerwkgpwergpowekr gpoewrkg perwkgperwkgp oewrkgpoerkgp owerkgpoerwkg poerwkgpwergpowekr gpoewrkg perwkgperwkgp oewrkgpoerkgp owerkgpoerwkg poerwkgpwergpowekr gpoewrkg perwkgperwkgp oewrkgpoerkgp owerkgpoerwkg poerwkgp"},{"message":"gwerg weprgk peowkgpoergk perokg poewrgk powerkg porwekg porwekg powerkgopwrekgwergew"},{"message":"wergpowekr gpoewrkg perwkgperwkgp oewrkgpoerkgp owerkgpoerwkg poerwkgp wepogkweprogkewprogkrpoewgk wperogkrepogkrewpogkwerpogkrpoewgkprowekgproew kgpowrekgp orwekgporwekg powekgpoewrkgpwerkgpowerkg powerkgpowekg porewkgporekgopw erkgopwekrgoprkew gopwrekgprkewogwerp"},{"message":"egoperwgwe "},{"message":"ewrgw egerwgregoewrkgorew"},{"message":"wergkpwerogk wpergk wegwre"},{"message":"goweprgkw epogkpewo gkpowegk erog"},{"message":"wergpowke progwerg wreogkerpwog krepwogk rwe gwe"}];
    public active: string = this.topics[0];
    public message: string = '';
    public locality: string = '';
    public isShowingAds: boolean = false;

    constructor(private elementRef: ElementRef, private localityService: LocalityService) {
    }

    ngOnInit() {
        this.localityService.get(this.onLocalityFound.bind(this));
    }

    onLocalityFound(locality: string) {
        this.locality = locality;
    }

    chooseTopic(topic: string) {
        this.active = topic;
        this.scrollChat();
    }

    toggleMobileAds() {
        this.isShowingAds = !this.isShowingAds;
    }

    enterPressedInChat(event: Event) {
        this.sendChat(this.message);
        this.message = '';
        event.preventDefault();
    }

    sendChat(message: string) {
        this.chats.push({
            message: message
        });

        this.scrollChat();
    }

    scrollChat() {
        $(this.elementRef.nativeElement).find('.room-main').animate({
            scrollTop: $(this.elementRef.nativeElement).find('.room-main-chats').height()
        }, 500);
    }

    ngAfterViewInit() {
        Waves.displayEffect();
        $(this.elementRef.nativeElement).find('.tooltipped').tooltip({delay: 50});

        let scrollChat = this.scrollChat.bind(this);

        setTimeout(() => scrollChat(), 500);
    }

    ngOnDestroy() {
        $(this.elementRef.nativeElement).find('.tooltipped').tooltip('remove');
    }
}
