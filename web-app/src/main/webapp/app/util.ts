declare var require: any;
declare var moment: any;
declare var $: any;

export default class Util {

    public static thingUrl(thing: any) {
        switch (thing.kind) {
            case 'person':
                return ['/' + thing.googleUrl];
            default:
                return ['/' + thing.kind + 's/' + thing.id];
        }
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
                return 'yellow darken-2';
            case 'form':
                return 'purple';
            case 'person':
            default:
                return 'bkg-red';
        }
    }

    public static imageUrl(url: string, sz: number) {
        return url ? url.split('=')[0] + '=' + sz : '';
    }

    public static thingName(thing: any) {
        return thing.name ? thing.name : thing.firstName ? thing.firstName + ' ' + thing.lastName : 'Unknown';
    }

    public static setBodyBackground(url: string) {
        if (!'solid background') {
            $('body').css({
                'background-image': 'url(\'' + url + '\')'
            });
        }
    }

    public static getDistanceText(distance: number) {
        if (!distance) {
            return 'Around here';
        }

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
        if (!person.infoUpdated) {
            return;
        }

        return Util.getDistanceText(person.infoDistance) + ' ' + moment(person.infoUpdated).fromNow();
    }

    public static validateEmail(email: string) {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    public static rndstr(len: any = 16) {
        let str = '';

        for(let i = 0; i < (len || 16); i++) {
            str += Math.random().toString(36).substr(2, 1);
        }

        return str;
    }

    // https://gist.github.com/mjackson/5311256
    public static rgbToHsl(rgb) {
      let r = rgb[0], g = rgb[1], b = rgb[2];
      r /= 255; g /= 255; b /= 255;

      let max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;

      if (max == min) {
        h = s = 0; // achromatic
      } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
      }

      return [ h, s, l ];
    }

    // https://gist.github.com/mjackson/5311256
    public static rgbToHsv(rgb) {
      let r = rgb[0], g = rgb[1], b = rgb[2];
      r /= 255; g /= 255; b /= 255;

      let max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h, s, v = max;

      let d = max - min;
      s = max == 0 ? 0 : d / max;

      if (max == min) {
        h = 0; // achromatic
      } else {
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
      }

      return [ h, s, v ];
    }
}