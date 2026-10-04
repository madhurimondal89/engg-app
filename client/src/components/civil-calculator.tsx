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

export default function CivilCalculator({ initialCalc }: { initialCalc?: string }) {
  const [activeCalculator, setActiveCalculator] = useState(() => {
    if (initialCalc) return initialCalc;
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

  React.useEffect(() => {
    if (initialCalc && initialCalc !== activeCalculator) {
      setActiveCalculator(initialCalc);
    }
  }, [initialCalc]);

  // Sync state with clean URL
  React.useEffect(() => {
    const slug = activeCalculator === 'menu' ? '' : `/${activeCalculator}`;
    const newPath = `/calculators/civil${slug}`;
    if (window.location.pathname !== newPath) {
      window.history.replaceState(null, '', newPath);
    }
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
    <Card className="mb-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center font-outfit">
            <Building className="h-8 w-8 text-emerald-600 dark:text-emerald-400 mr-3" />
            Civil Engineering Calculators
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {calculatorTypes.map((calc) => (
            <Button
              key={calc.id}
              variant="outline"
              className="h-auto py-6 flex flex-col items-center justify-center text-center whitespace-normal border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-400 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30 transition-all group rounded-xl"
              onClick={() => calc.active && setActiveCalculator(calc.id)}
              disabled={!calc.active}
            >
              <div className="bg-emerald-100/70 dark:bg-emerald-950/80 p-3 rounded-full mb-3 group-hover:bg-emerald-200/80 dark:group-hover:bg-emerald-900/60 transition-colors">
                <calc.icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="font-bold text-base text-slate-900 dark:text-white font-outfit">{calc.name}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">Click to open calculator</span>
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
