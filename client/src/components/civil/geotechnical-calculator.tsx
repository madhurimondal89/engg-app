
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, BarChart3, CheckCircle } from 'lucide-react';
import { CalculationOutput } from '@/lib/calculations';
import {
    calculateSoilBearingCapacity,
    calculateSafeBearingCapacity,
    calculateSoilDensity,
    calculateEarthPressure,
    calculateCompaction,
    calculateSlopeStability,
    calculateSettlement,
    calculateCBR,
    calculatePileCapacity,
    calculateMoistureContent
} from '@/lib/civil-calculations';
import { engineeringDisciplines } from '@/lib/formulas';
import { getHowToUse, getEngineeringExplanation, getPracticalApplications, getFAQs } from '@/lib/calculator-content';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { BookOpen } from 'lucide-react';

export default function GeotechnicalCalculator() {
    const [activeMode, setActiveMode] = useState('bearing');
    const [inputs, setInputs] = useState({
        c: { value: '0', unit: 'kPa' },
        phi: { value: '30', unit: 'deg' },
        gamma: { value: '18', unit: 'kN/m³' },
        depth: { value: '1.5', unit: 'm' },
        width: { value: '2', unit: 'm' },
        capacity: { value: '0', unit: 'kPa' },
        factor: { value: '3', unit: '' },
        weight: { value: '0', unit: 'kN' },
        volume: { value: '0', unit: 'm³' },
        height: { value: '3', unit: 'm' },
        type: { value: 'active', unit: '' },
        weightWet: { value: '0', unit: 'g' },
        weightDry: { value: '0', unit: 'g' },
        moisture: { value: '0', unit: '%' },
        angle: { value: '30', unit: 'deg' }, // Slope angle
        cc: { value: '0.3', unit: '' },
        h0: { value: '5', unit: 'm' },
        e0: { value: '0.8', unit: '' },
        p0: { value: '100', unit: 'kPa' },
        dp: { value: '50', unit: 'kPa' },
        load: { value: '0', unit: 'kg' },
        standard: { value: '1370', unit: 'kg' },
        diameter: { value: '0.5', unit: 'm' },
        length: { value: '10', unit: 'm' },
        alpha: { value: '0.5', unit: '' },
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
            if (val.value) {
                calcInputs[key] = { value: parseFloat(val.value) || val.value, unit: val.unit };
            }
        });

        let res: CalculationOutput;
        switch (activeMode) {
            case 'bearing': res = calculateSoilBearingCapacity(calcInputs); break;
            case 'safe-bearing': res = calculateSafeBearingCapacity(calcInputs); break;
            case 'density': res = calculateSoilDensity(calcInputs); break;
            case 'pressure': res = calculateEarthPressure(calcInputs); break;
            case 'compaction': res = calculateCompaction(calcInputs); break;
            case 'slope': res = calculateSlopeStability({ ...calcInputs, cohesion: calcInputs.c }); break; // Map c to cohesion
            case 'settlement': res = calculateSettlement(calcInputs); break;
            case 'cbr': res = calculateCBR(calcInputs); break;
            case 'pile': res = calculatePileCapacity({ ...calcInputs, cohesion: calcInputs.c }); break; // Map c to cohesion
            case 'moisture': res = calculateMoistureContent(calcInputs); break;
            default: res = { results: {}, steps: [], errors: ['Invalid Mode'] };
        }
        setResults(res);
    };

    const clearInputs = () => {
        setInputs(prev => {
            const cleared: any = {};
            Object.keys(prev).forEach(key => {
                cleared[key] = { ...prev[key as keyof typeof prev], value: (key === 'type' ? 'active' : '0') };
            });
            // Reset defaults
            cleared.phi.value = '30';
            cleared.gamma.value = '18';
            cleared.factor.value = '3';
            cleared.standard.value = '1370';
            return cleared;
        });
        setResults(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex space-x-2 overflow-x-auto pb-2">
                <Button variant={activeMode === 'bearing' ? 'default' : 'outline'} onClick={() => { setActiveMode('bearing'); setResults(null); }}>Bearing Capacity</Button>
                <Button variant={activeMode === 'safe-bearing' ? 'default' : 'outline'} onClick={() => { setActiveMode('safe-bearing'); setResults(null); }}>Safe Bearing</Button>
                <Button variant={activeMode === 'density' ? 'default' : 'outline'} onClick={() => { setActiveMode('density'); setResults(null); }}>Soil Density</Button>
                <Button variant={activeMode === 'pressure' ? 'default' : 'outline'} onClick={() => { setActiveMode('pressure'); setResults(null); }}>Earth Pressure</Button>
                <Button variant={activeMode === 'compaction' ? 'default' : 'outline'} onClick={() => { setActiveMode('compaction'); setResults(null); }}>Compaction</Button>
                <Button variant={activeMode === 'slope' ? 'default' : 'outline'} onClick={() => { setActiveMode('slope'); setResults(null); }}>Slope Stability</Button>
                <Button variant={activeMode === 'settlement' ? 'default' : 'outline'} onClick={() => { setActiveMode('settlement'); setResults(null); }}>Settlement</Button>
                <Button variant={activeMode === 'cbr' ? 'default' : 'outline'} onClick={() => { setActiveMode('cbr'); setResults(null); }}>CBR</Button>
                <Button variant={activeMode === 'pile' ? 'default' : 'outline'} onClick={() => { setActiveMode('pile'); setResults(null); }}>Pile Capacity</Button>
                <Button variant={activeMode === 'moisture' ? 'default' : 'outline'} onClick={() => { setActiveMode('moisture'); setResults(null); }}>Moisture</Button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-charcoal flex items-center">
                            <Edit className="h-5 w-5 text-eng-blue mr-2" />
                            Input Parameters
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {activeMode === 'bearing' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label>Cohesion (c)</Label><Input type="number" value={inputs.c.value} onChange={(e) => handleInputChange('c', e.target.value)} /></div>
                                <div><Label>Friction Angle (φ)</Label><Input type="number" value={inputs.phi.value} onChange={(e) => handleInputChange('phi', e.target.value)} /></div>
                                <div><Label>Unit Weight (γ)</Label><Input type="number" value={inputs.gamma.value} onChange={(e) => handleInputChange('gamma', e.target.value)} /></div>
                                <div><Label>Depth (Df)</Label><Input type="number" value={inputs.depth.value} onChange={(e) => handleInputChange('depth', e.target.value)} /></div>
                                <div><Label>Width (B)</Label><Input type="number" value={inputs.width.value} onChange={(e) => handleInputChange('width', e.target.value)} /></div>
                            </div>
                        )}
                        {activeMode === 'safe-bearing' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label>Ultimate Capacity (qu)</Label><Input type="number" value={inputs.capacity.value} onChange={(e) => handleInputChange('capacity', e.target.value)} /></div>
                                <div><Label>Factor of Safety</Label><Input type="number" value={inputs.factor.value} onChange={(e) => handleInputChange('factor', e.target.value)} /></div>
                            </div>
                        )}
                        {activeMode === 'density' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label>Weight (W)</Label><Input type="number" value={inputs.weight.value} onChange={(e) => handleInputChange('weight', e.target.value)} /></div>
                                <div><Label>Volume (V)</Label><Input type="number" value={inputs.volume.value} onChange={(e) => handleInputChange('volume', e.target.value)} /></div>
                            </div>
                        )}
                        {activeMode === 'pressure' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label>Height (H)</Label><Input type="number" value={inputs.height.value} onChange={(e) => handleInputChange('height', e.target.value)} /></div>
                                <div><Label>Friction Angle (φ)</Label><Input type="number" value={inputs.phi.value} onChange={(e) => handleInputChange('phi', e.target.value)} /></div>
                                <div><Label>Unit Weight (γ)</Label><Input type="number" value={inputs.gamma.value} onChange={(e) => handleInputChange('gamma', e.target.value)} /></div>
                                <div><Label>Type</Label>
                                    <Select value={inputs.type.value} onValueChange={(v) => handleInputChange('type', v)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="passive">Passive</SelectItem></SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}
                        {activeMode === 'compaction' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label>Weight Wet Soil</Label><Input type="number" value={inputs.weightWet.value} onChange={(e) => handleInputChange('weightWet', e.target.value)} /></div>
                                <div><Label>Mold Volume</Label><Input type="number" value={inputs.volume.value} onChange={(e) => handleInputChange('volume', e.target.value)} /></div>
                                <div><Label>Moisture Content (%)</Label><Input type="number" value={inputs.moisture.value} onChange={(e) => handleInputChange('moisture', e.target.value)} /></div>
                            </div>
                        )}
                        {activeMode === 'slope' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label>Cohesion (c)</Label><Input type="number" value={inputs.c.value} onChange={(e) => handleInputChange('c', e.target.value)} /></div>
                                <div><Label>Friction Angle (φ)</Label><Input type="number" value={inputs.phi.value} onChange={(e) => handleInputChange('phi', e.target.value)} /></div>
                                <div><Label>Unit Weight (γ)</Label><Input type="number" value={inputs.gamma.value} onChange={(e) => handleInputChange('gamma', e.target.value)} /></div>
                                <div><Label>Slope Angle (β)</Label><Input type="number" value={inputs.angle.value} onChange={(e) => handleInputChange('angle', e.target.value)} /></div>
                                <div><Label>Height (H)</Label><Input type="number" value={inputs.height.value} onChange={(e) => handleInputChange('height', e.target.value)} /></div>
                            </div>
                        )}
                        {activeMode === 'settlement' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label>Compression Index (Cc)</Label><Input type="number" value={inputs.cc.value} onChange={(e) => handleInputChange('cc', e.target.value)} /></div>
                                <div><Label>Initial Thickness (H0)</Label><Input type="number" value={inputs.h0.value} onChange={(e) => handleInputChange('h0', e.target.value)} /></div>
                                <div><Label>Void Ratio (e0)</Label><Input type="number" value={inputs.e0.value} onChange={(e) => handleInputChange('e0', e.target.value)} /></div>
                                <div><Label>Initial Stress (p0)</Label><Input type="number" value={inputs.p0.value} onChange={(e) => handleInputChange('p0', e.target.value)} /></div>
                                <div><Label>Stress Change (Δp)</Label><Input type="number" value={inputs.dp.value} onChange={(e) => handleInputChange('dp', e.target.value)} /></div>
                            </div>
                        )}
                        {activeMode === 'cbr' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label>Test Load</Label><Input type="number" value={inputs.load.value} onChange={(e) => handleInputChange('load', e.target.value)} /></div>
                                <div><Label>Standard Load</Label><Input type="number" value={inputs.standard.value} onChange={(e) => handleInputChange('standard', e.target.value)} /></div>
                            </div>
                        )}
                        {activeMode === 'pile' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label>Cohesion (c)</Label><Input type="number" value={inputs.c.value} onChange={(e) => handleInputChange('c', e.target.value)} /></div>
                                <div><Label>Diameter (d)</Label><Input type="number" value={inputs.diameter.value} onChange={(e) => handleInputChange('diameter', e.target.value)} /></div>
                                <div><Label>Length (L)</Label><Input type="number" value={inputs.length.value} onChange={(e) => handleInputChange('length', e.target.value)} /></div>
                                <div><Label>Adhesion Factor (α)</Label><Input type="number" value={inputs.alpha.value} onChange={(e) => handleInputChange('alpha', e.target.value)} /></div>
                            </div>
                        )}
                        {activeMode === 'moisture' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label>Wet Weight</Label><Input type="number" value={inputs.weightWet.value} onChange={(e) => handleInputChange('weightWet', e.target.value)} /></div>
                                <div><Label>Dry Weight</Label><Input type="number" value={inputs.weightDry.value} onChange={(e) => handleInputChange('weightDry', e.target.value)} /></div>
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
                                        <CheckCircle className="h-4 w-4 mr-2" /> Analysis Result
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
                                <p>Enter parameters to view results</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Dynamic Contextual Accordion */}
                {(() => {
                    const modeToId: Record<string, string> = {
                        'bearing': 'bearing-capacity',
                        'safe-bearing': 'safe-bearing',
                        'density': 'soil-density',
                        'pressure': 'earth-pressure',
                        'compaction': 'compaction',
                        'slope': 'slope-stability',
                        'settlement': 'settlement',
                        'cbr': 'cbr',
                        'pile': 'pile-capacity',
                        'moisture': 'moisture-content'
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
