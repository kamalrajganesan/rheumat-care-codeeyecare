import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from '../../services/data.service';
import { ExportService } from '../../services/export.service';
import { RheumatCareData } from '../../models/patient-data.model';

@Component({
  selector: 'app-print-summary',
  templateUrl: './print-summary.component.html',
  styleUrls: ['./print-summary.component.scss'],
  standalone: false
})
export class PrintSummaryComponent implements OnInit, OnDestroy {
  summaryHTML: string = '';
  private dataSubscription!: Subscription;

  constructor(
    private dataService: DataService,
    private exportService: ExportService
  ) {}

  ngOnInit(): void {
    this.dataSubscription = this.dataService.data$.subscribe(data => {
      this.summaryHTML = this.exportService.generatePrintHTML(data);
    });
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
}
