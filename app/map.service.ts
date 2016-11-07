import { Injectable } from '@angular/core';
import arcgisUtils = require('esri/arcgis/utils');
import esriBasemaps = require('esri/basemaps');
import Legend = require('esri/dijit/Legend');
import Search = require('esri/dijit/Search');
import {LegendOptions} from "esri";


@Injectable()
export class MapService {
  _basemaps: any[];

  // load a web map and return respons
  createMap(itemIdOrInfo: any, domNodeOrId: any, options: Object) {
    return arcgisUtils.createMap(itemIdOrInfo, domNodeOrId, options).then(response => {
      // append layer infos and basemap name to response before returning
      response.layerInfos = arcgisUtils.getLegendLayers(response);
      //response.basemapName = this.getBasemapName(response.map);
      return response;
    });
  };

  // create a search dijit at the dom node
  createSearch(options: Object, domNodeOrId: any) {
    return new Search(options, domNodeOrId);
  };

  // create a legend dijit at the dom node
  createLegend(options: LegendOptions, domNodeOrId: any) {
    return new Legend(options, domNodeOrId);
  };

  // get esriBasemaps as array of basemap defintion objects
  getBasemaps() {
    if (!this._basemaps) {
      this._basemaps = Object.keys(esriBasemaps).map((name) => {
        let basemap = esriBasemaps[name];
        basemap.name = name;
        return basemap;
      });
    }
    return this._basemaps;
  }

  
}
