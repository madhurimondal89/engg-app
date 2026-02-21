
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Edit, Trash2, BarChart3, Save, Share, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';
import { CalculationOutput } from '@/lib/calculations';

import { calculateBeamLoad, calculateBendingMoment, calculateShearForce, calculateBeamDeflection, calculateColumnLoad, calculateSlabThickness, calculateFootingSize, calculateReinforcement, calculateStructuralSafetyFactor } from '@/lib/civil-calculations';
import { engineeringDisciplines } from '@/lib/formulas';
import { getHowToUse, getEngineeringExplanation, getPracticalApplications, getFAQs } from '@/lib/calculator-content';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { BookOpen } from 'lucide-react';

export default function StructuralCalculator() {
    const [activeMode, setActiveMode] = useState('beam-load');
    const [inputs, setInputs] = useState({
        length: { value: '5', unit: 'm' },
        width: { value: '0.3', unit: 'm' },
        depth: { value: '0.45', unit: 'm' },
        density: { value: '2500', unit: 'kg/m³' },
        force: { value: '10', unit: 'kN' },
        type: { value: 'point', unit: '' },
        position: { value: '2.5', unit: 'm' },
        elasticity: { value: '200', unit: 'GPa' },
        inertia: { value: '0.00045', unit: 'm4' },
        area: { value: '250', unit: 'mm²' },
        concreteGrade: { value: '25', unit: 'MPa' },
        steelGrade: { value: '500', unit: 'MPa' },
        ratio: { value: '25', unit: '' }, // Slab L/d
        pressure: { value: '150', unit: 'kN/m²' }, // SBC
        volume: { value: '10', unit: 'm³' },
        percentage: { value: '1', unit: '%' },
        strength: { value: '100', unit: 'kN' }, // Working Load
    });
    const [results, setResults] = useState<CalculationOutput | null>(null);

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
        const calcInputs: any = {};
        Object.entries(inputs).forEach(([key, val]) => {
            if (val.value) { // Don't strictly check for NaN here for string types like 'type', though here all are numbers
                // Special handling for force input which might be in kN
                let finalUnit = val.unit;
                // For force, if unit is kN, let convertToBaseUnit handle it (1000 multiplier)

                calcInputs[key] = { value: parseFloat(val.value) || val.value, unit: val.unit };
            }
        });

        let res: CalculationOutput;
        if (activeMode === 'beam-load') {
            res = calculateBeamLoad(calcInputs);
        } else if (activeMode === 'moment') {
            res = calculateBendingMoment(calcInputs);
        } else if (activeMode === 'shear') {
            res = calculateShearForce(calcInputs);
        } else if (activeMode === 'deflection') {
            res = calculateBeamDeflection(calcInputs);
        } else if (activeMode === 'column') {
            res = calculateColumnLoad(calcInputs);
        } else if (activeMode === 'slab') {
            res = calculateSlabThickness(calcInputs);
        } else if (activeMode === 'footing') {
            res = calculateFootingSize(calcInputs);
        } else if (activeMode === 'reinforcement') {
            res = calculateReinforcement(calcInputs);
        } else if (activeMode === 'safety') {
            res = calculateStructuralSafetyFactor(calcInputs);
        } else {
            res = { results: {}, steps: [], errors: ['Invalid Mode'] };
        }
        setResults(res);
    };

    const clearInputs = () => {
        setInputs({
            length: { value: '5', unit: 'm' },
            width: { value: '0.3', unit: 'm' },
            depth: { value: '0.45', unit: 'm' },
            density: { value: '2500', unit: 'kg/m³' },
            force: { value: '10', unit: 'kN' },
            type: { value: 'point', unit: '' },
            position: { value: '2.5', unit: 'm' },
            elasticity: { value: '200', unit: 'GPa' },
            inertia: { value: '0.00045', unit: 'm4' },
            area: { value: '250', unit: 'mm²' },
            concreteGrade: { value: '25', unit: 'MPa' },
            steelGrade: { value: '500', unit: 'MPa' },
            ratio: { value: '25', unit: '' },
            pressure: { value: '150', unit: 'kN/m²' },
            volume: { value: '10', unit: 'm³' },
            percentage: { value: '1', unit: '%' },
            strength: { value: '100', unit: 'kN' },
        });
        setResults(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex space-x-2 overflow-x-auto pb-2">
                <Button
                    variant={activeMode === 'beam-load' ? 'default' : 'outline'}
                    onClick={() => { setActiveMode('beam-load'); setResults(null); }}
                    className={activeMode === 'beam-load' ? 'bg-eng-blue text-white' : ''}
                >
                    Beam Load
                </Button>
                <Button
                    variant={activeMode === 'moment' ? 'default' : 'outline'}
                    onClick={() => { setActiveMode('moment'); setResults(null); }}
                    className={activeMode === 'moment' ? 'bg-eng-blue text-white' : ''}
                >
                    Bending Moment
                </Button>
                <Button variant={activeMode === 'shear' ? 'default' : 'outline'} onClick={() => { setActiveMode('shear'); setResults(null); }} className={activeMode === 'shear' ? 'bg-eng-blue text-white' : ''}>Shear Force</Button>
                <Button variant={activeMode === 'deflection' ? 'default' : 'outline'} onClick={() => { setActiveMode('deflection'); setResults(null); }} className={activeMode === 'deflection' ? 'bg-eng-blue text-white' : ''}>Beam Deflection</Button>
                <Button variant={activeMode === 'column' ? 'default' : 'outline'} onClick={() => { setActiveMode('column'); setResults(null); }} className={activeMode === 'column' ? 'bg-eng-blue text-white' : ''}>Axial Load</Button>
                <Button variant={activeMode === 'slab' ? 'default' : 'outline'} onClick={() => { setActiveMode('slab'); setResults(null); }} className={activeMode === 'slab' ? 'bg-eng-blue text-white' : ''}>Slab</Button>
                <Button variant={activeMode === 'footing' ? 'default' : 'outline'} onClick={() => { setActiveMode('footing'); setResults(null); }} className={activeMode === 'footing' ? 'bg-eng-blue text-white' : ''}>Footing</Button>
                <Button variant={activeMode === 'reinforcement' ? 'default' : 'outline'} onClick={() => { setActiveMode('reinforcement'); setResults(null); }} className={activeMode === 'reinforcement' ? 'bg-eng-blue text-white' : ''}>Steel %</Button>
                <Button variant={activeMode === 'safety' ? 'default' : 'outline'} onClick={() => { setActiveMode('safety'); setResults(null); }} className={activeMode === 'safety' ? 'bg-eng-blue text-white' : ''}>Structural Safety Factor</Button>
                <Button variant="outline" onClick={() => window.open('/calculators/beam-calculator.html', '_blank')} className="border-eng-blue text-eng-blue">
                    <ExternalLink className="h-4 w-4 mr-2" /> Advanced Beam Tool
                </Button>

            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-charcoal flex items-center">
                            <Edit className="h-5 w-5 text-eng-blue mr-2" />
                            Parameters
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {activeMode === 'beam-load' && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Length (L)</Label>
                                        <div className="flex mt-1.5 space-x-2">
                                            <Input type="number" value={inputs.length.value} onChange={(e) => handleInputChange('length', e.target.value)} />
                                            <Select value={inputs.length.unit} onValueChange={(v) => handleUnitChange('length', v)}>
                                                <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="m">m</SelectItem><SelectItem value="ft">ft</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Width (W)</Label>
                                        <div className="flex mt-1.5 space-x-2">
                                            <Input type="number" value={inputs.width.value} onChange={(e) => handleInputChange('width', e.target.value)} />
                                            <Select value={inputs.width.unit} onValueChange={(v) => handleUnitChange('width', v)}>
                                                <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="m">m</SelectItem><SelectItem value="mm">mm</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Depth (D)</Label>
                                        <div className="flex mt-1.5 space-x-2">
                                            <Input type="number" value={inputs.depth.value} onChange={(e) => handleInputChange('depth', e.target.value)} />
                                            <Select value={inputs.depth.unit} onValueChange={(v) => handleUnitChange('depth', v)}>
                                                <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="m">m</SelectItem><SelectItem value="mm">mm</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Density (ρ)</Label>
                                        <div className="flex mt-1.5 space-x-2">
                                            <Input type="number" value={inputs.density.value} onChange={(e) => handleInputChange('density', e.target.value)} />
                                            <div className="flex items-center justify-center px-3 bg-gray-100 rounded text-sm text-gray-500">kg/m³</div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeMode === 'moment' && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Span Length (L)</Label>
                                        <div className="flex mt-1.5 space-x-2">
                                            <Input type="number" value={inputs.length.value} onChange={(e) => handleInputChange('length', e.target.value)} />
                                            <Select value={inputs.length.unit} onValueChange={(v) => handleUnitChange('length', v)}>
                                                <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="m">m</SelectItem><SelectItem value="ft">ft</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Load (F or W)</Label>
                                        <div className="flex mt-1.5 space-x-2">
                                            <Input type="number" value={inputs.force.value} onChange={(e) => handleInputChange('force', e.target.value)} />
                                            <Select value={inputs.force.unit} onValueChange={(v) => handleUnitChange('force', v)}>
                                                <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="kN">kN</SelectItem><SelectItem value="N">N</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    {/* 
                    <div>
                        <Label>Load Type</Label>
                        <Select value={inputs.type.value} onValueChange={(v) => handleInputChange('type', v)}>
                            <SelectTrigger className="w-full mt-1.5"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="point">Point Load (Center)</SelectItem><SelectItem value="udl">UDL (Total)</SelectItem></SelectContent>
                        </Select>
                    </div>
                    */}
                                </div>
                                <Alert className="mt-4 bg-blue-50 border-eng-blue">
                                    <CheckCircle className="h-4 w-4 text-eng-blue" />
                                    <AlertDescription>
                                        Calculates Maximum Bending Moment for Simply Supported Beam. <br />
                                        Displays results for both Point Load (at center) and UDL (total load).
                                    </AlertDescription>
                                </Alert>
                            </>
                        )}

                        {activeMode === 'shear' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Span Length (L)</Label>
                                    <div className="flex mt-1.5 space-x-2">
                                        <Input type="number" value={inputs.length.value} onChange={(e) => handleInputChange('length', e.target.value)} />
                                        <Select value={inputs.length.unit} onValueChange={(v) => handleUnitChange('length', v)}>
                                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                                            <SelectContent><SelectItem value="m">m</SelectItem><SelectItem value="ft">ft</SelectItem></SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div>
                                    <Label>Load (F or W)</Label>
                                    <div className="flex mt-1.5 space-x-2">
                                        <Input type="number" value={inputs.force.value} onChange={(e) => handleInputChange('force', e.target.value)} />
                                        <Select value={inputs.force.unit} onValueChange={(v) => handleUnitChange('force', v)}>
                                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                                            <SelectContent><SelectItem value="kN">kN</SelectItem><SelectItem value="N">N</SelectItem></SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div>
                                    <Label>Load Type</Label>
                                    <Select value={inputs.type.value} onValueChange={(v) => handleInputChange('type', v)}>
                                        <SelectTrigger className="w-full mt-1.5"><SelectValue /></SelectTrigger>
                                        <SelectContent><SelectItem value="point">Point Load (Center)</SelectItem><SelectItem value="udl">UDL (Total)</SelectItem></SelectContent>
                                    </Select>
                                </div>
                                {inputs.type.value === 'point' && (
                                    <div>
                                        <Label>Position (a)</Label>
                                        <div className="flex mt-1.5 space-x-2">
                                            <Input type="number" value={inputs.position.value} onChange={(e) => handleInputChange('position', e.target.value)} placeholder="From Left" />
                                            <Select value={inputs.position.unit} onValueChange={(v) => handleUnitChange('position', v)}>
                                                <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="m">m</SelectItem><SelectItem value="ft">ft</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeMode === 'deflection' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Span Length (L)</Label>
                                    <div className="flex mt-1.5 space-x-2">
                                        <Input type="number" value={inputs.length.value} onChange={(e) => handleInputChange('length', e.target.value)} />
                                        <Select value={inputs.length.unit} onValueChange={(v) => handleUnitChange('length', v)}>
                                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                                            <SelectContent><SelectItem value="m">m</SelectItem><SelectItem value="ft">ft</SelectItem></SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div>
                                    <Label>Point Load (P)</Label>
                                    <div className="flex mt-1.5 space-x-2">
                                        <Input type="number" value={inputs.force.value} onChange={(e) => handleInputChange('force', e.target.value)} />
                                        <Select value={inputs.force.unit} onValueChange={(v) => handleUnitChange('force', v)}>
                                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                                            <SelectContent><SelectItem value="kN">kN</SelectItem><SelectItem value="N">N</SelectItem></SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div>
                                    <Label>Elastic Modulus (E)</Label>
                                    <div className="flex mt-1.5 space-x-2">
                                        <Input type="number" value={inputs.elasticity.value} onChange={(e) => handleInputChange('elasticity', e.target.value)} />
                                        <Select value={inputs.elasticity.unit} onValueChange={(v) => handleUnitChange('elasticity', v)}>
                                            <SelectTrigger className="w-22"><SelectValue /></SelectTrigger>
                                            <SelectContent><SelectItem value="GPa">GPa</SelectItem><SelectItem value="MPa">MPa</SelectItem></SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div>
                                    <Label>Inertia (I)</Label>
                                    <div className="flex mt-1.5 space-x-2">
                                        <Input type="number" value={inputs.inertia.value} onChange={(e) => handleInputChange('inertia', e.target.value)} />
                                        <Select value={inputs.inertia.unit} onValueChange={(v) => handleUnitChange('inertia', v)}>
                                            <SelectTrigger className="w-22"><SelectValue /></SelectTrigger>
                                            <SelectContent><SelectItem value="m4">m4</SelectItem><SelectItem value="cm4">cm4</SelectItem><SelectItem value="mm4">mm4</SelectItem></SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeMode === 'column' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Width (b)</Label>
                                    <Input type="number" className="mt-1.5" value={inputs.length.value} onChange={(e) => handleInputChange('length', e.target.value)} placeholder="mm" />
                                </div>
                                <div>
                                    <Label>Depth (d)</Label>
                                    <Input type="number" className="mt-1.5" value={inputs.width.value} onChange={(e) => handleInputChange('width', e.target.value)} placeholder="mm" />
                                </div>
                                <div>
                                    <Label>Concrete Grade (fck)</Label>
                                    <div className="flex mt-1.5 space-x-2">
                                        <Input type="number" value={inputs.concreteGrade.value} onChange={(e) => handleInputChange('concreteGrade', e.target.value)} />
                                        <div className="flex items-center justify-center px-3 bg-gray-100 rounded text-sm text-gray-500">MPa</div>
                                    </div>
                                </div>
                                <div>
                                    <Label>Steel Grade (fy)</Label>
                                    <div className="flex mt-1.5 space-x-2">
                                        <Input type="number" value={inputs.steelGrade.value} onChange={(e) => handleInputChange('steelGrade', e.target.value)} />
                                        <div className="flex items-center justify-center px-3 bg-gray-100 rounded text-sm text-gray-500">MPa</div>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <Label>Steel Area (Asc)</Label>
                                    <div className="flex mt-1.5 space-x-2">
                                        <Input type="number" value={inputs.area.value} onChange={(e) => handleInputChange('area', e.target.value)} placeholder="Optional (Default 1%)" />
                                        <div className="flex items-center justify-center px-3 bg-gray-100 rounded text-sm text-gray-500">mm²</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeMode === 'slab' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Span Length</Label>
                                    <div className="flex mt-1.5 space-x-2">
                                        <Input type="number" value={inputs.length.value} onChange={(e) => handleInputChange('length', e.target.value)} />
                                        <Select value={inputs.length.unit} onValueChange={(v) => handleUnitChange('length', v)}>
                                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                                            <SelectContent><SelectItem value="m">m</SelectItem><SelectItem value="ft">ft</SelectItem></SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div>
                                    <Label>L/d Ratio</Label>
                                    <Input type="number" className="mt-1.5" value={inputs.ratio.value} onChange={(e) => handleInputChange('ratio', e.target.value)} placeholder="e.g. 20 for Simp. Sup." />
                                </div>
                            </div>
                        )}

                        {activeMode === 'footing' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Column Load</Label>
                                    <div className="flex mt-1.5 space-x-2">
                                        <Input type="number" value={inputs.force.value} onChange={(e) => handleInputChange('force', e.target.value)} />
                                        <Select value={inputs.force.unit} onValueChange={(v) => handleUnitChange('force', v)}>
                                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                                            <SelectContent><SelectItem value="kN">kN</SelectItem><SelectItem value="N">N</SelectItem></SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div>
                                    <Label>Soil Bearing Capacity (SBC)</Label>
                                    <div className="flex mt-1.5 space-x-2">
                                        <Input type="number" value={inputs.pressure.value} onChange={(e) => handleInputChange('pressure', e.target.value)} />
                                        <div className="flex items-center justify-center px-3 bg-gray-100 rounded text-sm text-gray-500">kN/m²</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeMode === 'reinforcement' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Concrete Volume</Label>
                                    <div className="flex mt-1.5 space-x-2">
                                        <Input type="number" value={inputs.volume.value} onChange={(e) => handleInputChange('volume', e.target.value)} />
                                        <div className="flex items-center justify-center px-3 bg-gray-100 rounded text-sm text-gray-500">m³</div>
                                    </div>
                                </div>
                                <div>
                                    <Label>Steel Percentage (%)</Label>
                                    <Input type="number" className="mt-1.5" value={inputs.percentage.value} onChange={(e) => handleInputChange('percentage', e.target.value)} />
                                </div>
                            </div>
                        )}

                        {activeMode === 'safety' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Ultimate Load</Label>
                                    <Input type="number" className="mt-1.5" value={inputs.force.value} onChange={(e) => handleInputChange('force', e.target.value)} />
                                </div>
                                <div>
                                    <Label>Working Load</Label>
                                    <Input type="number" className="mt-1.5" value={inputs.strength.value} onChange={(e) => handleInputChange('strength', e.target.value)} />
                                </div>
                            </div>
                        )}

                        <div className="pt-4 space-y-3">
                            <Button onClick={performCalculation} className="w-full bg-eng-blue hover:bg-eng-blue/90 text-white font-semibold">
                                <i className="fas fa-calculator mr-2"></i>
                                Calculate
                            </Button>
                            <Button variant="outline" onClick={clearInputs} className="w-full text-gray-700 hover:bg-gray-50">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Clear All
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Results */}
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
                                        Structural Results
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {Object.entries(results.results).map(([key, result]) => (
                                            <div key={key} className="text-center bg-white p-3 rounded shadow-sm">
                                                <div className="text-sm text-gray-500 capitalize mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                                                <div className="text-xl font-bold text-eng-blue">{result.formatted}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {results.steps.length > 0 && (
                                    <div className="border-t border-gray-200 pt-4">
                                        <h4 className="font-semibold text-charcoal mb-3">Calculation Details</h4>
                                        <div className="space-y-3 text-sm">
                                            {results.steps.map((step, index) => (
                                                <div key={index} className="bg-gray-50 p-3 rounded border border-gray-100">
                                                    <div className="flex justify-between">
                                                        <span className="font-medium text-gray-700">{step.description}</span>
                                                    </div>
                                                    <div className="mt-1 font-mono text-gray-600 text-xs">{step.formula}</div>
                                                    <div className="mt-1 font-mono text-gray-800">{step.calculation}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                <p>Enter structural parameters to view results</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Dynamic Contextual Accordion */}
                {(() => {
                    const modeToId: Record<string, string> = {
                        'beam-load': 'beam-load',
                        'moment': 'bending-moment',
                        'shear': 'shear-force',
                        'deflection': 'beam-deflection',
                        'column': 'column-load',
                        'slab': 'slab-thickness',
                        'footing': 'footing-size',
                        'reinforcement': 'reinforcement',
                        'safety': 'safety-factor'
                    };
                    const formulaId = modeToId[activeMode] || activeMode;
                    const formulaInfo = engineeringDisciplines
                        .find(d => d.id === 'civil')
                        ?.calculators.flatMap(c => c.formulas)
                        .find(f => f.id === formulaId);

                    if (!formulaInfo) return null;

                    return (
                        <Card className="mt-6 border-0 shadow-none bg-transparent">
                            <CardHeader className="px-0 pt-0">
                                <CardTitle className="text-lg font-semibold text-charcoal flex items-center">
                                    <BookOpen className="h-5 w-5 text-eng-blue mr-2" />
                                    Quick Reference - {formulaInfo.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-0">
                                <Accordion type="single" collapsible className="w-full bg-white rounded-lg border border-gray-200 px-4 shadow-sm">
                                    <AccordionItem value="how-to-use" className="border-b last:border-0 border-gray-100">
                                        <AccordionTrigger className="text-base font-semibold text-charcoal py-4 hover:no-underline hover:text-eng-blue">How to Use This Calculator</AccordionTrigger>
                                        <AccordionContent className="text-gray-600 pb-4">
                                            {getHowToUse(formulaInfo, "this tool")}
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="formula-used" className="border-b last:border-0 border-gray-100">
                                        <AccordionTrigger className="text-base font-semibold text-charcoal py-4 hover:no-underline hover:text-eng-blue">Formula Used</AccordionTrigger>
                                        <AccordionContent className="pb-4">
                                            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mt-2">
                                                <div className="font-semibold text-charcoal mb-2">{formulaInfo.name}</div>
                                                <div className="font-roboto-mono text-sm text-eng-blue mb-2 bg-gray-200 inline-block px-2 py-1 rounded">
                                                    {formulaInfo.formula}
                                                </div>
                                                <div className="text-sm text-gray-600 mb-3">{formulaInfo.description}</div>
                                                <div className="text-xs text-gray-500 font-medium border-t border-gray-200 pt-2 mt-2">
                                                    Variables Mapping: {formulaInfo.variables ? Object.entries(formulaInfo.variables).map(([k, v]) => `${k} = ${v}`).join(', ') : 'N/A'}
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="explanation" className="border-b last:border-0 border-gray-100">
                                        <AccordionTrigger className="text-base font-semibold text-charcoal py-4 hover:no-underline hover:text-eng-blue">Engineering Explanation</AccordionTrigger>
                                        <AccordionContent className="pb-4">
                                            {getEngineeringExplanation('civil', formulaInfo, "this system")}
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="applications" className="border-b last:border-0 border-gray-100">
                                        <AccordionTrigger className="text-base font-semibold text-charcoal py-4 hover:no-underline hover:text-eng-blue">Practical Applications</AccordionTrigger>
                                        <AccordionContent className="text-gray-600 pb-4">
                                            {getPracticalApplications('civil', formulaInfo, "these")}
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="faqs" className="border-b last:border-0 border-gray-100">
                                        <AccordionTrigger className="text-base font-semibold text-charcoal py-4 hover:no-underline hover:text-eng-blue">FAQs</AccordionTrigger>
                                        <AccordionContent className="space-y-4 text-gray-600 pb-4">
                                            {getFAQs(formulaInfo, "calculator").map((faq, i) => (
                                                <div key={i} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                    <strong className="text-charcoal block mb-1">Q: {faq.question}</strong>
                                                    <p className="text-sm">A: {faq.answer}</p>
                                                </div>
                                            ))}
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </CardContent>
                        </Card>
                    );
                })()}

            </div>
        </div>
    );
}
