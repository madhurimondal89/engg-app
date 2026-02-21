import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { calculateHeatTransfer, calculateIdealGas, calculateThermalEfficiency, calculateCarnotEfficiency, calculateSpecificHeat, calculateHeatLoss, calculateEntropyChange, calculateWorkDone, calculateCOP, calculateBoilerEfficiency, type CalculationInput, type CalculationOutput } from '@/lib/calculations';
import { Settings, BarChart3, Edit, Trash2, Save, Share, Printer, AlertTriangle, CheckCircle } from 'lucide-react';

export default function ThermodynamicsCalculator() {
    const [activeCalculator, setActiveCalculator] = useState('heat-transfer');
    const [inputs, setInputs] = useState({
        k: { value: '', unit: '' },
        A: { value: '', unit: 'm²' },
        deltaT: { value: '', unit: 'K' },
        d: { value: '', unit: 'm' },
        P: { value: '', unit: 'Pa' },
        V: { value: '', unit: 'm³' },
        n: { value: '', unit: 'mol' },
        T: { value: '', unit: 'K' },
        W_out: { value: '', unit: 'J' },
        Q_in: { value: '', unit: 'J' },
        Tc: { value: '', unit: 'K' },
        Th: { value: '', unit: 'K' },
        m: { value: '', unit: 'kg' },
        c: { value: '', unit: 'J/kg·K' },
        U: { value: '', unit: 'W/m²·K' },
        Q: { value: '', unit: 'J' },
        deltaV: { value: '', unit: 'm³' },
        Qc: { value: '', unit: 'J' },
        Win: { value: '', unit: 'J' },
        Q_out: { value: '', unit: 'J' }
    });
    const [results, setResults] = useState<CalculationOutput | null>(null);

    const calculatorTypes = [
        { id: 'heat-transfer', name: 'Heat Transfer', active: true },
        { id: 'ideal-gas', name: 'Ideal Gas Law', active: true },
        { id: 'thermal-efficiency', name: 'Thermal Efficiency', active: true },
        { id: 'carnot-efficiency', name: 'Carnot Efficiency', active: true },
        { id: 'specific-heat', name: 'Specific Heat', active: true },
        { id: 'heat-loss', name: 'Heat Loss', active: true },
        { id: 'entropy-change', name: 'Entropy Change', active: true },
        { id: 'work-done', name: 'Work Done', active: true },
        { id: 'cop', name: 'COP Refrigerator', active: true },
        { id: 'boiler-efficiency', name: 'Boiler Efficiency', active: true }
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

        if (activeCalculator === 'heat-transfer') {
            result = calculateHeatTransfer(calculationInputs);
        } else if (activeCalculator === 'ideal-gas') {
            result = calculateIdealGas(calculationInputs);
        } else if (activeCalculator === 'thermal-efficiency') {
            result = calculateThermalEfficiency(calculationInputs);
        } else if (activeCalculator === 'carnot-efficiency') {
            result = calculateCarnotEfficiency(calculationInputs);
        } else if (activeCalculator === 'specific-heat') {
            result = calculateSpecificHeat(calculationInputs);
        } else if (activeCalculator === 'heat-loss') {
            result = calculateHeatLoss(calculationInputs);
        } else if (activeCalculator === 'entropy-change') {
            result = calculateEntropyChange(calculationInputs);
        } else if (activeCalculator === 'work-done') {
            result = calculateWorkDone(calculationInputs);
        } else if (activeCalculator === 'cop') {
            result = calculateCOP(calculationInputs);
        } else if (activeCalculator === 'boiler-efficiency') {
            result = calculateBoilerEfficiency(calculationInputs);
        } else {
            result = { results: {}, steps: [], errors: ['Calculator not implemented yet'] };
        }

        setResults(result);
    };

    const clearInputs = () => {
        setInputs({
            k: { value: '', unit: '' },
            A: { value: '', unit: 'm²' },
            deltaT: { value: '', unit: 'K' },
            d: { value: '', unit: 'm' },
            P: { value: '', unit: 'Pa' },
            V: { value: '', unit: 'm³' },
            n: { value: '', unit: 'mol' },
            T: { value: '', unit: 'K' },
            W_out: { value: '', unit: 'J' },
            Q_in: { value: '', unit: 'J' },
            Tc: { value: '', unit: 'K' },
            Th: { value: '', unit: 'K' },
            m: { value: '', unit: 'kg' },
            c: { value: '', unit: 'J/kg·K' },
            U: { value: '', unit: 'W/m²·K' },
            Q: { value: '', unit: 'J' },
            deltaV: { value: '', unit: 'm³' },
            Qc: { value: '', unit: 'J' },
            Win: { value: '', unit: 'J' },
            Q_out: { value: '', unit: 'J' }
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
                            Thermodynamics
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
                            {activeCalculator === 'heat-transfer' && (
                                <>
                                    <div>
                                        <Label>Thermal Conductivity (k)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.k.value} onChange={(e) => handleInputChange('k', e.target.value)} placeholder="W/m·K" />
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Area (A)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.A.value} onChange={(e) => handleInputChange('A', e.target.value)} />
                                            <Select value={inputs.A.unit} onValueChange={(v) => handleUnitChange('A', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="m²">m²</SelectItem><SelectItem value="cm²">cm²</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Temp Difference (ΔT)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.deltaT.value} onChange={(e) => handleInputChange('deltaT', e.target.value)} />
                                            <Select value={inputs.deltaT.unit} onValueChange={(v) => handleUnitChange('deltaT', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="K">K</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Thickness (d)</Label>
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
                            {activeCalculator === 'ideal-gas' && (
                                <>
                                    <div>
                                        <Label>Pressure (P)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.P.value} onChange={(e) => handleInputChange('P', e.target.value)} placeholder="Optional" />
                                            <Select value={inputs.P.unit} onValueChange={(v) => handleUnitChange('P', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="Pa">Pa</SelectItem><SelectItem value="kPa">kPa</SelectItem><SelectItem value="bar">bar</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Volume (V)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.V.value} onChange={(e) => handleInputChange('V', e.target.value)} placeholder="Optional" />
                                            <Select value={inputs.V.unit} onValueChange={(v) => handleUnitChange('V', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="m³">m³</SelectItem><SelectItem value="L">L</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Moles (n)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.n.value} onChange={(e) => handleInputChange('n', e.target.value)} placeholder="Optional" />
                                            <Select value={inputs.n.unit} onValueChange={(v) => handleUnitChange('n', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="mol">mol</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Temperature (T)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.T.value} onChange={(e) => handleInputChange('T', e.target.value)} placeholder="Optional" />
                                            <Select value={inputs.T.unit} onValueChange={(v) => handleUnitChange('T', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="K">K</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeCalculator === 'thermal-efficiency' && (
                                <>
                                    <div>
                                        <Label>Work Output (W_out)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.W_out.value} onChange={(e) => handleInputChange('W_out', e.target.value)} />
                                            <Select value={inputs.W_out.unit} onValueChange={(v) => handleUnitChange('W_out', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="J">J</SelectItem><SelectItem value="kJ">kJ</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Heat Input (Q_in)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.Q_in.value} onChange={(e) => handleInputChange('Q_in', e.target.value)} />
                                            <Select value={inputs.Q_in.unit} onValueChange={(v) => handleUnitChange('Q_in', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="J">J</SelectItem><SelectItem value="kJ">kJ</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeCalculator === 'carnot-efficiency' && (
                                <>
                                    <div>
                                        <Label>Cold Reservoir Temp (Tc)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.Tc.value} onChange={(e) => handleInputChange('Tc', e.target.value)} />
                                            <Select value={inputs.Tc.unit} onValueChange={(v) => handleUnitChange('Tc', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="K">K</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Hot Reservoir Temp (Th)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.Th.value} onChange={(e) => handleInputChange('Th', e.target.value)} />
                                            <Select value={inputs.Th.unit} onValueChange={(v) => handleUnitChange('Th', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="K">K</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeCalculator === 'specific-heat' && (
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
                                        <Label>Specific Heat Capacity (c)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.c.value} onChange={(e) => handleInputChange('c', e.target.value)} />
                                            <Select value={inputs.c.unit} onValueChange={(v) => handleUnitChange('c', v)}>
                                                <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="J/kg·K">J/kg·K</SelectItem><SelectItem value="kJ/kg·K">kJ/kg·K</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Temp Change (ΔT)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.deltaT.value} onChange={(e) => handleInputChange('deltaT', e.target.value)} />
                                            <Select value={inputs.deltaT.unit} onValueChange={(v) => handleUnitChange('deltaT', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="K">K</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeCalculator === 'heat-loss' && (
                                <>
                                    <div>
                                        <Label>Overall Heat Transfer Coeff (U)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.U.value} onChange={(e) => handleInputChange('U', e.target.value)} />
                                            <Select value={inputs.U.unit} onValueChange={(v) => handleUnitChange('U', v)}>
                                                <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="W/m²·K">W/m²·K</SelectItem></SelectContent>
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
                                    <div>
                                        <Label>Temp Difference (ΔT)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.deltaT.value} onChange={(e) => handleInputChange('deltaT', e.target.value)} />
                                            <Select value={inputs.deltaT.unit} onValueChange={(v) => handleUnitChange('deltaT', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="K">K</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeCalculator === 'entropy-change' && (
                                <>
                                    <div>
                                        <Label>Heat Exchange (Q)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.Q.value} onChange={(e) => handleInputChange('Q', e.target.value)} />
                                            <Select value={inputs.Q.unit} onValueChange={(v) => handleUnitChange('Q', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="J">J</SelectItem><SelectItem value="kJ">kJ</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Temperature (T)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.T.value} onChange={(e) => handleInputChange('T', e.target.value)} />
                                            <Select value={inputs.T.unit} onValueChange={(v) => handleUnitChange('T', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="K">K</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeCalculator === 'work-done' && (
                                <>
                                    <div>
                                        <Label>Pressure (P)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.P.value} onChange={(e) => handleInputChange('P', e.target.value)} />
                                            <Select value={inputs.P.unit} onValueChange={(v) => handleUnitChange('P', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="Pa">Pa</SelectItem><SelectItem value="kPa">kPa</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Volume Change (ΔV)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.deltaV.value} onChange={(e) => handleInputChange('deltaV', e.target.value)} />
                                            <Select value={inputs.deltaV.unit} onValueChange={(v) => handleUnitChange('deltaV', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="m³">m³</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeCalculator === 'cop' && (
                                <>
                                    <div>
                                        <Label>Heat Removed (Qc)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.Qc.value} onChange={(e) => handleInputChange('Qc', e.target.value)} />
                                            <Select value={inputs.Qc.unit} onValueChange={(v) => handleUnitChange('Qc', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="J">J</SelectItem><SelectItem value="kJ">kJ</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Work Input (Win)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.Win.value} onChange={(e) => handleInputChange('Win', e.target.value)} />
                                            <Select value={inputs.Win.unit} onValueChange={(v) => handleUnitChange('Win', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="J">J</SelectItem><SelectItem value="kJ">kJ</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeCalculator === 'boiler-efficiency' && (
                                <>
                                    <div>
                                        <Label>Heat Output (Q_out)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.Q_out.value} onChange={(e) => handleInputChange('Q_out', e.target.value)} />
                                            <Select value={inputs.Q_out.unit} onValueChange={(v) => handleUnitChange('Q_out', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="J">J</SelectItem><SelectItem value="kJ">kJ</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Heat Input (Q_in)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.Q_in.value} onChange={(e) => handleInputChange('Q_in', e.target.value)} />
                                            <Select value={inputs.Q_in.unit} onValueChange={(v) => handleUnitChange('Q_in', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="J">J</SelectItem><SelectItem value="kJ">kJ</SelectItem></SelectContent>
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
        </>
    );
}
