import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from '../../services/data.service';
import { MODULES } from '../../models/constants';

@Component({
  selector: 'app-module-selector',
  templateUrl: './module-selector.component.html',
  styleUrls: ['./module-selector.component.scss'],
  standalone: false
})
export class ModuleSelectorComponent implements OnInit, OnDestroy {
  modules = MODULES;
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

  onModuleChange(module: string, event: any): void {
    if (event.target.checked) {
      this.selectedModules = [...this.selectedModules, module];
    } else {
      this.selectedModules = this.selectedModules.filter(m => m !== module);
    }
    this.dataService.updateSelectedModules(this.selectedModules);
  }

  isModuleSelected(module: string): boolean {
    return this.selectedModules.includes(module);
  }
}
