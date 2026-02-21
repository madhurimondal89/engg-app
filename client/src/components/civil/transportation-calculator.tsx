
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, BarChart3, CheckCircle } from 'lucide-react';
import { CalculationOutput } from '@/lib/calculations';
import { calculateSSD, calculateOSD, calculatePavementThickness, calculateTrafficFlow } from '@/lib/civil-calculations';
import { engineeringDisciplines } from '@/lib/formulas';
import { getHowToUse, getEngineeringExplanation, getPracticalApplications, getFAQs } from '@/lib/calculator-content';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { BookOpen } from 'lucide-react';

export default function TransportationCalculator() {
    const [activeMode, setActiveMode] = useState('ssd');
    const [inputs, setInputs] = useState({
        v: { value: '60', unit: 'km/h' },
        t: { value: '2.5', unit: 's' },
        f: { value: '0.35', unit: '' },
        g: { value: '0', unit: '%' },
        vb: { value: '44', unit: 'km/h' }, // Default Overtaken Speed
        a: { value: '0', unit: 'm/s²' }, // Acceleration
        cbr: { value: '5', unit: '%' },
        traffic: { value: '10', unit: 'msa' },
        speed: { value: '60', unit: 'km/h' },
        density: { value: '0', unit: 'veh/km' },
        headway: { value: '2', unit: 's' },
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

        let res: CalculationOutput;
        switch (activeMode) {
            case 'ssd': res = calculateSSD(calcInputs); break;
            case 'osd': res = calculateOSD(calcInputs); break;
            case 'pavement': res = calculatePavementThickness(calcInputs); break;
            case 'traffic': res = calculateTrafficFlow(calcInputs); break;
            default: res = { results: {}, steps: [], errors: ['Invalid Mode'] };
        }
        setResults(res);
    };

    const clearInputs = () => {
        setInputs(prev => ({
            ...prev,
            v: { value: '60', unit: 'km/h' },
            t: { value: '2.5', unit: 's' },
            vb: { value: '44', unit: 'km/h' },
            a: { value: '0', unit: 'm/s²' },
            speed: { value: '60', unit: 'km/h' },
            headway: { value: '2', unit: 's' }
        }));
        setResults(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex space-x-2 overflow-x-auto pb-2">
                <Button variant={activeMode === 'ssd' ? 'default' : 'outline'} onClick={() => { setActiveMode('ssd'); setResults(null); }}>Sight Distance (SSD)</Button>
                <Button variant={activeMode === 'osd' ? 'default' : 'outline'} onClick={() => { setActiveMode('osd'); setResults(null); }}>Overtaking (OSD)</Button>
                <Button variant={activeMode === 'pavement' ? 'default' : 'outline'} onClick={() => { setActiveMode('pavement'); setResults(null); }}>Pavement Thickness</Button>
                <Button variant={activeMode === 'traffic' ? 'default' : 'outline'} onClick={() => { setActiveMode('traffic'); setResults(null); }}>Traffic Flow</Button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-charcoal flex items-center">
                            <Edit className="h-5 w-5 text-eng-blue mr-2" /> Parameters
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {activeMode === 'ssd' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label>Design Speed (v)</Label><Input type="number" value={inputs.v.value} onChange={(e) => handleInputChange('v', e.target.value)} /></div>
                                <div><Label>Reaction Time (t)</Label><Input type="number" value={inputs.t.value} onChange={(e) => handleInputChange('t', e.target.value)} /></div>
                                <div><Label>Friction (f)</Label><Input type="number" value={inputs.f.value} onChange={(e) => handleInputChange('f', e.target.value)} /></div>
                                <div><Label>Gradient (%)</Label><Input type="number" value={inputs.g.value} onChange={(e) => handleInputChange('g', e.target.value)} /></div>
                            </div>
                        )}
                        {activeMode === 'osd' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label>Overtaking Speed</Label><Input type="number" value={inputs.v.value} onChange={(e) => handleInputChange('v', e.target.value)} /></div>
                                <div><Label>Overtaken Speed</Label><Input type="number" value={inputs.vb.value} onChange={(e) => handleInputChange('vb', e.target.value)} /></div>
                                <div><Label>Reaction Time</Label><Input type="number" value={inputs.t.value} onChange={(e) => handleInputChange('t', e.target.value)} /></div>
                                <div><Label>Acceleration (Optional)</Label><Input type="number" value={inputs.a.value} onChange={(e) => handleInputChange('a', e.target.value)} placeholder="Auto" /></div>
                            </div>
                        )}
                        {activeMode === 'pavement' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label>Traffic (msa)</Label><Input type="number" value={inputs.traffic.value} onChange={(e) => handleInputChange('traffic', e.target.value)} /></div>
                                <div><Label>CBR (%)</Label><Input type="number" value={inputs.cbr.value} onChange={(e) => handleInputChange('cbr', e.target.value)} /></div>
                            </div>
                        )}
                        {activeMode === 'traffic' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label>Speed (v)</Label><Input type="number" value={inputs.speed.value} onChange={(e) => handleInputChange('speed', e.target.value)} /></div>
                                <div><Label>Density (k) - veh/km</Label><Input type="number" value={inputs.density.value} onChange={(e) => handleInputChange('density', e.target.value)} /></div>
                                <div><Label>Headway (h) - sec</Label><Input type="number" value={inputs.headway.value} onChange={(e) => handleInputChange('headway', e.target.value)} /></div>
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
                                        <CheckCircle className="h-4 w-4 mr-2" /> Calculated Values
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
                        'ssd': 'sight-distance',
                        'osd': 'overtaking-distance',
                        'pavement': 'pavement-thickness',
                        'traffic': 'traffic-flow'
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
