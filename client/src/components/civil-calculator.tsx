import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Truck, Ruler, Activity, Mountain, HardHat } from 'lucide-react';
import ConstructionCalculator from './civil/construction-calculator';
import StructuralCalculator from './civil/structural-calculator';
import GeotechnicalCalculator from './civil/geotechnical-calculator';
import SurveyingCalculator from './civil/surveying-calculator';
import TransportationCalculator from './civil/transportation-calculator';
import EnvironmentalCalculator from './civil/environmental-calculator';
import QuantityCalculator from './civil/quantity-calculator';

export default function CivilCalculator() {
  const [activeCalculator, setActiveCalculator] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('mode') || 'menu';
  });

  const calculatorTypes = [
    { id: 'construction', name: 'Construction & Est.', icon: HardHat, active: true },
    { id: 'structural', name: 'Structural Eng.', icon: Building, active: true },
    { id: 'geotechnical', name: 'Geotechnical', icon: Mountain, active: true },
    { id: 'surveying', name: 'Surveying', icon: Ruler, active: true },
    { id: 'transportation', name: 'Transportation', icon: Truck, active: true },
    { id: 'environmental', name: 'Environmental', icon: Activity, active: true },
    { id: 'quantity', name: 'Qty & Site Util.', icon: Ruler, active: true },
  ];

  // Sync state with URL
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (activeCalculator === 'menu') {
      params.delete('mode');
    } else {
      params.set('mode', activeCalculator);
    }
    const newRelativePathQuery = window.location.pathname + '?' + params.toString();
    window.history.replaceState(null, '', newRelativePathQuery);
  }, [activeCalculator]);

  const renderActiveCalculator = () => {
    switch (activeCalculator) {
      case 'construction':
        return <ConstructionCalculator />;
      case 'structural':
        return <StructuralCalculator />;
      case 'geotechnical':
        return <GeotechnicalCalculator />;
      case 'surveying':
        return <SurveyingCalculator />;
      case 'transportation':
        return <TransportationCalculator />;
      case 'environmental':
        return <EnvironmentalCalculator />;
      case 'quantity':
        return <QuantityCalculator />;
      default:
        return null;
    }
  };

  if (activeCalculator === 'menu') return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-charcoal flex items-center">
            <Building className="h-8 w-8 text-eng-blue mr-3" />
            Civil Engineering Calculators
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {calculatorTypes.map((calc) => (
            <Button
              key={calc.id}
              variant="outline"
              className="h-auto py-6 flex flex-col items-center justify-center text-center whitespace-normal hover:border-eng-blue hover:bg-blue-50 transition-all group"
              onClick={() => calc.active && setActiveCalculator(calc.id)}
              disabled={!calc.active}
            >
              <div className="bg-blue-100 p-3 rounded-full mb-3 group-hover:bg-blue-200 transition-colors">
                <calc.icon className="h-6 w-6 text-eng-blue" />
              </div>
              <span className="font-semibold text-lg text-charcoal">{calc.name}</span>
              <span className="text-sm text-gray-500 mt-1">Click to open calculator</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <div className="mb-6">
        <Button variant="outline" onClick={() => setActiveCalculator('menu')} className="mb-4">
          ← Back to Civil Menu
        </Button>
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-semibold text-charcoal flex items-center">
            <Building className="h-6 w-6 text-eng-blue mr-3" />
            Civil Engineering - {calculatorTypes.find(c => c.id === activeCalculator)?.name}
          </h2>
        </div>
      </div>

      {renderActiveCalculator()}
    </>
  );
}
