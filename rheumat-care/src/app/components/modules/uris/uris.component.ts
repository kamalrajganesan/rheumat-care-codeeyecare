import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataService } from '../../../services/data.service';
import {
  URIS_VISIT_TYPES,
  UVEITIS_STATUS,
  UVEITIS_ANATOMICAL_TYPES,
  UVEITIS_NATURE,
  UVEITIS_DIAGNOSES,
  EPISODE_PATTERNS,
  EPISODE_COUNTS,
  COURSE_COMPLETED_OPTIONS,
  LATERALITY_OPTIONS,
  UVEITIS_ACTION_ITEMS,
  SURGERY_CLEARANCE_OPTIONS,
  YES_NO_OPTIONS
} from '../../../models/constants';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-uris',
  templateUrl: './uris.component.html',
  styleUrls: ['./uris.component.scss'],
  standalone: false
})
export class UrisComponent implements OnInit, OnDestroy {
  urisForm!: FormGroup;
  visitTypes = URIS_VISIT_TYPES;
  uveitisStatuses = UVEITIS_STATUS;
  anatomicalTypes = UVEITIS_ANATOMICAL_TYPES;
  natureOptions = UVEITIS_NATURE;
  diagnoses = UVEITIS_DIAGNOSES;
  episodePatterns = EPISODE_PATTERNS;
  episodeCounts = EPISODE_COUNTS;
  courseCompletedOptions = COURSE_COMPLETED_OPTIONS;
  lateralityOptions = LATERALITY_OPTIONS;
  actionItems = UVEITIS_ACTION_ITEMS;
  surgeryClearanceOptions = SURGERY_CLEARANCE_OPTIONS;
  yesNoOptions = YES_NO_OPTIONS;
  completed: boolean = false;
  private resetSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.dataService.initializeURISModule();

    this.urisForm = this.fb.group({
      visit: [''],
      uveitisStatusOD: [''],
      uveitisStatusOS: [''],
      anatomicalTypeOD: [''],
      anatomicalTypeOS: [''],
      natureOD: [''],
      natureOS: [''],
      episodePatternOD: [''],
      episodePatternOS: [''],
      episodesCountOD: [''],
      episodesCountOS: [''],
      priorCourseCompletedOD: [''],
      priorCourseCompletedOS: [''],
      diagnosis: [[]],
      finalDiagnosis: [''],
      topicalSteroidsOD: [''],
      topicalSteroidsOS: [''],
      topicalSteroidsNameOD: [''],
      topicalSteroidsNameOS: [''],
      topicalNSAIDOD: [''],
      topicalNSAIDOS: [''],
      topicalNSAIDNameOD: [''],
      topicalNSAIDNameOS: [''],
      actionItems: [[]],
      surgeryClearance: [''],
      ophthalmologistInput: ['']
    });

    this.urisForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe(values => {
        this.dataService.updateURISModule({
          ...values,
          completed: this.completed
        });
      });

    this.resetSubscription = this.dataService.reset$.subscribe(() => {
      this.urisForm.reset({ diagnosis: [], actionItems: [] });
      this.completed = false;
    });
  }

  ngOnDestroy(): void {
    if (this.resetSubscription) {
      this.resetSubscription.unsubscribe();
    }
  }

  onDiagnosisChange(diagnosis: string, event: any): void {
    const currentDiagnoses = this.urisForm.get('diagnosis')?.value || [];
    if (event.target.checked) {
      this.urisForm.patchValue({
        diagnosis: [...currentDiagnoses, diagnosis]
      });
    } else {
      this.urisForm.patchValue({
        diagnosis: currentDiagnoses.filter((d: string) => d !== diagnosis)
      });
    }
  }

  isDiagnosisChecked(diagnosis: string): boolean {
    const currentDiagnoses = this.urisForm.get('diagnosis')?.value || [];
    return currentDiagnoses.includes(diagnosis);
  }

  onActionItemChange(item: string, event: any): void {
    const currentItems = this.urisForm.get('actionItems')?.value || [];
    if (event.target.checked) {
      this.urisForm.patchValue({
        actionItems: [...currentItems, item]
      });
    } else {
      this.urisForm.patchValue({
        actionItems: currentItems.filter((i: string) => i !== item)
      });
    }
  }

  isActionItemChecked(item: string): boolean {
    const currentItems = this.urisForm.get('actionItems')?.value || [];
    return currentItems.includes(item);
  }

  showSteroidsNameOD(): boolean {
    return this.urisForm.get('topicalSteroidsOD')?.value === 'Yes';
  }

  showSteroidsNameOS(): boolean {
    return this.urisForm.get('topicalSteroidsOS')?.value === 'Yes';
  }

  showNSAIDNameOD(): boolean {
    return this.urisForm.get('topicalNSAIDOD')?.value === 'Yes';
  }

  showNSAIDNameOS(): boolean {
    return this.urisForm.get('topicalNSAIDOS')?.value === 'Yes';
  }

  markComplete(): void {
    this.completed = true;
    const formValues = this.urisForm.value;
    this.dataService.updateURISModule({
      ...formValues,
      completed: this.completed
    });
  }
}
