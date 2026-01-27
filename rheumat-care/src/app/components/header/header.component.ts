import { Component, ElementRef, HostListener } from '@angular/core';
import { DataService } from '../../services/data.service';
import { ExportService, PrintFormat } from '../../services/export.service';
import { RheumatCareData } from '../../models/patient-data.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false
})
export class HeaderComponent {
  showPdfMenu = false;

  constructor(
    private dataService: DataService,
    private exportService: ExportService,
    private elementRef: ElementRef
  ) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    // Close dropdown if clicked outside
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showPdfMenu = false;
    }
  }

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

  togglePdfMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.showPdfMenu = !this.showPdfMenu;
  }

  onPrintCodeEyeCare(event: MouseEvent): void {
    event.stopPropagation();
    this.dataService.updateTimestamp();
    const data = this.dataService.getData();
    this.exportService.printSummary(data, 'codeEyeCare');
    this.showPdfMenu = false;
  }

  onPrintLetterhead(event: MouseEvent): void {
    event.stopPropagation();
    this.dataService.updateTimestamp();
    const data = this.dataService.getData();
    this.exportService.printSummary(data, 'letterhead');
    this.showPdfMenu = false;
  }
}
