
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Edit, Trash2, BarChart3, Save, Share, Printer, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';
import { CalculationOutput } from '@/lib/calculations';
import { calculateConcreteVolume, calculateBrickCount, calculateConcreteMaterials, calculateMortar, calculatePlastering, calculateFlooring, calculatePaint, calculateBlockCount } from '@/lib/civil-calculations';
import { engineeringDisciplines } from '@/lib/formulas';
import { getHowToUse, getEngineeringExplanation, getPracticalApplications, getFAQs } from '@/lib/calculator-content';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { BookOpen } from 'lucide-react';

export default function ConstructionCalculator() {
    const [activeMode, setActiveMode] = useState('concrete');
    const [inputs, setInputs] = useState({
        length: { value: '', unit: 'm' },
        width: { value: '', unit: 'm' },
        depth: { value: '', unit: 'm' },
        height: { value: '', unit: 'm' },
        thickness: { value: '', unit: 'm' },
        quantity: { value: '1', unit: 'nos' },

        // Brick/Block dimensions
        brickLength: { value: '0.19', unit: 'm' },
        brickWidth: { value: '0.09', unit: 'm' },
        brickHeight: { value: '0.09', unit: 'm' },
        blockLength: { value: '0.39', unit: 'm' }, // Standard Block 400x200x200 approx
        blockHeight: { value: '0.19', unit: 'm' },
        blockWidth: { value: '0.19', unit: 'm' },

        mortar: { value: '0.01', unit: 'm' },

        // New inputs for Mix/Mortar
        volume: { value: '', unit: 'm³' },
        ratioCement: { value: '1', unit: '' },
        ratioSand: { value: '2', unit: '' },
        ratioAggregate: { value: '4', unit: '' },

        // Finishing
        tileSizeH: { value: '0.6', unit: 'm' },
        tileSizeW: { value: '0.6', unit: 'm' },
        doors: { value: '0', unit: 'm²' }, // Area deduction
        coverage: { value: '10', unit: 'm²/l' },
        coats: { value: '2', unit: '' },
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
            case 'concrete': res = calculateConcreteVolume(calcInputs); break;
            case 'brick': res = calculateBrickCount(calcInputs); break;
            case 'block': res = calculateBlockCount(calcInputs); break;
            case 'cement':
            case 'sand':
            case 'aggregate':
            case 'mix':
                res = calculateConcreteMaterials(calcInputs); break;
            case 'mortar': res = calculateMortar(calcInputs); break;
            case 'plaster': res = calculatePlastering(calcInputs); break;
            case 'flooring': res = calculateFlooring(calcInputs); break;
            case 'paint': res = calculatePaint(calcInputs); break;
            default: res = { results: {}, steps: [], errors: ['Invalid Mode'] };
        }
        setResults(res);
    };

    const clearInputs = () => {
        setInputs(prev => ({ ...prev, volume: { value: '', unit: 'm³' }, length: { value: '', unit: 'm' } }));
        setResults(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                <Button variant={activeMode === 'concrete' ? 'default' : 'outline'} onClick={() => { setActiveMode('concrete'); setResults(null); }}>Concrete Vol</Button>
                <Button variant={activeMode === 'cement' ? 'default' : 'outline'} onClick={() => { setActiveMode('cement'); setResults(null); }}>Cement</Button>
                <Button variant={activeMode === 'sand' ? 'default' : 'outline'} onClick={() => { setActiveMode('sand'); setResults(null); }}>Sand</Button>
                <Button variant={activeMode === 'aggregate' ? 'default' : 'outline'} onClick={() => { setActiveMode('aggregate'); setResults(null); }}>Aggregate</Button>
                <Button variant={activeMode === 'brick' ? 'default' : 'outline'} onClick={() => { setActiveMode('brick'); setResults(null); }}>Brick</Button>
                <Button variant={activeMode === 'block' ? 'default' : 'outline'} onClick={() => { setActiveMode('block'); setResults(null); }}>Block</Button>
                <Button variant={activeMode === 'mortar' ? 'default' : 'outline'} onClick={() => { setActiveMode('mortar'); setResults(null); }}>Mortar</Button>
                <Button variant={activeMode === 'plaster' ? 'default' : 'outline'} onClick={() => { setActiveMode('plaster'); setResults(null); }}>Plastering</Button>
                <Button variant={activeMode === 'flooring' ? 'default' : 'outline'} onClick={() => { setActiveMode('flooring'); setResults(null); }}>Flooring</Button>
                <Button variant={activeMode === 'paint' ? 'default' : 'outline'} onClick={() => { setActiveMode('paint'); setResults(null); }}>Paint</Button>
                <Button variant="outline" onClick={() => window.open('/calculators/concrete-calculator.html', '_blank')} className="border-eng-blue text-eng-blue">
                    <ExternalLink className="h-4 w-4 mr-2" /> Advanced Concrete Tool
                </Button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-charcoal flex items-center">
                            <Edit className="h-5 w-5 text-eng-blue mr-2" /> Inputs
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {activeMode === 'concrete' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label>Length</Label><Input type="number" value={inputs.length.value} onChange={(e) => handleInputChange('length', e.target.value)} /></div>
                                <div><Label>Width</Label><Input type="number" value={inputs.width.value} onChange={(e) => handleInputChange('width', e.target.value)} /></div>
                                <div><Label>Depth/Thickness</Label><Input type="number" value={inputs.depth.value} onChange={(e) => handleInputChange('depth', e.target.value)} /></div>
                                <div><Label>Quantity (Nos)</Label><Input type="number" value={inputs.quantity.value} onChange={(e) => handleInputChange('quantity', e.target.value)} /></div>
                            </div>
                        )}
                        {(activeMode === 'cement' || activeMode === 'sand' || activeMode === 'aggregate' || activeMode === 'mix') && (
                            <div className="space-y-4">
                                <div><Label>Concrete Volume (Wet)</Label><Input type="number" value={inputs.volume.value} onChange={(e) => handleInputChange('volume', e.target.value)} placeholder="Enter volume in m³" /></div>
                                <div className="grid grid-cols-3 gap-2">
                                    <div><Label>Cement Ratio</Label><Input type="number" value={inputs.ratioCement.value} onChange={(e) => handleInputChange('ratioCement', e.target.value)} /></div>
                                    <div><Label>Sand Ratio</Label><Input type="number" value={inputs.ratioSand.value} onChange={(e) => handleInputChange('ratioSand', e.target.value)} /></div>
                                    <div><Label>Agg Ratio</Label><Input type="number" value={inputs.ratioAggregate.value} onChange={(e) => handleInputChange('ratioAggregate', e.target.value)} /></div>
                                </div>
                                <p className="text-xs text-gray-500">M20 = 1:1.5:3, M15 = 1:2:4, M10 = 1:3:6</p>
                            </div>
                        )}
                        {activeMode === 'brick' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div><Label>Wall Length</Label><Input type="number" value={inputs.length.value} onChange={(e) => handleInputChange('length', e.target.value)} /></div>
                                    <div><Label>Wall Height</Label><Input type="number" value={inputs.height.value} onChange={(e) => handleInputChange('height', e.target.value)} /></div>
                                    <div><Label>Wall Thickness</Label><Input type="number" value={inputs.thickness.value} onChange={(e) => handleInputChange('thickness', e.target.value)} /></div>
                                    <div><Label>Mortar (m)</Label><Input type="number" value={inputs.mortar.value} onChange={(e) => handleInputChange('mortar', e.target.value)} /></div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 border-t pt-2">
                                    <div><Label>Brick L</Label><Input type="number" value={inputs.brickLength.value} onChange={(e) => handleInputChange('brickLength', e.target.value)} /></div>
                                    <div><Label>Brick W</Label><Input type="number" value={inputs.brickWidth.value} onChange={(e) => handleInputChange('brickWidth', e.target.value)} /></div>
                                    <div><Label>Brick H</Label><Input type="number" value={inputs.brickHeight.value} onChange={(e) => handleInputChange('brickHeight', e.target.value)} /></div>
                                </div>
                            </div>
                        )}
                        {activeMode === 'block' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div><Label>Wall Length</Label><Input type="number" value={inputs.length.value} onChange={(e) => handleInputChange('length', e.target.value)} /></div>
                                    <div><Label>Wall Height</Label><Input type="number" value={inputs.height.value} onChange={(e) => handleInputChange('height', e.target.value)} /></div>
                                    {/* Wall Thickness usually equals Block Width for single leaf */}
                                    <div><Label>Mortar (m)</Label><Input type="number" value={inputs.mortar.value} onChange={(e) => handleInputChange('mortar', e.target.value)} /></div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 border-t pt-2">
                                    <div><Label>Block L</Label><Input type="number" value={inputs.blockLength.value} onChange={(e) => handleInputChange('blockLength', e.target.value)} /></div>
                                    <div><Label>Block W</Label><Input type="number" value={inputs.blockWidth.value} onChange={(e) => handleInputChange('blockWidth', e.target.value)} /></div>
                                    <div><Label>Block H</Label><Input type="number" value={inputs.blockHeight.value} onChange={(e) => handleInputChange('blockHeight', e.target.value)} /></div>
                                </div>
                            </div>
                        )}
                        {activeMode === 'mortar' && (
                            <div className="space-y-4">
                                <div><Label>Mortar Volume (Wet)</Label><Input type="number" value={inputs.volume.value} onChange={(e) => handleInputChange('volume', e.target.value)} /></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><Label>Cement Ratio</Label><Input type="number" value={inputs.ratioCement.value} onChange={(e) => handleInputChange('ratioCement', e.target.value)} /></div>
                                    <div><Label>Sand Ratio</Label><Input type="number" value={inputs.ratioSand.value} onChange={(e) => handleInputChange('ratioSand', e.target.value)} /></div>
                                </div>
                            </div>
                        )}
                        {activeMode === 'plaster' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label>Length</Label><Input type="number" value={inputs.length.value} onChange={(e) => handleInputChange('length', e.target.value)} /></div>
                                <div><Label>Height/Width</Label><Input type="number" value={inputs.height.value} onChange={(e) => handleInputChange('height', e.target.value)} /></div>
                                <div><Label>Thickness</Label><Input type="number" value={inputs.thickness.value} onChange={(e) => handleInputChange('thickness', e.target.value)} placeholder="0.012" /></div>
                                <div><Label>Ratio (C:S)</Label><div className="flex gap-2"><Input value={inputs.ratioCement.value} onChange={(e) => handleInputChange('ratioCement', e.target.value)} className="w-1/3" /><Input value={inputs.ratioSand.value} onChange={(e) => handleInputChange('ratioSand', e.target.value)} /></div></div>
                            </div>
                        )}
                        {activeMode === 'flooring' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label>Room Length</Label><Input type="number" value={inputs.length.value} onChange={(e) => handleInputChange('length', e.target.value)} /></div>
                                <div><Label>Room Width</Label><Input type="number" value={inputs.width.value} onChange={(e) => handleInputChange('width', e.target.value)} /></div>
                                <div><Label>Tile Height</Label><Input type="number" value={inputs.tileSizeH.value} onChange={(e) => handleInputChange('tileSizeH', e.target.value)} /></div>
                                <div><Label>Tile Width</Label><Input type="number" value={inputs.tileSizeW.value} onChange={(e) => handleInputChange('tileSizeW', e.target.value)} /></div>
                            </div>
                        )}
                        {activeMode === 'paint' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label>Wall Length</Label><Input type="number" value={inputs.length.value} onChange={(e) => handleInputChange('length', e.target.value)} /></div>
                                <div><Label>Wall Height</Label><Input type="number" value={inputs.width.value} onChange={(e) => handleInputChange('width', e.target.value)} /></div>
                                <div><Label>Deductions (m²)</Label><Input type="number" value={inputs.doors.value} onChange={(e) => handleInputChange('doors', e.target.value)} /></div>
                                <div><Label>Coverage (m²/l)</Label><Input type="number" value={inputs.coverage.value} onChange={(e) => handleInputChange('coverage', e.target.value)} /></div>
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
                                        {Object.entries(results.results).map(([key, result]) => {
                                            // Highlight specific results based on mode
                                            const isHighlight =
                                                (activeMode === 'cement' && key === 'cement') ||
                                                (activeMode === 'sand' && key === 'sand') ||
                                                (activeMode === 'aggregate' && key === 'aggregate') ||
                                                (activeMode === 'block' && key === 'total_blocks');

                                            return (
                                                <div key={key} className={`flex justify-between items-center bg-white p-3 rounded shadow-sm ${isHighlight ? 'ring-2 ring-eng-blue' : ''}`}>
                                                    <span className="text-sm text-gray-600 font-medium capitalize">{key.replace(/_/g, ' ')}</span>
                                                    <span className="text-lg font-bold text-eng-blue">{result.formatted}</span>
                                                </div>
                                            );
                                        })}
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
                        'concrete': 'concrete-volume',
                        'cement': 'cement-calc',
                        'sand': 'sand-calc',
                        'aggregate': 'aggregate-calc',
                        'brick': 'brick-count',
                        'block': 'block-count',
                        'mortar': 'mortar',
                        'plaster': 'plastering',
                        'flooring': 'flooring',
                        'paint': 'paint',
                        'mix': 'concrete-mix'
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
