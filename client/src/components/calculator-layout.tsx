import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { engineeringDisciplines } from '@/lib/formulas';
import ElectricalCalculator from './electrical-calculator';
import MechanicalCalculator from './mechanical-calculator';
import CivilCalculator from './civil-calculator';
import UnitConverterModal from './unit-converter-modal';
import { Calculator, Moon, HelpCircle, RotateCcw, History, Download, BookOpen } from 'lucide-react';

export default function CalculatorLayout() {
  const [activeSection, setActiveSection] = useState('electrical');
  const [showUnitConverter, setShowUnitConverter] = useState(false);

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b-2 border-eng-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Calculator className="h-8 w-8 text-eng-blue" />
              <h1 className="text-2xl font-bold text-charcoal">Engineering Calculator Suite</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-eng-blue">
                <Moon className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-eng-blue">
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
                <CardTitle className="text-lg font-semibold text-charcoal">
                  Engineering Disciplines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {engineeringDisciplines.map((discipline) => (
                  <Button
                    key={discipline.id}
                    variant={activeSection === discipline.id ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      activeSection === discipline.id 
                        ? 'bg-eng-blue text-white hover:bg-eng-blue' 
                        : 'text-gray-700 hover:bg-gray-100'
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
                      className="w-full justify-start text-gray-600 hover:text-eng-blue"
                      onClick={() => setShowUnitConverter(true)}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Unit Converter
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-gray-600 hover:text-eng-blue"
                    >
                      <History className="h-4 w-4 mr-2" />
                      Calculation History
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-gray-600 hover:text-eng-blue"
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

            {/* Quick Reference Card */}
            {currentDiscipline && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-charcoal flex items-center">
                    <BookOpen className="h-5 w-5 text-eng-blue mr-2" />
                    Quick Reference - {currentDiscipline.name} Formulas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentDiscipline.calculators.map((calculator) => 
                      calculator.formulas.map((formula) => (
                        <div
                          key={formula.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="font-semibold text-charcoal mb-2">{formula.name}</div>
                          <div className="font-roboto-mono text-sm text-gray-600 mb-2">
                            {formula.formula}
                          </div>
                          <div className="text-xs text-gray-500">{formula.description}</div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
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
