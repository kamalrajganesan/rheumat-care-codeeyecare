import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from '../../../services/data.service';
import { HCQ_SCREENING_TYPES, HCQ_TESTS, HCQ_TOXICITY_OPTIONS } from '../../../models/constants';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-hcq',
  templateUrl: './hcq.component.html',
  styleUrls: ['./hcq.component.scss'],
  standalone: false
})
export class HcqComponent implements OnInit {
  hcqForm!: FormGroup;
  screeningTypes = HCQ_SCREENING_TYPES;
  tests = HCQ_TESTS;
  toxicityOptions = HCQ_TOXICITY_OPTIONS;
  completed: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.dataService.initializeHCQModule();

    this.hcqForm = this.fb.group({
      screeningType: [''],
      testsPerformed: [[]],
      toxicitySigns: [''],
      notes: ['']
    });

    this.hcqForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe(values => {
        this.dataService.updateHCQModule({
          ...values,
          completed: this.completed
        });
      });
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
    const formValues = this.hcqForm.value;
    this.dataService.updateHCQModule({
      ...formValues,
      completed: this.completed
    });
  }
}
