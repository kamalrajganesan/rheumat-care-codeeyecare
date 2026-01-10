import { Component, OnInit } from '@angular/core';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App implements OnInit {
  selectedModules: string[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.data$.subscribe(data => {
      this.selectedModules = data.selectedModules;
    });
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
