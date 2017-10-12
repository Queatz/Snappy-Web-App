import { Component, OnInit, AfterViewInit, ElementRef, Input, Output, EventEmitter } from '@angular/core';

import util from '../util';

@Component({
  selector: 'color-wheel',
  templateUrl: './color-wheel.component.html',
  styleUrls: ['./color-wheel.component.css']
})
export class ColorWheelComponent implements OnInit, AfterViewInit {

  private context: any;
  private indicator: number[];
  private radius = 50;

  @Input() color: number[];
  @Output() colorChange: EventEmitter<number[]>;

  constructor(private elementRef: ElementRef) {
    this.colorChange = new EventEmitter();
  }

  ngOnInit() {
    if (!this.color) {
        this.color = [0, 0, 0];
    }

    let hsv = util.rgbToHsv(this.color);

    this.indicator = [
        this.radius + Math.cos(hsv[0] * Math.PI * 2) * Math.pow(hsv[1], .667) * this.radius,
        this.radius + Math.sin(hsv[0] * Math.PI * 2) * Math.pow(hsv[1], .667) * this.radius
    ];
  }

  ngAfterViewInit() {
    let canvas = this.elementRef.nativeElement.querySelector('#colorwheel');
    let context = canvas.getContext('2d');
    let radius = this.radius;
    let x = canvas.width / 2;
    let y = canvas.height / 2;
    let counterClockwise = false;

    for(let angle=0; angle<=360; angle+=1){
        let startAngle = (angle-2)*Math.PI/180;
        let endAngle = angle * Math.PI/180;
        context.beginPath();
        context.moveTo(x, y);
        context.arc(x, y, radius, startAngle, endAngle, counterClockwise);
        context.closePath();
        context.fillStyle = 'hsl('+angle+', 100%, 50%)';
        context.fill();
    }

    context.moveTo(0, 0);
    let gradient = context.createRadialGradient(radius, radius, radius, radius, radius, 0);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
    gradient.addColorStop(.125, 'rgba(255, 255, 255, .3)');
    gradient.addColorStop(.25, 'rgba(255, 255, 255, .5)');
    gradient.addColorStop(.5, 'rgba(255, 255, 255, .75)');
    gradient.addColorStop(.75, 'rgba(255, 255, 255, .925)');
    gradient.addColorStop(.95, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 1)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.width);

    this.context = context;
  }

  tap(event: MouseEvent) {
    let data = this.context.getImageData(event.layerX, event.layerY, 1, 1).data;

    if (data[3] > 0) {
        this.indicator[0] = event.layerX;
        this.indicator[1] = event.layerY;

        this.color[0] = data[0];
        this.color[1] = data[1];
        this.color[2] = data[2];
        this.colorChange.emit(this.color);
    }
  }
}
