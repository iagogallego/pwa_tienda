import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NftComponent } from './components/nft/nft.component';
import { CompraNFTComponent } from './components/compra-nft/compra-nft.component';

@NgModule({
  declarations: [
    AppComponent,
    NftComponent,
    CompraNFTComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
