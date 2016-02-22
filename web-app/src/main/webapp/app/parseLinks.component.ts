import { Component, ElementRef } from 'angular2/core';

@Component({
  selector: 'parse-links',
  template: '<ng-content></ng-content>'
})
export class ParseLinksComponent implements AfterViewInit {
    private element: ElementRef;

    constructor(element: ElementRef) {
        this.element = element;
    }

    ngAfterViewInit() {
        this.element.nativeElement.innerHTML = this.parse(this.element.nativeElement.innerHTML);
    }

    parse(value: string) {
        let regex = new RegExp(/(\()?([a-z]*\:\/\/)?([-@\.\w]+\.[a-z|0-9]{1,4}[-~;:,@$%+!*'=#\/\?&\(\)\.\w]*)/gi);

        return value.replace(regex, (str, $1, $2, $3) => {
            if ($1 === undefined) {
                $1 = '';
            }

            if ($2 === undefined) {
                $2 = '';
            }

            return $1 + '<a href="' +
             ( $2 ? $2 : 'http://' ) +
             ( $1 && $3.substr(-1) === ')' || ( $3.substr(-1).match(/[;,\.]/g)) ? $3.substr(0, $3.length - 1) : $3 ) +
             '" target="_blank">' + $2 + ( $1 && $3.substr(-1) === ')' || ( $3.substr(-1).match(/[;,\.]/g)) ? $3.substr(0, $3.length - 1) : $3 ) +
             '</a>' + ( $1 && $3.substr(-1) === ')' ? ')' : '' ) +
             ( $3.substr(-1).match(/[;,\.]/g) ? $3.substr(-1) : '' );
        });
    }
}
