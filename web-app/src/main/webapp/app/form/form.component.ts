import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InforService } from '../infor.service';
import { ApiService } from '../api.service';

@Component({
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

    public id: string;

    constructor(private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.id = params['id'];
        });
    }

}
