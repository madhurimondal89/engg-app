import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { calculateForce, type CalculationInput, type CalculationOutput } from '@/lib/calculations';
import { Settings, BarChart3, Edit, Trash2, Save, Share, Printer, AlertTriangle, CheckCircle } from 'lucide-react';

export default function MechanicalCalculator() {
  const [activeCalculator, setActiveCalculator] = useState('force');
  const [inputs, setInputs] = useState({
    force: { value: '', unit: 'N' },
    mass: { value: '', unit: 'kg' },
    acceleration: { value: '', unit: 'm/s²' },
    torque: { value: '', unit: 'N⋅m' },
    radius: { value: '', unit: 'm' },
    pressure: { value: '', unit: 'Pa' },
    area: { value: '', unit: 'm²' }
  });
  const [results, setResults] = useState<CalculationOutput | null>(null);

  const calculatorTypes = [
    { id: 'force', name: 'Force & Motion', active: true },
    { id: 'torque', name: 'Torque', active: false },
    { id: 'pressure', name: 'Pressure', active: false }
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
    
    if (activeCalculator === 'force') {
      result = calculateForce(calculationInputs);
    } else {
      result = { results: {}, steps: [], errors: ['Calculator not implemented yet'] };
    }

    setResults(result);
  };

  const clearInputs = () => {
    setInputs({
      force: { value: '', unit: 'N' },
      mass: { value: '', unit: 'kg' },
      acceleration: { value: '', unit: 'm/s²' },
      torque: { value: '', unit: 'N⋅m' },
      radius: { value: '', unit: 'm' },
      pressure: { value: '', unit: 'Pa' },
      area: { value: '', unit: 'm²' }
    });
    setResults(null);
  };

  const getFormulaInfo = () => {
    if (activeCalculator === 'force') {
      return {
        name: "Newton's Second Law",
        formula: 'F = m × a',
        description: 'Force (F) = Mass (m) × Acceleration (a)'
      };
    }
    return null;
  };

  const formulaInfo = getFormulaInfo();

  return (
    <>
      {/* Calculator Type Selection */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-charcoal flex items-center">
              <Settings className="h-6 w-6 text-eng-blue mr-3" />
              Mechanical Engineering
            </h2>
            <Button variant="outline" size="sm" className="text-gray-500 hover:text-eng-blue">
              <i className="fas fa-book mr-2"></i>
              Formulas
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {calculatorTypes.map((calc) => (
              <Button
                key={calc.id}
                variant={activeCalculator === calc.id ? "default" : "outline"}
                size="sm"
                className={`${
                  activeCalculator === calc.id 
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

      {/* Calculator Interface */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Input Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-charcoal flex items-center">
              <Edit className="h-5 w-5 text-eng-blue mr-2" />
              Input Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Formula Display */}
            {formulaInfo && (
              <div className="bg-blue-50 border-l-4 border-eng-blue p-4">
                <div className="flex items-center mb-2">
                  <i className="fas fa-formula text-eng-blue mr-2"></i>
                  <span className="font-semibold text-charcoal">{formulaInfo.name}</span>
                </div>
                <div className="font-roboto-mono text-lg text-charcoal">
                  {formulaInfo.formula}
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  {formulaInfo.description}
                </div>
              </div>
            )}

            {/* Input Fields */}
            <div className="space-y-4">
              {activeCalculator === 'force' && (
                <>
                  {/* Force Input */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Force (F) <span className="text-gray-500 ml-1">- Optional</span>
                    </Label>
                    <div className="flex mt-2 space-x-2">
                      <Input
                        type="number"
                        placeholder="Enter force value"
                        value={inputs.force.value}
                        onChange={(e) => handleInputChange('force', e.target.value)}
                        className="flex-1"
                      />
                      <Select value={inputs.force.unit} onValueChange={(value) => handleUnitChange('force', value)}>
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="N">N</SelectItem>
                          <SelectItem value="kN">kN</SelectItem>
                          <SelectItem value="lbf">lbf</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Mass Input */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Mass (m) <span className="text-gray-500 ml-1">- Optional</span>
                    </Label>
                    <div className="flex mt-2 space-x-2">
                      <Input
                        type="number"
                        placeholder="Enter mass value"
                        value={inputs.mass.value}
                        onChange={(e) => handleInputChange('mass', e.target.value)}
                        className="flex-1"
                      />
                      <Select value={inputs.mass.unit} onValueChange={(value) => handleUnitChange('mass', value)}>
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="g">g</SelectItem>
                          <SelectItem value="lb">lb</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Acceleration Input */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Acceleration (a) <span className="text-gray-500 ml-1">- Optional</span>
                    </Label>
                    <div className="flex mt-2 space-x-2">
                      <Input
                        type="number"
                        placeholder="Enter acceleration value"
                        value={inputs.acceleration.value}
                        onChange={(e) => handleInputChange('acceleration', e.target.value)}
                        className="flex-1"
                      />
                      <Select value={inputs.acceleration.unit} onValueChange={(value) => handleUnitChange('acceleration', value)}>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="m/s²">m/s²</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Error Display */}
            {results?.errors && results.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {results.errors[0]}
                </AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={performCalculation}
                className="w-full bg-eng-blue hover:bg-eng-blue/90 text-white font-semibold"
              >
                <i className="fas fa-calculator mr-2"></i>
                Calculate
              </Button>
              <Button 
                variant="outline"
                onClick={clearInputs}
                className="w-full text-gray-700 hover:bg-gray-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-charcoal flex items-center">
              <BarChart3 className="h-5 w-5 text-eng-blue mr-2" />
              Results & Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {results && Object.keys(results.results).length > 0 ? (
              <>
                {/* Calculated Values */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Calculated Values
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(results.results).map(([key, result]) => (
                      <div key={key} className="text-center">
                        <div className="text-2xl font-roboto-mono font-bold text-green-700">
                          {result.formatted}
                        </div>
                        <div className="text-sm text-green-600 capitalize">
                          {key}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step-by-Step Calculation */}
                {results.steps.length > 0 && (
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="font-semibold text-charcoal mb-3 flex items-center">
                      <i className="fas fa-list-ol text-eng-blue mr-2"></i>
                      Step-by-Step Solution
                    </h4>
                    <div className="space-y-3 text-sm">
                      {results.steps.map((step, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <Badge 
                            variant="secondary" 
                            className="flex-shrink-0 w-6 h-6 bg-eng-blue text-white rounded-full flex items-center justify-center text-xs font-bold p-0"
                          >
                            {step.step}
                          </Badge>
                          <div>
                            <div className="font-medium text-gray-700">{step.description}</div>
                            {step.formula && (
                              <div className="text-gray-600 font-roboto-mono">{step.formula}</div>
                            )}
                            <div className="text-gray-600 font-roboto-mono">{step.calculation}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Save/Export Options */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" size="sm" className="flex-1 min-w-0">
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 min-w-0">
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 min-w-0">
                      <Printer className="h-4 w-4 mr-2" />
                      Print
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Enter values and click Calculate to see results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
