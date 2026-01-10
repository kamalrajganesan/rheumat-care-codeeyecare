import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { MODULES } from '../../models/constants';

@Component({
  selector: 'app-module-selector',
  templateUrl: './module-selector.component.html',
  styleUrls: ['./module-selector.component.scss'],
  standalone: false
})
export class ModuleSelectorComponent implements OnInit {
  modules = MODULES;
  selectedModules: string[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.data$.subscribe(data => {
      this.selectedModules = data.selectedModules;
    });
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
