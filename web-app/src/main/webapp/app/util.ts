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
    }
}