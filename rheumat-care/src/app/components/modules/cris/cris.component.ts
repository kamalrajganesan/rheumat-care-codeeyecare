import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { DataService } from '../../../services/data.service';
import {
  CORNEAL_STAINING_LEVELS,
  FOLLOW_UP_STATUS,
  ELECTIVE_SURGERY_CLEARANCE,
  EMERGENCY_CONDITIONS,
  CRIS_COORDINATION_ITEMS,
  YES_NO_OPTIONS
} from '../../../models/constants';
import { EmergencyCondition } from '../../../models/patient-data.model';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-cris',
  templateUrl: './cris.component.html',
  styleUrls: ['./cris.component.scss'],
  standalone: false
})
export class CrisComponent implements OnInit {
  crisForm!: FormGroup;
  cornealStainingLevels = CORNEAL_STAINING_LEVELS;
  followUpStatuses = FOLLOW_UP_STATUS;
  electiveSurgeryClearances = ELECTIVE_SURGERY_CLEARANCE;
  emergencyConditions = EMERGENCY_CONDITIONS;
  coordinationItems = CRIS_COORDINATION_ITEMS;
  yesNoOptions = YES_NO_OPTIONS;
  completed: boolean = false;

  emergencyConditionsList: EmergencyCondition[] = [];

  constructor(
    private fb: FormBuilder,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.dataService.initializeCRISModule();
    this.initializeEmergencyConditions();

    this.crisForm = this.fb.group({
      deq5OD: [null],
      deq5OS: [null],
      schirmerOD: [null],
      schirmerOS: [null],
      cornealStainingOD: [''],
      cornealStainingOS: [''],
      topicalCyclosporine: [''],
      cyclosporineName: [''],
      topicalSteroids: [''],
      topicalSteroidsName: [''],
      followUpOD: [''],
      followUpOS: [''],
      electiveSurgeryClearance: [''],
      coordinationItems: [[]],
      ophthalmologistImpression: [''],
      additionalNotes: ['']
    });

    this.crisForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe(values => {
        this.dataService.updateCRISModule({
          ...values,
          emergencyConditions: this.emergencyConditionsList,
          completed: this.completed
        });
      });
  }

  initializeEmergencyConditions(): void {
    this.emergencyConditionsList = this.emergencyConditions.map(condition => ({
      name: condition,
      checked: false,
      laterality: ''
    }));
  }

  onEmergencyConditionChange(index: number, event: any): void {
    this.emergencyConditionsList[index].checked = event.target.checked;
    if (!event.target.checked) {
      this.emergencyConditionsList[index].laterality = '';
    }
    this.updateCRISData();
  }

  onLateralityChange(index: number, event: any): void {
    this.emergencyConditionsList[index].laterality = event.target.value;
    this.updateCRISData();
  }

  onCoordinationChange(item: string, event: any): void {
    const currentItems = this.crisForm.get('coordinationItems')?.value || [];
    if (event.target.checked) {
      this.crisForm.patchValue({
        coordinationItems: [...currentItems, item]
      });
    } else {
      this.crisForm.patchValue({
        coordinationItems: currentItems.filter((i: string) => i !== item)
      });
    }
  }

  isCoordinationChecked(item: string): boolean {
    const currentItems = this.crisForm.get('coordinationItems')?.value || [];
    return currentItems.includes(item);
  }

  showCyclosporineName(): boolean {
    return this.crisForm.get('topicalCyclosporine')?.value === 'Yes';
  }

  showSteroidsName(): boolean {
    return this.crisForm.get('topicalSteroids')?.value === 'Yes';
  }

  markComplete(): void {
    this.completed = true;
    this.updateCRISData();
  }

  private updateCRISData(): void {
    const formValues = this.crisForm.value;
    this.dataService.updateCRISModule({
      ...formValues,
      emergencyConditions: this.emergencyConditionsList,
      completed: this.completed
    });
  }
}
