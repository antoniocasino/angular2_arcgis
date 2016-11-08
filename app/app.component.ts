import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl,Validators, FormBuilder ,Control} from '@angular/forms';
import { MapComponent } from './map.component';
import { SearchComponent } from './search.component';

import { ModalDirective } from "ng2-bootstrap/components/modal/modal.component";
import { DonorService }    from './donor.service';
import {Donor} from './donor';

import SimpleMarkerSymbol = require('esri/symbols/SimpleMarkerSymbol');
import PictureMarkerSymbol = require('esri/symbols/PictureMarkerSymbol');

import InfoTemplate = require('esri/InfoTemplate');
import Graphic = require('esri/graphic');
import GraphicsLayer = require('esri/layers/GraphicsLayer')
import Point = require('esri/geometry/Point');
import webMercatorUtils = require('esri/geometry/webMercatorUtils');
import 'rxjs/add/operator/map';

@Component({
    selector: 'my-app',
    templateUrl: 'app/donors.html'
})
export class AppComponent {

  // references to child components
  @ViewChild(MapComponent) mapComponent:MapComponent;
  @ViewChild(SearchComponent) searchComponent:SearchComponent;

  @ViewChild('lgModal') public lgModal:ModalDirective;
  @ViewChild('confirmModal') public confirmModal:ModalDirective;
  @ViewChild('patientModal') public patientModal:ModalDirective;

  donorForPatient:Donor;
  donors:Donor[];
  
  title = `Click on the map and add a donor location.
           Refresh the page to see all locations.
           Click inside the circle and you will see donor's info`;
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
    this.map.infoWindow.hide();
    this.map.infoWindow.show(this.mapOptions.center[0],this.mapOptions.center[1]);
     
    // bind the search dijit to the map
    this.searchComponent.setMap(response.map);
    this.loadDonors();
   
    response.map.on("click", (event) => {
      this.donorForPatient = null;
      var mp = webMercatorUtils.webMercatorToGeographic(event.mapPoint);
      this.geometry = mp;
      var distance = 0;
      var point:Point=null;
      for(let donor of this.donors){
        var p = new Point(donor.latitude, donor.longitude);
        var d = esri.geometry.getLength(p, mp);
        if(distance == 0){
          distance = d;
        }
        if(d<0.1 && d <= distance){
          point = p;
          this.donorForPatient = donor;
          distance = d;
        }
      }
      if(distance<0.1){
        this.patientModal.show();
      }
      else{
        this.lgModal.show();
      }
    }); 
  }
  
  onSearchChanged(response){
    this.mapOptions.center = [response.feature.geometry.x, response.feature.geometry.y];
    var mercator  = webMercatorUtils.webMercatorToGeographic(event.mapPoint);
    this.map.centerAt(mercator);
  }
  
  loadDonors(){
   
    this.donorService.getDonors().subscribe((response) => {
      this.donors = response
      var gl = new GraphicsLayer();
      for(let donor of this.donors){
        var p = new Point(donor.latitude, donor.longitude);
        var s = new SimpleMarkerSymbol().setSize(30);
        var g = new Graphic(p, s);
        gl.add(g);
      }
      this.map.addLayer(gl);
    });
  }
  
 
  onSubmit(){
    var donor:Donor = <Donor>this.donorForm.value;
    donor.latitude = this.geometry.x;
    donor.longitude = this.geometry.y;
    this.lgModal.hide();
    this.donorService.addDonor(donor);
    this.confirmModal.show();
  }
}
