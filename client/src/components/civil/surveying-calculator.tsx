
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, BarChart3, CheckCircle } from 'lucide-react';
import { CalculationOutput } from '@/lib/calculations';
import { calculateLevelDifference, calculateGradient, calculateAreaConversion, calculateDistanceConversion, calculateChainSurvey, calculateLandArea } from '@/lib/civil-calculations';
import { engineeringDisciplines } from '@/lib/formulas';
import { getHowToUse, getEngineeringExplanation, getPracticalApplications, getFAQs } from '@/lib/calculator-content';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { BookOpen } from 'lucide-react';

export default function SurveyingCalculator() {
    const [activeMode, setActiveMode] = useState('level');
    const [inputs, setInputs] = useState({
        bs: { value: '', unit: 'm' },
        fs: { value: '', unit: 'm' },
        rl: { value: '100.000', unit: 'm' },
        rise: { value: '', unit: 'm' },
        run: { value: '', unit: 'm' },
        area: { value: '', unit: 'm²' },
        dist: { value: '', unit: 'm' },
        fromUnit: { value: 'm²', unit: '' },
        toUnit: { value: 'ft²', unit: '' },
        fromDist: { value: 'm', unit: '' },
        toDist: { value: 'ft', unit: '' },
        measuredLength: { value: '', unit: 'm' },
        trueLength: { value: '20', unit: 'm' },
        mistakeLength: { value: '20.1', unit: 'm' },
        // Land Area Inputs
        shape: { value: 'rectangle', unit: '' },
        sideA: { value: '', unit: 'm' },
        sideB: { value: '', unit: 'm' },
        sideC: { value: '', unit: 'm' },
        sideD: { value: '', unit: 'm' },
        diagonal: { value: '', unit: 'm' },
    });
    const [results, setResults] = useState<CalculationOutput | null>(null);

    const handleInputChange = (field: string, value: string) => {
        setInputs(prev => ({
            ...prev,
            [field]: { ...prev[field as keyof typeof prev], value }
        }));
    };

    // Special handler for unit selection
    const handleUnitSelect = (field: string, value: string) => {
        setInputs(prev => ({
            ...prev,
            [field]: { ...prev[field as keyof typeof prev], value }
        }));
    };

    const performCalculation = () => {
        const calcInputs: any = {};
        Object.entries(inputs).forEach(([key, val]) => {
            if (val.value && !isNaN(parseFloat(val.value))) {
                calcInputs[key] = { value: parseFloat(val.value), unit: val.unit };
            }
        });

        // Pass shape string directly
        if (activeMode === 'land-area') {
            calcInputs.shape = { value: inputs.shape.value, unit: '' };
            calcInputs.l = calcInputs.sideA;
            calcInputs.w = calcInputs.sideB;
            calcInputs.c = calcInputs.sideC;
            calcInputs.d = calcInputs.sideD;
            calcInputs.diag = calcInputs.diagonal;
        }

        // Manual mapping for unit conversions
        if (activeMode === 'area') {
            calcInputs.value = { value: parseFloat(inputs.area.value), unit: inputs.area.unit };
            calcInputs.from = { value: inputs.fromUnit.value, unit: '' };
            calcInputs.to = { value: inputs.toUnit.value, unit: '' };
        } else if (activeMode === 'distance') {
            calcInputs.value = { value: parseFloat(inputs.dist.value), unit: inputs.dist.unit };
            calcInputs.from = { value: inputs.fromDist.value, unit: '' };
            calcInputs.to = { value: inputs.toDist.value, unit: '' };
        }

        let res: CalculationOutput;
        switch (activeMode) {
            case 'level': res = calculateLevelDifference(calcInputs); break;
            case 'gradient': res = calculateGradient(calcInputs); break;
            case 'area': res = calculateAreaConversion(calcInputs); break;
            case 'distance': res = calculateDistanceConversion(calcInputs); break;
            case 'chain': res = calculateChainSurvey(calcInputs); break;
            case 'land-area': res = calculateLandArea(calcInputs); break;
            default: res = { results: {}, steps: [], errors: ['Invalid Mode'] };
        }
        setResults(res);
    };

    const clearInputs = () => {
        setInputs(prev => ({
            ...prev,
            bs: { value: '', unit: 'm' },
            fs: { value: '', unit: 'm' },
            rl: { value: '100.000', unit: 'm' },
            rise: { value: '', unit: 'm' },
            run: { value: '', unit: 'm' },
            area: { value: '', unit: 'm²' },
            dist: { value: '', unit: 'm' },
            measuredLength: { value: '', unit: 'm' },
            sideA: { value: '', unit: 'm' },
            sideB: { value: '', unit: 'm' },
            sideC: { value: '', unit: 'm' },
            sideD: { value: '', unit: 'm' },
            diagonal: { value: '', unit: 'm' },
        }));
        setResults(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex space-x-2 overflow-x-auto pb-2">
                <Button variant={activeMode === 'level' ? 'default' : 'outline'} onClick={() => { setActiveMode('level'); setResults(null); }}>Level Difference</Button>
                <Button variant={activeMode === 'land-area' ? 'default' : 'outline'} onClick={() => { setActiveMode('land-area'); setResults(null); }} className={activeMode === 'land-area' ? 'bg-eng-blue text-white' : ''}>Land Area</Button>
                <Button variant={activeMode === 'gradient' ? 'default' : 'outline'} onClick={() => { setActiveMode('gradient'); setResults(null); }}>Gradient</Button>
                <Button variant={activeMode === 'area' ? 'default' : 'outline'} onClick={() => { setActiveMode('area'); setResults(null); }}>Area Conv.</Button>
                <Button variant={activeMode === 'distance' ? 'default' : 'outline'} onClick={() => { setActiveMode('distance'); setResults(null); }}>Distance Conv.</Button>
                <Button variant={activeMode === 'chain' ? 'default' : 'outline'} onClick={() => { setActiveMode('chain'); setResults(null); }}>Chain Survey</Button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-charcoal flex items-center">
                            <Edit className="h-5 w-5 text-eng-blue mr-2" /> Inputs
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {activeMode === 'level' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label>Backsight (BS)</Label><Input type="number" value={inputs.bs.value} onChange={(e) => handleInputChange('bs', e.target.value)} placeholder="0.000" /></div>
                                <div><Label>Foresight (FS)</Label><Input type="number" value={inputs.fs.value} onChange={(e) => handleInputChange('fs', e.target.value)} placeholder="0.000" /></div>
                                <div><Label>Benchmark RL</Label><Input type="number" value={inputs.rl.value} onChange={(e) => handleInputChange('rl', e.target.value)} placeholder="100.000" /></div>
                            </div>
                        )}
                        {activeMode === 'land-area' && (
                            <div className="space-y-4">
                                <div>
                                    <Label>Shape</Label>
                                    <Select value={inputs.shape.value} onValueChange={(v) => handleInputChange('shape', v)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="rectangle">Rectangle (L x W)</SelectItem>
                                            <SelectItem value="triangle">Triangle (3 Sides)</SelectItem>
                                            <SelectItem value="quadrilateral">Irregular Quadrilateral (4 Sides + Diagonal)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><Label>Side A / Length</Label><Input type="number" value={inputs.sideA.value} onChange={(e) => handleInputChange('sideA', e.target.value)} /></div>
                                    <div><Label>Side B / Width</Label><Input type="number" value={inputs.sideB.value} onChange={(e) => handleInputChange('sideB', e.target.value)} /></div>
                                    {inputs.shape.value !== 'rectangle' && (
                                        <div><Label>Side C</Label><Input type="number" value={inputs.sideC.value} onChange={(e) => handleInputChange('sideC', e.target.value)} /></div>
                                    )}
                                    {inputs.shape.value === 'quadrilateral' && (
                                        <div><Label>Side D</Label><Input type="number" value={inputs.sideD.value} onChange={(e) => handleInputChange('sideD', e.target.value)} /></div>
                                    )}
                                    {inputs.shape.value === 'quadrilateral' && (
                                        <div className="col-span-2"><Label>Diagonal Length</Label><Input type="number" value={inputs.diagonal.value} onChange={(e) => handleInputChange('diagonal', e.target.value)} placeholder="Connects A-B junction and C-D junction ends?" /> <span className="text-xs text-gray-500">Diagonal splits quad into two triangles (A-B-Diag and C-D-Diag)</span></div>
                                    )}
                                </div>
                            </div>
                        )}
                        {activeMode === 'gradient' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label>Rise (Vertical)</Label><Input type="number" value={inputs.rise.value} onChange={(e) => handleInputChange('rise', e.target.value)} /></div>
                                <div><Label>Run (Horizontal)</Label><Input type="number" value={inputs.run.value} onChange={(e) => handleInputChange('run', e.target.value)} /></div>
                            </div>
                        )}
                        {activeMode === 'area' && (
                            <div className="grid grid-cols-1 gap-4">
                                <div><Label>Area Value</Label><Input type="number" value={inputs.area.value} onChange={(e) => handleInputChange('area', e.target.value)} /></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>From</Label>
                                        <Select value={inputs.fromUnit.value} onValueChange={(v) => handleUnitSelect('fromUnit', v)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="m²">Square Meter (m²)</SelectItem>
                                                <SelectItem value="ft²">Square Feet (ft²)</SelectItem>
                                                <SelectItem value="acre">Acre</SelectItem>
                                                <SelectItem value="hectare">Hectare</SelectItem>
                                                <SelectItem value="guntha">Guntha</SelectItem>
                                                <SelectItem value="bigha">Bigha</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label>To</Label>
                                        <Select value={inputs.toUnit.value} onValueChange={(v) => handleUnitSelect('toUnit', v)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="m²">Square Meter (m²)</SelectItem>
                                                <SelectItem value="ft²">Square Feet (ft²)</SelectItem>
                                                <SelectItem value="acre">Acre</SelectItem>
                                                <SelectItem value="hectare">Hectare</SelectItem>
                                                <SelectItem value="guntha">Guntha</SelectItem>
                                                <SelectItem value="bigha">Bigha</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeMode === 'distance' && (
                            <div className="grid grid-cols-1 gap-4">
                                <div><Label>Distance Value</Label><Input type="number" value={inputs.dist.value} onChange={(e) => handleInputChange('dist', e.target.value)} /></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>From</Label>
                                        <Select value={inputs.fromDist.value} onValueChange={(v) => handleUnitSelect('fromDist', v)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="m">Meter (m)</SelectItem>
                                                <SelectItem value="km">Kilometer (km)</SelectItem>
                                                <SelectItem value="ft">Feet (ft)</SelectItem>
                                                <SelectItem value="mi">Mile (mi)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label>To</Label>
                                        <Select value={inputs.toDist.value} onValueChange={(v) => handleUnitSelect('toDist', v)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="m">Meter (m)</SelectItem>
                                                <SelectItem value="km">Kilometer (km)</SelectItem>
                                                <SelectItem value="ft">Feet (ft)</SelectItem>
                                                <SelectItem value="mi">Mile (mi)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeMode === 'chain' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label>Measured Length (L')</Label><Input type="number" value={inputs.measuredLength.value} onChange={(e) => handleInputChange('measuredLength', e.target.value)} /></div>
                                <div><Label>Std Length (l)</Label><Input type="number" value={inputs.trueLength.value} onChange={(e) => handleInputChange('trueLength', e.target.value)} /></div>
                                <div><Label>Actual Length (l')</Label><Input type="number" value={inputs.mistakeLength.value} onChange={(e) => handleInputChange('mistakeLength', e.target.value)} /></div>
                            </div>
                        )}

                        <div className="pt-4 space-y-3">
                            <Button onClick={performCalculation} className="w-full bg-eng-blue hover:bg-eng-blue/90 text-white font-semibold">
                                <i className="fas fa-calculator mr-2"></i> Calculate
                            </Button>
                            <Button variant="outline" onClick={clearInputs} className="w-full text-gray-700 hover:bg-gray-50">
                                <Trash2 className="h-4 w-4 mr-2" /> Clear All
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Results Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-charcoal flex items-center">
                            <BarChart3 className="h-5 w-5 text-eng-blue mr-2" /> Results
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {results && Object.keys(results.results).length > 0 ? (
                            <>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                                        <CheckCircle className="h-4 w-4 mr-2" /> Result
                                    </h4>
                                    <div className="grid grid-cols-1 gap-4">
                                        {Object.entries(results.results).map(([key, result]) => (
                                            <div key={key} className="flex justify-between items-center bg-white p-3 rounded shadow-sm">
                                                <span className="text-sm text-gray-600 font-medium capitalize">{key.replace(/_/g, ' ')}</span>
                                                <span className="text-lg font-bold text-eng-blue">{result.formatted}</span>
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
                                                    <div className="flex justify-between"><span className="font-medium text-gray-700">{step.description}</span></div>
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
                                <p>Enter parameters to calculate</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Dynamic Contextual Accordion */}
                {(() => {
                    const modeToId: Record<string, string> = {
                        'level': 'level-difference',
                        'gradient': 'gradient',
                        'area': 'area-conversion',
                        'distance': 'distance-conversion',
                        'chain': 'chain-survey',
                        'land-area': 'land-area'
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
