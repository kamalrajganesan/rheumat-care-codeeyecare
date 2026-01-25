# RheumatCare

A clinical web application for managing rheumatology-ophthalmology interface documentation. Built with Angular 21.

## Overview

RheumatCare streamlines the documentation workflow between rheumatologists and ophthalmologists, providing structured forms for patient visits, disease tracking, and specialized module assessments.

## Features

### Patient Visit Management
- Patient identification (Name, CEC Number)
- Rheumatologist assignment
- Visit type tracking (First visit, Follow-up, Reports review, Urgent/flare, Others)

### Rheumatologist Sheet
- Systemic diagnosis tracking
- Serology status (Seropositive, Seronegative, Not applicable, Unknown)
- Disease status monitoring (Active, Remission, Exacerbation, Burnt out)
- Treatment targets and disease activity scores
- Lab values (ESR, CRP)

### Medications Tracking
- Steroid dosing
- Methotrexate management
- Hydroxychloroquine (HCQ) with cumulative dose calculation
- Biologicals and JAK inhibitors

## Specialized Modules

### CRIS (Cornea-Rheumat Interface Sheet)
Comprehensive dry eye and corneal disease assessment:

| Field | Description |
|-------|-------------|
| DEQ5 Score | Dry Eye Questionnaire (0-25) for OD/OS |
| OSDI-6 Score | Ocular Surface Disease Index for OD/OS |
| Schirmer's Test | Wetting measurement at 5 minutes (mm) |
| Corneal Staining | Severity: Nil, Mild, Moderate, Severe |
| Conjunctival Staining | Severity: Nil, Mild, Moderate, Severe |
| Topical Anti-inflammatory | Options: No, Cyclosporine, Lifitegrast, Others |
| Topical Steroids | Yes/No with name/dose specification |
| Follow-up Status | Baseline, Improved, Worsened, Status quo |
| Elective Surgery Clearance | Not applicable, Yes, No |
| Emergency Conditions | Necrotising/Non-necrotising scleritis, PUK, Corneal perforation/infection, Emergency surgery |
| Coordination Items | IVMP, Pulse Cyclophosphamide, Biologicals, Immunomodulation adjustments |

### URIS (Uvea-Rheumat Interface Sheet)
Uveitis assessment and management:
- Laterality (OD/OS/OU)
- Uveitis status and anatomical type
- Episode pattern and recurrence tracking
- Topical treatment documentation
- Action items and surgery clearance

### HCQ Screening
Hydroxychloroquine toxicity monitoring:
- Baseline and annual screening
- Up to 3 HCQ dosing blocks (dose + duration) for patients with varying dose history
- Automatic cumulative dose calculation across all dosing blocks
- Macula OCT, Fundus photo, HVF, MF-ERG tracking
- Toxicity assessment

## Export Features
- Print-friendly HTML summary generation
- CSV export for data analysis

## Development

### Prerequisites
- Node.js 18+
- Angular CLI 21.x

### Development Server

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The application auto-reloads on file changes.

### Build

```bash
ng build
```

Build artifacts are stored in `dist/rheumat-care`.

### Running Tests

```bash
ng test
```

## Project Structure

```
src/app/
├── components/
│   └── modules/
│       ├── cris/          # CRIS module component
│       ├── uris/          # URIS module component
│       └── hcq/           # HCQ screening component
├── models/
│   ├── patient-data.model.ts   # Data interfaces
│   └── constants.ts            # Dropdown options & constants
└── services/
    ├── data.service.ts         # State management
    └── export.service.ts       # Print/CSV export
```

## License

Proprietary - CODE Eye Care
