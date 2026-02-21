const fs = require('fs');
let file = fs.readFileSync('client/src/components/electrical-calculator.tsx', 'utf8');

// Update Voltage activeCalculator array
file = file.replace(
    /\['ohms-law', 'voltage', 'current', 'resistance', 'power', 'amp-to-watt', 'volt-to-watt', 'ac-power', 'apparent-power', 'reactive-power'\]\.includes\(activeCalculator\)/g,
    `['ohms-law', 'voltage', 'current', 'resistance', 'power', 'amp-to-watt', 'volt-to-watt', 'ac-power', 'apparent-power', 'reactive-power', 'dc-power', 'dc-current', 'dc-voltage-drop', 'battery-backup', 'voltage-divider'].includes(activeCalculator)`
);

// Update Current activeCalculator array
file = file.replace(
    /\['ohms-law', 'voltage', 'current', 'resistance', 'power', 'amp-to-watt', 'volt-to-watt', 'ac-power', 'apparent-power', 'reactive-power'\]\.includes\(activeCalculator\)/g,
    `['ohms-law', 'voltage', 'current', 'resistance', 'power', 'amp-to-watt', 'volt-to-watt', 'ac-power', 'apparent-power', 'reactive-power', 'dc-power', 'dc-current', 'dc-voltage-drop', 'battery-capacity', 'battery-charging', 'current-divider'].includes(activeCalculator)`
);

// Actually, let's just do targeted replaces for Current, Resistance, Power, and Time
// Voltage: look for {['ohms-law', 'voltage', 'current', 'resistance', 'power', 'watt-to-amp', 'volt-to-watt', 'ac-power', 'apparent-power', 'reactive-power'].includes(activeCalculator) && (
file = file.replace(
    `{['ohms-law', 'voltage', 'current', 'resistance', 'power', 'watt-to-amp', 'volt-to-watt', 'ac-power', 'apparent-power', 'reactive-power'].includes(activeCalculator) && (`,
    `{['ohms-law', 'voltage', 'current', 'resistance', 'power', 'watt-to-amp', 'volt-to-watt', 'ac-power', 'apparent-power', 'reactive-power', 'dc-power', 'dc-current', 'dc-voltage-drop', 'battery-backup', 'voltage-divider'].includes(activeCalculator) && (`
);

file = file.replace(
    `{['ohms-law', 'voltage', 'current', 'resistance', 'power', 'amp-to-watt', 'volt-to-watt', 'ac-power', 'apparent-power', 'reactive-power'].includes(activeCalculator) && (`,
    `{['ohms-law', 'voltage', 'current', 'resistance', 'power', 'amp-to-watt', 'volt-to-watt', 'ac-power', 'apparent-power', 'reactive-power', 'dc-power', 'dc-current', 'dc-voltage-drop', 'battery-capacity', 'battery-charging', 'current-divider'].includes(activeCalculator) && (`
);

// Resistance
file = file.replace(
    `{['ohms-law', 'voltage', 'current', 'resistance', 'power'].includes(activeCalculator) && (`,
    `{['ohms-law', 'voltage', 'current', 'resistance', 'power', 'dc-power', 'dc-current'].includes(activeCalculator) && (`
);

// Power
file = file.replace(
    `{['power', 'energy-consumption', 'watt-to-amp', 'power-factor'].includes(activeCalculator) && (`,
    `{['power', 'energy-consumption', 'watt-to-amp', 'power-factor', 'dc-power', 'dc-current', 'battery-backup'].includes(activeCalculator) && (`
);

// Time
file = file.replace(
    `{['energy-consumption'].includes(activeCalculator) && (`,
    `{['energy-consumption', 'battery-capacity'].includes(activeCalculator) && (`
);


// Now inject the new fields right before:
//                   )}
//                 </div>
//
//                 {/* Error Display */}

const newFields = \`
                  {/* DC SPECIFIC INPUTS */}
                  {['series-resistance', 'parallel-resistance', 'voltage-divider', 'current-divider'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Resistor 1 (R1)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter R1" value={inputs.r1.value} onChange={(e) => handleInputChange('r1', e.target.value)} className="flex-1" />
                          <Select value={inputs.r1.unit} onValueChange={(v) => handleUnitChange('r1', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="Ω">Ω</SelectItem><SelectItem value="kΩ">kΩ</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Resistor 2 (R2)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter R2" value={inputs.r2.value} onChange={(e) => handleInputChange('r2', e.target.value)} className="flex-1" />
                          <Select value={inputs.r2.unit} onValueChange={(v) => handleUnitChange('r2', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="Ω">Ω</SelectItem><SelectItem value="kΩ">kΩ</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      {['series-resistance', 'parallel-resistance'].includes(activeCalculator) && (
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Resistor 3 (R3) - Optional</Label>
                          <div className="flex mt-2 space-x-2">
                            <Input type="number" placeholder="Enter R3" value={inputs.r3.value} onChange={(e) => handleInputChange('r3', e.target.value)} className="flex-1" />
                            <Select value={inputs.r3.unit} onValueChange={(v) => handleUnitChange('r3', v)}>
                              <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                              <SelectContent><SelectItem value="Ω">Ω</SelectItem><SelectItem value="kΩ">kΩ</SelectItem></SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {['dc-voltage-drop'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Wire Length (One-way)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter length" value={inputs.length.value} onChange={(e) => handleInputChange('length', e.target.value)} className="flex-1" />
                          <Select value={inputs.length.unit} onValueChange={(v) => handleUnitChange('length', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="m">m</SelectItem><SelectItem value="km">km</SelectItem><SelectItem value="ft">ft</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Cross-sectional Area</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Area" value={inputs.area.value} onChange={(e) => handleInputChange('area', e.target.value)} className="flex-1" />
                          <Select value={inputs.area.unit} onValueChange={(v) => handleUnitChange('area', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="mm²">mm²</SelectItem><SelectItem value="cm²">cm²</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}
                  {['battery-backup', 'battery-charging'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Battery Capacity</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Capacity" value={inputs.capacity.value} onChange={(e) => handleInputChange('capacity', e.target.value)} className="flex-1" />
                          <Select value={inputs.capacity.unit} onValueChange={(v) => handleUnitChange('capacity', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="Ah">Ah</SelectItem><SelectItem value="mAh">mAh</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Efficiency / Factor (%)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="e.g. 80" value={inputs.efficiency.value} onChange={(e) => handleInputChange('efficiency', e.target.value)} className="flex-1" />
                          <Select value={inputs.efficiency.unit} onValueChange={(v) => handleUnitChange('efficiency', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="%">%</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}
\`;

file = file.replace(
  \`                  {/* TIME PERIOD */}
                  {['frequency'].includes(activeCalculator) && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Time Period (T) <span className="text-gray-500 ml-1">- Required</span>
                      </Label>
                      <div className="flex mt-2 space-x-2">
                        <Input type="number" placeholder="Enter Time Period" value={inputs.timePeriod.value} onChange={(e) => handleInputChange('timePeriod', e.target.value)} className="flex-1" />
                        <Select value={inputs.timePeriod.unit} onValueChange={(v) => handleUnitChange('timePeriod', v)}>
                          <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="s">s</SelectItem>
                            <SelectItem value="min">min</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}\`,
  \`                  {/* TIME PERIOD */}
                  {['frequency'].includes(activeCalculator) && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Time Period (T) <span className="text-gray-500 ml-1">- Required</span>
                      </Label>
                      <div className="flex mt-2 space-x-2">
                        <Input type="number" placeholder="Enter Time Period" value={inputs.timePeriod.value} onChange={(e) => handleInputChange('timePeriod', e.target.value)} className="flex-1" />
                        <Select value={inputs.timePeriod.unit} onValueChange={(v) => handleUnitChange('timePeriod', v)}>
                          <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="s">s</SelectItem>
                            <SelectItem value="min">min</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
\${newFields}\`
);

fs.writeFileSync('client/src/components/electrical-calculator.tsx', file, 'utf8');
console.log('Done mapping.');
