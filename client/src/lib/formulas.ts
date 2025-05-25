export interface Formula {
  id: string;
  name: string;
  formula: string;
  description: string;
  variables: { [key: string]: string };
}

export interface CalculatorType {
  id: string;
  name: string;
  icon: string;
  formulas: Formula[];
}

export interface EngineeringDiscipline {
  id: string;
  name: string;
  icon: string;
  calculators: CalculatorType[];
}

export const engineeringDisciplines: EngineeringDiscipline[] = [
  {
    id: 'electrical',
    name: 'Electrical Engineering',
    icon: 'fas fa-bolt',
    calculators: [
      {
        id: 'ohms-law',
        name: "Ohm's Law",
        icon: 'fas fa-bolt',
        formulas: [
          {
            id: 'voltage',
            name: "Voltage Calculation",
            formula: 'V = I × R',
            description: 'Voltage equals Current times Resistance',
            variables: {
              V: 'Voltage (V)',
              I: 'Current (A)',
              R: 'Resistance (Ω)'
            }
          }
        ]
      },
      {
        id: 'power',
        name: 'Power',
        icon: 'fas fa-flash',
        formulas: [
          {
            id: 'power-vi',
            name: 'Power (V×I)',
            formula: 'P = V × I',
            description: 'Power equals Voltage times Current',
            variables: {
              P: 'Power (W)',
              V: 'Voltage (V)',
              I: 'Current (A)'
            }
          },
          {
            id: 'power-i2r',
            name: 'Power (I²R)',
            formula: 'P = I² × R',
            description: 'Power equals Current squared times Resistance',
            variables: {
              P: 'Power (W)',
              I: 'Current (A)',
              R: 'Resistance (Ω)'
            }
          },
          {
            id: 'power-v2r',
            name: 'Power (V²/R)',
            formula: 'P = V² / R',
            description: 'Power equals Voltage squared divided by Resistance',
            variables: {
              P: 'Power (W)',
              V: 'Voltage (V)',
              R: 'Resistance (Ω)'
            }
          }
        ]
      },
      {
        id: 'capacitance',
        name: 'Capacitance',
        icon: 'fas fa-battery-full',
        formulas: [
          {
            id: 'capacitor-energy',
            name: 'Capacitor Energy',
            formula: 'E = ½ × C × V²',
            description: 'Energy stored in a capacitor',
            variables: {
              E: 'Energy (J)',
              C: 'Capacitance (F)',
              V: 'Voltage (V)'
            }
          }
        ]
      },
      {
        id: 'inductance',
        name: 'Inductance',
        icon: 'fas fa-magnet',
        formulas: [
          {
            id: 'inductor-energy',
            name: 'Inductor Energy',
            formula: 'E = ½ × L × I²',
            description: 'Energy stored in an inductor',
            variables: {
              E: 'Energy (J)',
              L: 'Inductance (H)',
              I: 'Current (A)'
            }
          }
        ]
      },
      {
        id: 'impedance',
        name: 'Impedance',
        icon: 'fas fa-wave-square',
        formulas: [
          {
            id: 'impedance-rl',
            name: 'RL Circuit Impedance',
            formula: 'Z = √(R² + (ωL)²)',
            description: 'Impedance of RL circuit',
            variables: {
              Z: 'Impedance (Ω)',
              R: 'Resistance (Ω)',
              ω: 'Angular frequency (rad/s)',
              L: 'Inductance (H)'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'mechanical',
    name: 'Mechanical Engineering',
    icon: 'fas fa-cog',
    calculators: [
      {
        id: 'force',
        name: 'Force & Motion',
        icon: 'fas fa-arrow-right',
        formulas: [
          {
            id: 'newtons-second',
            name: "Newton's Second Law",
            formula: 'F = m × a',
            description: 'Force equals mass times acceleration',
            variables: {
              F: 'Force (N)',
              m: 'Mass (kg)',
              a: 'Acceleration (m/s²)'
            }
          }
        ]
      },
      {
        id: 'torque',
        name: 'Torque',
        icon: 'fas fa-sync-alt',
        formulas: [
          {
            id: 'torque-basic',
            name: 'Basic Torque',
            formula: 'τ = F × r',
            description: 'Torque equals force times radius',
            variables: {
              τ: 'Torque (N⋅m)',
              F: 'Force (N)',
              r: 'Radius (m)'
            }
          }
        ]
      },
      {
        id: 'pressure',
        name: 'Pressure',
        icon: 'fas fa-compress',
        formulas: [
          {
            id: 'pressure-basic',
            name: 'Basic Pressure',
            formula: 'P = F / A',
            description: 'Pressure equals force divided by area',
            variables: {
              P: 'Pressure (Pa)',
              F: 'Force (N)',
              A: 'Area (m²)'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'civil',
    name: 'Civil Engineering',
    icon: 'fas fa-building',
    calculators: [
      {
        id: 'beam',
        name: 'Beam Analysis',
        icon: 'fas fa-minus',
        formulas: [
          {
            id: 'moment',
            name: 'Bending Moment',
            formula: 'M = F × L / 4',
            description: 'Maximum moment for simply supported beam with center load',
            variables: {
              M: 'Moment (N⋅m)',
              F: 'Force (N)',
              L: 'Length (m)'
            }
          }
        ]
      },
      {
        id: 'concrete',
        name: 'Concrete Design',
        icon: 'fas fa-cube',
        formulas: [
          {
            id: 'concrete-stress',
            name: 'Compressive Stress',
            formula: 'σ = P / A',
            description: 'Compressive stress in concrete',
            variables: {
              σ: 'Stress (Pa)',
              P: 'Load (N)',
              A: 'Area (m²)'
            }
          }
        ]
      }
    ]
  }
];

export const unitConversions = {
  voltage: {
    V: 1,
    mV: 0.001,
    kV: 1000
  },
  current: {
    A: 1,
    mA: 0.001,
    μA: 0.000001
  },
  resistance: {
    Ω: 1,
    kΩ: 1000,
    MΩ: 1000000
  },
  power: {
    W: 1,
    mW: 0.001,
    kW: 1000,
    MW: 1000000
  },
  capacitance: {
    F: 1,
    mF: 0.001,
    μF: 0.000001,
    nF: 0.000000001,
    pF: 0.000000000001
  },
  inductance: {
    H: 1,
    mH: 0.001,
    μH: 0.000001
  },
  force: {
    N: 1,
    kN: 1000,
    lbf: 4.448
  },
  mass: {
    kg: 1,
    g: 0.001,
    lb: 0.453592
  },
  length: {
    m: 1,
    mm: 0.001,
    cm: 0.01,
    km: 1000,
    in: 0.0254,
    ft: 0.3048
  },
  area: {
    'm²': 1,
    'cm²': 0.0001,
    'mm²': 0.000001,
    'in²': 0.00064516,
    'ft²': 0.092903
  },
  pressure: {
    Pa: 1,
    kPa: 1000,
    MPa: 1000000,
    psi: 6895,
    bar: 100000
  }
};
