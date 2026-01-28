# CODE Eye Care - Rheumatology Interface

An Angular application for managing rheumatology patient data with specialized modules for ophthalmology assessment.

## Features

### Core Functionality
- **Patient & Visit Management**: Track patient information, MR numbers, and visit types
- **Rheumatologist Sheet**: Record systemic diagnosis, serology status, disease activity scores, and clinical impressions
- **Medication Management**: Track systemic medications with dose details and HCQ cumulative dose calculator
- **Module Selection**: Dynamic module loading based on patient needs

### Specialized Modules

#### CRIS (Cornea-Rheumat Interface Sheet)
- Dry eye assessment (DEQ5 scores)
- Schirmer's test results (bilateral)
- Corneal staining severity tracking
- Topical medication management
- Emergency condition monitoring (scleritis, PUK, perforation)
- Surgical clearance status

#### URIS (Uvea-Rheumat Interface Sheet)
- Uveitis classification (anatomical & nature)
- FFA (Fundus Fluorescein Angiography) findings
- Episode tracking and patterns
- Differential diagnosis management
- Topical treatment protocols
- Action items and coordination tracking

#### HCQ Screening
- Baseline and follow-up screening
- Test tracking (OCT, fundus photo, HVF, MF-ERG)
- Toxicity assessment

### Output Features
- **Real-time Print Preview**: Live summary updates as data is entered
- **PDF Generation**: Print or save as PDF
- **CSV Export**: Data export for analysis
- **No Data Storage**: Privacy-focused - all data exists only in the browser session

## Getting Started

### Prerequisites
- Node.js 22.x or higher
- npm 10.x or higher

### Installation

```bash
# Navigate to the project directory
cd rheumat-care

# Install dependencies
npm install
```

### Development Server

```bash
# Start the development server
npm start

# Or using ng serve
ng serve
```

Navigate to http://localhost:4200/

### Build

```bash
# Production build
npm run build
```

### Adding the Logo

Place your CODE EYE CARE LOGO-02.png file in src/assets/images/ directory.

## Usage

1. Fill in patient information
2. Complete rheumatologist assessment
3. Record medications
4. Select required modules (CRIS/URIS/HCQ)
5. Complete module assessments
6. Review summary and export (PDF/CSV)

## Technology Stack

- Angular 21
- TypeScript (Strict Mode)
- RxJS
- SCSS
- Reactive Forms

