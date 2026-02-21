import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { calculateCuttingSpeed, calculateFeedRate, calculateMachiningTime, calculateMRR, calculateSurfaceRoughness, calculateWeldingHeat, calculateSolidificationTime, calculateToolLife, type CalculationInput, type CalculationOutput } from '@/lib/calculations';
import { Settings, BarChart3, Edit, Trash2, Save, Share, Printer, AlertTriangle, CheckCircle } from 'lucide-react';

export default function ManufacturingCalculator() {
    const [activeCalculator, setActiveCalculator] = useState('cutting-speed');
    const [inputs, setInputs] = useState({
        D: { value: '', unit: 'mm' },
        N: { value: '', unit: 'rpm' },
        MRR: { value: '', unit: 'cm³/min' },
        f: { value: '', unit: 'mm/rev' },
        d: { value: '', unit: 'mm' },
        V: { value: '', unit: 'm/min' },
        z: { value: '', unit: 'teeth' },
        fz: { value: '', unit: 'mm/tooth' },
        L: { value: '', unit: 'mm' },
        Vf: { value: '', unit: 'mm/min' },
        w: { value: '', unit: 'mm' },
        r: { value: '', unit: 'mm' },
        I: { value: '', unit: 'A' },
        voltage: { value: '', unit: 'V' },
        S: { value: '', unit: 'mm/min' },
        B: { value: '', unit: 's/cm²' },
        A: { value: '', unit: 'cm²' },
        volume: { value: '', unit: 'cm³' },
        C: { value: '', unit: '' },
        taylorN: { value: '', unit: '' }
    });
    const [results, setResults] = useState<CalculationOutput | null>(null);

    const calculatorTypes = [
        { id: 'cutting-speed', name: 'Cutting Speed', active: true },
        { id: 'feed-rate', name: 'Feed Rate', active: true },
        { id: 'machining-time', name: 'Machining Time', active: true },
        { id: 'mrr', name: 'MRR', active: true },
        { id: 'surface-roughness', name: 'Surface Roughness', active: true },
        { id: 'welding-heat', name: 'Welding Heat Input', active: true },
        { id: 'solidification-time', name: 'Solidification Time', active: true },
        { id: 'tool-life', name: 'Tool Life', active: true }
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

        if (activeCalculator === 'cutting-speed') {
            result = calculateCuttingSpeed(calculationInputs);
        } else if (activeCalculator === 'feed-rate') {
            result = calculateFeedRate(calculationInputs);
        } else if (activeCalculator === 'machining-time') {
            result = calculateMachiningTime(calculationInputs);
        } else if (activeCalculator === 'mrr') {
            result = calculateMRR(calculationInputs);
        } else if (activeCalculator === 'surface-roughness') {
            result = calculateSurfaceRoughness(calculationInputs);
        } else if (activeCalculator === 'welding-heat') {
            result = calculateWeldingHeat(calculationInputs);
        } else if (activeCalculator === 'solidification-time') {
            result = calculateSolidificationTime(calculationInputs);
        } else if (activeCalculator === 'tool-life') {
            result = calculateToolLife(calculationInputs);
        } else {
            result = { results: {}, steps: [], errors: ['Calculator not implemented yet'] };
        }

        setResults(result);
    };

    const clearInputs = () => {
        setInputs({
            D: { value: '', unit: 'mm' },
            N: { value: '', unit: 'rpm' },
            MRR: { value: '', unit: 'cm³/min' },
            f: { value: '', unit: 'mm/rev' },
            d: { value: '', unit: 'mm' },
            V: { value: '', unit: 'm/min' },
            z: { value: '', unit: 'teeth' },
            fz: { value: '', unit: 'mm/tooth' },
            L: { value: '', unit: 'mm' },
            Vf: { value: '', unit: 'mm/min' },
            w: { value: '', unit: 'mm' },
            r: { value: '', unit: 'mm' },
            I: { value: '', unit: 'A' },
            voltage: { value: '', unit: 'V' },
            S: { value: '', unit: 'mm/min' },
            B: { value: '', unit: 's/cm²' },
            A: { value: '', unit: 'cm²' },
            volume: { value: '', unit: 'cm³' },
            C: { value: '', unit: '' },
            taylorN: { value: '', unit: '' }
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
                            Manufacturing
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
                            {activeCalculator === 'cutting-speed' && (
                                <>
                                    <div>
                                        <Label>Diameter (D)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.D.value} onChange={(e) => handleInputChange('D', e.target.value)} />
                                            <Select value={inputs.D.unit} onValueChange={(v) => handleUnitChange('D', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="mm">mm</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>RPM (N)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.N.value} onChange={(e) => handleInputChange('N', e.target.value)} />
                                            <Select value={inputs.N.unit} onValueChange={(v) => handleUnitChange('N', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="rpm">rpm</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeCalculator === 'feed-rate' && (
                                <>
                                    <div>
                                        <Label>RPM (n)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.N.value} onChange={(e) => handleInputChange('N', e.target.value)} />
                                            <Select value={inputs.N.unit} onValueChange={(v) => handleUnitChange('N', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="rpm">rpm</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Number of Teeth (z)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.z.value} onChange={(e) => handleInputChange('z', e.target.value)} />
                                            <Select value={inputs.z.unit} onValueChange={(v) => handleUnitChange('z', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="teeth">teeth</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Feed per Tooth (fz)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.fz.value} onChange={(e) => handleInputChange('fz', e.target.value)} />
                                            <Select value={inputs.fz.unit} onValueChange={(v) => handleUnitChange('fz', v)}>
                                                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="mm/tooth">mm/tooth</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeCalculator === 'machining-time' && (
                                <>
                                    <div>
                                        <Label>Length of Cut (L)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.L.value} onChange={(e) => handleInputChange('L', e.target.value)} />
                                            <Select value={inputs.L.unit} onValueChange={(v) => handleUnitChange('L', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="mm">mm</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Feed Rate (Vf)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.Vf.value} onChange={(e) => handleInputChange('Vf', e.target.value)} />
                                            <Select value={inputs.Vf.unit} onValueChange={(v) => handleUnitChange('Vf', v)}>
                                                <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="mm/min">mm/min</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeCalculator === 'mrr' && (
                                <>
                                    <div>
                                        <Label>Depth of Cut (d)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.d.value} onChange={(e) => handleInputChange('d', e.target.value)} />
                                            <Select value={inputs.d.unit} onValueChange={(v) => handleUnitChange('d', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="mm">mm</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Width of Cut (w)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.w.value} onChange={(e) => handleInputChange('w', e.target.value)} />
                                            <Select value={inputs.w.unit} onValueChange={(v) => handleUnitChange('w', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="mm">mm</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Feed Rate (Vf)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.Vf.value} onChange={(e) => handleInputChange('Vf', e.target.value)} />
                                            <Select value={inputs.Vf.unit} onValueChange={(v) => handleUnitChange('Vf', v)}>
                                                <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="mm/min">mm/min</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeCalculator === 'surface-roughness' && (
                                <>
                                    <div>
                                        <Label>Feed per Rev (f)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.f.value} onChange={(e) => handleInputChange('f', e.target.value)} />
                                            <Select value={inputs.f.unit} onValueChange={(v) => handleUnitChange('f', v)}>
                                                <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="mm/rev">mm/rev</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Nose Radius (r)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.r.value} onChange={(e) => handleInputChange('r', e.target.value)} />
                                            <Select value={inputs.r.unit} onValueChange={(v) => handleUnitChange('r', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="mm">mm</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeCalculator === 'welding-heat' && (
                                <>
                                    <div>
                                        <Label>Voltage (V)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.voltage.value} onChange={(e) => handleInputChange('voltage', e.target.value)} />
                                            <Select value={inputs.voltage.unit} onValueChange={(v) => handleUnitChange('voltage', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="V">V</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Current (I)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.I.value} onChange={(e) => handleInputChange('I', e.target.value)} />
                                            <Select value={inputs.I.unit} onValueChange={(v) => handleUnitChange('I', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="A">A</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Travel Speed (S)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.S.value} onChange={(e) => handleInputChange('S', e.target.value)} />
                                            <Select value={inputs.S.unit} onValueChange={(v) => handleUnitChange('S', v)}>
                                                <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="mm/min">mm/min</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeCalculator === 'solidification-time' && (
                                <>
                                    <div>
                                        <Label>Mold Constant (B)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.B.value} onChange={(e) => handleInputChange('B', e.target.value)} />
                                            <Select value={inputs.B.unit} onValueChange={(v) => handleUnitChange('B', v)}>
                                                <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="s/cm²">s/cm²</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Volume (V)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.volume.value} onChange={(e) => handleInputChange('volume', e.target.value)} />
                                            <Select value={inputs.volume.unit} onValueChange={(v) => handleUnitChange('volume', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="cm³">cm³</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Surface Area (A)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.A.value} onChange={(e) => handleInputChange('A', e.target.value)} />
                                            <Select value={inputs.A.unit} onValueChange={(v) => handleUnitChange('A', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="cm²">cm²</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeCalculator === 'tool-life' && (
                                <>
                                    <div>
                                        <Label>Cutting Speed (V)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.V.value} onChange={(e) => handleInputChange('V', e.target.value)} />
                                            <Select value={inputs.V.unit} onValueChange={(v) => handleUnitChange('V', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="m/min">m/min</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Taylor Constant (C)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.C.value} onChange={(e) => handleInputChange('C', e.target.value)} />
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Taylor Exponent (n)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input type="number" value={inputs.taylorN.value} onChange={(e) => handleInputChange('taylorN', e.target.value)} />
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
