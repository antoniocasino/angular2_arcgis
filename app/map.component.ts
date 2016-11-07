import { Component, ElementRef, Output, EventEmitter ,Input} from '@angular/core';
import { MapService } from './map.service';

@Component({
  selector: 'esri-map',
  template: '<div><ng-content></ng-content></div>'
})
export class MapComponent {

  @Output() mapLoaded = new EventEmitter();

  map: any;
  @Input() options: Object;
  @Input() itemId: string;

  constructor(private elRef:ElementRef, private _mapService:MapService) {}

  ngOnInit() {
    // create the map
    this.loadMap();
  }
  
   loadMap() {
    this._mapService.createMap(this.itemId, this.elRef.nativeElement.firstChild, this.options).then((response) => {
      // get a reference to the map and expose response to app
      this.map = response.map;
      this.mapLoaded.next(response);
    });
   }

  // destroy map
  ngOnDestroy() {
    if (this.map) {
      this.map.destroy();
    }
  }
}
