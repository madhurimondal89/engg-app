import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { calculateStress, calculateStrain, calculateYoungsModulus, calculateShearStress, calculateShearStrain, calculateBendingStress, calculateBendingMoment, calculateTorsionalStress, calculateBeamDeflection, calculateFOS, type CalculationInput, type CalculationOutput } from '@/lib/calculations';
import { Settings, BarChart3, Edit, Trash2, Save, Share, Printer, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';
import { CalculatorDescription } from './calculator-description';

export default function StrengthCalculator() {
    const [activeCalculator, setActiveCalculator] = useState('stress');
    const [inputs, setInputs] = useState({
        force: { value: '', unit: 'N' },
        area: { value: '', unit: 'm²' },
        deltaL: { value: '', unit: 'm' },
        L: { value: '', unit: 'm' },
        stress: { value: '', unit: 'Pa' },
        strain: { value: '', unit: '' },
        V: { value: '', unit: 'N' },
        delta: { value: '', unit: 'm' },
        M: { value: '', unit: 'N⋅m' },
        y: { value: '', unit: 'm' },
        I: { value: '', unit: 'm⁴' },
        F: { value: '', unit: 'N' },
        T: { value: '', unit: 'N⋅m' },
        r: { value: '', unit: 'm' },
        J: { value: '', unit: 'm⁴' },
        E: { value: '', unit: 'Pa' },
        sigma_fail: { value: '', unit: 'Pa' },
        sigma_allow: { value: '', unit: 'Pa' }
    });
    const [results, setResults] = useState<CalculationOutput | null>(null);

    const calculatorTypes = [
        { id: 'stress', name: 'Normal Stress', active: true },
        { id: 'strain', name: 'Normal Strain', active: true },
        { id: 'youngs-modulus', name: "Young's Modulus", active: true },
        { id: 'shear-stress', name: 'Shear Stress', active: true },
        { id: 'shear-strain', name: 'Shear Strain', active: true },
        { id: 'bending-stress', name: 'Bending Stress', active: true },
        { id: 'bending-moment', name: 'Bending Moment', active: true },
        { id: 'torsional-stress', name: 'Torsional Stress', active: true },
        { id: 'beam-deflection', name: 'Beam Deflection', active: true },
        { id: 'fos', name: 'Factor of Safety', active: true }
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

        if (activeCalculator === 'stress') {
            result = calculateStress(calculationInputs);
        } else if (activeCalculator === 'strain') {
            result = calculateStrain(calculationInputs);
        } else if (activeCalculator === 'youngs-modulus') {
            result = calculateYoungsModulus(calculationInputs);
        } else if (activeCalculator === 'shear-stress') {
            result = calculateShearStress(calculationInputs);
        } else if (activeCalculator === 'shear-strain') {
            result = calculateShearStrain(calculationInputs);
        } else if (activeCalculator === 'bending-stress') {
            result = calculateBendingStress(calculationInputs);
        } else if (activeCalculator === 'bending-moment') {
            result = calculateBendingMoment(calculationInputs);
        } else if (activeCalculator === 'torsional-stress') {
            result = calculateTorsionalStress(calculationInputs);
        } else if (activeCalculator === 'beam-deflection') {
            result = calculateBeamDeflection(calculationInputs);
        } else if (activeCalculator === 'fos') {
            result = calculateFOS(calculationInputs);
        } else {
            result = { results: {}, steps: [], errors: ['Calculator not implemented yet'] };
        }

        setResults(result);
    };

    const clearInputs = () => {
        setInputs({
            force: { value: '', unit: 'N' },
            area: { value: '', unit: 'm²' },
            deltaL: { value: '', unit: 'm' },
            L: { value: '', unit: 'm' },
            stress: { value: '', unit: 'Pa' },
            strain: { value: '', unit: '' },
            V: { value: '', unit: 'N' },
            delta: { value: '', unit: 'm' },
            M: { value: '', unit: 'N⋅m' },
            y: { value: '', unit: 'm' },
            I: { value: '', unit: 'm⁴' },
            F: { value: '', unit: 'N' },
            T: { value: '', unit: 'N⋅m' },
            r: { value: '', unit: 'm' },
            J: { value: '', unit: 'm⁴' },
            E: { value: '', unit: 'Pa' },
            sigma_fail: { value: '', unit: 'Pa' },
            sigma_allow: { value: '', unit: 'Pa' }
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
                            Strength of Materials
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
                        <Button variant="outline" size="sm" onClick={() => window.open('/calculators/stress-strain.html', '_blank')} className="border-eng-blue text-eng-blue">
                            <ExternalLink className="h-4 w-4 mr-2" /> Advance Stress & Strain
                        </Button>
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
                            {activeCalculator === 'stress' && (
                                <>
                                    <div>
                                        <Label>Force (F)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.force.value} onChange={(e) => handleInputChange('force', e.target.value)} />
                                            <Select value={inputs.force.unit} onValueChange={(v) => handleUnitChange('force', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="N">N</SelectItem><SelectItem value="kN">kN</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Area (A)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.area.value} onChange={(e) => handleInputChange('area', e.target.value)} />
                                            <Select value={inputs.area.unit} onValueChange={(v) => handleUnitChange('area', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="m²">m²</SelectItem><SelectItem value="mm²">mm²</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeCalculator === 'strain' && (
                                <>
                                    <div>
                                        <Label>Change in Length (ΔL)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.deltaL.value} onChange={(e) => handleInputChange('deltaL', e.target.value)} />
                                            <Select value={inputs.deltaL.unit} onValueChange={(v) => handleUnitChange('deltaL', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="m">m</SelectItem><SelectItem value="mm">mm</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Original Length (L)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.L.value} onChange={(e) => handleInputChange('L', e.target.value)} />
                                            <Select value={inputs.L.unit} onValueChange={(v) => handleUnitChange('L', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="m">m</SelectItem><SelectItem value="mm">mm</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeCalculator === 'youngs-modulus' && (
                                <>
                                    <div>
                                        <Label>Stress (σ)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.stress.value} onChange={(e) => handleInputChange('stress', e.target.value)} />
                                            <Select value={inputs.stress.unit} onValueChange={(v) => handleUnitChange('stress', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="Pa">Pa</SelectItem><SelectItem value="MPa">MPa</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Strain (ε)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.strain.value} onChange={(e) => handleInputChange('strain', e.target.value)} />
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeCalculator === 'shear-stress' && (
                                <>
                                    <div>
                                        <Label>Shear Force (V)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.V.value} onChange={(e) => handleInputChange('V', e.target.value)} />
                                            <Select value={inputs.V.unit} onValueChange={(v) => handleUnitChange('V', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="N">N</SelectItem><SelectItem value="kN">kN</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Area (A)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.area.value} onChange={(e) => handleInputChange('area', e.target.value)} />
                                            <Select value={inputs.area.unit} onValueChange={(v) => handleUnitChange('area', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="m²">m²</SelectItem><SelectItem value="mm²">mm²</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeCalculator === 'shear-strain' && (
                                <>
                                    <div>
                                        <Label>Deformation (δ)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.delta.value} onChange={(e) => handleInputChange('delta', e.target.value)} />
                                            <Select value={inputs.delta.unit} onValueChange={(v) => handleUnitChange('delta', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="m">m</SelectItem><SelectItem value="mm">mm</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Length (L)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.L.value} onChange={(e) => handleInputChange('L', e.target.value)} />
                                            <Select value={inputs.L.unit} onValueChange={(v) => handleUnitChange('L', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="m">m</SelectItem><SelectItem value="mm">mm</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeCalculator === 'bending-stress' && (
                                <>
                                    <div>
                                        <Label>Bending Moment (M)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.M.value} onChange={(e) => handleInputChange('M', e.target.value)} />
                                            <Select value={inputs.M.unit} onValueChange={(v) => handleUnitChange('M', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="N⋅m">N⋅m</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Distance from Neutral Axis (y)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.y.value} onChange={(e) => handleInputChange('y', e.target.value)} />
                                            <Select value={inputs.y.unit} onValueChange={(v) => handleUnitChange('y', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="m">m</SelectItem><SelectItem value="mm">mm</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Moment of Inertia (I)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.I.value} onChange={(e) => handleInputChange('I', e.target.value)} />
                                            <Select value={inputs.I.unit} onValueChange={(v) => handleUnitChange('I', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="m⁴">m⁴</SelectItem><SelectItem value="mm⁴">mm⁴</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeCalculator === 'bending-moment' && (
                                <>
                                    <div>
                                        <Label>Force (F)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.F.value} onChange={(e) => handleInputChange('F', e.target.value)} />
                                            <Select value={inputs.F.unit} onValueChange={(v) => handleUnitChange('F', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="N">N</SelectItem><SelectItem value="kN">kN</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Length (L)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.L.value} onChange={(e) => handleInputChange('L', e.target.value)} />
                                            <Select value={inputs.L.unit} onValueChange={(v) => handleUnitChange('L', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="m">m</SelectItem><SelectItem value="mm">mm</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeCalculator === 'torsional-stress' && (
                                <>
                                    <div>
                                        <Label>Torque (T)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.T.value} onChange={(e) => handleInputChange('T', e.target.value)} />
                                            <Select value={inputs.T.unit} onValueChange={(v) => handleUnitChange('T', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="N⋅m">N⋅m</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Radius (r)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.r.value} onChange={(e) => handleInputChange('r', e.target.value)} />
                                            <Select value={inputs.r.unit} onValueChange={(v) => handleUnitChange('r', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="m">m</SelectItem><SelectItem value="mm">mm</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Polar Moment of Inertia (J)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.J.value} onChange={(e) => handleInputChange('J', e.target.value)} />
                                            <Select value={inputs.J.unit} onValueChange={(v) => handleUnitChange('J', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="m⁴">m⁴</SelectItem><SelectItem value="mm⁴">mm⁴</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeCalculator === 'beam-deflection' && (
                                <>
                                    <div>
                                        <Label>Force (F)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.F.value} onChange={(e) => handleInputChange('F', e.target.value)} />
                                            <Select value={inputs.F.unit} onValueChange={(v) => handleUnitChange('F', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="N">N</SelectItem><SelectItem value="kN">kN</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Length (L)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.L.value} onChange={(e) => handleInputChange('L', e.target.value)} />
                                            <Select value={inputs.L.unit} onValueChange={(v) => handleUnitChange('L', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="m">m</SelectItem><SelectItem value="mm">mm</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Modulus of Elasticity (E)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.E.value} onChange={(e) => handleInputChange('E', e.target.value)} />
                                            <Select value={inputs.E.unit} onValueChange={(v) => handleUnitChange('E', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="Pa">Pa</SelectItem><SelectItem value="GPa">GPa</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Moment of Inertia (I)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.I.value} onChange={(e) => handleInputChange('I', e.target.value)} />
                                            <Select value={inputs.I.unit} onValueChange={(v) => handleUnitChange('I', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="m⁴">m⁴</SelectItem><SelectItem value="mm⁴">mm⁴</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeCalculator === 'fos' && (
                                <>
                                    <div>
                                        <Label>Failure Stress (σ_fail)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.sigma_fail.value} onChange={(e) => handleInputChange('sigma_fail', e.target.value)} />
                                            <Select value={inputs.sigma_fail.unit} onValueChange={(v) => handleUnitChange('sigma_fail', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="Pa">Pa</SelectItem><SelectItem value="MPa">MPa</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Allowable Stress (σ_allow)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.sigma_allow.value} onChange={(e) => handleInputChange('sigma_allow', e.target.value)} />
                                            <Select value={inputs.sigma_allow.unit} onValueChange={(v) => handleUnitChange('sigma_allow', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="Pa">Pa</SelectItem><SelectItem value="MPa">MPa</SelectItem></SelectContent>
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
            <CalculatorDescription activeCalculator={activeCalculator} />
        </>
    );
}
