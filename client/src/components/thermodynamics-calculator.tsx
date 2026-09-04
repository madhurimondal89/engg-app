import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { calculateHeatTransfer, calculateIdealGas, calculateThermalEfficiency, calculateCarnotEfficiency, calculateSpecificHeat, calculateHeatLoss, calculateEntropyChange, calculateWorkDone, calculateCOP, calculateBoilerEfficiency, calculateSteamTables, calculateHVACDuctSizing, calculatePsychrometrics, type CalculationInput, type CalculationOutput } from '@/lib/calculations';
import { Settings, BarChart3, Edit, Trash2, Save, Share, Printer, AlertTriangle, CheckCircle, BookOpen } from 'lucide-react';
import { getHowToUse, getEngineeringExplanation, getPracticalApplications, getFAQs } from '@/lib/calculator-content';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

export default function ThermodynamicsCalculator({ initialCalc }: { initialCalc?: string }) {
    const [activeCalculator, setActiveCalculator] = useState(() => {
        if (initialCalc) return initialCalc;
        return 'heat-transfer';
    });

    React.useEffect(() => {
        if (initialCalc && initialCalc !== activeCalculator) {
            setActiveCalculator(initialCalc);
        }
    }, [initialCalc]);

    React.useEffect(() => {
        const slug = activeCalculator ? `/${activeCalculator}` : '';
        const newPath = `/calculators/thermodynamics${slug}`;
        if (window.location.pathname !== newPath) {
            window.history.replaceState(null, '', newPath);
        }
    }, [activeCalculator]);
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
        Q_out: { value: '', unit: 'J' },
        steam_pressure: { value: '10', unit: 'bar' },
        steam_temp: { value: '180', unit: '°C' },
        steam_quality: { value: '1.0', unit: 'ratio' },
        dry_bulb_T: { value: '28', unit: '°C' },
        rel_humidity_RH: { value: '60', unit: '%' },
        airflow_Q: { value: '1.2', unit: 'm³/s' },
        velocity_V: { value: '6.0', unit: 'm/s' },
        aspect_ratio: { value: '1.5', unit: 'ratio' }
    });
    const [results, setResults] = useState<CalculationOutput | null>(null);

    const calculatorTypes = [
        { id: 'heat-transfer', name: 'Heat Transfer', active: true },
        { id: 'steam-tables', name: 'Steam & Fluid Tables', active: true },
        { id: 'psychrometrics', name: 'Psychrometrics (Moist Air)', active: true },
        { id: 'duct-sizing', name: 'HVAC Duct Sizing', active: true },
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

        if (activeCalculator === 'steam-tables') {
            result = calculateSteamTables({
                pressure: calculationInputs.steam_pressure,
                temperature: calculationInputs.steam_temp,
                quality: calculationInputs.steam_quality
            });
        } else if (activeCalculator === 'psychrometrics') {
            result = calculatePsychrometrics({
                dry_bulb_T: calculationInputs.dry_bulb_T,
                rel_humidity_RH: calculationInputs.rel_humidity_RH
            });
        } else if (activeCalculator === 'duct-sizing') {
            result = calculateHVACDuctSizing({
                airflow_Q: calculationInputs.airflow_Q,
                velocity_V: calculationInputs.velocity_V,
                aspect_ratio: calculationInputs.aspect_ratio
            });
        } else if (activeCalculator === 'heat-transfer') {
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

    const getFormulaInfo = () => {
        if (activeCalculator === 'steam-tables') {
            return {
                name: 'Steam & Fluid Thermodynamic Tables',
                formula: 'T_sat = f(P), h = h_f + x·h_fg, s = s_f + x·s_fg, v = v_f + x·v_fg',
                description: 'Calculates saturation temperature, latent heat of vaporization, enthalpy, entropy, and specific volume based on IAPWS-IF97 steam formulations.'
            };
        } else if (activeCalculator === 'psychrometrics') {
            return {
                name: 'Psychrometrics (Moist Air Properties)',
                formula: 'Pws = 0.61078·e^(17.27T/(T+237.3)), W = 0.622·Pw/(P-Pw), h = 1.006T + W·(2501 + 1.86T)',
                description: 'Computes moist air thermodynamic state, enthalpy, humidity ratio, dew point, wet bulb, and specific volume for HVAC systems.'
            };
        } else if (activeCalculator === 'duct-sizing') {
            return {
                name: 'HVAC Air Duct Sizing (Equal Friction)',
                formula: 'A = Q / V, D = √(4A/π), H = √(A/AR), W = AR·H, Pv = 0.5·ρ·V²',
                description: 'Sizes circular round duct diameters and equivalent aspect-ratio rectangular HVAC supply and return air duct dimensions.'
            };
        } else if (activeCalculator === 'ideal-gas') {
            return {
                name: 'Ideal Gas Law',
                formula: 'PV = nRT',
                description: 'Relates pressure (P), volume (V), temperature (T), and number of moles (n) of an ideal gas.'
            };
        } else if (activeCalculator === 'heat-transfer') {
            return {
                name: 'Heat Transfer (Conduction)',
                formula: 'Q = k × A × (ΔT) / d',
                description: 'Calculates heat transfer rate (Q) through a material of thickness (d) and area (A).'
            };
        }
        return {
            name: activeCalculator.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase()),
            formula: 'Formula specific to thermodynamic principles',
            description: 'Refer to thermodynamics literature for detailed formulas on ' + activeCalculator.replace('-', ' ')
        };
    };

    const formulaInfo = getFormulaInfo();

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
            Q_out: { value: '', unit: 'J' },
            steam_pressure: { value: '10', unit: 'bar' },
            steam_temp: { value: '180', unit: '°C' },
            steam_quality: { value: '1.0', unit: 'ratio' },
            dry_bulb_T: { value: '28', unit: '°C' },
            rel_humidity_RH: { value: '60', unit: '%' },
            airflow_Q: { value: '1.2', unit: 'm³/s' },
            velocity_V: { value: '6.0', unit: 'm/s' },
            aspect_ratio: { value: '1.5', unit: 'ratio' }
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
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold text-charcoal flex items-center">
                                <Edit className="h-5 w-5 text-eng-blue mr-2" />
                                Input Parameters
                            </CardTitle>
                            {(activeCalculator === 'psychrometrics' || activeCalculator === 'duct-sizing') && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        const savedTemp = localStorage.getItem('live_ambient_temp') || '28';
                                        const savedRH = localStorage.getItem('live_ambient_humidity') || '60';
                                        setInputs(prev => ({
                                            ...prev,
                                            dry_bulb_T: { value: savedTemp, unit: '°C' },
                                            rel_humidity_RH: { value: savedRH, unit: '%' }
                                        }));
                                    }}
                                    className="text-xs h-8 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border-cyan-300 hover:bg-cyan-100"
                                >
                                    🌤️ Autofill Live Ambient ({localStorage.getItem('live_ambient_temp') || '28'}°C, {localStorage.getItem('live_ambient_humidity') || '60'}% RH)
                                </Button>
                            )}
                        </div>
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
                            {activeCalculator === 'steam-tables' && (
                                <>
                                    <div>
                                        <Label>Steam / Liquid Pressure (P)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input
                                                type="number"
                                                value={inputs.steam_pressure.value}
                                                onChange={(e) => handleInputChange('steam_pressure', e.target.value)}
                                                placeholder="e.g. 10 bar (1.0 MPa)"
                                            />
                                            <Select value={inputs.steam_pressure.unit} onValueChange={(v) => handleUnitChange('steam_pressure', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="bar">bar</SelectItem>
                                                    <SelectItem value="kPa">kPa</SelectItem>
                                                    <SelectItem value="MPa">MPa</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Temperature (T) [Optional if Saturated]</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input
                                                type="number"
                                                value={inputs.steam_temp.value}
                                                onChange={(e) => handleInputChange('steam_temp', e.target.value)}
                                                placeholder="e.g. 180"
                                            />
                                            <Select value={inputs.steam_temp.unit} onValueChange={(v) => handleUnitChange('steam_temp', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="°C">°C</SelectItem>
                                                    <SelectItem value="K">K</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Dryness Fraction / Steam Quality (x: 0 = Liquid, 1 = Vapor)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input
                                                type="number"
                                                step="0.05"
                                                min="0"
                                                max="1"
                                                value={inputs.steam_quality.value}
                                                onChange={(e) => handleInputChange('steam_quality', e.target.value)}
                                                placeholder="1.0"
                                            />
                                        </div>
                                        <p className="text-[11px] text-slate-500 mt-1">x=0 for Saturated Liquid, x=1 for Saturated Vapor, 0 &lt; x &lt; 1 for Wet Steam Mixture</p>
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
                            {activeCalculator === 'psychrometrics' && (
                                <>
                                    <div>
                                        <Label>Dry Bulb Temperature (T_db)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input
                                                type="number"
                                                value={inputs.dry_bulb_T.value}
                                                onChange={(e) => handleInputChange('dry_bulb_T', e.target.value)}
                                                placeholder="e.g. 28"
                                            />
                                            <Select value={inputs.dry_bulb_T.unit} onValueChange={(v) => handleUnitChange('dry_bulb_T', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="°C">°C</SelectItem>
                                                    <SelectItem value="K">K</SelectItem>
                                                    <SelectItem value="°F">°F</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Relative Humidity (RH %)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={inputs.rel_humidity_RH.value}
                                                onChange={(e) => handleInputChange('rel_humidity_RH', e.target.value)}
                                                placeholder="e.g. 60"
                                            />
                                            <Select value={inputs.rel_humidity_RH.unit} onValueChange={(v) => handleUnitChange('rel_humidity_RH', v)}>
                                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="%">%</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <p className="text-[11px] text-slate-500 mt-1">Percentage of water vapor saturation in atmospheric air (0% to 100%)</p>
                                    </div>
                                </>
                            )}
                            {activeCalculator === 'duct-sizing' && (
                                <>
                                    <div>
                                        <Label>Volumetric Airflow (Q)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input
                                                type="number"
                                                value={inputs.airflow_Q.value}
                                                onChange={(e) => handleInputChange('airflow_Q', e.target.value)}
                                                placeholder="e.g. 1.2"
                                            />
                                            <Select value={inputs.airflow_Q.unit} onValueChange={(v) => handleUnitChange('airflow_Q', v)}>
                                                <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="m³/s">m³/s</SelectItem>
                                                    <SelectItem value="CFM">CFM</SelectItem>
                                                    <SelectItem value="m³/h">m³/h</SelectItem>
                                                    <SelectItem value="L/s">L/s</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Target Air Velocity (V)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input
                                                type="number"
                                                value={inputs.velocity_V.value}
                                                onChange={(e) => handleInputChange('velocity_V', e.target.value)}
                                                placeholder="e.g. 6.0"
                                            />
                                            <Select value={inputs.velocity_V.unit} onValueChange={(v) => handleUnitChange('velocity_V', v)}>
                                                <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="m/s">m/s</SelectItem>
                                                    <SelectItem value="FPM">FPM</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <p className="text-[11px] text-slate-500 mt-1">Typical main ducts: 5–8 m/s (1000–1600 FPM); Branch ducts: 3–5 m/s (600–1000 FPM)</p>
                                    </div>
                                    <div>
                                        <Label>Rectangular Duct Aspect Ratio (W : H)</Label>
                                        <div className="flex mt-2 space-x-2">
                                            <Input
                                                type="number"
                                                step="0.1"
                                                min="1"
                                                max="6"
                                                value={inputs.aspect_ratio.value}
                                                onChange={(e) => handleInputChange('aspect_ratio', e.target.value)}
                                                placeholder="1.5"
                                            />
                                        </div>
                                        <p className="text-[11px] text-slate-500 mt-1">Recommended ratio between 1.0 (square) and 2.5 for optimal pressure drop</p>
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

            {(() => {
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
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="explanation" className="border-b last:border-0 border-gray-100">
                                    <AccordionTrigger className="text-base font-semibold text-charcoal py-4 hover:no-underline hover:text-eng-blue">Engineering Explanation</AccordionTrigger>
                                    <AccordionContent className="pb-4">
                                        {getEngineeringExplanation('mechanical', formulaInfo, "this system")}
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="applications" className="border-b last:border-0 border-gray-100">
                                    <AccordionTrigger className="text-base font-semibold text-charcoal py-4 hover:no-underline hover:text-eng-blue">Practical Applications</AccordionTrigger>
                                    <AccordionContent className="text-gray-600 pb-4">
                                        {getPracticalApplications('mechanical', formulaInfo, "these")}
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
        </>
    );
}
