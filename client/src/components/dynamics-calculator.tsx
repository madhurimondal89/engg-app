import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { calculateAngularVelocity, calculateCentripetalForce, type CalculationInput, type CalculationOutput } from '@/lib/calculations';
import { Settings, BarChart3, Edit, Trash2, Save, Share, Printer, AlertTriangle, CheckCircle, BookOpen } from 'lucide-react';
import { getHowToUse, getEngineeringExplanation, getPracticalApplications, getFAQs } from '@/lib/calculator-content';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { QuickReferenceAccordion } from './quick-reference-accordion';

export default function DynamicsCalculator() {
    const [activeCalculator, setActiveCalculator] = useState('angular-velocity');
    const [inputs, setInputs] = useState({
        v: { value: '', unit: 'm/s' },
        r: { value: '', unit: 'm' },
        m: { value: '', unit: 'kg' }
    });
    const [results, setResults] = useState<CalculationOutput | null>(null);

    const calculatorTypes = [
        { id: 'angular-velocity', name: 'Angular Velocity', active: true },
        { id: 'centripetal', name: 'Centripetal Force', active: true }
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

        if (activeCalculator === 'angular-velocity') {
            result = calculateAngularVelocity(calculationInputs);
        } else if (activeCalculator === 'centripetal') {
            result = calculateCentripetalForce(calculationInputs);
        } else {
            result = { results: {}, steps: [], errors: ['Calculator not implemented yet'] };
        }

        setResults(result);
    };

    const getFormulaInfo = () => {
        if (activeCalculator === 'angular-velocity') {
            return {
                name: 'Angular Velocity',
                formula: 'ω = v / r',
                description: 'Calculates the angular velocity (ω) of an object in circular motion based on its linear velocity (v) and radius (r).'
            };
        } else if (activeCalculator === 'centripetal') {
            return {
                name: 'Centripetal Force',
                formula: 'F = (m × v²) / r',
                description: 'Calculates the force required to keep an object of mass (m) moving in a circular path of radius (r) at velocity (v).'
            };
        }
        return {
            name: activeCalculator.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase()),
            formula: 'Formula specific to dynamics and kinematics',
            description: 'Refer to dynamics literature for detailed formulas on ' + activeCalculator.replace('-', ' ')
        };
    };

    const formulaInfo = getFormulaInfo();

    const clearInputs = () => {
        setInputs({
            v: { value: '', unit: 'm/s' },
            r: { value: '', unit: 'm' },
            m: { value: '', unit: 'kg' }
        });
        setResults(null);
    };

    return (
        <>
            <Card className="mb-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center font-outfit">
                            <Settings className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
                            Dynamics & Kinematics
                        </h2>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {calculatorTypes.map((calc) => (
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
                        <div className="space-y-4">
                            {activeCalculator === 'angular-velocity' && (
                                <>
                                    <div>
                                        <Label>Linear Velocity (v)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.v.value} onChange={(e) => handleInputChange('v', e.target.value)} />
                                            <Select value={inputs.v.unit} onValueChange={(v) => handleUnitChange('v', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="m/s">m/s</SelectItem><SelectItem value="km/h">km/h</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Radius (r)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.r.value} onChange={(e) => handleInputChange('r', e.target.value)} />
                                            <Select value={inputs.r.unit} onValueChange={(v) => handleUnitChange('r', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="m">m</SelectItem><SelectItem value="cm">cm</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeCalculator === 'centripetal' && (
                                <>
                                    <div>
                                        <Label>Mass (m)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.m.value} onChange={(e) => handleInputChange('m', e.target.value)} />
                                            <Select value={inputs.m.unit} onValueChange={(v) => handleUnitChange('m', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="kg">kg</SelectItem><SelectItem value="g">g</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Velocity (v)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.v.value} onChange={(e) => handleInputChange('v', e.target.value)} />
                                            <Select value={inputs.v.unit} onValueChange={(v) => handleUnitChange('v', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="m/s">m/s</SelectItem><SelectItem value="km/h">km/h</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Radius (r)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.r.value} onChange={(e) => handleInputChange('r', e.target.value)} />
                                            <Select value={inputs.r.unit} onValueChange={(v) => handleUnitChange('r', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="m">m</SelectItem><SelectItem value="cm">cm</SelectItem></SelectContent>
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
                            <Button onClick={performCalculation} className="w-full bg-eng-blue text-white">Calculate</Button>
                            <Button variant="outline" onClick={clearInputs} className="w-full">Clear All</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-charcoal flex items-center">
                            <BarChart3 className="h-5 w-5 text-eng-blue mr-2" />
                            Results
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
                                                <div className="text-2xl font-bold text-green-700">{result.formatted}</div>
                                                <div className="text-sm text-green-600 capitalize">{key}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {results.steps.length > 0 && (
                                    <div className="border-t border-gray-200 pt-6">
                                        <h4 className="font-semibold text-charcoal mb-3">Step-by-Step Solution</h4>
                                        <div className="space-y-3 text-sm">
                                            {results.steps.map((step, index) => (
                                                <div key={index} className="flex items-start space-x-3">
                                                    <Badge variant="secondary" className="bg-eng-blue text-white">{step.step}</Badge>
                                                    <div>
                                                        <div className="font-medium">{step.description}</div>
                                                        <div className="text-gray-600 font-mono">{step.formula}</div>
                                                        <div className="text-gray-600 font-mono">{step.calculation}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                <p>Enter values and click Calculate</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <QuickReferenceAccordion formulaInfo={formulaInfo} discipline="mechanical" />
        </>
    );
}
