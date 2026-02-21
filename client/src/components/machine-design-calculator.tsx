import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { calculateBoltTorque, calculateShaftDiameter, calculateGearRatio, calculateGearSpeed, calculateBeltLength, calculateBeltTension, calculateChainLength, calculateSpringConstant, calculateBearingLife, calculateFlywheelEnergy, type CalculationInput, type CalculationOutput } from '@/lib/calculations';
import { Settings, BarChart3, Edit, Trash2, Save, Share, Printer, AlertTriangle, CheckCircle } from 'lucide-react';

export default function MachineDesignCalculator() {
    const [activeCalculator, setActiveCalculator] = useState('bolt-torque');
    const [inputs, setInputs] = useState({
        K: { value: '', unit: '' },
        F: { value: '', unit: 'N' },
        d: { value: '', unit: 'mm' },
        N_out: { value: '', unit: '' },
        N_in: { value: '', unit: '' },
        T: { value: '', unit: 'N⋅m' },
        tau: { value: '', unit: 'Pa' },
        omega_in: { value: '', unit: 'rpm' },
        GR: { value: '', unit: '' },
        C: { value: '', unit: 'm' },
        D: { value: '', unit: 'm' },
        T2: { value: '', unit: 'N' },
        mu: { value: '', unit: '' },
        theta: { value: '', unit: 'rad' },
        N: { value: '', unit: '' },
        n: { value: '', unit: '' },
        G: { value: '', unit: 'Pa' },
        P: { value: '', unit: 'N' },
        p: { value: '', unit: '' },
        I: { value: '', unit: 'kg·m²' },
        omega: { value: '', unit: 'rad/s' },
        c: { value: '', unit: 'N' } // Dynamic Load Rating C (lowercase c to avoid conflict with Center Distance C)
    });
    const [results, setResults] = useState<CalculationOutput | null>(null);

    const calculatorTypes = [
        { id: 'bolt-torque', name: 'Bolt Torque', active: true },
        { id: 'shaft-diameter', name: 'Shaft Diameter', active: true },
        { id: 'gear-ratio', name: 'Gear Ratio', active: true },
        { id: 'gear-speed', name: 'Gear Speed', active: true },
        { id: 'belt-length', name: 'Belt Length', active: true },
        { id: 'belt-tension', name: 'Belt Tension', active: true },
        { id: 'chain-length', name: 'Chain Length', active: true },
        { id: 'spring-constant', name: 'Spring Constant', active: true },
        { id: 'bearing-life', name: 'Bearing Life', active: true },
        { id: 'flywheel-energy', name: 'Flywheel Energy', active: true }
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
                // Special handling for bearing calculation where 'c' maps to 'C' in calculation function
                const calcKey = key === 'c' ? 'C' : key;
                calculationInputs[calcKey] = {
                    value: parseFloat(input.value),
                    unit: input.unit
                };
            }
        });

        let result: CalculationOutput;

        if (activeCalculator === 'bolt-torque') {
            result = calculateBoltTorque(calculationInputs);
        } else if (activeCalculator === 'shaft-diameter') {
            result = calculateShaftDiameter(calculationInputs);
        } else if (activeCalculator === 'gear-ratio') {
            result = calculateGearRatio(calculationInputs);
        } else if (activeCalculator === 'gear-speed') {
            result = calculateGearSpeed(calculationInputs);
        } else if (activeCalculator === 'belt-length') {
            result = calculateBeltLength(calculationInputs);
        } else if (activeCalculator === 'belt-tension') {
            result = calculateBeltTension(calculationInputs);
        } else if (activeCalculator === 'chain-length') {
            result = calculateChainLength(calculationInputs);
        } else if (activeCalculator === 'spring-constant') {
            result = calculateSpringConstant(calculationInputs);
        } else if (activeCalculator === 'bearing-life') {
            result = calculateBearingLife(calculationInputs);
        } else if (activeCalculator === 'flywheel-energy') {
            result = calculateFlywheelEnergy(calculationInputs);
        } else {
            result = { results: {}, steps: [], errors: ['Calculator not implemented yet'] };
        }

        setResults(result);
    };

    const clearInputs = () => {
        setInputs({
            K: { value: '', unit: '' },
            F: { value: '', unit: 'N' },
            d: { value: '', unit: 'mm' },
            N_out: { value: '', unit: '' },
            N_in: { value: '', unit: '' },
            T: { value: '', unit: 'N⋅m' },
            tau: { value: '', unit: 'Pa' },
            omega_in: { value: '', unit: 'rpm' },
            GR: { value: '', unit: '' },
            C: { value: '', unit: 'm' },
            D: { value: '', unit: 'm' },
            T2: { value: '', unit: 'N' },
            mu: { value: '', unit: '' },
            theta: { value: '', unit: 'rad' },
            N: { value: '', unit: '' },
            n: { value: '', unit: '' },
            G: { value: '', unit: 'Pa' },
            P: { value: '', unit: 'N' },
            p: { value: '', unit: '' },
            I: { value: '', unit: 'kg·m²' },
            omega: { value: '', unit: 'rad/s' },
            c: { value: '', unit: 'N' }
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
                            Machine Design
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
                            {activeCalculator === 'bolt-torque' && (
                                <>
                                    <div>
                                        <Label>Nut Factor (K)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.K.value} onChange={(e) => handleInputChange('K', e.target.value)} placeholder="e.g., 0.2" />
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Preload Force (F)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.F.value} onChange={(e) => handleInputChange('F', e.target.value)} />
                                            <Select value={inputs.F.unit} onValueChange={(v) => handleUnitChange('F', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="N">N</SelectItem><SelectItem value="kN">kN</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Bolt Diameter (d)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.d.value} onChange={(e) => handleInputChange('d', e.target.value)} />
                                            <Select value={inputs.d.unit} onValueChange={(v) => handleUnitChange('d', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="mm">mm</SelectItem><SelectItem value="m">m</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeCalculator === 'gear-ratio' && (
                                <>
                                    <div>
                                        <Label>Output Teeth (N_out)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.N_out.value} onChange={(e) => handleInputChange('N_out', e.target.value)} />
                                        </div>
                                    </div>

                                    <div>
                                        <Label>Input Teeth (N_in)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.N_in.value} onChange={(e) => handleInputChange('N_in', e.target.value)} />
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeCalculator === 'shaft-diameter' && (
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
                                        <Label>Shear Stress (τ)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.tau.value} onChange={(e) => handleInputChange('tau', e.target.value)} />
                                            <Select value={inputs.tau.unit} onValueChange={(v) => handleUnitChange('tau', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="Pa">Pa</SelectItem><SelectItem value="MPa">MPa</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeCalculator === 'gear-speed' && (
                                <>
                                    <div>
                                        <Label>Input Speed (ω_in)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.omega_in.value} onChange={(e) => handleInputChange('omega_in', e.target.value)} />
                                            <Select value={inputs.omega_in.unit} onValueChange={(v) => handleUnitChange('omega_in', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="rpm">rpm</SelectItem><SelectItem value="rad/s">rad/s</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Gear Ratio (GR)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.GR.value} onChange={(e) => handleInputChange('GR', e.target.value)} />
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeCalculator === 'belt-length' && (
                                <>
                                    <div>
                                        <Label>Center Distance (C)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.C.value} onChange={(e) => handleInputChange('C', e.target.value)} />
                                            <Select value={inputs.C.unit} onValueChange={(v) => handleUnitChange('C', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="m">m</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Large Diameter (D)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.D.value} onChange={(e) => handleInputChange('D', e.target.value)} />
                                            <Select value={inputs.D.unit} onValueChange={(v) => handleUnitChange('D', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="m">m</SelectItem><SelectItem value="mm">mm</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Small Diameter (d)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.d.value} onChange={(e) => handleInputChange('d', e.target.value)} />
                                            <Select value={inputs.d.unit} onValueChange={(v) => handleUnitChange('d', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="m">m</SelectItem><SelectItem value="mm">mm</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeCalculator === 'belt-tension' && (
                                <>
                                    <div>
                                        <Label>Slack Side Tension (T2)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.T2.value} onChange={(e) => handleInputChange('T2', e.target.value)} />
                                            <Select value={inputs.T2.unit} onValueChange={(v) => handleUnitChange('T2', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="N">N</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Friction Coefficient (μ)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.mu.value} onChange={(e) => handleInputChange('mu', e.target.value)} step="0.01" />
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Wrap Angle (θ)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.theta.value} onChange={(e) => handleInputChange('theta', e.target.value)} />
                                            <Select value={inputs.theta.unit} onValueChange={(v) => handleUnitChange('theta', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="rad">rad</SelectItem><SelectItem value="deg">deg</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeCalculator === 'chain-length' && (
                                <>
                                    <div>
                                        <Label>Center Distance (C)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.C.value} onChange={(e) => handleInputChange('C', e.target.value)} placeholder="in pitches" />
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Large Sprocket (N)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.N.value} onChange={(e) => handleInputChange('N', e.target.value)} />
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Small Sprocket (n)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.n.value} onChange={(e) => handleInputChange('n', e.target.value)} />
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeCalculator === 'spring-constant' && (
                                <>
                                    <div>
                                        <Label>Shear Modulus (G)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.G.value} onChange={(e) => handleInputChange('G', e.target.value)} />
                                            <Select value={inputs.G.unit} onValueChange={(v) => handleUnitChange('G', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="Pa">Pa</SelectItem><SelectItem value="GPa">GPa</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Wire Diameter (d)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.d.value} onChange={(e) => handleInputChange('d', e.target.value)} />
                                            <Select value={inputs.d.unit} onValueChange={(v) => handleUnitChange('d', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="mm">mm</SelectItem><SelectItem value="m">m</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Mean Coil Diameter (D)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.D.value} onChange={(e) => handleInputChange('D', e.target.value)} />
                                            <Select value={inputs.D.unit} onValueChange={(v) => handleUnitChange('D', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="mm">mm</SelectItem><SelectItem value="m">m</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Active Coils (N)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.N.value} onChange={(e) => handleInputChange('N', e.target.value)} />
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeCalculator === 'bearing-life' && (
                                <>
                                    <div>
                                        <Label>Dynamic Load Rating (C)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.c.value} onChange={(e) => handleInputChange('c', e.target.value)} />
                                            <Select value={inputs.c.unit} onValueChange={(v) => handleUnitChange('c', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="N">N</SelectItem><SelectItem value="kN">kN</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Equivalent Dynamic Load (P)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.P.value} onChange={(e) => handleInputChange('P', e.target.value)} />
                                            <Select value={inputs.P.unit} onValueChange={(v) => handleUnitChange('P', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="N">N</SelectItem><SelectItem value="kN">kN</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Exponent (p)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.p.value} onChange={(e) => handleInputChange('p', e.target.value)} placeholder="3 for Ball, 10/3 for Roller" />
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeCalculator === 'flywheel-energy' && (
                                <>
                                    <div>
                                        <Label>Moment of Inertia (I)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.I.value} onChange={(e) => handleInputChange('I', e.target.value)} />
                                            <Select value={inputs.I.unit} onValueChange={(v) => handleUnitChange('I', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="kg·m²">kg·m²</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Angular Velocity (ω)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.omega.value} onChange={(e) => handleInputChange('omega', e.target.value)} />
                                            <Select value={inputs.omega.unit} onValueChange={(v) => handleUnitChange('omega', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="rad/s">rad/s</SelectItem><SelectItem value="rpm">rpm</SelectItem></SelectContent>
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
            </div >
        </>
    );
}
