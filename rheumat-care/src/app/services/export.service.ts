import { Injectable } from '@angular/core';
import { RheumatCareData } from '../models/patient-data.model';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  generatePrintHTML(data: RheumatCareData): string {
    const escapeHtml = (str: string): string => {
      return String(str || '').replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };

    let html = `
      <div style="border:1px solid #d6dbe6;border-radius:14px;padding:14px;">
        <div style="display:flex;align-items:center;gap:14px;">
          <img src="assets/images/CODE EYE CARE LOGO-02.png" style="height:42px;width:auto;object-fit:contain;" onerror="this.style.display='none'" />
          <div>
            <div style="font-size:16px;font-weight:800;margin-bottom:2px;">CODE Eye Care – Rheumatology Interface Summary</div>
          </div>
        </div>
        <hr style="border:none;border-top:1px solid #d6dbe6;margin:12px 0;" />
        <div><b>Patient:</b> ${escapeHtml(data.patientVisit.patientName || '—')} &nbsp; | &nbsp; <b>CEC:</b> ${escapeHtml(data.patientVisit.cecNumber || '—')}</div>
        <div><b>Rheumatologist:</b> ${escapeHtml(data.patientVisit.rheumatologistName || '—')}</div>
        <div><b>Visit type:</b> ${escapeHtml(data.patientVisit.visitType || '—')}</div>
        <div><b>Modules included:</b> ${data.selectedModules.length ? data.selectedModules.join(', ') : '—'}</div>
      </div>
    `;

    // Rheumatologist Sheet
    html += `
      <div style="border:1px solid #d6dbe6;border-radius:14px;padding:14px;margin-top:12px;">
        <div style="font-weight:800;margin-bottom:6px;">Rheumatologist Sheet</div>
        <div><b>Systemic diagnosis:</b> ${data.rheumatologistSheet.systemicDiagnosis.length ? data.rheumatologistSheet.systemicDiagnosis.join(', ') : '—'}</div>
        <div><b>Final systemic diagnosis:</b> ${escapeHtml(data.rheumatologistSheet.finalSystemicDiagnosis || '—')}</div>
        <div><b>Serology status:</b> ${escapeHtml(data.rheumatologistSheet.serologyStatus || '—')}</div>
        <div><b>Status:</b> ${escapeHtml(data.rheumatologistSheet.diseaseStatus || '—')}</div>
        <div><b>Treatment target:</b> ${escapeHtml(data.rheumatologistSheet.treatmentTarget || '—')}</div>
        <div><b>Disease activity score:</b> ${escapeHtml(data.rheumatologistSheet.diseaseActivityScore || '—')}</div>
        <div><b>ESR:</b> ${escapeHtml(data.rheumatologistSheet.esr || '—')} &nbsp; | &nbsp; <b>CRP:</b> ${escapeHtml(data.rheumatologistSheet.crp || '—')}</div>
        <div><b>Rheumatologist's impression:</b> ${escapeHtml(data.rheumatologistSheet.rheumatologistImpression || '—')}</div>
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
        html += `<div><b>Steroid dose/regimen:</b> ${escapeHtml(data.medications.steroidDose)}</div>`;
      }
      if (data.medications.selectedMeds.includes('Methotrexate') && data.medications.methotrexateDose) {
        html += `<div><b>Methotrexate:</b> ${data.medications.methotrexateDose} mg/week</div>`;
      }
      if (data.medications.selectedMeds.includes('Hydroxychloroquine (HCQ)')) {
        html += `<div><b>HCQ:</b> ${data.medications.hcqDailyDose || '—'} mg/day | ${data.medications.hcqTotalMonths || '—'} months</div>`;
        if (data.medications.hcqCumulativeDose) {
          html += `<div><b>HCQ cumulative dose:</b> ${data.medications.hcqCumulativeDose}</div>`;
        }
      }
      if (data.medications.otherMedDetails) {
        html += `<div><b>Other details:</b> ${escapeHtml(data.medications.otherMedDetails)}</div>`;
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
          <div><b>Schirmer's 1 @5 min:</b> OD ${data.cris.schirmerOD ?? '—'} mm | OS ${data.cris.schirmerOS ?? '—'} mm</div>
          <div><b>Corneal staining:</b> OD ${escapeHtml(data.cris.cornealStainingOD || '—')} | OS ${escapeHtml(data.cris.cornealStainingOS || '—')}</div>
          <div><b>Topical cyclosporine:</b> ${escapeHtml(data.cris.topicalCyclosporine || '—')}${data.cris.topicalCyclosporine === 'Yes' && data.cris.cyclosporineName ? ' – ' + escapeHtml(data.cris.cyclosporineName) : ''}</div>
          <div><b>Topical steroids:</b> ${escapeHtml(data.cris.topicalSteroids || '—')}${data.cris.topicalSteroids === 'Yes' && data.cris.topicalSteroidsName ? ' – ' + escapeHtml(data.cris.topicalSteroidsName) : ''}</div>
          <div><b>Follow-up clinical status:</b> OD ${escapeHtml(data.cris.followUpOD || '—')} | OS ${escapeHtml(data.cris.followUpOS || '—')}</div>
          <div><b>Clearance for elective surgery:</b> ${escapeHtml(data.cris.electiveSurgeryClearance || '—')}</div>
          <div><b>Emergency conditions:</b> ${emergConditions || '—'}</div>
          <div><b>Coordination / escalation:</b> ${data.cris.coordinationItems.length ? data.cris.coordinationItems.join(', ') : '—'}</div>
          ${data.cris.ophthalmologistImpression ? `<div><b>Ophthalmologist's impression:</b> ${escapeHtml(data.cris.ophthalmologistImpression)}</div>` : ''}
          ${data.cris.additionalNotes ? `<div><b>Additional notes:</b> ${escapeHtml(data.cris.additionalNotes)}</div>` : ''}
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
          <div><b>Uveitis status:</b> ${escapeHtml(data.uris.uveitisStatus || '—')}</div>
          <div><b>Anatomical type:</b> ${escapeHtml(data.uris.anatomicalType || '—')}</div>
          <div><b>Nature:</b> ${escapeHtml(data.uris.nature || '—')}</div>
          <div><b>Likely/confirmed diagnosis:</b> ${data.uris.diagnosis.length ? data.uris.diagnosis.join(', ') : '—'}</div>
          <div><b>Final uveitis diagnosis:</b> ${escapeHtml(data.uris.finalDiagnosis || '—')}</div>
          <div><b>Episode pattern:</b> ${escapeHtml(data.uris.episodePattern || '—')}</div>
          <div><b>Episodes (last 1–2 years):</b> ${escapeHtml(data.uris.episodesCount || '—')}</div>
          <div><b>Prior course completed:</b> ${escapeHtml(data.uris.priorCourseCompleted || '—')}</div>
          <div><b>Topical steroids:</b> ${escapeHtml(data.uris.topicalSteroidsUse || '—')}${data.uris.topicalSteroidsUse === 'Yes' ? ` (${escapeHtml(data.uris.topicalSteroidsLaterality || '—')}) – ${escapeHtml(data.uris.topicalSteroidsName || '—')}` : ''}</div>
          <div><b>Topical NSAID:</b> ${escapeHtml(data.uris.topicalNSAIDUse || '—')}${data.uris.topicalNSAIDUse === 'Yes' ? ` (${escapeHtml(data.uris.topicalNSAIDLaterality || '—')}) – ${escapeHtml(data.uris.topicalNSAIDName || '—')}` : ''}</div>
          <div><b>Action items:</b> ${data.uris.actionItems.length ? data.uris.actionItems.join(', ') : '—'}</div>
          <div><b>Surgery clearance:</b> ${escapeHtml(data.uris.surgeryClearance || '—')}</div>
          ${data.uris.ophthalmologistInput ? `<div><b>Ophthalmologist input:</b> ${escapeHtml(data.uris.ophthalmologistInput)}</div>` : ''}
        </div>
      `;
    }

    // HCQ Module
    if (data.selectedModules.includes('HCQ Screening') && data.hcq) {
      html += `
        <div style="border:1px solid #d6dbe6;border-radius:14px;padding:14px;margin-top:12px;">
          <div style="font-weight:800;margin-bottom:6px;">HCQ Screening</div>
          <div><b>Status:</b> ${data.hcq.completed ? 'Complete' : 'Pending'}</div>
          <div><b>Type:</b> ${escapeHtml(data.hcq.screeningType || '—')}</div>
          <div><b>Tests:</b> ${data.hcq.testsPerformed.length ? data.hcq.testsPerformed.join(', ') : '—'}</div>
          <div><b>Signs of toxicity:</b> ${escapeHtml(data.hcq.toxicitySigns || '—')}</div>
          ${data.hcq.notes ? `<div><b>Notes:</b> ${escapeHtml(data.hcq.notes)}</div>` : ''}
        </div>
      `;
    }

    html += `
      <div style="margin-top:14px;text-align:center;font-size:10px;color:#444;">
        <div><b>CODE Eye Care</b></div>
        <div style="color:#666;">Generated • ${escapeHtml(data.timestamp || new Date().toLocaleString())}</div>
      </div>
    `;

    return html;
  }

  printSummary(data: RheumatCareData): void {
    const html = this.generatePrintHTML(data);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
        <!doctype html>
        <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <title>CODE Eye Care – Rheumatology Interface Summary</title>
          <style>
            body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;margin:18px;color:#111827;}
            img{max-width:100%;}
          </style>
        </head>
        <body>${html}<script>window.onload=()=>{window.print();}<\/script></body>
        </html>
      `);
      printWindow.document.close();
    }
  }

  downloadCSV(data: RheumatCareData): void {
    const csvData = {
      timestamp: data.timestamp || new Date().toLocaleString(),
      patient: data.patientVisit.patientName,
      cec: data.patientVisit.cecNumber,
      rheumatologist: data.patientVisit.rheumatologistName,
      visitType: data.patientVisit.visitType,
      systemicDiagnosis: data.rheumatologistSheet.systemicDiagnosis.join('; '),
      systemicFinalDx: data.rheumatologistSheet.finalSystemicDiagnosis,
      serologyStatus: data.rheumatologistSheet.serologyStatus,
      diseaseStatus: data.rheumatologistSheet.diseaseStatus,
      treatmentTarget: data.rheumatologistSheet.treatmentTarget,
      diseaseActivityScore: data.rheumatologistSheet.diseaseActivityScore,
      esr: data.rheumatologistSheet.esr,
      crp: data.rheumatologistSheet.crp,
      rheumImpression: data.rheumatologistSheet.rheumatologistImpression,
      modules: data.selectedModules.join('; '),
      meds: data.medications.selectedMeds.join('; ')
    };

    const headers = Object.keys(csvData);
    const values = headers.map(h => String(csvData[h as keyof typeof csvData] ?? '').replace(/"/g, '""'));
    const csv = headers.map(h => `"${h}"`).join(',') + '\n' + values.map(v => `"${v}"`).join(',');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CODE_Rheum_${(data.patientVisit.cecNumber || 'CEC').replace(/\s/g, '_')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
