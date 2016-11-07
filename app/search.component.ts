import { Component, ElementRef,Output , EventEmitter} from '@angular/core';
import { MapService } from './map.service';

@Component({
  selector: 'esri-search',
  template: '<div></div>',
  inputs: ['options']
})
export class SearchComponent {

  constructor(private elRef:ElementRef, private _mapService:MapService) {}

  @Output() onChange = new EventEmitter();
  search: any;
  options: Object;

  // create the search dijit
  ngOnInit() {
    this.search = this._mapService.createSearch(this.options, this.elRef.nativeElement.firstChild);
    var that = this;
    this.search.on("search-results", function(search){
      var result = search.results[0][0];
      that.onChange.next(result);
    });
  }

  // start up once the DOM is ready
  ngAfterViewInit() {
    this.search.startup();
  }

  // bind search dijit to map
  setMap(map) {
    this.search.set('map', map);
  }

  // destroy search dijit
  ngOnDestroy() {
    if (this.search) {
      this.search.destroy();
    }
  }
}
