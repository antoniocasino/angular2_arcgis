import { Injectable } from '@angular/core';
import arcgisUtils = require('esri/arcgis/utils');
import esriBasemaps = require('esri/basemaps');
import Legend = require('esri/dijit/Legend');
import Search = require('esri/dijit/Search');


@Injectable()
export class MapService {
  _basemaps: any[];

  // load a web map and return respons
  createMap(itemIdOrInfo: any, domNodeOrId: any, options: Object) {
    return arcgisUtils.createMap(itemIdOrInfo, domNodeOrId, options).then(response => {
      // append layer infos and basemap name to response before returning
      response.layerInfos = arcgisUtils.getLegendLayers(response);
      return response;
    });
  };
  
  // create a search dijit at the dom node
  createSearch(options: Object, domNodeOrId: any) {
    return new Search(options, domNodeOrId);
  };
  
}
