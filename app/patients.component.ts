import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl,Validators, FormBuilder ,Control} from '@angular/forms';
import { MapComponent } from './map.component';
import { SearchComponent } from './search.component';
import { LegendComponent } from './legend.component';
import { BasemapSelect } from './basemapselect.component';
import { LayerComponent } from './layer.component';
import { ModalDirective } from "ng2-bootstrap/components/modal/modal.component";
import { DonorService }    from './donor.service';

@Component({
    selector: 'patients-app',
    templateUrl: './patients.html'
})
export class PatientsComponent {

  // references to child components
  @ViewChild(MapComponent) mapComponent:MapComponent;
  @ViewChild(SearchComponent) searchComponent:SearchComponent;
  @ViewChild(LegendComponent) legendComponent:LegendComponent;
  @ViewChild(BasemapSelect) basemapSelect:BasemapSelect;
  @ViewChild(LayerComponent) LayerComponent:LayerComponent;

  @ViewChild('lgModal') public childModal:ModalDirective;
  @ViewChild('confirmModal') public confirmModal:ModalDirective;

  title = 'Patients page';
  map:any;
  // map config
  itemId = 'ca61731df68a49bc9f0d6d78f6f73c7b';
  public mapOptions = {
    basemap: 'gray',
    center: [12.492373, 41.890251], // lon, lat
    zoom: 7
  };
  donorForm:FormGroup;
  geometry:any;
  // search config
  public searchOptions = {
    enableButtonMode: true, //this enables the search widget to display as a single button
    enableLabel: false,
    enableInfoWindow: true,
    showInfoWindowOnSelect: false,
  };

  constructor(private donorService:DonorService, private formBuilder: FormBuilder) {}


  ngOnInit(){
    this.donorForm = this.formBuilder.group({
        firstName:['', Validators.required],
        lastName:['', Validators.required],
        email:['', Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}')],
        contact:['', Validators.pattern('[\+]\d{2}[\(]\d{2}[\)]\d{4}[\-]\d{4}')],
        bloodGroup:['', Validators.required],
        latitude:['', Validators.required],
        longitude:['', Validators.required],
        ip:['', Validators.required]
    });
  }

  // once the map loads
  onMapLoad(response) {
    const map = this.map = response.map;
    // bind the search dijit to the map
    this.searchComponent.setMap(map);
    // initialize the leged dijit with map and layer infos
    //this.legendComponent.init(map, response.layerInfos);
    // set the selected basemap
    //this.basemapSelect.selectedBasemap = response.basemapName;
    // bind the map title
    this.title = response.itemInfo.item.title;
    //bind the legendlayer
    //this.LayerComponent.init(response);

  }
  
  onSearchChanged(response){
    this.geometry = response.feature.geometry;
    this.mapOptions.center = [this.geometry.x, this.geometry.y];
    this.mapComponent.loadMap();
    const modal = this.childModal;
    this.map.on("click", (event) => {
      modal.show();
    }); 
  }

  // set map's basemap in response to user changes
  onBasemapSelected(basemapName) {
    this.mapComponent.setBasemap(basemapName);
  }
  
  onSubmit(){
    var donor:Donor = <Donor>this.donorForm.value;
    donor.latitude = this.geometry.x;
    donor.longitude = this.geometry.y;
    this.childModal.hide();
    this.donorService.addDonor(donor);
    this.confirmModal.show();
  }
}
