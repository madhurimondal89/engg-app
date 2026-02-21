
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, BarChart3, CheckCircle } from 'lucide-react';
import { CalculationOutput } from '@/lib/calculations';
import { calculateStaircase, calculateRailing, calculateExcavation, calculatePlinthArea, calculateCarpetArea } from '@/lib/civil-calculations';
import { engineeringDisciplines } from '@/lib/formulas';
import { getHowToUse, getEngineeringExplanation, getPracticalApplications, getFAQs } from '@/lib/calculator-content';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { BookOpen } from 'lucide-react';

export default function QuantityCalculator() {
    const [activeMode, setActiveMode] = useState('staircase');
    const [inputs, setInputs] = useState({
        height: { value: '', unit: 'm' }, // Stair height
        riser: { value: '150', unit: 'mm' },
        tread: { value: '250', unit: 'mm' },
        width: { value: '1', unit: 'm' }, // Stair width
        length: { value: '', unit: 'm' },
        floors: { value: '1', unit: '' },
        rate: { value: '', unit: '' },
        pitLength: { value: '', unit: 'm' },
        pitWidth: { value: '', unit: 'm' },
        pitDepth: { value: '', unit: 'm' },
        pitNos: { value: '1', unit: '' },
        carpetArea: { value: '', unit: 'm²' },
        wallPercent: { value: '20', unit: '' },
        builtUpArea: { value: '', unit: 'm²' },
        deductionPercent: { value: '20', unit: '' },
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
            if (val.value && !isNaN(parseFloat(val.value))) {
                calcInputs[key] = { value: parseFloat(val.value), unit: val.unit };
            }
        });

        // Remap inputs specific to functions
        if (activeMode === 'staircase') {
            // height maps directly
        } else if (activeMode === 'railing') {
            // length maps directly
        } else if (activeMode === 'excavation') {
            calcInputs.l = calcInputs.pitLength;
            calcInputs.w = calcInputs.pitWidth;
            calcInputs.d = calcInputs.pitDepth;
            calcInputs.nos = calcInputs.pitNos;
        } else if (activeMode === 'plinth') {
            calcInputs.wallArea = calcInputs.wallPercent;
        } else if (activeMode === 'carpet') {
            calcInputs.deduction = calcInputs.deductionPercent;
        }

        let res: CalculationOutput;
        switch (activeMode) {
            case 'staircase': res = calculateStaircase(calcInputs); break;
            case 'railing': res = calculateRailing(calcInputs); break;
            case 'excavation': res = calculateExcavation(calcInputs); break;
            case 'plinth': res = calculatePlinthArea(calcInputs); break;
            case 'carpet': res = calculateCarpetArea(calcInputs); break;
            default: res = { results: {}, steps: [], errors: ['Invalid Mode'] };
        }
        setResults(res);
    };

    const clearInputs = () => {
        setInputs(prev => ({
            ...prev,
            height: { value: '', unit: 'm' },
            riser: { value: '150', unit: 'mm' },
            tread: { value: '250', unit: 'mm' },
            width: { value: '1', unit: 'm' },
            length: { value: '', unit: 'm' },
            floors: { value: '1', unit: '' },
            pitLength: { value: '', unit: 'm' },
            pitWidth: { value: '', unit: 'm' },
            pitDepth: { value: '', unit: 'm' },
            carpetArea: { value: '', unit: 'm²' },
            builtUpArea: { value: '', unit: 'm²' },
        }));
        setResults(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex space-x-2 overflow-x-auto pb-2">
                <Button variant={activeMode === 'staircase' ? 'default' : 'outline'} onClick={() => { setActiveMode('staircase'); setResults(null); }}>Staircase</Button>
                <Button variant={activeMode === 'railing' ? 'default' : 'outline'} onClick={() => { setActiveMode('railing'); setResults(null); }}>Railing</Button>
                <Button variant={activeMode === 'excavation' ? 'default' : 'outline'} onClick={() => { setActiveMode('excavation'); setResults(null); }}>Excavation</Button>
                <Button variant={activeMode === 'plinth' ? 'default' : 'outline'} onClick={() => { setActiveMode('plinth'); setResults(null); }}>Plinth Area</Button>
                <Button variant={activeMode === 'carpet' ? 'default' : 'outline'} onClick={() => { setActiveMode('carpet'); setResults(null); }}>Carpet Area</Button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-charcoal flex items-center">
                            <Edit className="h-5 w-5 text-eng-blue mr-2" /> Inputs
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {activeMode === 'staircase' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label>Total Height</Label><Input type="number" value={inputs.height.value} onChange={(e) => handleInputChange('height', e.target.value)} /></div>
                                <div><Label>Stair Width</Label><Input type="number" value={inputs.width.value} onChange={(e) => handleInputChange('width', e.target.value)} /></div>
                                <div><Label>Riser Height (mm)</Label><Input type="number" value={inputs.riser.value} onChange={(e) => handleInputChange('riser', e.target.value)} /></div>
                                <div><Label>Tread Length (mm)</Label><Input type="number" value={inputs.tread.value} onChange={(e) => handleInputChange('tread', e.target.value)} /></div>
                            </div>
                        )}
                        {activeMode === 'railing' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label>Length (m)</Label><Input type="number" value={inputs.length.value} onChange={(e) => handleInputChange('length', e.target.value)} /></div>
                                <div><Label>No. of Floors</Label><Input type="number" value={inputs.floors.value} onChange={(e) => handleInputChange('floors', e.target.value)} /></div>
                                <div><Label>Rate (per m)</Label><Input type="number" value={inputs.rate.value} onChange={(e) => handleInputChange('rate', e.target.value)} placeholder="0" /></div>
                            </div>
                        )}
                        {activeMode === 'excavation' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label>Length (m)</Label><Input type="number" value={inputs.pitLength.value} onChange={(e) => handleInputChange('pitLength', e.target.value)} /></div>
                                <div><Label>Width (m)</Label><Input type="number" value={inputs.pitWidth.value} onChange={(e) => handleInputChange('pitWidth', e.target.value)} /></div>
                                <div><Label>Depth (m)</Label><Input type="number" value={inputs.pitDepth.value} onChange={(e) => handleInputChange('pitDepth', e.target.value)} /></div>
                                <div><Label>Nos (Count)</Label><Input type="number" value={inputs.pitNos.value} onChange={(e) => handleInputChange('pitNos', e.target.value)} /></div>
                            </div>
                        )}
                        {activeMode === 'plinth' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label>Carpet Area</Label><Input type="number" value={inputs.carpetArea.value} onChange={(e) => handleInputChange('carpetArea', e.target.value)} /></div>
                                <div><Label>Wall Area (%)</Label><Input type="number" value={inputs.wallPercent.value} onChange={(e) => handleInputChange('wallPercent', e.target.value)} placeholder="Approx 20%" /></div>
                            </div>
                        )}
                        {activeMode === 'carpet' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label>Built-up Area</Label><Input type="number" value={inputs.builtUpArea.value} onChange={(e) => handleInputChange('builtUpArea', e.target.value)} /></div>
                                <div><Label>Deductions (%)</Label><Input type="number" value={inputs.deductionPercent.value} onChange={(e) => handleInputChange('deductionPercent', e.target.value)} placeholder="Approx 10-20%" /></div>
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
                        'staircase': 'staircase',
                        'railing': 'railing',
                        'excavation': 'excavation',
                        'plinth': 'plinth-area',
                        'carpet': 'carpet-area'
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
