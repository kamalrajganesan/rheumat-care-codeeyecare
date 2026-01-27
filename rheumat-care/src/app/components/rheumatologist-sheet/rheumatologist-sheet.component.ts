import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataService } from '../../services/data.service';
import { SYSTEMIC_DIAGNOSES, SEROLOGY_STATUS, DISEASE_STATUS, TREATMENT_TARGETS } from '../../models/constants';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-rheumatologist-sheet',
  templateUrl: './rheumatologist-sheet.component.html',
  styleUrls: ['./rheumatologist-sheet.component.scss'],
  standalone: false
})
export class RheumatologistSheetComponent implements OnInit, OnDestroy {
  rheumatologistForm!: FormGroup;
  systemicDiagnoses = SYSTEMIC_DIAGNOSES;
  serologyStatuses = SEROLOGY_STATUS;
  diseaseStatuses = DISEASE_STATUS;
  treatmentTargets = TREATMENT_TARGETS;
  private resetSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.rheumatologistForm = this.fb.group({
      systemicDiagnosis: [[]],
      otherDiagnosis: [''],
      serologyStatus: [''],
      diseaseStatus: [''],
      treatmentTarget: [''],
      diseaseActivityScore: [''],
      esr: [''],
      crp: [''],
      rheumatologistImpression: ['']
    });

    this.rheumatologistForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe(values => {
        this.dataService.updateRheumatologistSheet(values);
      });

    this.resetSubscription = this.dataService.reset$.subscribe(() => {
      this.rheumatologistForm.reset({ systemicDiagnosis: [] });
    });
  }

  ngOnDestroy(): void {
    if (this.resetSubscription) {
      this.resetSubscription.unsubscribe();
    }
  }

  onDiagnosisChange(diagnosis: string, event: any): void {
    const currentDiagnoses = this.rheumatologistForm.get('systemicDiagnosis')?.value || [];
    if (event.target.checked) {
      this.rheumatologistForm.patchValue({
        systemicDiagnosis: [...currentDiagnoses, diagnosis]
      });
    } else {
      this.rheumatologistForm.patchValue({
        systemicDiagnosis: currentDiagnoses.filter((d: string) => d !== diagnosis)
      });
    }
  }

  isDiagnosisChecked(diagnosis: string): boolean {
    const currentDiagnoses = this.rheumatologistForm.get('systemicDiagnosis')?.value || [];
    return currentDiagnoses.includes(diagnosis);
  }

  showOtherDiagnosis(): boolean {
    return this.isDiagnosisChecked('Others');
  }
}
