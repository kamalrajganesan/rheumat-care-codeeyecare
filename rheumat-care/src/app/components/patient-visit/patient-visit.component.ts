import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { VISIT_TYPES } from '../../models/constants';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-patient-visit',
  templateUrl: './patient-visit.component.html',
  styleUrls: ['./patient-visit.component.scss'],
  standalone: false
})
export class PatientVisitComponent implements OnInit {
  patientForm!: FormGroup;
  visitTypes = VISIT_TYPES;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.patientForm = this.fb.group({
      patientName: [''],
      cecNumber: [''],
      rheumatologistName: [''],
      visitType: ['']
    });

    this.patientForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe(values => {
        this.dataService.updatePatientVisit(values);
      });
  }
}
