import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataService } from '../../services/data.service';
import { MEDICATIONS, HCQ_DAILY_DOSES } from '../../models/constants';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-medications',
  templateUrl: './medications.component.html',
  styleUrls: ['./medications.component.scss'],
  standalone: false
})
export class MedicationsComponent implements OnInit, OnDestroy {
  medicationsForm!: FormGroup;
  medications = MEDICATIONS;
  hcqDailyDoses = HCQ_DAILY_DOSES;
  hcqCumulativeDose: string = '—';
  private resetSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.medicationsForm = this.fb.group({
      selectedMeds: [[]],
      steroidDose: [''],
      methotrexateDose: [null],
      hcqDailyDose: [null],
      hcqTotalMonths: [null],
      otherMedName: [''],
      otherMedDetails: ['']
    });

    this.medicationsForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe(values => {
        this.calculateHCQCumulative();
        const updateData = {
          ...values,
          hcqCumulativeDose: this.hcqCumulativeDose
        };
        this.dataService.updateMedications(updateData);
      });

    this.resetSubscription = this.dataService.reset$.subscribe(() => {
      this.medicationsForm.reset({ selectedMeds: [] });
      this.hcqCumulativeDose = '—';
    });
  }

  ngOnDestroy(): void {
    if (this.resetSubscription) {
      this.resetSubscription.unsubscribe();
    }
  }

  onMedicationChange(medication: string, event: any): void {
    const currentMeds = this.medicationsForm.get('selectedMeds')?.value || [];
    if (event.target.checked) {
      this.medicationsForm.patchValue({
        selectedMeds: [...currentMeds, medication]
      });
      // Auto-select HCQ module when HCQ medication is checked
      if (medication === 'Hydroxychloroquine (HCQ)') {
        const currentData = this.dataService.getData();
        if (!currentData.selectedModules.includes('HCQ Screening')) {
          this.dataService.updateSelectedModules([...currentData.selectedModules, 'HCQ Screening']);
        }
      }
    } else {
      this.medicationsForm.patchValue({
        selectedMeds: currentMeds.filter((m: string) => m !== medication)
      });
    }
  }

  isMedicationChecked(medication: string): boolean {
    const currentMeds = this.medicationsForm.get('selectedMeds')?.value || [];
    return currentMeds.includes(medication);
  }

  showDoseDetails(): boolean {
    const selectedMeds = this.medicationsForm.get('selectedMeds')?.value || [];
    return selectedMeds.length > 0;
  }

  showSteroidDose(): boolean {
    return this.isMedicationChecked('Steroid');
  }

  showMethotrexateDose(): boolean {
    return this.isMedicationChecked('Methotrexate');
  }

  showHCQDose(): boolean {
    return this.isMedicationChecked('Hydroxychloroquine (HCQ)');
  }

  showOtherMedication(): boolean {
    return this.isMedicationChecked('Others');
  }

  calculateHCQCumulative(): void {
    const dailyDose = this.medicationsForm.get('hcqDailyDose')?.value;
    const months = this.medicationsForm.get('hcqTotalMonths')?.value;

    if (dailyDose && months) {
      this.hcqCumulativeDose = this.dataService.calculateHCQCumulativeDose(dailyDose, months);
    } else {
      this.hcqCumulativeDose = '—';
    }
  }
}
