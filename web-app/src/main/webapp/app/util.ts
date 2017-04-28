declare var require: any;
var Masonry = require('masonry-layout');

export default {
    masonry: element => {
        return new Masonry(element, {
            itemSelector: '.item',
            gutter: 24,
            fitWidth: true,
            transitionDuration: 0
        });
    },

    typeClassOf: kind => {
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
}