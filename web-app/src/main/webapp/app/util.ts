declare var require: any;
declare var moment: any;
declare var $: any;
var Masonry = require('masonry-layout');

export default class Util {
    public static masonry(element: any) {
        return new Masonry(element, {
            itemSelector: '.item',
            gutter: 24,
            fitWidth: true,
            transitionDuration: 0
        });
    }

    public static typeClassOf(kind: string) {
        switch (kind) {
            case 'resource':
                return 'brown';
            case 'project':
                return 'deep-orange';
            case 'hub':
                return 'blue';
            case 'club':
                return 'yellow darken-4';
            case 'person':
            default:
                return 'bkg-red';
        }
    }

    public static imageUrl(url: string, sz: number) {
        return url ? url.split('=')[0] + '=' + sz : '';
    }

    public static setBodyBackground(url: string) {
        $('body').css({
            'background-image': 'url(\'' + url + '\')'
        });
    }

    public static getDistanceText(distance: number) {
        if (distance < 1) {
            var ft = distance * 5280;

            if (ft < 250) {
                return 'Right here';
            } else if (ft <= 1000) {
                ft = Math.floor(ft / 250) * 250;
            } else {
                ft = Math.floor(ft / 500) * 500;
            }

            return ft + ' feet';
        } else {
            var mi = Math.floor(distance);
            return mi + ' mile' + (mi !== 1 ? 's' : '');
        }
    }

    public static presence(person) {
        return Util.getDistanceText(person.infoDistance) + ' ' + moment(person.infoUpdated).fromNow();
    }
}