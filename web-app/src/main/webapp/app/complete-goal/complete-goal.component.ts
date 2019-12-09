declare var Waves: any;
declare var M: any;

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ApiService } from '../api.service';
import { InforService } from '../infor.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'complete-goal',
  templateUrl: './complete-goal.component.html',
  styleUrls: ['./complete-goal.component.css']
})
export class CompleteGoalComponent implements OnInit, AfterViewInit {
  
  thing: any;
  notFound: boolean;
  withPeople: any[] = [];
  checkingIn: boolean;
  
  proofFile: File;
  proofUrl: any;

  constructor(
    private api: ApiService,
    private inforService: InforService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
        this.load(params['id']);
    });
  }

  ngAfterViewInit() {
    Waves.displayEffect();
  }

  uploadProof(file: File) {
    this.proofFile = file;
    let fr = new FileReader();
    fr.onloadend = () => this.proofUrl = fr.result;
    fr.readAsDataURL(file);
  }

  addWith(person: any) {
    this.withPeople.push(person);
    this.checkingIn = false;
  }

  removeWith(person: any) {
    let i = this.withPeople.indexOf(person);

    if (i === -1) {
      return;
    }

    this.withPeople.splice(i, 1);
  }

  submitProof() {
    if (!this.inforService.getInforUser()) {
      M.toast({ html: 'Sign in' });
      return;
    }
    
    let me = this.inforService.getInforUser().id;

    if (!this.proofFile) {
      M.toast({ html: 'Missing proof' });
      return;
    }

    this.api.completeGoal(this.thing.id, {
      photo: this.proofFile,
      with: this.withPeople.map(t => t.id)
    }).subscribe(
      () => {
        M.toast({ html: 'Completed ' + this.thing.name });
      },
      () => {
        M.toast({ html: 'Nooo... there was an error' });
      }
    );
  }

  load(id: string) {
    this.api.earthThing(id, ApiService.SELECT_THING).subscribe(thing => {
      this.thing = thing;
    }, () => this.notFound = true);
  }
  
}
