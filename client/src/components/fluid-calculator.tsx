import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { calculateReynolds, calculateFlowRate, calculateFluidVelocity, calculatePressureDrop, calculateHeadLoss, calculateDarcyFriction, calculatePipeDiameter, calculatePumpPower, calculateHydraulicPower, calculateBernoulli, type CalculationInput, type CalculationOutput } from '@/lib/calculations';
import { Settings, BarChart3, Edit, Trash2, Save, Share, Printer, AlertTriangle, CheckCircle } from 'lucide-react';

export default function FluidCalculator() {
    const [activeCalculator, setActiveCalculator] = useState('reynolds');
    const [inputs, setInputs] = useState({
        rho: { value: '', unit: 'kg/m³' },
        v: { value: '', unit: 'm/s' },
        v1: { value: '', unit: 'm/s' },
        v2: { value: '', unit: 'm/s' },
        D: { value: '', unit: 'm' },
        mu: { value: '', unit: 'Pa·s' },
        A: { value: '', unit: 'm²' },
        Q: { value: '', unit: 'm³/s' },
        f: { value: '', unit: '' },
        L: { value: '', unit: 'm' },
        Re: { value: '', unit: '' },
        h: { value: '', unit: 'm' },
        h1: { value: '', unit: 'm' },
        h2: { value: '', unit: 'm' },
        eta: { value: '', unit: '' },
        dP: { value: '', unit: 'Pa' },
        P1: { value: '', unit: 'Pa' }
    });
    const [results, setResults] = useState<CalculationOutput | null>(null);

    const calculatorTypes = [
        { id: 'reynolds', name: 'Reynolds Number', active: true },
        { id: 'flow-rate', name: 'Flow Rate', active: true },
        { id: 'fluid-velocity', name: 'Velocity', active: true },
        { id: 'pressure-drop', name: 'Pressure Drop', active: true },
        { id: 'head-loss', name: 'Head Loss', active: true },
        { id: 'darcy-friction', name: 'Darcy Friction', active: true },
        { id: 'pipe-diameter', name: 'Pipe Diameter', active: true },
        { id: 'pump-power', name: 'Pump Power', active: true },
        { id: 'hydraulic-power', name: 'Hydraulic Power', active: true },
        { id: 'bernoulli', name: 'Bernoulli Equation', active: true }
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

        if (activeCalculator === 'reynolds') {
            result = calculateReynolds(calculationInputs);
        } else if (activeCalculator === 'flow-rate') {
            result = calculateFlowRate(calculationInputs);
        } else if (activeCalculator === 'fluid-velocity') {
            result = calculateFluidVelocity(calculationInputs);
        } else if (activeCalculator === 'pressure-drop') {
            result = calculatePressureDrop(calculationInputs);
        } else if (activeCalculator === 'head-loss') {
            result = calculateHeadLoss(calculationInputs);
        } else if (activeCalculator === 'darcy-friction') {
            result = calculateDarcyFriction(calculationInputs);
        } else if (activeCalculator === 'pipe-diameter') {
            result = calculatePipeDiameter(calculationInputs);
        } else if (activeCalculator === 'pump-power') {
            result = calculatePumpPower(calculationInputs);
        } else if (activeCalculator === 'hydraulic-power') {
            result = calculateHydraulicPower(calculationInputs);
        } else if (activeCalculator === 'bernoulli') {
            result = calculateBernoulli(calculationInputs);
        } else {
            result = { results: {}, steps: [], errors: ['Calculator not implemented yet'] };
        }

        setResults(result);
    };

    const clearInputs = () => {
        setInputs({
            rho: { value: '', unit: 'kg/m³' },
            v: { value: '', unit: 'm/s' },
            v1: { value: '', unit: 'm/s' },
            v2: { value: '', unit: 'm/s' },
            D: { value: '', unit: 'm' },
            mu: { value: '', unit: 'Pa·s' },
            A: { value: '', unit: 'm²' },
            Q: { value: '', unit: 'm³/s' },
            f: { value: '', unit: '' },
            L: { value: '', unit: 'm' },
            Re: { value: '', unit: '' },
            h: { value: '', unit: 'm' },
            h1: { value: '', unit: 'm' },
            h2: { value: '', unit: 'm' },
            eta: { value: '', unit: '' },
            dP: { value: '', unit: 'Pa' },
            P1: { value: '', unit: 'Pa' }
        });
        setResults(null);
    };

    return (
        <>
            <Card className="mb-6">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-charcoal flex items-center">
                            <Settings className="h-6 w-6 text-eng-blue mr-3" />
                            Fluid Mechanics
                        </h2>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {calculatorTypes.map((calc) => (
                            <Button
                                key={calc.id}
                                variant={activeCalculator === calc.id ? "default" : "outline"}
                                size="sm"
                                className={`${activeCalculator === calc.id
                                    ? 'bg-eng-blue text-white hover:bg-eng-blue'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
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
                            {activeCalculator === 'reynolds' && (
                                <>
                                    <div>
                                        <Label>Density (ρ)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.rho.value} onChange={(e) => handleInputChange('rho', e.target.value)} />
                                            <Select value={inputs.rho.unit} onValueChange={(v) => handleUnitChange('rho', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="kg/m³">kg/m³</SelectItem></SelectContent>
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
                                        <Label>Diameter (D)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.D.value} onChange={(e) => handleInputChange('D', e.target.value)} />
                                            <Select value={inputs.D.unit} onValueChange={(v) => handleUnitChange('D', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="m">m</SelectItem><SelectItem value="mm">mm</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Dynamic Viscosity (μ)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.mu.value} onChange={(e) => handleInputChange('mu', e.target.value)} />
                                            <Select value={inputs.mu.unit} onValueChange={(v) => handleUnitChange('mu', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="Pa·s">Pa·s</SelectItem><SelectItem value="cP">cP</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeCalculator === 'flow-rate' && (
                                <>
                                    <div>
                                        <Label>Area (A)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.A.value} onChange={(e) => handleInputChange('A', e.target.value)} />
                                            <Select value={inputs.A.unit} onValueChange={(v) => handleUnitChange('A', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="m²">m²</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Velocity (v)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.v.value} onChange={(e) => handleInputChange('v', e.target.value)} />
                                            <Select value={inputs.v.unit} onValueChange={(v) => handleUnitChange('v', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="m/s">m/s</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeCalculator === 'fluid-velocity' && (
                                <>
                                    <div>
                                        <Label>Flow Rate (Q)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.Q.value} onChange={(e) => handleInputChange('Q', e.target.value)} />
                                            <Select value={inputs.Q.unit} onValueChange={(v) => handleUnitChange('Q', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="m³/s">m³/s</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Area (A)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.A.value} onChange={(e) => handleInputChange('A', e.target.value)} />
                                            <Select value={inputs.A.unit} onValueChange={(v) => handleUnitChange('A', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="m²">m²</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeCalculator === 'pressure-drop' && (
                                <>
                                    <div>
                                        <Label>Friction Factor (f)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.f.value} onChange={(e) => handleInputChange('f', e.target.value)} />
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Length (L)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.L.value} onChange={(e) => handleInputChange('L', e.target.value)} />
                                            <Select value={inputs.L.unit} onValueChange={(v) => handleUnitChange('L', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="m">m</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Diameter (D)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.D.value} onChange={(e) => handleInputChange('D', e.target.value)} />
                                            <Select value={inputs.D.unit} onValueChange={(v) => handleUnitChange('D', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="m">m</SelectItem><SelectItem value="mm">mm</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Density (ρ)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.rho.value} onChange={(e) => handleInputChange('rho', e.target.value)} />
                                            <Select value={inputs.rho.unit} onValueChange={(v) => handleUnitChange('rho', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="kg/m³">kg/m³</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Velocity (v)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.v.value} onChange={(e) => handleInputChange('v', e.target.value)} />
                                            <Select value={inputs.v.unit} onValueChange={(v) => handleUnitChange('v', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="m/s">m/s</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeCalculator === 'head-loss' && (
                                <>
                                    <div>
                                        <Label>Friction Factor (f)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.f.value} onChange={(e) => handleInputChange('f', e.target.value)} />
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Length (L)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.L.value} onChange={(e) => handleInputChange('L', e.target.value)} />
                                            <Select value={inputs.L.unit} onValueChange={(v) => handleUnitChange('L', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="m">m</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Diameter (D)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.D.value} onChange={(e) => handleInputChange('D', e.target.value)} />
                                            <Select value={inputs.D.unit} onValueChange={(v) => handleUnitChange('D', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="m">m</SelectItem><SelectItem value="mm">mm</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Velocity (v)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.v.value} onChange={(e) => handleInputChange('v', e.target.value)} />
                                            <Select value={inputs.v.unit} onValueChange={(v) => handleUnitChange('v', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="m/s">m/s</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeCalculator === 'darcy-friction' && (
                                <>
                                    <div>
                                        <Label>Reynolds Number (Re)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.Re.value} onChange={(e) => handleInputChange('Re', e.target.value)} />
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeCalculator === 'pipe-diameter' && (
                                <>
                                    <div>
                                        <Label>Flow Rate (Q)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.Q.value} onChange={(e) => handleInputChange('Q', e.target.value)} />
                                            <Select value={inputs.Q.unit} onValueChange={(v) => handleUnitChange('Q', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="m³/s">m³/s</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Velocity (v)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.v.value} onChange={(e) => handleInputChange('v', e.target.value)} />
                                            <Select value={inputs.v.unit} onValueChange={(v) => handleUnitChange('v', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="m/s">m/s</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeCalculator === 'pump-power' && (
                                <>
                                    <div>
                                        <Label>Density (ρ)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.rho.value} onChange={(e) => handleInputChange('rho', e.target.value)} />
                                            <Select value={inputs.rho.unit} onValueChange={(v) => handleUnitChange('rho', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="kg/m³">kg/m³</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Flow Rate (Q)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.Q.value} onChange={(e) => handleInputChange('Q', e.target.value)} />
                                            <Select value={inputs.Q.unit} onValueChange={(v) => handleUnitChange('Q', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="m³/s">m³/s</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Head (h)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.h.value} onChange={(e) => handleInputChange('h', e.target.value)} />
                                            <Select value={inputs.h.unit} onValueChange={(v) => handleUnitChange('h', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="m">m</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Efficiency (η)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.eta.value} onChange={(e) => handleInputChange('eta', e.target.value)} max="1" step="0.01" />
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeCalculator === 'hydraulic-power' && (
                                <>
                                    <div>
                                        <Label>Flow Rate (Q)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.Q.value} onChange={(e) => handleInputChange('Q', e.target.value)} />
                                            <Select value={inputs.Q.unit} onValueChange={(v) => handleUnitChange('Q', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="m³/s">m³/s</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Pressure Drop (ΔP)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.dP.value} onChange={(e) => handleInputChange('dP', e.target.value)} />
                                            <Select value={inputs.dP.unit} onValueChange={(v) => handleUnitChange('dP', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="Pa">Pa</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeCalculator === 'bernoulli' && (
                                <>
                                    <div>
                                        <Label>Pressure 1 (P1)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.P1.value} onChange={(e) => handleInputChange('P1', e.target.value)} />
                                            <Select value={inputs.P1.unit} onValueChange={(v) => handleUnitChange('P1', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="Pa">Pa</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Density (ρ)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.rho.value} onChange={(e) => handleInputChange('rho', e.target.value)} />
                                            <Select value={inputs.rho.unit} onValueChange={(v) => handleUnitChange('rho', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="kg/m³">kg/m³</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <Label>Velocity 1 (v1)</Label>
                                            <Input type="number" value={inputs.v1.value} onChange={(e) => handleInputChange('v1', e.target.value)} className="mt-2" />
                                        </div>
                                        <div>
                                            <Label>Velocity 2 (v2)</Label>
                                            <Input type="number" value={inputs.v2.value} onChange={(e) => handleInputChange('v2', e.target.value)} className="mt-2" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <Label>Height 1 (h1)</Label>
                                            <Input type="number" value={inputs.h1.value} onChange={(e) => handleInputChange('h1', e.target.value)} className="mt-2" />
                                        </div>
                                        <div>
                                            <Label>Height 2 (h2)</Label>
                                            <Input type="number" value={inputs.h2.value} onChange={(e) => handleInputChange('h2', e.target.value)} className="mt-2" />
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
        </>
    );
}
