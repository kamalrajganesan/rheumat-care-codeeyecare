import { Injectable } from '@angular/core';
import { RheumatCareData } from '../models/patient-data.model';

export type PrintFormat = 'codeEyeCare' | 'letterhead';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  generatePrintHTML(data: RheumatCareData, format: PrintFormat = 'codeEyeCare'): string {
    const escapeHtml = (str: string): string => {
      return String(str || '').replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };

    const isLetterhead = format === 'letterhead';

    // Header section - different based on format
    let html = '';

    if (isLetterhead) {
      // Letterhead format: blank header space for custom letterhead
      html += `
        <div style="height:100px;"></div>
        <div style="border:1px solid #d6dbe6;border-radius:14px;padding:14px;">
          <div style="font-size:16px;font-weight:800;margin-bottom:8px;">Eye Rheumatology Interface Summary</div>
          <div><b>Patient:</b> ${escapeHtml(data.patientVisit.patientName || '—')} &nbsp; | &nbsp; <b>MR Number:</b> ${escapeHtml(data.patientVisit.cecNumber || '—')}</div>
          <div><b>Rheumatologist:</b> ${escapeHtml(data.patientVisit.rheumatologistName || '—')}</div>
          <div><b>Visit Type:</b> ${escapeHtml(data.patientVisit.visitType || '—')}</div>
          <div><b>Modules Included:</b> ${data.selectedModules.length ? data.selectedModules.join(', ') : '—'}</div>
        </div>
      `;
    } else {
      // Code Eye Care format: with logo and branding
      html += `
        <div style="border:1px solid #d6dbe6;border-radius:14px;padding:14px;">
          <div style="">
            <img src="assets/images/code-eye-care-logo.png" style="height:42px;width:auto;object-fit:contain;" onerror="this.style.display='none'" /><br>
            <div>
              <div style="font-size:16px;font-weight:800;margin-bottom:2px;">Eye Rheumatology Interface Summary</div>
            </div>
          </div>
          <hr style="border:none;border-top:1px solid #d6dbe6;margin:12px 0;" />
          <div><b>Patient:</b> ${escapeHtml(data.patientVisit.patientName || '—')} &nbsp; | &nbsp; <b>MR Number:</b> ${escapeHtml(data.patientVisit.cecNumber || '—')}</div>
          <div><b>Rheumatologist:</b> ${escapeHtml(data.patientVisit.rheumatologistName || '—')}</div>
          <div><b>Visit Type:</b> ${escapeHtml(data.patientVisit.visitType || '—')}</div>
          <div><b>Modules Included:</b> ${data.selectedModules.length ? data.selectedModules.join(', ') : '—'}</div>
        </div>
      `;
    }

    // Rheumatologist Sheet
    html += `
      <div style="border:1px solid #d6dbe6;border-radius:14px;padding:14px;margin-top:12px;">
        <div style="font-weight:800;margin-bottom:6px;">Rheumatologist Sheet</div>
        <div><b>Systemic Diagnosis:</b> ${data.rheumatologistSheet.systemicDiagnosis.length ? data.rheumatologistSheet.systemicDiagnosis.join(', ') : '—'}</div>
        ${data.rheumatologistSheet.systemicDiagnosis.includes('Others') && data.rheumatologistSheet.otherDiagnosis ? `<div><b>Other Diagnosis Details:</b> ${escapeHtml(data.rheumatologistSheet.otherDiagnosis)}</div>` : ''}
        <div><b>Serology Status:</b> ${escapeHtml(data.rheumatologistSheet.serologyStatus || '—')}</div>
        <div><b>Status:</b> ${escapeHtml(data.rheumatologistSheet.diseaseStatus || '—')}</div>
        <div><b>Treatment Target:</b> ${escapeHtml(data.rheumatologistSheet.treatmentTarget || '—')}</div>
        <div><b>Disease Activity Score:</b> ${escapeHtml(data.rheumatologistSheet.diseaseActivityScore || '—')}</div>
        <div><b>ESR:</b> ${escapeHtml(data.rheumatologistSheet.esr || '—')} &nbsp; | &nbsp; <b>CRP:</b> ${escapeHtml(data.rheumatologistSheet.crp || '—')}</div>
        <div><b>Rheumatologist's Impression:</b> ${escapeHtml(data.rheumatologistSheet.rheumatologistImpression || '—')}</div>
      </div>
    `;

    // Medications
    if (data.medications.selectedMeds.length > 0) {
      html += `
        <div style="border:1px solid #d6dbe6;border-radius:14px;padding:14px;margin-top:12px;">
          <div style="font-weight:800;margin-bottom:6px;">Current systemic medications</div>
          <div><b>Meds:</b> ${data.medications.selectedMeds.join(', ')}</div>
      `;

      if (data.medications.selectedMeds.includes('Steroid') && data.medications.steroidDose) {
        html += `<div><b>Steroid Dose/Regimen:</b> ${escapeHtml(data.medications.steroidDose)}</div>`;
      }
      if (data.medications.selectedMeds.includes('Methotrexate') && data.medications.methotrexateDose) {
        html += `<div><b>Methotrexate:</b> ${data.medications.methotrexateDose} mg/week</div>`;
      }
      if (data.medications.selectedMeds.includes('Hydroxychloroquine (HCQ)')) {
        html += `<div><b>HCQ:</b> See HCQ Screening module for dosing details</div>`;
      }
      if (data.medications.selectedMeds.includes('Others') && data.medications.otherMedName) {
        html += `<div><b>Other Medication:</b> ${escapeHtml(data.medications.otherMedName)}</div>`;
      }
      if (data.medications.otherMedDetails) {
        html += `<div><b>Additional Notes:</b> ${escapeHtml(data.medications.otherMedDetails)}</div>`;
      }
      html += `</div>`;
    }

    // CRIS Module
    if (data.selectedModules.includes('CRIS (Cornea–Rheumat)') && data.cris) {
      const emergConditions = data.cris.emergencyConditions
        .filter(ec => ec.checked)
        .map(ec => ec.laterality ? `${ec.name} (${ec.laterality})` : ec.name)
        .join(', ');

      html += `
        <div style="border:1px solid #d6dbe6;border-radius:14px;padding:14px;margin-top:12px;">
          <div style="font-weight:800;margin-bottom:6px;">CRIS – Cornea–Rheumat Interface</div>
          <div><b>Status:</b> ${data.cris.completed ? 'Complete' : 'Pending'}</div>
          <div><b>DEQ5:</b> OD ${data.cris.deq5OD ?? '—'} | OS ${data.cris.deq5OS ?? '—'}</div>
          <div><b>OSDI-6 Score:</b> OD ${data.cris.osdi6OD ?? '—'} | OS ${data.cris.osdi6OS ?? '—'}</div>
          <div><b>Schirmer's 1 @5 min:</b> OD ${data.cris.schirmerOD ?? '—'} mm | OS ${data.cris.schirmerOS ?? '—'} mm</div>
          <div><b>Corneal Staining:</b> OD ${escapeHtml(data.cris.cornealStainingOD || '—')} | OS ${escapeHtml(data.cris.cornealStainingOS || '—')}</div>
          <div><b>Conjunctival Staining:</b> OD ${escapeHtml(data.cris.conjunctivalStainingOD || '—')} | OS ${escapeHtml(data.cris.conjunctivalStainingOS || '—')}</div>
          <div><b>Topical Anti-Inflammatory:</b> ${escapeHtml(data.cris.topicalAntiInflammatory || '—')}${data.cris.topicalAntiInflammatory && data.cris.topicalAntiInflammatory !== 'No' && data.cris.antiInflammatoryName ? ' – ' + escapeHtml(data.cris.antiInflammatoryName) : ''}</div>
          <div><b>Topical Steroids:</b> ${escapeHtml(data.cris.topicalSteroids || '—')}${data.cris.topicalSteroids === 'Yes' && data.cris.topicalSteroidsName ? ' – ' + escapeHtml(data.cris.topicalSteroidsName) : ''}</div>
          <div><b>Follow-Up Clinical Status:</b> OD ${escapeHtml(data.cris.followUpOD || '—')} | OS ${escapeHtml(data.cris.followUpOS || '—')}</div>
          <div><b>Clearance For Elective Surgery:</b> ${escapeHtml(data.cris.electiveSurgeryClearance || '—')}</div>
          <div><b>Emergency Conditions:</b> ${emergConditions || '—'}</div>
          <div><b>Coordination / Escalation:</b> ${data.cris.coordinationItems.length ? data.cris.coordinationItems.join(', ') : '—'}</div>
          ${data.cris.ophthalmologistImpression ? `<div><b>Ophthalmologist's Impression:</b> ${escapeHtml(data.cris.ophthalmologistImpression)}</div>` : ''}
          ${data.cris.additionalNotes ? `<div><b>Additional Notes:</b> ${escapeHtml(data.cris.additionalNotes)}</div>` : ''}
        </div>
      `;
    }

    // URIS Module
    if (data.selectedModules.includes('URIS (Uvea–Rheumat)') && data.uris) {
      html += `
        <div style="border:1px solid #d6dbe6;border-radius:14px;padding:14px;margin-top:12px;">
          <div style="font-weight:800;margin-bottom:6px;">URIS – Uvea–Rheumat Interface</div>
          <div><b>Status:</b> ${data.uris.completed ? 'Complete' : 'Pending'}</div>
          <div><b>Visit:</b> ${escapeHtml(data.uris.visit || '—')}</div>
          <div><b>Uveitis Status:</b> OD ${escapeHtml(data.uris.uveitisStatusOD || '—')} | OS ${escapeHtml(data.uris.uveitisStatusOS || '—')}</div>
          <div><b>Anatomical Type:</b> OD ${escapeHtml(data.uris.anatomicalTypeOD || '—')} | OS ${escapeHtml(data.uris.anatomicalTypeOS || '—')}</div>
          <div><b>Nature:</b> OD ${escapeHtml(data.uris.natureOD || '—')} | OS ${escapeHtml(data.uris.natureOS || '—')}</div>
          <div><b>Episode Pattern:</b> OD ${escapeHtml(data.uris.episodePatternOD || '—')} | OS ${escapeHtml(data.uris.episodePatternOS || '—')}</div>
          <div><b>Episodes (Last 1–2 Years):</b> OD ${escapeHtml(data.uris.episodesCountOD || '—')} | OS ${escapeHtml(data.uris.episodesCountOS || '—')}</div>
          <div><b>Prior Course Completed:</b> OD ${escapeHtml(data.uris.priorCourseCompletedOD || '—')} | OS ${escapeHtml(data.uris.priorCourseCompletedOS || '—')}</div>
          <div><b>Topical Steroids:</b> OD ${escapeHtml(data.uris.topicalSteroidsOD || '—')}${data.uris.topicalSteroidsOD === 'Yes' && data.uris.topicalSteroidsNameOD ? ' – ' + escapeHtml(data.uris.topicalSteroidsNameOD) : ''} | OS ${escapeHtml(data.uris.topicalSteroidsOS || '—')}${data.uris.topicalSteroidsOS === 'Yes' && data.uris.topicalSteroidsNameOS ? ' – ' + escapeHtml(data.uris.topicalSteroidsNameOS) : ''}</div>
          <div><b>Topical NSAID:</b> OD ${escapeHtml(data.uris.topicalNSAIDOD || '—')}${data.uris.topicalNSAIDOD === 'Yes' && data.uris.topicalNSAIDNameOD ? ' – ' + escapeHtml(data.uris.topicalNSAIDNameOD) : ''} | OS ${escapeHtml(data.uris.topicalNSAIDOS || '—')}${data.uris.topicalNSAIDOS === 'Yes' && data.uris.topicalNSAIDNameOS ? ' – ' + escapeHtml(data.uris.topicalNSAIDNameOS) : ''}</div>
          <div><b>Likely/Confirmed Diagnosis:</b> ${data.uris.diagnosis.length ? data.uris.diagnosis.join(', ') : '—'}</div>
          <div><b>Final Uveitis Diagnosis:</b> ${escapeHtml(data.uris.finalDiagnosis || '—')}</div>
          <div><b>Action Items:</b> ${data.uris.actionItems.length ? data.uris.actionItems.join(', ') : '—'}</div>
          <div><b>Surgery Clearance:</b> ${escapeHtml(data.uris.surgeryClearance || '—')}</div>
          ${data.uris.ophthalmologistInput ? `<div><b>Ophthalmologist Input:</b> ${escapeHtml(data.uris.ophthalmologistInput)}</div>` : ''}
        </div>
      `;
    }

    // HCQ Module
    if (data.selectedModules.includes('HCQ Screening') && data.hcq) {
      const dosingBlocksHtml = data.hcq.dosingBlocks
        .map((block, i) => {
          if (block.dose && block.duration) {
            return `Block ${i + 1}: ${block.dose} mg/day × ${block.duration} months`;
          }
          return null;
        })
        .filter(b => b !== null)
        .join(' | ') || '—';

      html += `
        <div style="border:1px solid #d6dbe6;border-radius:14px;padding:14px;margin-top:12px;">
          <div style="font-weight:800;margin-bottom:6px;">HCQ Screening</div>
          <div><b>Status:</b> ${data.hcq.completed ? 'Complete' : 'Pending'}</div>
          <div><b>Type:</b> ${escapeHtml(data.hcq.screeningType || '—')}</div>
          <div><b>Dosing History:</b> ${dosingBlocksHtml}</div>
          <div><b>Cumulative HCQ Dose:</b> ${escapeHtml(data.hcq.cumulativeDose || '—')}</div>
          <div><b>Tests:</b> ${data.hcq.testsPerformed.length ? data.hcq.testsPerformed.join(', ') : '—'}</div>
          <div><b>Signs of Toxicity:</b> ${escapeHtml(data.hcq.toxicitySigns || '—')}</div>
          ${data.hcq.notes ? `<div><b>Notes:</b> ${escapeHtml(data.hcq.notes)}</div>` : ''}
        </div>
      `;
    }

    if (isLetterhead) {
      // Letterhead format: footer with attribution and blank space for custom letterhead
      html += `
        <div style="margin-top:14px;text-align:center;font-size:10px;color:#666;">
          <div>Generated • ${escapeHtml(data.timestamp || new Date().toLocaleString())}</div>
          <div style="margin-top:6px;font-style:italic;">Developed by CODE Eye Care. This tool is intended for screening purposes only and clinical decisions remain the responsibility of the treating clinician.</div>
        </div>
        <div style="height:80px;"></div>
      `;
    } else {
      // Code Eye Care format: full branding footer
      html += `
        <div style="margin-top:14px;text-align:center;font-size:10px;color:#666;">
          <div>Generated • ${escapeHtml(data.timestamp || new Date().toLocaleString())}</div>
          <div style="margin-top:6px;font-style:italic;">
            <strong>Developed by CODE Eye Care - Institute of Excellence for Cornea, Ocular Surface & Dry Eye </strong><br/>
            This tool supports structured clinical documentation and interdisciplinary communication. Final diagnosis and clinical decisions remain the responsibility of the treating clinician.
          </div>
        </div>
      `;
    }

    return html;
  }

  printSummary(data: RheumatCareData, format: PrintFormat = 'codeEyeCare'): void {
    const html = this.generatePrintHTML(data, format);
    const isLetterhead = format === 'letterhead';
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
        <!doctype html>
        <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <title>Eye Rheumatology Interface Summary</title>
          <style>
            body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;margin:18px;color:#111827;}
            img{max-width:100%;}
            ${isLetterhead ? `
            @page {
              margin-top: 25mm;
              margin-bottom: 20mm;
            }
            @media print {
              body { margin-top: 0; }
            }
            ` : ''}
          </style>
        </head>
        <body>${html}<script>window.onload=()=>{window.print();}<\/script></body>
        </html>
      `);
      printWindow.document.close();
    }
  }

  downloadCSV(data: RheumatCareData): void {
    const escape = (str: string): string => {
      return String(str || '').replace(/"/g, '""');
    };

    const rows: string[][] = [];

    // Helper to add a section header
    const addSection = (title: string) => {
      rows.push([]);
      rows.push([`=== ${title} ===`, '']);
    };

    // Helper to add a row
    const addRow = (label: string, value: string | number | null | undefined) => {
      rows.push([label, String(value ?? '—')]);
    };

    // Header
    rows.push(['Field', 'Value']);
    rows.push([]);

    // Generated timestamp
    addRow('Generated', data.timestamp || new Date().toLocaleString());

    // Patient & Visit Info
    addSection('PATIENT & VISIT INFO');
    addRow('Patient Name', data.patientVisit.patientName);
    addRow('MR Number', data.patientVisit.cecNumber);
    addRow('Rheumatologist Name', data.patientVisit.rheumatologistName);
    addRow('Visit Type', data.patientVisit.visitType);
    addRow('Modules Included', data.selectedModules.join('; ') || '—');

    // Rheumatologist Sheet
    addSection('RHEUMATOLOGIST SHEET');
    addRow('Systemic Diagnosis', data.rheumatologistSheet.systemicDiagnosis.join('; ') || '—');
    if (data.rheumatologistSheet.systemicDiagnosis.includes('Others') && data.rheumatologistSheet.otherDiagnosis) {
      addRow('Other Diagnosis Details', data.rheumatologistSheet.otherDiagnosis);
    }
    addRow('Serology Status', data.rheumatologistSheet.serologyStatus);
    addRow('Disease Status', data.rheumatologistSheet.diseaseStatus);
    addRow('Treatment Target', data.rheumatologistSheet.treatmentTarget);
    addRow('Disease Activity Score', data.rheumatologistSheet.diseaseActivityScore);
    addRow('ESR', data.rheumatologistSheet.esr);
    addRow('CRP', data.rheumatologistSheet.crp);
    addRow('Rheumatologist\'s Impression', data.rheumatologistSheet.rheumatologistImpression);

    // Medications
    if (data.medications.selectedMeds.length > 0) {
      addSection('CURRENT SYSTEMIC MEDICATIONS');
      addRow('Medications', data.medications.selectedMeds.join('; '));
      if (data.medications.selectedMeds.includes('Steroid') && data.medications.steroidDose) {
        addRow('Steroid Dose/Regimen', data.medications.steroidDose);
      }
      if (data.medications.selectedMeds.includes('Methotrexate') && data.medications.methotrexateDose) {
        addRow('Methotrexate Dose', `${data.medications.methotrexateDose} mg/week`);
      }
      if (data.medications.selectedMeds.includes('Hydroxychloroquine (HCQ)')) {
        addRow('HCQ', 'See HCQ Screening module');
      }
      if (data.medications.selectedMeds.includes('Others') && data.medications.otherMedName) {
        addRow('Other Medication', data.medications.otherMedName);
      }
      if (data.medications.otherMedDetails) {
        addRow('Additional Notes', data.medications.otherMedDetails);
      }
    }

    // CRIS Module
    if (data.selectedModules.includes('CRIS (Cornea–Rheumat)') && data.cris) {
      addSection('CRIS – CORNEA–RHEUMAT INTERFACE');
      addRow('Status', data.cris.completed ? 'Complete' : 'Pending');
      addRow('DEQ5 Score (OD)', data.cris.deq5OD);
      addRow('DEQ5 Score (OS)', data.cris.deq5OS);
      addRow('OSDI-6 Score (OD)', data.cris.osdi6OD);
      addRow('OSDI-6 Score (OS)', data.cris.osdi6OS);
      addRow('Schirmer\'s 1 @ 5 min (OD)', data.cris.schirmerOD ? `${data.cris.schirmerOD} mm` : null);
      addRow('Schirmer\'s 1 @ 5 min (OS)', data.cris.schirmerOS ? `${data.cris.schirmerOS} mm` : null);
      addRow('Corneal Staining (OD)', data.cris.cornealStainingOD);
      addRow('Corneal Staining (OS)', data.cris.cornealStainingOS);
      addRow('Conjunctival Staining (OD)', data.cris.conjunctivalStainingOD);
      addRow('Conjunctival Staining (OS)', data.cris.conjunctivalStainingOS);
      addRow('Topical Anti-Inflammatory', data.cris.topicalAntiInflammatory);
      if (data.cris.topicalAntiInflammatory && data.cris.topicalAntiInflammatory !== 'No' && data.cris.antiInflammatoryName) {
        addRow('Anti-Inflammatory Name/Dose', data.cris.antiInflammatoryName);
      }
      addRow('Topical Steroids', data.cris.topicalSteroids);
      if (data.cris.topicalSteroids === 'Yes' && data.cris.topicalSteroidsName) {
        addRow('Steroids Name/Dose', data.cris.topicalSteroidsName);
      }
      addRow('Follow-Up Clinical Status (OD)', data.cris.followUpOD);
      addRow('Follow-Up Clinical Status (OS)', data.cris.followUpOS);
      addRow('Clearance For Elective Surgery', data.cris.electiveSurgeryClearance);
      const emergConditions = data.cris.emergencyConditions
        .filter(ec => ec.checked)
        .map(ec => ec.laterality ? `${ec.name} (${ec.laterality})` : ec.name)
        .join('; ');
      addRow('Emergency Conditions', emergConditions || '—');
      addRow('Coordination / Escalation', data.cris.coordinationItems.join('; ') || '—');
      addRow('Ophthalmologist\'s Impression', data.cris.ophthalmologistImpression);
      addRow('Additional Notes', data.cris.additionalNotes);
    }

    // URIS Module
    if (data.selectedModules.includes('URIS (Uvea–Rheumat)') && data.uris) {
      addSection('URIS – UVEA–RHEUMAT INTERFACE');
      addRow('Status', data.uris.completed ? 'Complete' : 'Pending');
      addRow('Visit', data.uris.visit);
      addRow('Uveitis Status (OD)', data.uris.uveitisStatusOD);
      addRow('Uveitis Status (OS)', data.uris.uveitisStatusOS);
      addRow('Anatomical Type (OD)', data.uris.anatomicalTypeOD);
      addRow('Anatomical Type (OS)', data.uris.anatomicalTypeOS);
      addRow('Nature (OD)', data.uris.natureOD);
      addRow('Nature (OS)', data.uris.natureOS);
      addRow('Episode Pattern (OD)', data.uris.episodePatternOD);
      addRow('Episode Pattern (OS)', data.uris.episodePatternOS);
      addRow('Episodes Last 1–2 Years (OD)', data.uris.episodesCountOD);
      addRow('Episodes Last 1–2 Years (OS)', data.uris.episodesCountOS);
      addRow('Prior Course Completed (OD)', data.uris.priorCourseCompletedOD);
      addRow('Prior Course Completed (OS)', data.uris.priorCourseCompletedOS);
      addRow('Topical Steroids (OD)', data.uris.topicalSteroidsOD);
      if (data.uris.topicalSteroidsOD === 'Yes' && data.uris.topicalSteroidsNameOD) {
        addRow('Steroids Name/Dose (OD)', data.uris.topicalSteroidsNameOD);
      }
      addRow('Topical Steroids (OS)', data.uris.topicalSteroidsOS);
      if (data.uris.topicalSteroidsOS === 'Yes' && data.uris.topicalSteroidsNameOS) {
        addRow('Steroids Name/Dose (OS)', data.uris.topicalSteroidsNameOS);
      }
      addRow('Topical NSAID (OD)', data.uris.topicalNSAIDOD);
      if (data.uris.topicalNSAIDOD === 'Yes' && data.uris.topicalNSAIDNameOD) {
        addRow('NSAID Name/Dose (OD)', data.uris.topicalNSAIDNameOD);
      }
      addRow('Topical NSAID (OS)', data.uris.topicalNSAIDOS);
      if (data.uris.topicalNSAIDOS === 'Yes' && data.uris.topicalNSAIDNameOS) {
        addRow('NSAID Name/Dose (OS)', data.uris.topicalNSAIDNameOS);
      }
      addRow('Likely/Confirmed Diagnosis', data.uris.diagnosis.join('; ') || '—');
      addRow('Final Uveitis Diagnosis', data.uris.finalDiagnosis);
      addRow('Action Items', data.uris.actionItems.join('; ') || '—');
      addRow('Surgery Clearance', data.uris.surgeryClearance);
      addRow('Ophthalmologist Input', data.uris.ophthalmologistInput);
    }

    // HCQ Module
    if (data.selectedModules.includes('HCQ Screening') && data.hcq) {
      addSection('HCQ SCREENING');
      addRow('Status', data.hcq.completed ? 'Complete' : 'Pending');
      addRow('Screening Type', data.hcq.screeningType);
      data.hcq.dosingBlocks.forEach((block, i) => {
        if (block.dose || block.duration) {
          addRow(`Dosing Block ${i + 1} - Dose`, block.dose ? `${block.dose} mg/day` : '—');
          addRow(`Dosing Block ${i + 1} - Duration`, block.duration ? `${block.duration} months` : '—');
        }
      });
      addRow('Cumulative HCQ Dose', data.hcq.cumulativeDose);
      addRow('Tests Performed', data.hcq.testsPerformed.join('; ') || '—');
      addRow('Signs of Toxicity', data.hcq.toxicitySigns);
      addRow('Notes', data.hcq.notes);
    }

    // Convert rows to CSV string
    const csv = rows.map(row => row.map(cell => `"${escape(cell)}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Eye_Rheum_${(data.patientVisit.cecNumber || 'CEC').replace(/\s/g, '_')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
