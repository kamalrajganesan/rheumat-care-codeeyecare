export interface PatientVisit {
  patientName: string;
  cecNumber: string;
  rheumatologistName: string;
  visitType: string;
}

export interface RheumatologistSheet {
  systemicDiagnosis: string[];
  otherDiagnosis?: string;
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
  otherMedName?: string;
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
  visit: string;
  uveitisStatusOD: string;
  uveitisStatusOS: string;
  anatomicalTypeOD: string;
  anatomicalTypeOS: string;
  natureOD: string;
  natureOS: string;
  episodePatternOD: string;
  episodePatternOS: string;
  episodesCountOD: string;
  episodesCountOS: string;
  priorCourseCompletedOD: string;
  priorCourseCompletedOS: string;
  diagnosis: string[];
  finalDiagnosis: string;
  topicalSteroidsOD: string;
  topicalSteroidsOS: string;
  topicalSteroidsNameOD: string;
  topicalSteroidsNameOS: string;
  topicalNSAIDOD: string;
  topicalNSAIDOS: string;
  topicalNSAIDNameOD: string;
  topicalNSAIDNameOS: string;
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
