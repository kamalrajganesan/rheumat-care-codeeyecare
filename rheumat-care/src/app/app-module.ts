import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { HeaderComponent } from './components/header/header.component';
import { PatientVisitComponent } from './components/patient-visit/patient-visit.component';
import { RheumatologistSheetComponent } from './components/rheumatologist-sheet/rheumatologist-sheet.component';
import { MedicationsComponent } from './components/medications/medications.component';
import { ModuleSelectorComponent } from './components/module-selector/module-selector.component';
import { CrisComponent } from './components/modules/cris/cris.component';
import { UrisComponent } from './components/modules/uris/uris.component';
import { HcqComponent } from './components/modules/hcq/hcq.component';
import { PrintSummaryComponent } from './components/print-summary/print-summary.component';

@NgModule({
  declarations: [
    App,
    HeaderComponent,
    PatientVisitComponent,
    RheumatologistSheetComponent,
    MedicationsComponent,
    ModuleSelectorComponent,
    CrisComponent,
    UrisComponent,
    HcqComponent,
    PrintSummaryComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
  ],
  bootstrap: [App]
})
export class AppModule { }
