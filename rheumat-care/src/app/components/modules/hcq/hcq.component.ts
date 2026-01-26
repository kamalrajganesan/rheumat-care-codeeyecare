import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataService } from '../../../services/data.service';
import { HCQ_SCREENING_TYPES, HCQ_TESTS, HCQ_TOXICITY_OPTIONS } from '../../../models/constants';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-hcq',
  templateUrl: './hcq.component.html',
  styleUrls: ['./hcq.component.scss'],
  standalone: false
})
export class HcqComponent implements OnInit, OnDestroy {
  hcqForm!: FormGroup;
  screeningTypes = HCQ_SCREENING_TYPES;
  tests = HCQ_TESTS;
  toxicityOptions = HCQ_TOXICITY_OPTIONS;
  completed: boolean = false;
  cumulativeDose: string = '';
  private resetSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.dataService.initializeHCQModule();

    this.hcqForm = this.fb.group({
      screeningType: [''],
      testsPerformed: [[]],
      dosingBlocks: this.fb.array([
        this.createDosingBlock(),
        this.createDosingBlock(),
        this.createDosingBlock()
      ]),
      toxicitySigns: [''],
      notes: ['']
    });

    this.hcqForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe(values => {
        this.calculateCumulativeDose();
        this.dataService.updateHCQModule({
          ...values,
          cumulativeDose: this.cumulativeDose,
          completed: this.completed
        });
      });

    this.resetSubscription = this.dataService.reset$.subscribe(() => {
      this.hcqForm.reset({ testsPerformed: [] });
      // Reset dosing blocks
      this.dosingBlocks.controls.forEach(control => {
        control.reset({ dose: null, duration: null });
      });
      this.completed = false;
      this.cumulativeDose = '';
    });
  }

  ngOnDestroy(): void {
    if (this.resetSubscription) {
      this.resetSubscription.unsubscribe();
    }
  }

  createDosingBlock(): FormGroup {
    return this.fb.group({
      dose: [null],
      duration: [null]
    });
  }

  get dosingBlocks(): FormArray {
    return this.hcqForm.get('dosingBlocks') as FormArray;
  }

  calculateCumulativeDose(): void {
    const blocks = this.hcqForm.get('dosingBlocks')?.value || [];
    let totalMg = 0;

    blocks.forEach((block: { dose: number | null; duration: number | null }) => {
      const dose = block.dose || 0;
      const duration = block.duration || 0;
      if (dose > 0 && duration > 0) {
        const days = duration * 30.44;
        totalMg += dose * days;
      }
    });

    if (totalMg > 0) {
      const g = totalMg / 1000;
      this.cumulativeDose = `${g.toFixed(1)} g (${Math.round(totalMg).toLocaleString()} mg)`;
    } else {
      this.cumulativeDose = '';
    }
  }

  onTestChange(test: string, event: any): void {
    const currentTests = this.hcqForm.get('testsPerformed')?.value || [];
    if (event.target.checked) {
      this.hcqForm.patchValue({
        testsPerformed: [...currentTests, test]
      });
    } else {
      this.hcqForm.patchValue({
        testsPerformed: currentTests.filter((t: string) => t !== test)
      });
    }
  }

  isTestChecked(test: string): boolean {
    const currentTests = this.hcqForm.get('testsPerformed')?.value || [];
    return currentTests.includes(test);
  }

  markComplete(): void {
    this.completed = true;
    this.calculateCumulativeDose();
    const formValues = this.hcqForm.value;
    this.dataService.updateHCQModule({
      ...formValues,
      cumulativeDose: this.cumulativeDose,
      completed: this.completed
    });
  }
}
