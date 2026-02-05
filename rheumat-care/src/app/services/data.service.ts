import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { RheumatCareData, PatientVisit, RheumatologistSheet, Medication, CRISModule, URISModule, HCQModule } from '../models/patient-data.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private initialData: RheumatCareData = {
    patientVisit: {
      patientName: '',
      cecNumber: '',
      rheumatologistName: '',
      visitType: ''
    },
    rheumatologistSheet: {
      systemicDiagnosis: [],
      otherDiagnosis: '',
      serologyStatus: '',
      diseaseStatus: '',
      treatmentTarget: '',
      diseaseActivityScore: '',
      esr: '',
      crp: '',
      rheumatologistImpression: ''
    },
    medications: {
      selectedMeds: []
    },
    selectedModules: [],
    timestamp: ''
  };

  private dataSubject = new BehaviorSubject<RheumatCareData>(this.initialData);
  public data$: Observable<RheumatCareData> = this.dataSubject.asObservable();

  private resetSubject = new Subject<void>();
  public reset$: Observable<void> = this.resetSubject.asObservable();

  constructor() { }

  getData(): RheumatCareData {
    return this.dataSubject.value;
  }

  updatePatientVisit(data: Partial<PatientVisit>): void {
    const current = this.dataSubject.value;
    this.dataSubject.next({
      ...current,
      patientVisit: { ...current.patientVisit, ...data }
    });
  }

  updateRheumatologistSheet(data: Partial<RheumatologistSheet>): void {
    const current = this.dataSubject.value;
    this.dataSubject.next({
      ...current,
      rheumatologistSheet: { ...current.rheumatologistSheet, ...data }
    });
  }

  updateMedications(data: Partial<Medication>): void {
    const current = this.dataSubject.value;
    this.dataSubject.next({
      ...current,
      medications: { ...current.medications, ...data }
    });
  }

  updateSelectedModules(modules: string[]): void {
    const current = this.dataSubject.value;
    this.dataSubject.next({
      ...current,
      selectedModules: modules
    });
  }

  updateCRISModule(data: Partial<CRISModule>): void {
    const current = this.dataSubject.value;
    this.dataSubject.next({
      ...current,
      cris: { ...current.cris as CRISModule, ...data }
    });
  }

  updateURISModule(data: Partial<URISModule>): void {
    const current = this.dataSubject.value;
    this.dataSubject.next({
      ...current,
      uris: { ...current.uris as URISModule, ...data }
    });
  }

  updateHCQModule(data: Partial<HCQModule>): void {
    const current = this.dataSubject.value;
    this.dataSubject.next({
      ...current,
      hcq: { ...current.hcq as HCQModule, ...data }
    });
  }

  initializeCRISModule(): void {
    const current = this.dataSubject.value;
    if (!current.cris) {
      this.dataSubject.next({
        ...current,
        cris: {
          deq5OD: null,
          deq5OS: null,
          osdi6OD: null,
          osdi6OS: null,
          schirmerOD: null,
          schirmerOS: null,
          cornealStainingOD: '',
          cornealStainingOS: '',
          conjunctivalStainingOD: '',
          conjunctivalStainingOS: '',
          typeOfDryEye: '',
          typeOfDryEyeOther: '',
          topicalAntiInflammatory: '',
          topicalSteroids: '',
          followUpOD: '',
          followUpOS: '',
          electiveSurgeryClearance: '',
          emergencyConditions: [],
          coordinationItems: [],
          ophthalmologistImpression: '',
          additionalNotes: '',
          completed: false
        }
      });
    }
  }

  initializeURISModule(): void {
    const current = this.dataSubject.value;
    if (!current.uris) {
      this.dataSubject.next({
        ...current,
        uris: {
          visit: '',
          uveitisStatusOD: '',
          uveitisStatusOS: '',
          anatomicalTypeOD: '',
          anatomicalTypeOS: '',
          natureOD: '',
          natureOS: '',
          ffaOD: '',
          ffaOS: '',
          episodePatternOD: '',
          episodePatternOS: '',
          episodesCountOD: '',
          episodesCountOS: '',
          priorCourseCompletedOD: '',
          priorCourseCompletedOS: '',
          diagnosis: [],
          finalDiagnosis: '',
          topicalSteroidsOD: '',
          topicalSteroidsOS: '',
          topicalSteroidsNameOD: '',
          topicalSteroidsNameOS: '',
          topicalNSAIDOD: '',
          topicalNSAIDOS: '',
          topicalNSAIDNameOD: '',
          topicalNSAIDNameOS: '',
          actionItems: [],
          surgeryClearance: '',
          ophthalmologistInput: '',
          completed: false
        }
      });
    }
  }

  initializeHCQModule(): void {
    const current = this.dataSubject.value;
    if (!current.hcq) {
      this.dataSubject.next({
        ...current,
        hcq: {
          screeningType: '',
          testsPerformed: [],
          dosingBlocks: [
            { dose: null, duration: null },
            { dose: null, duration: null },
            { dose: null, duration: null }
          ],
          cumulativeDose: '',
          toxicitySigns: '',
          notes: '',
          completed: false
        }
      });
    }
  }

  calculateHCQCumulativeDose(dailyDose: number, months: number): string {
    if (!dailyDose || !months) return '—';
    const days = months * 30.44;
    const mg = dailyDose * days;
    const g = mg / 1000;
    return `${g.toFixed(1)} g (${Math.round(mg).toLocaleString()} mg)`;
  }

  resetData(): void {
    this.dataSubject.next({
      patientVisit: {
        patientName: '',
        cecNumber: '',
        rheumatologistName: '',
        visitType: ''
      },
      rheumatologistSheet: {
        systemicDiagnosis: [],
        otherDiagnosis: '',
        serologyStatus: '',
        diseaseStatus: '',
        treatmentTarget: '',
        diseaseActivityScore: '',
        esr: '',
        crp: '',
        rheumatologistImpression: ''
      },
      medications: {
        selectedMeds: [],
        steroidDose: '',
        methotrexateDose: undefined,
        otherMedName: '',
        otherMedDetails: ''
      },
      selectedModules: [],
      timestamp: '',
      cris: undefined,
      uris: undefined,
      hcq: undefined
    });
    this.resetSubject.next();
  }

  updateTimestamp(): void {
    const current = this.dataSubject.value;
    this.dataSubject.next({
      ...current,
      timestamp: new Date().toLocaleString()
    });
  }
}
