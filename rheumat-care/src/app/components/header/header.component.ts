import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { ExportService } from '../../services/export.service';
import { RheumatCareData } from '../../models/patient-data.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false
})
export class HeaderComponent {

  constructor(
    private dataService: DataService,
    private exportService: ExportService
  ) {}

  onReset(): void {
    if (confirm('Reset all fields? This will clear all entered data.')) {
      this.dataService.resetData();
    }
  }

  onDownloadCSV(): void {
    this.dataService.updateTimestamp();
    const data = this.dataService.getData();
    this.exportService.downloadCSV(data);
  }

  onPrint(): void {
    this.dataService.updateTimestamp();
    const data = this.dataService.getData();
    this.exportService.printSummary(data);
  }
}
