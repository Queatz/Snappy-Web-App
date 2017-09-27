import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../api.service';
import { InforService } from '../infor.service';

@Component({
  selector: 'searchbox',
  templateUrl: './searchbox.component.html',
  styleUrls: ['./searchbox.component.css']
})
export class SearchboxComponent implements OnInit {

    @Output() onSearchResults = new EventEmitter<any>();
    @Output() onSearchResultClicked = new EventEmitter<any>();

    public results;
    private position;
    private searchRequest = null;
    public text: string;
    public searching;

    constructor(private api: ApiService, private inforService: InforService) {
        this.results = [];
        this.search();
    }

    ngOnInit() {
    }

    search() {
        this.searching = true;
        if (!this.position) {
            this.inforService.getLocation(this.doSearch.bind(this));
        } else {
            this.doSearch(this.position);
        }
    }

    select(index) {
        this.results = [this.results[index]];
        this.onSearchResults.emit(this.results);
        this.onSearchResultClicked.emit(this.results[0]);
    }

    url(thing: any) {
        if (thing.kind === 'person') {
            return thing.imageUrl;
        }

        if (thing.photo) {
            return this.api.earthImageUrl(thing.id, 64);
        }
    }

    private doSearch(position) {
        this.position = position;

        if (this.searchRequest) {
            this.searchRequest.unsubscribe();
        }

        this.searchRequest = this.api.earthSearch(position.coords, this.text || '', 'person|resource|project|offer|club|hub|form|party').subscribe(results => {
            this.results = results;
            this.searching = false;
            this.searchRequest = null;
            this.onSearchResults.emit(this.results);
        });
    }
}
