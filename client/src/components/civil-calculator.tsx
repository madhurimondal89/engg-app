import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building, BarChart3, Edit, Trash2, Save, Share, Printer, AlertTriangle } from 'lucide-react';

export default function CivilCalculator() {
  const [activeCalculator, setActiveCalculator] = useState('beam');
  const [inputs, setInputs] = useState({
    force: { value: '', unit: 'N' },
    length: { value: '', unit: 'm' },
    area: { value: '', unit: 'm²' },
    moment: { value: '', unit: 'N⋅m' },
    stress: { value: '', unit: 'Pa' },
    load: { value: '', unit: 'N' }
  });

  const calculatorTypes = [
    { id: 'beam', name: 'Beam Analysis', active: false },
    { id: 'concrete', name: 'Concrete Design', active: false }
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

  const clearInputs = () => {
    setInputs({
      force: { value: '', unit: 'N' },
      length: { value: '', unit: 'm' },
      area: { value: '', unit: 'm²' },
      moment: { value: '', unit: 'N⋅m' },
      stress: { value: '', unit: 'Pa' },
      load: { value: '', unit: 'N' }
    });
  };

  const getFormulaInfo = () => {
    if (activeCalculator === 'beam') {
      return {
        name: 'Beam Bending Moment',
        formula: 'M = F × L / 4',
        description: 'Maximum moment for simply supported beam with center load'
      };
    } else if (activeCalculator === 'concrete') {
      return {
        name: 'Compressive Stress',
        formula: 'σ = P / A',
        description: 'Compressive stress in concrete'
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
              <Building className="h-6 w-6 text-eng-blue mr-3" />
              Civil Engineering
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

            {/* Coming Soon Message */}
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Civil engineering calculators are coming soon! This module will include beam analysis, concrete design, and structural calculations.
              </AlertDescription>
            </Alert>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                disabled
                className="w-full bg-gray-300 text-gray-500 font-semibold cursor-not-allowed"
              >
                <i className="fas fa-calculator mr-2"></i>
                Calculate (Coming Soon)
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
            <div className="text-center py-12 text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Civil engineering calculations coming soon!</p>
              <p className="text-sm mt-2">This will include beam analysis, concrete design, and structural calculations.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
