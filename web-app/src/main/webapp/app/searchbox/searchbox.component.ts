declare var $: any;

import { Component, OnInit, AfterViewInit, Output, EventEmitter, ElementRef, Input } from '@angular/core';
import { ApiService } from '../api.service';
import { InforService } from '../infor.service';

@Component({
  selector: 'searchbox',
  templateUrl: './searchbox.component.html',
  styleUrls: ['./searchbox.component.css']
})
export class SearchboxComponent implements OnInit, AfterViewInit {

    @Output() onSearchResults = new EventEmitter<any>();
    @Output() onSearchResultClicked = new EventEmitter<any>();

    @Input() kinds: string;
    @Input() maxResults: number;

    public results;
    private position;
    private searchRequest = null;
    public text: string;
    public searching;

    constructor(private api: ApiService, private inforService: InforService, private elementRef: ElementRef) {
        this.results = [];
    }

    ngOnInit() {
        this.search();
    }

    ngAfterViewInit() {
        $(this.elementRef.nativeElement.querySelector('#searchbox')).focus();
    }

    search() {
        this.searching = true;
        if (!this.position) {
            this.inforService.getLocation(this.doSearch.bind(this));
        } else {
            this.doSearch(this.position);
        }
    }

    enter() {
        if (this.results.length) {
            this.onSearchResultClicked.emit(this.results[0]);
        }
    }

    select(thing: any) {
        this.results = [thing];
        this.onSearchResults.emit(this.results);
        this.onSearchResultClicked.emit(this.results[0]);
    }

    private doSearch(position) {
        this.position = position;

        if (this.searchRequest) {
            this.searchRequest.unsubscribe();
        }

        this.searchRequest = this.api.earthSearch(position.coords, this.text || '', this.kinds || 'person|resource|project|offer|club|hub|form|party', 'name,about,photo,imageUrl,firstName,lastName,googleUrl,source(googleUrl)').subscribe(results => {
            this.results = results;

            if (this.maxResults && this.results.length > this.maxResults) {
                this.results.length = this.maxResults;
            }

            this.searching = false;
            this.searchRequest = null;
            this.onSearchResults.emit(this.results);
        });
    }
}
