export interface PatientVisit {
  patientName: string;
  cecNumber: string;
  rheumatologistName: string;
  visitType: string;
}

export interface RheumatologistSheet {
  systemicDiagnosis: string[];
  finalSystemicDiagnosis: string;
  serologyStatus: string;
  diseaseStatus: string;
  treatmentTarget: string;
  diseaseActivityScore: string;
  esr: string;
  crp: string;
  rheumatologistImpression: string;
}

export interface Medication {
  selectedMeds: string[];
  steroidDose?: string;
  methotrexateDose?: number;
  hcqDailyDose?: number;
  hcqTotalMonths?: number;
  hcqCumulativeDose?: string;
  otherMedDetails?: string;
}

export interface CRISModule {
  deq5OD: number | null;
  deq5OS: number | null;
  osdi6OD: number | null;
  osdi6OS: number | null;
  schirmerOD: number | null;
  schirmerOS: number | null;
  cornealStainingOD: string;
  cornealStainingOS: string;
  conjunctivalStainingOD: string;
  conjunctivalStainingOS: string;
  topicalAntiInflammatory: string;
  antiInflammatoryName?: string;
  topicalSteroids: string;
  topicalSteroidsName?: string;
  followUpOD: string;
  followUpOS: string;
  electiveSurgeryClearance: string;
  emergencyConditions: EmergencyCondition[];
  coordinationItems: string[];
  ophthalmologistImpression: string;
  additionalNotes: string;
  completed: boolean;
}

export interface EmergencyCondition {
  name: string;
  checked: boolean;
  laterality: string;
}

export interface URISModule {
  laterality: string;
  visit: string;
  uveitisStatus: string;
  anatomicalType: string;
  nature: string;
  diagnosis: string[];
  finalDiagnosis: string;
  episodePattern: string;
  episodesCount: string;
  priorCourseCompleted: string;
  topicalSteroidsUse: string;
  topicalSteroidsLaterality: string;
  topicalSteroidsName: string;
  topicalNSAIDUse: string;
  topicalNSAIDLaterality: string;
  topicalNSAIDName: string;
  actionItems: string[];
  surgeryClearance: string;
  ophthalmologistInput: string;
  completed: boolean;
}

export interface HCQDosingBlock {
  dose: number | null;
  duration: number | null;
}

export interface HCQModule {
  screeningType: string;
  testsPerformed: string[];
  dosingBlocks: HCQDosingBlock[];
  cumulativeDose: string;
  toxicitySigns: string;
  notes: string;
  completed: boolean;
}

export interface RheumatCareData {
  patientVisit: PatientVisit;
  rheumatologistSheet: RheumatologistSheet;
  medications: Medication;
  selectedModules: string[];
  cris?: CRISModule;
  uris?: URISModule;
  hcq?: HCQModule;
  timestamp: string;
}
