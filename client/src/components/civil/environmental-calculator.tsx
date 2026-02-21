
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, BarChart3, CheckCircle } from 'lucide-react';
import { CalculationOutput } from '@/lib/calculations';
import { calculateWaterDemand, calculateRainwaterHarvesting, calculateRunoff, calculateWaterTank, calculateSewageFlow } from '@/lib/civil-calculations';
import { engineeringDisciplines } from '@/lib/formulas';
import { getHowToUse, getEngineeringExplanation, getPracticalApplications, getFAQs } from '@/lib/calculator-content';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { BookOpen } from 'lucide-react';

export default function EnvironmentalCalculator() {
    const [activeMode, setActiveMode] = useState('water-demand');
    const [inputs, setInputs] = useState({
        population: { value: '', unit: '' },
        lpcd: { value: '135', unit: 'LPCD' },
        area: { value: '', unit: 'm²' },
        rainfall: { value: '', unit: 'mm' },
        coeff: { value: '0.8', unit: '' },
        intensity: { value: '', unit: 'mm/hr' },
        length: { value: '', unit: 'm' },
        width: { value: '', unit: 'm' },
        depth: { value: '', unit: 'm' },
        diameter: { value: '', unit: 'm' },
        shape: { value: 'rectangular', unit: '' },
        waterDemand: { value: '', unit: 'L' },
        sewageFactor: { value: '0.8', unit: '' },
    });
    const [results, setResults] = useState<CalculationOutput | null>(null);

    const handleInputChange = (field: string, value: string) => {
        setInputs(prev => ({
            ...prev,
            [field]: { ...prev[field as keyof typeof prev], value }
        }));
    };

    const performCalculation = () => {
        const calcInputs: any = {};
        Object.entries(inputs).forEach(([key, val]) => {
            // Include shape even if it's not a number parsable string
            if (key === 'shape') {
                calcInputs[key] = { value: val.value, unit: val.unit };
            } else if (val.value && !isNaN(parseFloat(val.value))) {
                calcInputs[key] = { value: parseFloat(val.value), unit: val.unit };
            }
        });

        // Remap inputs specific to functions
        if (activeMode === 'water-demand') {
            calcInputs.demandPerCapita = calcInputs.lpcd;
        } else if (activeMode === 'rainwater') {
            calcInputs.coefficient = calcInputs.coeff;
        } else if (activeMode === 'runoff') {
            calcInputs.coefficient = calcInputs.coeff;
        } else if (activeMode === 'tank') {
            calcInputs.l = calcInputs.length;
            calcInputs.w = calcInputs.width;
            calcInputs.d = calcInputs.depth;
            calcInputs.dia = calcInputs.diameter;
        } else if (activeMode === 'sewage') {
            calcInputs.factor = calcInputs.sewageFactor;
        }

        let res: CalculationOutput;
        switch (activeMode) {
            case 'water-demand': res = calculateWaterDemand(calcInputs); break;
            case 'rainwater': res = calculateRainwaterHarvesting(calcInputs); break;
            case 'runoff': res = calculateRunoff(calcInputs); break;
            case 'tank': res = calculateWaterTank(calcInputs); break;
            case 'sewage': res = calculateSewageFlow(calcInputs); break;
            default: res = { results: {}, steps: [], errors: ['Invalid Mode'] };
        }
        setResults(res);
    };

    const clearInputs = () => {
        setInputs(prev => ({
            ...prev,
            population: { value: '', unit: '' },
            lpcd: { value: '135', unit: 'LPCD' },
            area: { value: '', unit: 'm²' },
            rainfall: { value: '', unit: 'mm' },
            coeff: { value: '0.8', unit: '' },
            intensity: { value: '', unit: 'mm/hr' },
            length: { value: '', unit: 'm' },
            width: { value: '', unit: 'm' },
            depth: { value: '', unit: 'm' },
            diameter: { value: '', unit: 'm' },
            waterDemand: { value: '', unit: 'L' },
        }));
        setResults(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex space-x-2 overflow-x-auto pb-2">
                <Button variant={activeMode === 'water-demand' ? 'default' : 'outline'} onClick={() => { setActiveMode('water-demand'); setResults(null); }}>Water Demand</Button>
                <Button variant={activeMode === 'rainwater' ? 'default' : 'outline'} onClick={() => { setActiveMode('rainwater'); setResults(null); }}>Rainwater Harvesting</Button>
                <Button variant={activeMode === 'runoff' ? 'default' : 'outline'} onClick={() => { setActiveMode('runoff'); setResults(null); }}>Runoff</Button>
                <Button variant={activeMode === 'tank' ? 'default' : 'outline'} onClick={() => { setActiveMode('tank'); setResults(null); }}>Tank Capacity</Button>
                <Button variant={activeMode === 'sewage' ? 'default' : 'outline'} onClick={() => { setActiveMode('sewage'); setResults(null); }}>Sewage Flow</Button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-charcoal flex items-center">
                            <Edit className="h-5 w-5 text-eng-blue mr-2" /> Inputs
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {activeMode === 'water-demand' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label>Population</Label><Input type="number" value={inputs.population.value} onChange={(e) => handleInputChange('population', e.target.value)} /></div>
                                <div><Label>Demand (LPCD)</Label><Input type="number" value={inputs.lpcd.value} onChange={(e) => handleInputChange('lpcd', e.target.value)} /></div>
                            </div>
                        )}
                        {activeMode === 'rainwater' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label>Catchment Area (m²)</Label><Input type="number" value={inputs.area.value} onChange={(e) => handleInputChange('area', e.target.value)} /></div>
                                <div><Label>Annual Rainfall (mm)</Label><Input type="number" value={inputs.rainfall.value} onChange={(e) => handleInputChange('rainfall', e.target.value)} /></div>
                                <div><Label>Runoff Coeff (C)</Label><Input type="number" value={inputs.coeff.value} onChange={(e) => handleInputChange('coeff', e.target.value)} placeholder="0.8 for roof" /></div>
                            </div>
                        )}
                        {activeMode === 'runoff' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label>Area (m²)</Label><Input type="number" value={inputs.area.value} onChange={(e) => handleInputChange('area', e.target.value)} /></div>
                                <div><Label>Intensity (mm/hr)</Label><Input type="number" value={inputs.intensity.value} onChange={(e) => handleInputChange('intensity', e.target.value)} /></div>
                                <div><Label>Coeff (C)</Label><Input type="number" value={inputs.coeff.value} onChange={(e) => handleInputChange('coeff', e.target.value)} placeholder="0.5" /></div>
                            </div>
                        )}
                        {activeMode === 'tank' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <Label>Tank Shape</Label>
                                    <Select value={inputs.shape.value} onValueChange={(v) => handleInputChange('shape', v)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="rectangular">Rectangular</SelectItem>
                                            <SelectItem value="cylindrical">Cylindrical</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {inputs.shape.value === 'rectangular' && (
                                    <>
                                        <div><Label>Length (m)</Label><Input type="number" value={inputs.length.value} onChange={(e) => handleInputChange('length', e.target.value)} /></div>
                                        <div><Label>Width (m)</Label><Input type="number" value={inputs.width.value} onChange={(e) => handleInputChange('width', e.target.value)} /></div>
                                    </>
                                )}
                                {inputs.shape.value === 'cylindrical' && (
                                    <div><Label>Diameter (m)</Label><Input type="number" value={inputs.diameter.value} onChange={(e) => handleInputChange('diameter', e.target.value)} /></div>
                                )}
                                <div><Label>Depth/Height (m)</Label><Input type="number" value={inputs.depth.value} onChange={(e) => handleInputChange('depth', e.target.value)} /></div>
                            </div>
                        )}
                        {activeMode === 'sewage' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label>Water Demand (L)</Label><Input type="number" value={inputs.waterDemand.value} onChange={(e) => handleInputChange('waterDemand', e.target.value)} /></div>
                                <div><Label>Sewage Factor (%)</Label><Input type="number" value={inputs.sewageFactor.value} onChange={(e) => handleInputChange('sewageFactor', e.target.value)} placeholder="0.8" /></div>
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
                        'water-demand': 'water-demand',
                        'rainwater': 'rainwater',
                        'runoff': 'runoff',
                        'tank': 'water-tank',
                        'sewage': 'sewage-flow'
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
