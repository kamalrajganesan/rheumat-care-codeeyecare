import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {
  selectedModules: string[] = [];
  private dataSubscription!: Subscription;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataSubscription = this.dataService.data$.subscribe(data => {
      this.selectedModules = data.selectedModules;
    });
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  showCRIS(): boolean {
    return this.selectedModules.includes('CRIS (Cornea–Rheumat)');
  }

  showURIS(): boolean {
    return this.selectedModules.includes('URIS (Uvea–Rheumat)');
  }

  showHCQ(): boolean {
    return this.selectedModules.includes('HCQ Screening');
  }
}
