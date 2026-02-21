import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { engineeringDisciplines } from '@/lib/formulas';
import ElectricalCalculator from './electrical-calculator';
import MechanicalCalculator from './mechanical-calculator';
import CivilCalculator from './civil-calculator';
import UnitConverterModal from './unit-converter-modal';
import { Calculator, Moon, Sun, HelpCircle, RotateCcw, History, Download, BookOpen, Home } from 'lucide-react';

export default function CalculatorLayout() {
  const [activeSection, setActiveSection] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('discipline') || 'electrical';
  });
  const [showUnitConverter, setShowUnitConverter] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const currentDiscipline = engineeringDisciplines.find(d => d.id === activeSection);

  const renderCalculator = () => {
    switch (activeSection) {
      case 'electrical':
        return <ElectricalCalculator />;
      case 'mechanical':
        return <MechanicalCalculator />;
      case 'civil':
        return <CivilCalculator />;
      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-600">Calculator for {currentDiscipline?.name} coming soon!</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md border-b-2 border-eng-blue transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Calculator className="h-8 w-8 text-eng-blue" />
              <h1 className="text-2xl font-bold text-charcoal dark:text-gray-100">Engineering Calculator Hub</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300 hover:text-eng-blue" onClick={() => window.location.href = '/'}>
                <Home className="h-5 w-5 mr-2" />
                Back to Home
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300 hover:text-eng-blue" onClick={toggleTheme}>
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300 hover:text-eng-blue">
                <HelpCircle className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-charcoal dark:text-gray-100">
                  Engineering Disciplines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {engineeringDisciplines.map((discipline) => (
                  <Button
                    key={discipline.id}
                    variant={activeSection === discipline.id ? "default" : "ghost"}
                    className={`w-full justify-start ${activeSection === discipline.id
                      ? 'bg-eng-blue text-white hover:bg-eng-blue'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    onClick={() => setActiveSection(discipline.id)}
                  >
                    <i className={`${discipline.icon} mr-3`} />
                    {discipline.name.replace(' Engineering', '')}
                  </Button>
                ))}

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-600 mb-3">Quick Access</h3>
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-gray-600 dark:text-gray-300 hover:text-eng-blue"
                      onClick={() => setShowUnitConverter(true)}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Unit Converter
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-gray-600 dark:text-gray-300 hover:text-eng-blue"
                    >
                      <History className="h-4 w-4 mr-2" />
                      Calculation History
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-gray-600 dark:text-gray-300 hover:text-eng-blue"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Results
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Calculator Area */}
          <div className="lg:col-span-3">
            {renderCalculator()}
          </div>
        </div>
      </div>

      {/* Unit Converter Modal */}
      <UnitConverterModal
        isOpen={showUnitConverter}
        onClose={() => setShowUnitConverter(false)}
      />
    </div>
  );
}
