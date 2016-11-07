import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule ,JsonpModule} from '@angular/http';
import { RouterModule }   from '@angular/router';

import { MapComponent } from './map.component';
import { SearchComponent } from './search.component';
import { LegendComponent } from './legend.component';
import { LayerComponent } from './layer.component';
import { TabComponent } from './tab.component';
import { TabsComponent } from './tabs.component';
import { AppComponent }  from './app.component';
import { ModalModule } from 'ng2-bootstrap/ng2-bootstrap';
import { MapService } from './map.service';
import { DonorService } from './donor.service';

@NgModule({
  imports: [ 
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule,
    HttpModule,
    JsonpModule
  ],
  declarations: [ 
    AppComponent, 
    MapComponent, 
    SearchComponent, 
    LegendComponent, 
    LayerComponent, 
    TabComponent, 
    TabsComponent
  ],
  providers: [
    MapService,
    DonorService
  ],
  bootstrap: [ AppComponent]
})
export class AppModule { }
