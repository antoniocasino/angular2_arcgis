import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl,Validators, FormBuilder ,Control} from '@angular/forms';
import { MapComponent } from './map.component';
import { SearchComponent } from './search.component';
import { LegendComponent } from './legend.component';
import { BasemapSelect } from './basemapselect.component';
import { LayerComponent } from './layer.component';
import { ModalDirective } from "ng2-bootstrap/components/modal/modal.component";
import { DonorService }    from './donor.service';
import SimpleMarkerSymbol = require('esri/symbols/SimpleMarkerSymbol');
import InfoTemplate = require('esri/InfoTemplate');
import Graphic = require('esri/graphic');
import GraphicsLayer = require('esri/layers/GraphicsLayer')
import Point = require('esri/geometry/Point');
import 'rxjs/add/operator/map';

@Component({
    selector: 'my-app',
    templateUrl: 'app/donors.html'
})
export class AppComponent {

  // references to child components
  @ViewChild(MapComponent) mapComponent:MapComponent;
  @ViewChild(SearchComponent) searchComponent:SearchComponent;
  @ViewChild(LegendComponent) legendComponent:LegendComponent;
  @ViewChild(BasemapSelect) basemapSelect:BasemapSelect;
  @ViewChild(LayerComponent) LayerComponent:LayerComponent;

  @ViewChild('lgModal') public childModal:ModalDirective;
  @ViewChild('confirmModal') public confirmModal:ModalDirective;

  title = 'Donors page';
  map:any;
  // map config
  itemId = 'ca61731df68a49bc9f0d6d78f6f73c7b';
  public mapOptions = {
    basemap: 'grey',
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

  constructor(private donorService:DonorService, private formBuilder: FormBuilder) {
  }


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
    this.map = response.map;
    // bind the search dijit to the map
    this.loadDonors();
    this.searchComponent.setMap(this.map);
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
  
  loadDonors(){
    
    var donors:Donor[];
    this.donorService.getDonors().subscribe((response) => {
      donors = response
      var gl = new GraphicsLayer();
      for(let donor of donors){
       /* var infoSymbol:PictureMarkerSymbol = new PictureMarkerSymbol("http://hexe.er.usgs.gov/data/McHenry/images/bluedot.gif",30,30);
        infoSymbol.setSize(40);
        var infoTemplate:InfoTemplate = new InfoTemplate("${w}", "x: ${a}<br />y: ${b}<br />z: ${c}");
        var marker:Graphic = new Graphic({"geometry":{"x":donor.latitude ,"y":donor.logitude, "spatialReference":{"wkid":102113}},
            "attributes":{"w":"Donor","a":donor.email,"b":donor.contact}});
        marker.setSymbol(infoSymbol);
        marker.setInfoTemplate(infoTemplate);*/
       
        var p = new Point(donor.latitude?donor.latitude:0, donor.longitude?donor.logitude:0);
        var s = new SimpleMarkerSymbol().setSize(60);
        var g = new Graphic(p, s);
        gl.add(g);
      }
      this.map.addLayer(gl);
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
