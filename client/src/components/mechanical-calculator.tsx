import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { calculateForce, calculateTorque, calculatePressure, type CalculationInput, type CalculationOutput } from '@/lib/calculations';
import { Settings, BarChart3, Edit, Trash2, Save, Share, Printer, AlertTriangle, CheckCircle, ExternalLink, BookOpen } from 'lucide-react';
import { engineeringDisciplines } from '@/lib/formulas';
import { getHowToUse, getEngineeringExplanation, getPracticalApplications, getFAQs } from '@/lib/calculator-content';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import StrengthCalculator from './strength-calculator';
import MachineDesignCalculator from './machine-design-calculator';
import ThermodynamicsCalculator from './thermodynamics-calculator';
import FluidCalculator from './fluid-calculator';
import ManufacturingCalculator from './manufacturing-calculator';
import DynamicsCalculator from './dynamics-calculator';
import BeamVisualizer from './visualizers/beam-visualizer';
import MohrCircleVisualizer from './visualizers/mohr-circle-visualizer';
import { QuickReferenceAccordion } from './quick-reference-accordion';

export default function MechanicalCalculator({ initialCalc }: { initialCalc?: string }) {
  // Machine Design sub-calculator IDs
  const machineDesignCalcs = ['gear-ratio', 'gear-speed', 'bolt-torque', 'shaft-diameter', 'belt-length', 'belt-tension', 'chain-length', 'spring-constant', 'bearing-life', 'flywheel-energy'];

  const [initialSubCalc, setInitialSubCalc] = useState<string | null>(() => {
    if (initialCalc && machineDesignCalcs.includes(initialCalc)) return initialCalc;
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode') || 'menu';
    return machineDesignCalcs.includes(mode) ? mode : null;
  });

  const [activeCalculator, setActiveCalculator] = useState(() => {
    if (initialCalc) {
      if (machineDesignCalcs.includes(initialCalc)) return 'machine-design';
      return initialCalc;
    }
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode') || 'menu';
    // If it's a machine-design sub-calculator, route to machine-design
    if (machineDesignCalcs.includes(mode)) return 'machine-design';
    return mode;
  });

  React.useEffect(() => {
    if (initialCalc && initialCalc !== activeCalculator) {
      if (machineDesignCalcs.includes(initialCalc)) {
        setActiveCalculator('machine-design');
        setInitialSubCalc(initialCalc);
      } else {
        setActiveCalculator(initialCalc);
      }
    }
  }, [initialCalc]);

  React.useEffect(() => {
    const slug = activeCalculator === 'menu' ? '' : `/${activeCalculator}`;
    const newPath = `/calculators/mechanical${slug}`;
    if (window.location.pathname !== newPath) {
      window.history.replaceState(null, '', newPath);
    }
  }, [activeCalculator]);
  const [inputs, setInputs] = useState({
    force: { value: '', unit: 'N' },
    mass: { value: '', unit: 'kg' },
    acceleration: { value: '', unit: 'm/s²' },
    radius: { value: '', unit: 'm' },
    area: { value: '', unit: 'm²' }
  });
  const [results, setResults] = useState<CalculationOutput | null>(null);

  // Grouped calculator types
  const calculatorTypes = [
    { id: 'beam-analyzer', name: '📊 Beam Analyzer (SFD & BMD)', active: true },
    { id: 'mohr-stress', name: "🧭 Mohr's Circle 2D Stress", active: true },
    { id: 'force', name: 'Force & Motion', active: true },
    { id: 'torque', name: 'Torque', active: true },
    { id: 'pressure', name: 'Pressure', active: true },
    { id: 'strength', name: 'Strength of Materials', active: true },
    { id: 'machine-design', name: 'Machine Design', active: true },
    { id: 'thermodynamics', name: 'Thermodynamics', active: true },
    { id: 'fluid-mechanics', name: 'Fluid Mechanics', active: true },
    { id: 'manufacturing', name: 'Manufacturing', active: true },
    { id: 'dynamics', name: 'Dynamics', active: true }
  ];

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({
      ...prev,
      [field]: { ...prev[field as keyof typeof prev], value }
    }));
  };

  const handleUnitChange = (field: string, unit: string) => {
    setInputs(prev => ({
      ...prev,
      [field]: { ...prev[field as keyof typeof prev], unit }
    }));
  };

  const performCalculation = () => {
    const calculationInputs: { [key: string]: CalculationInput } = {};

    Object.entries(inputs).forEach(([key, input]) => {
      if (input.value && !isNaN(parseFloat(input.value))) {
        calculationInputs[key] = {
          value: parseFloat(input.value),
          unit: input.unit
        };
      }
    });

    let result: CalculationOutput;

    if (activeCalculator === 'force') {
      result = calculateForce(calculationInputs);
    } else if (activeCalculator === 'torque') {
      result = calculateTorque(calculationInputs);
    } else if (activeCalculator === 'pressure') {
      result = calculatePressure(calculationInputs);
    } else {
      result = { results: {}, steps: [], errors: ['Calculator not implemented yet'] };
    }

    setResults(result);
  };

  const clearInputs = () => {
    setInputs({
      force: { value: '', unit: 'N' },
      mass: { value: '', unit: 'kg' },
      acceleration: { value: '', unit: 'm/s²' },
      radius: { value: '', unit: 'm' },
      area: { value: '', unit: 'm²' }
    });
    setResults(null);
  };

  const getFormulaInfo = () => {
    if (activeCalculator === 'force') {
      return {
        name: "Newton's Second Law",
        formula: 'F = m × a',
        description: 'Force (F) = Mass (m) × Acceleration (a)'
      };
    } else if (activeCalculator === 'torque') {
      return {
        name: "Basic Torque",
        formula: 'τ = F × r',
        description: 'Torque (τ) = Force (F) × Radius (r)'
      };
    } else if (activeCalculator === 'pressure') {
      return {
        name: "Basic Pressure",
        formula: 'P = F / A',
        description: 'Pressure (P) = Force (F) / Area (A)'
      };
    }
    return null;
  };

  const formulaInfo = getFormulaInfo();

  if (activeCalculator === 'menu') return (
    <Card className="mb-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center font-outfit">
            <Settings className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
            Mechanical Engineering Calculators
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {calculatorTypes.map((calc) => (
            <Button
              key={calc.id}
              variant="outline"
              className="h-auto py-6 flex flex-col items-center justify-center text-center whitespace-normal border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50/60 dark:hover:bg-blue-950/30 transition-all group rounded-xl"
              onClick={() => calc.active && setActiveCalculator(calc.id)}
              disabled={!calc.active}
            >
              <div className="bg-blue-100/70 dark:bg-blue-950/80 p-3 rounded-full mb-3 group-hover:bg-blue-200/80 dark:group-hover:bg-blue-900/60 transition-colors">
                {calc.id === 'force' && <i className="fas fa-apple-alt text-blue-600 dark:text-blue-400 text-xl"></i>}
                {calc.id === 'torque' && <i className="fas fa-sync-alt text-blue-600 dark:text-blue-400 text-xl"></i>}
                {calc.id === 'pressure' && <i className="fas fa-compress-arrows-alt text-blue-600 dark:text-blue-400 text-xl"></i>}
                {calc.id === 'strength' && <i className="fas fa-dumbbell text-blue-600 dark:text-blue-400 text-xl"></i>}
                {calc.id === 'machine-design' && <i className="fas fa-cogs text-blue-600 dark:text-blue-400 text-xl"></i>}
                {calc.id === 'thermodynamics' && <i className="fas fa-thermometer-half text-blue-600 dark:text-blue-400 text-xl"></i>}
                {calc.id === 'fluid-mechanics' && <i className="fas fa-water text-blue-600 dark:text-blue-400 text-xl"></i>}
                {calc.id === 'manufacturing' && <i className="fas fa-industry text-blue-600 dark:text-blue-400 text-xl"></i>}
                {calc.id === 'dynamics' && <i className="fas fa-running text-blue-600 dark:text-blue-400 text-xl"></i>}
              </div>
              <span className="font-bold text-base text-slate-900 dark:text-white font-outfit">{calc.name}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">Click to open calculator</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  // If selecting a sub-discipline, render its specific component
  if (activeCalculator === 'beam-analyzer' || activeCalculator === 'beam-visualizer') return (
    <>
      <div className="mb-6">
        <Button variant="outline" onClick={() => setActiveCalculator('menu')} className="mb-4">
          ← Back to Mechanical Menu
        </Button>
        <BeamVisualizer />
      </div>
    </>
  );

  if (activeCalculator === 'mohr-stress' || activeCalculator === 'mohrs-circle') return (
    <>
      <div className="mb-6">
        <Button variant="outline" onClick={() => setActiveCalculator('menu')} className="mb-4">
          ← Back to Mechanical Menu
        </Button>
        <MohrCircleVisualizer />
      </div>
    </>
  );

  if (activeCalculator === 'strength') return (
    <>
      <div className="mb-6">
        <Button variant="outline" onClick={() => setActiveCalculator('menu')} className="mb-4">
          ← Back to Mechanical Menu
        </Button>
        <StrengthCalculator />
      </div>
    </>
  );

  if (activeCalculator === 'machine-design') return (
    <>
      <div className="mb-6">
        <Button variant="outline" onClick={() => setActiveCalculator('menu')} className="mb-4">
          ← Back to Mechanical Menu
        </Button>
        <MachineDesignCalculator initialCalc={initialSubCalc} />
      </div>
    </>
  );

  if (activeCalculator === 'thermodynamics') return (
    <>
      <div className="mb-6">
        <Button variant="outline" onClick={() => setActiveCalculator('menu')} className="mb-4">
          ← Back to Mechanical Menu
        </Button>
        <ThermodynamicsCalculator />
      </div>
    </>
  );

  if (activeCalculator === 'fluid-mechanics') return (
    <>
      <div className="mb-6">
        <Button variant="outline" onClick={() => setActiveCalculator('menu')} className="mb-4">
          ← Back to Mechanical Menu
        </Button>
        <FluidCalculator />
      </div>
    </>
  );

  if (activeCalculator === 'manufacturing') return (
    <>
      <div className="mb-6">
        <Button variant="outline" onClick={() => setActiveCalculator('menu')} className="mb-4">
          ← Back to Mechanical Menu
        </Button>
        <ManufacturingCalculator />
      </div>
    </>
  );

  if (activeCalculator === 'dynamics') return (
    <>
      <div className="mb-6">
        <Button variant="outline" onClick={() => setActiveCalculator('menu')} className="mb-4">
          ← Back to Mechanical Menu
        </Button>
        <DynamicsCalculator />
      </div>
    </>
  );

  return (
    <>
      <Card className="mb-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={() => setActiveCalculator('menu')} className="mr-2 text-slate-600 dark:text-slate-300">
                <span className="text-xl">←</span>
              </Button>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center font-outfit">
                <Settings className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
                Mechanical Engineering - {calculatorTypes.find(c => c.id === activeCalculator)?.name}
              </h2>
            </div>
            <Button variant="outline" size="sm" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
              <i className="fas fa-book mr-2"></i>
              Formulas
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {calculatorTypes.filter(calc => ['force', 'torque', 'pressure'].includes(calc.id)).map((calc) => (
              <Button
                key={calc.id}
                variant={activeCalculator === calc.id ? "default" : "outline"}
                size="sm"
                className={`${activeCalculator === calc.id
                  ? 'bg-blue-600 text-white hover:bg-blue-600'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  } ${!calc.active ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => calc.active && setActiveCalculator(calc.id)}
                disabled={!calc.active}
              >
                {calc.name}
              </Button>
            ))}

            {activeCalculator === 'force' && (
              <Button variant="outline" size="sm" onClick={() => window.open('/calculators/force-calculator.html', '_blank')} className="border-eng-blue text-eng-blue ml-2">
                <ExternalLink className="h-4 w-4 mr-2" /> Advanced Force Tool
              </Button>
            )}
            {activeCalculator === 'torque' && (
              <>
                <Button variant="outline" size="sm" onClick={() => window.open('/calculators/torque-calculator.html', '_blank')} className="border-eng-blue text-eng-blue ml-2">
                  <ExternalLink className="h-4 w-4 mr-2" /> Advanced Torque
                </Button>
                <Button variant="outline" size="sm" onClick={() => window.open('/calculators/torque-conversion.html', '_blank')} className="border-eng-blue text-eng-blue ml-2">
                  <ExternalLink className="h-4 w-4 mr-2" /> Unit Converter
                </Button>
              </>
            )}

            {activeCalculator === 'pressure' && (
              <Button variant="outline" size="sm" onClick={() => window.open('/calculators/pressure-calculator.html', '_blank')} className="border-eng-blue text-eng-blue ml-2">
                <ExternalLink className="h-4 w-4 mr-2" /> Advanced Pressure Tool
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-charcoal flex items-center">
              <Edit className="h-5 w-5 text-eng-blue mr-2" />
              Input Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">

            {formulaInfo && (
              <div className="bg-blue-50 border-l-4 border-eng-blue p-4">
                <div className="flex items-center mb-2">
                  <i className="fas fa-formula text-eng-blue mr-2"></i>
                  <span className="font-semibold text-charcoal">{formulaInfo.name}</span>
                </div>
                <div className="font-roboto-mono text-lg text-charcoal">
                  {formulaInfo.formula}
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  {formulaInfo.description}
                </div>
              </div>
            )}

            <div className="space-y-4">
              {activeCalculator === 'force' && (
                <>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Force (F)</Label>
                    <div className="flex mt-2 space-x-2">
                      <Input type="number" placeholder="Enter force value" value={inputs.force.value} onChange={(e) => handleInputChange('force', e.target.value)} className="flex-1" />
                      <Select value={inputs.force.unit} onValueChange={(value) => handleUnitChange('force', value)}>
                        <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="N">N</SelectItem><SelectItem value="kN">kN</SelectItem></SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Mass (m)</Label>
                    <div className="flex mt-2 space-x-2">
                      <Input type="number" placeholder="Enter mass value" value={inputs.mass.value} onChange={(e) => handleInputChange('mass', e.target.value)} className="flex-1" />
                      <Select value={inputs.mass.unit} onValueChange={(value) => handleUnitChange('mass', value)}>
                        <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="kg">kg</SelectItem><SelectItem value="g">g</SelectItem></SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Acceleration (a)</Label>
                    <div className="flex mt-2 space-x-2">
                      <Input type="number" placeholder="Enter acceleration value" value={inputs.acceleration.value} onChange={(e) => handleInputChange('acceleration', e.target.value)} className="flex-1" />
                      <Select value={inputs.acceleration.unit} onValueChange={(value) => handleUnitChange('acceleration', value)}>
                        <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="m/s²">m/s²</SelectItem></SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}
              {activeCalculator === 'torque' && (
                <>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Force (F)</Label>
                    <div className="flex mt-2 space-x-2">
                      <Input type="number" placeholder="Enter force value" value={inputs.force.value} onChange={(e) => handleInputChange('force', e.target.value)} className="flex-1" />
                      <Select value={inputs.force.unit} onValueChange={(value) => handleUnitChange('force', value)}>
                        <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="N">N</SelectItem><SelectItem value="kN">kN</SelectItem></SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Radius (r)</Label>
                    <div className="flex mt-2 space-x-2">
                      <Input type="number" placeholder="Enter radius value" value={inputs.radius.value} onChange={(e) => handleInputChange('radius', e.target.value)} className="flex-1" />
                      <Select value={inputs.radius.unit} onValueChange={(value) => handleUnitChange('radius', value)}>
                        <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="m">m</SelectItem><SelectItem value="cm">cm</SelectItem></SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}
              {activeCalculator === 'pressure' && (
                <>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Force (F)</Label>
                    <div className="flex mt-2 space-x-2">
                      <Input type="number" placeholder="Enter force value" value={inputs.force.value} onChange={(e) => handleInputChange('force', e.target.value)} className="flex-1" />
                      <Select value={inputs.force.unit} onValueChange={(value) => handleUnitChange('force', value)}>
                        <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="N">N</SelectItem><SelectItem value="kN">kN</SelectItem></SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Area (A)</Label>
                    <div className="flex mt-2 space-x-2">
                      <Input type="number" placeholder="Enter area value" value={inputs.area.value} onChange={(e) => handleInputChange('area', e.target.value)} className="flex-1" />
                      <Select value={inputs.area.unit} onValueChange={(value) => handleUnitChange('area', value)}>
                        <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="m²">m²</SelectItem><SelectItem value="cm²">cm²</SelectItem></SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}
            </div>

            {results?.errors && results.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{results.errors[0]}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              <Button onClick={performCalculation} className="w-full bg-eng-blue hover:bg-eng-blue/90 text-white font-semibold">
                <i className="fas fa-calculator mr-2"></i>
                Calculate
              </Button>
              <Button variant="outline" onClick={clearInputs} className="w-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-charcoal flex items-center">
              <BarChart3 className="h-5 w-5 text-eng-blue mr-2" />
              Results & Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {results && Object.keys(results.results).length > 0 ? (
              <>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Calculated Values
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(results.results).map(([key, result]) => (
                      <div key={key} className="text-center">
                        <div className="text-2xl font-roboto-mono font-bold text-green-700">{result.formatted}</div>
                        <div className="text-sm text-green-600 capitalize">{key}</div>
                      </div>
                    ))}
                  </div>
                </div>
                {results.steps.length > 0 && (
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="font-semibold text-charcoal mb-3 flex items-center">
                      <i className="fas fa-list-ol text-eng-blue mr-2"></i>
                      Step-by-Step Solution
                    </h4>
                    <div className="space-y-3 text-sm">
                      {results.steps.map((step, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <Badge variant="secondary" className="flex-shrink-0 w-6 h-6 bg-eng-blue text-white rounded-full flex items-center justify-center text-xs font-bold p-0">{step.step}</Badge>
                          <div>
                            <div className="font-medium text-gray-700">{step.description}</div>
                            {step.formula && <div className="text-gray-600 font-roboto-mono">{step.formula}</div>}
                            <div className="text-gray-600 font-roboto-mono">{step.calculation}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" size="sm" className="flex-1 min-w-0"><Save className="h-4 w-4 mr-2" />Save</Button>
                    <Button variant="outline" size="sm" className="flex-1 min-w-0"><Share className="h-4 w-4 mr-2" />Share</Button>
                    <Button variant="outline" size="sm" className="flex-1 min-w-0"><Printer className="h-4 w-4 mr-2" />Print</Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Enter values and click Calculate to see results</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dynamic Contextual Accordion */}
        <QuickReferenceAccordion formulaInfo={formulaInfo} discipline="mechanical" />

      </div>
    </>
  );
}
