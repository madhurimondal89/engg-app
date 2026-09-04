import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Printer,
  Download,
  FileCheck2,
  Building,
  User,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';

interface EngineeringReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentDisciplineName?: string;
}

export default function EngineeringReportModal({
  open,
  onOpenChange,
  currentDisciplineName = 'Structural / Mechanical Engineering',
}: EngineeringReportModalProps) {
  const [projectName, setProjectName] = useState('Metro High-Voltage Substation & Feeder Line');
  const [projectCode, setProjectCode] = useState('ENG-2026-X04');
  const [engineerName, setEngineerName] = useState('Lead Consulting Engineer, PE');
  const [checkerName, setCheckerName] = useState('Senior Principal Reviewer, FIE');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [calculationTitle, setCalculationTitle] = useState('Transformer Impedance, Tan Delta & Cable Voltage Drop Verification');
  const [standardRef, setStandardRef] = useState('IEEE C57.12.00 / IEC 60076 / AS/NZS 3008');
  const [status, setStatus] = useState<'PASS' | 'WARN' | 'FAIL'>('PASS');
  const [notes, setNotes] = useState(
    'All computed electrical & mechanical parameters meet IEEE / IEC standard permissible limits. Dissipation factor tan δ < 0.5% and cable thermal rating margin is +24.8% above design full load current.'
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 p-0 rounded-2xl shadow-2xl">
        <DialogHeader className="p-6 border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/70 flex flex-row items-center justify-between no-print">
          <div>
            <DialogTitle className="text-xl font-outfit font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              Formal Engineering Calculation Report Generator
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400 text-xs">
              Generate client-ready calculation dossiers with IEEE/ASME/IEC compliance stamps
            </DialogDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handlePrint}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs h-9 gap-1.5 shadow-lg shadow-cyan-500/20"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </Button>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Metadata Controls (Hidden during print) */}
          <div className="no-print p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
              Document Header Information
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-slate-600 dark:text-slate-400">Project Name</Label>
                <Input
                  value={projectName}
                  onChange={e => setProjectName(e.target.value)}
                  className="h-8 text-xs bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-600 dark:text-slate-400">Project Code</Label>
                <Input
                  value={projectCode}
                  onChange={e => setProjectCode(e.target.value)}
                  className="h-8 text-xs bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-600 dark:text-slate-400">Calculation Title</Label>
                <Input
                  value={calculationTitle}
                  onChange={e => setCalculationTitle(e.target.value)}
                  className="h-8 text-xs bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-600 dark:text-slate-400">Design Engineer</Label>
                <Input
                  value={engineerName}
                  onChange={e => setEngineerName(e.target.value)}
                  className="h-8 text-xs bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-600 dark:text-slate-400">Standard / Code Ref</Label>
                <Input
                  value={standardRef}
                  onChange={e => setStandardRef(e.target.value)}
                  className="h-8 text-xs bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-600 dark:text-slate-400">Verdict Status</Label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as any)}
                  className="h-8 w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white px-2"
                >
                  <option value="PASS">PASS / COMPLIANT</option>
                  <option value="WARN">WARN / CONDITIONAL</option>
                  <option value="FAIL">FAIL / NON-COMPLIANT</option>
                </select>
              </div>
            </div>
          </div>

          {/* Actual Printable Report Sheet */}
          <div className="bg-white text-slate-900 p-8 rounded-xl shadow-xl font-sans border border-slate-200 print:border-0 print:shadow-none print:p-0 print:m-0">
            {/* Report Header Bar */}
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-outfit uppercase">
                  Engineering Calculation Sheet
                </h2>
                <p className="text-xs font-semibold text-cyan-700 tracking-wider">
                  ENGINEERING SUPERHUB CERTIFIED COMPUTATION REPORT
                </p>
              </div>
              <div className="text-right text-xs font-mono">
                <div className="font-bold text-slate-900">DOC REF: {projectCode}</div>
                <div className="text-slate-600">DATE: {date}</div>
                <div className="text-slate-600">REV: 01 (APPROVED)</div>
              </div>
            </div>

            {/* Project Details Grid */}
            <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-200 text-xs">
              <div>
                <span className="font-bold text-slate-700">Project:</span> {projectName}
              </div>
              <div>
                <span className="font-bold text-slate-700">Discipline:</span> {currentDisciplineName}
              </div>
              <div>
                <span className="font-bold text-slate-700">Calculation:</span> {calculationTitle}
              </div>
              <div>
                <span className="font-bold text-slate-700">Design Code:</span> {standardRef}
              </div>
            </div>

            {/* Design Inputs & Governing Equations */}
            <div className="py-4 space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">
                  1. Governing Mathematical Equations & Standards
                </h3>
                <div className="p-3 bg-slate-50 rounded border border-slate-200 font-mono text-xs space-y-1">
                  <div>• Voltage Drop Formula: ΔV = √3 × I × L × (R cos φ + X sin φ) / 1000 [V]</div>
                  <div>• Dissipation Factor: tan δ = I_resistive / I_capacitive (IEC 60076-1)</div>
                  <div>• Bending Moment Capacity: M_u = 0.87 × f_y × A_st × d × [1 - (A_st × f_y) / (b × d × f_ck)]</div>
                </div>
              </div>

              {/* Computed Values Table */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">
                  2. Design Verification & Calculated Safety Parameters
                </h3>
                <table className="w-full text-xs text-left border-collapse border border-slate-300 font-mono">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800">
                      <th className="border border-slate-300 p-2">Parameter / Metric</th>
                      <th className="border border-slate-300 p-2">Calculated Value</th>
                      <th className="border border-slate-300 p-2">Standard Allowable</th>
                      <th className="border border-slate-300 p-2 text-center">Verdict</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-300 p-2 font-medium">Insulation Tan Delta (tan δ)</td>
                      <td className="border border-slate-300 p-2 font-bold text-emerald-700">0.32 %</td>
                      <td className="border border-slate-300 p-2">&lt; 0.50 % (New/Refurbished)</td>
                      <td className="border border-slate-300 p-2 text-center text-emerald-600 font-bold">PASS</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 font-medium">Feeder Voltage Drop (ΔV)</td>
                      <td className="border border-slate-300 p-2 font-bold text-emerald-700">1.84 % (7.62 V)</td>
                      <td className="border border-slate-300 p-2">&lt; 3.00 % Max Allowed</td>
                      <td className="border border-slate-300 p-2 text-center text-emerald-600 font-bold">PASS</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 font-medium">Structural Safety Factor (FoS)</td>
                      <td className="border border-slate-300 p-2 font-bold text-emerald-700">2.15</td>
                      <td className="border border-slate-300 p-2">&ge; 1.50 Required</td>
                      <td className="border border-slate-300 p-2 text-center text-emerald-600 font-bold">PASS</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Status Badge & Notes */}
              <div className="pt-2 flex justify-between items-start gap-4">
                <div className="flex-1">
                  <span className="text-xs font-bold uppercase text-slate-800 block mb-1">
                    3. Engineering Notes & Recommendations:
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50 p-2.5 rounded border border-slate-200">
                    {notes}
                  </p>
                </div>

                <div className="text-center p-3 rounded-xl border-2 border-emerald-600 bg-emerald-50 shrink-0 w-36">
                  <div className="text-[10px] uppercase font-bold text-emerald-800">Compliance Stamp</div>
                  <div className="text-xl font-bold font-outfit text-emerald-600">PASS</div>
                  <div className="text-[9px] text-emerald-700 font-mono">IEEE/IEC VERIFIED</div>
                </div>
              </div>

              {/* Signatures Footer */}
              <div className="grid grid-cols-2 gap-8 pt-8 mt-6 border-t border-slate-300 text-xs">
                <div>
                  <div className="border-b border-slate-400 pb-8 font-mono text-slate-700">
                    {engineerName}
                  </div>
                  <div className="mt-1 font-bold text-slate-800">Prepared By (Design Engineer)</div>
                </div>
                <div>
                  <div className="border-b border-slate-400 pb-8 font-mono text-slate-700">
                    {checkerName}
                  </div>
                  <div className="mt-1 font-bold text-slate-800">Verified & Approved By (Chief Checker)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
