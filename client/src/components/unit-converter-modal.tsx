import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { convertToBaseUnit, convertFromBaseUnit } from '@/lib/calculations';
import { unitConversions } from '@/lib/formulas';
import { ArrowDown, X } from 'lucide-react';

interface UnitConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UnitConverterModal({ isOpen, onClose }: UnitConverterModalProps) {
  const [unitType, setUnitType] = useState('voltage');
  const [fromValue, setFromValue] = useState('');
  const [fromUnit, setFromUnit] = useState('V');
  const [toUnit, setToUnit] = useState('mV');
  const [result, setResult] = useState('');

  const unitTypes = [
    { id: 'voltage', name: 'Voltage' },
    { id: 'current', name: 'Current' },
    { id: 'resistance', name: 'Resistance' },
    { id: 'power', name: 'Power' },
    { id: 'force', name: 'Force' },
    { id: 'mass', name: 'Mass' },
    { id: 'length', name: 'Length' },
    { id: 'pressure', name: 'Pressure' }
  ];

  const getUnitsForType = (type: string) => {
    const conversions = unitConversions[type as keyof typeof unitConversions];
    return conversions ? Object.keys(conversions) : [];
  };

  const handleConvert = () => {
    if (!fromValue || isNaN(parseFloat(fromValue))) {
      setResult('');
      return;
    }

    const inputValue = parseFloat(fromValue);
    const baseValue = convertToBaseUnit(inputValue, fromUnit, unitType);
    const convertedValue = convertFromBaseUnit(baseValue, toUnit, unitType);
    
    setResult(convertedValue.toFixed(6));
  };

  const handleUnitTypeChange = (newType: string) => {
    setUnitType(newType);
    const units = getUnitsForType(newType);
    if (units.length > 0) {
      setFromUnit(units[0]);
      setToUnit(units[1] || units[0]);
    }
    setFromValue('');
    setResult('');
  };

  React.useEffect(() => {
    handleConvert();
  }, [fromValue, fromUnit, toUnit, unitType]);

  React.useEffect(() => {
    if (isOpen) {
      const units = getUnitsForType(unitType);
      if (units.length > 0) {
        setFromUnit(units[0]);
        setToUnit(units[1] || units[0]);
      }
    }
  }, [isOpen, unitType]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-slate-900 dark:text-white font-outfit text-lg">
            Engineering Unit Converter
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-2">
          {/* Unit Type Selection */}
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 block">
              Unit Type
            </Label>
            <Select value={unitType} onValueChange={handleUnitTypeChange}>
              <SelectTrigger className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                {unitTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Convert From */}
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 block">
              Convert From
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Value"
                value={fromValue}
                onChange={(e) => setFromValue(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
              />
              <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                  {getUnitsForType(unitType).map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Arrow */}
          <div className="text-center">
            <ArrowDown className="h-5 w-5 text-cyan-600 dark:text-cyan-400 mx-auto" />
          </div>

          {/* Convert To */}
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 block">
              Convert To
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Result"
                value={result}
                readOnly
                className="bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 font-bold font-mono text-emerald-600 dark:text-emerald-400"
              />
              <Select value={toUnit} onValueChange={setToUnit}>
                <SelectTrigger className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                  {getUnitsForType(unitType).map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Conversion Formula */}
          {fromValue && result && (
            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 rounded-xl p-3 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">Conversion Result:</div>
              <div className="text-sm text-blue-700 dark:text-cyan-300 font-mono font-semibold mt-1">
                {fromValue} {fromUnit} = {result} {toUnit}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
