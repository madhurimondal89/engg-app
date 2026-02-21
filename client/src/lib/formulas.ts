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
      },
      {
        id: 'strength',
        name: 'Strength of Materials',
        icon: 'fas fa-dumbbell',
        formulas: [
          { id: 'normal-stress', name: 'Normal Stress', formula: 'σ = F / A', description: 'Stress equals Force divided by Area', variables: { σ: 'Stress (Pa)', F: 'Force (N)', A: 'Area (m²)' } },
          { id: 'shear-stress', name: 'Shear Stress', formula: 'τ = V / A', description: 'Average shear stress', variables: { τ: 'Shear Stress (Pa)', V: 'Shear Force (N)', A: 'Area (m²)' } },
          { id: 'shear-strain', name: 'Shear Strain', formula: 'γ = δ / L', description: 'Shear deformation / length', variables: { γ: 'Shear Strain', δ: 'Deformation (m)', L: 'Length (m)' } },
          { id: 'bending-stress', name: 'Bending Stress', formula: 'σ = My / I', description: 'Stress in a beam due to bending', variables: { σ: 'Stress (Pa)', M: 'Moment (N⋅m)', y: 'Dist. from NA (m)', I: 'Moment of Inertia (m⁴)' } },
          { id: 'bending-moment', name: 'Bending Moment (SS)', formula: 'M = FL / 4', description: 'Max moment (Simply Supported, Point Load)', variables: { M: 'Moment (N⋅m)', F: 'Force (N)', L: 'Length (m)' } },
          { id: 'torsional-stress', name: 'Torsional Stress', formula: 'τ = Tr / J', description: 'Stress due to torque', variables: { τ: 'Shear Stress (Pa)', T: 'Torque (N⋅m)', r: 'Radius (m)', J: 'Polar MOI (m⁴)' } },
          { id: 'beam-deflection', name: 'Beam Deflection (SS)', formula: 'δ = FL³ / 48EI', description: 'Max deflection (Simply Supported, Point Load)', variables: { δ: 'Deflection (m)', F: 'Force (N)', L: 'Length (m)', E: 'Modulus (Pa)', I: 'Inertia (m⁴)' } },
          { id: 'fos', name: 'Factor of Safety', formula: 'n = σ_fail / σ_allow', description: 'Ratio of failure stress to allowable stress', variables: { n: 'Factor of Safety', σ_fail: 'Failure Stress (Pa)', σ_allow: 'Allowable Stress (Pa)' } }
        ]
      },
      {
        id: 'machine-design',
        name: 'Machine Design',
        icon: 'fas fa-cogs',
        formulas: [{ id: 'bolt-torque-calc', name: 'Bolt Torque', formula: 'T = K × F × d', description: 'Torque required to tighten a bolt', variables: { T: 'Torque (N⋅m)', K: 'Nut Factor', F: 'Preload Force (N)', d: 'Bolt Diameter (m)' } }]
      },
      {
        id: 'shaft-diameter',
        name: 'Shaft Diameter',
        icon: 'fas fa-minus',
        formulas: [{ id: 'shaft-dia-calc', name: 'Shaft Diameter (Torsion)', formula: 'D = (16T / πτ)^(1/3)', description: 'Diameter for torsional shear stress', variables: { D: 'Diameter (m)', T: 'Torque (N⋅m)', τ: 'Shear Stress (Pa)' } }]
      },
      {
        id: 'gear-ratio-calc',
        name: 'Gear Ratio',
        icon: 'fas fa-cog',
        formulas: [{ id: 'gear-ratio-calc', name: 'Gear Ratio', formula: 'GR = N_out / N_in', description: 'Ratio of output to input teeth', variables: { GR: 'Gear Ratio', N_out: 'Output Teeth', N_in: 'Input Teeth' } }]
      },
      {
        id: 'gear-speed',
        name: 'Gear Speed',
        icon: 'fas fa-tachometer-alt',
        formulas: [{ id: 'gear-speed-calc', name: 'Output Speed', formula: 'ω_out = ω_in / GR', description: 'Output angular velocity', variables: { ω_out: 'Output Speed (rpm)', ω_in: 'Input Speed (rpm)', GR: 'Gear Ratio' } }]
      },
      {
        id: 'belt-length',
        name: 'Belt Length',
        icon: 'fas fa-recycle',
        formulas: [{ id: 'belt-length-calc', name: 'Open Belt Length', formula: 'L = 2C + π(D+d)/2 + (D-d)²/4C', description: 'Length of open belt', variables: { L: 'Length (m)', C: 'Center Distance (m)', D: 'Large Dia (m)', d: 'Small Dia (m)' } }]
      },
      {
        id: 'belt-tension',
        name: 'Belt Tension',
        icon: 'fas fa-arrows-alt-v',
        formulas: [{ id: 'belt-tension-calc', name: 'Belt Tension Ratio', formula: 'T1/T2 = e^(μθ)', description: 'Tension ratio for flat belt', variables: { T1: 'Tight Side (N)', T2: 'Slack Side (N)', μ: 'Friction Coeff', θ: 'Wrap Angle (rad)' } }]
      },
      {
        id: 'chain-length',
        name: 'Chain Length',
        icon: 'fas fa-link',
        formulas: [{ id: 'chain-length-calc', name: 'Chain Length', formula: 'L = 2C + (N+n)/2 + ((N-n)/2π)²/C', description: 'Length in pitches', variables: { L: 'Length (pitches)', C: 'Center Dist (pitches)', N: 'Large Sprocket (teeth)', n: 'Small Sprocket (teeth)' } }]
      },
      {
        id: 'spring-constant',
        name: 'Spring Constant',
        icon: 'fas fa-compress-alt',
        formulas: [{ id: 'spring-const-calc', name: 'Spring Rate', formula: 'k = Gd⁴ / 8D³N', description: 'Stiffness of helical spring', variables: { k: 'Spring Rate (N/m)', G: 'Shear Modulus (Pa)', d: 'Wire Dia (m)', D: 'Mean Coil Dia (m)', N: 'Active Coils' } }]
      },
      {
        id: 'bearing-life',
        name: 'Bearing Life',
        icon: 'fas fa-dot-circle',
        formulas: [{ id: 'bearing-life-calc', name: 'L10 Life', formula: 'L10 = (C/P)^p', description: 'Rated fatigue life', variables: { L10: 'Life (million revs)', C: 'Dynamic Load Rating (N)', P: 'Equivalent Load (N)', p: 'Exponent (3:Ball, 10/3:Roller)' } }]
      },
      {
        id: 'flywheel-energy',
        name: 'Flywheel Energy',
        icon: 'fas fa-compact-disc',
        formulas: [{ id: 'flywheel-energy-calc', name: 'Kinetic Energy', formula: 'E = 0.5 × I × ω²', description: 'Energy stored in flywheel', variables: { E: 'Energy (J)', I: 'Inertia (kg·m²)', ω: 'Angular Velocity (rad/s)' } }]
      },
      {
        id: 'thermodynamics',
        name: 'Thermodynamics',
        icon: 'fas fa-thermometer-half',
        formulas: [{ id: 'conduction', name: 'Conduction', formula: 'Q = k × A × ΔT / d', description: 'Heat transfer by conduction', variables: { Q: 'Heat Transfer Rate (W)', k: 'Thermal Conductivity (W/m·K)', A: 'Area (m²)', ΔT: 'Temp Diff (K)', d: 'Thickness (m)' } }]
      },
      {
        id: 'thermal-efficiency',
        name: 'Thermal Efficiency',
        icon: 'fas fa-percentage',
        formulas: [{ id: 'thermal-eff', name: 'Thermal Efficiency', formula: 'η = (W_out / Q_in) × 100', description: 'Efficiency of a heat engine', variables: { η: 'Efficiency (%)', W_out: 'Work Output (J)', Q_in: 'Heat Input (J)' } }]
      },
      {
        id: 'carnot-efficiency',
        name: 'Carnot Efficiency',
        icon: 'fas fa-fire',
        formulas: [{ id: 'carnot-eff', name: 'Carnot Efficiency', formula: 'η = (1 - Tc / Th) × 100', description: 'Max theoretical efficiency', variables: { η: 'Efficiency (%)', Tc: 'Cold Res. Temp (K)', Th: 'Hot Res. Temp (K)' } }]
      },
      {
        id: 'specific-heat',
        name: 'Specific Heat',
        icon: 'fas fa-fire-alt',
        formulas: [{ id: 'specific-heat-calc', name: 'Specific Heat', formula: 'Q = m × c × ΔT', description: 'Heat required to change temperature', variables: { Q: 'Heat Energy (J)', m: 'Mass (kg)', c: 'Specific Heat Capacity (J/kg·K)', ΔT: 'Temp Change (K)' } }]
      },
      {
        id: 'heat-loss',
        name: 'Heat Loss',
        icon: 'fas fa-wind',
        formulas: [{ id: 'heat-loss-calc', name: 'Heat Loss', formula: 'Q = U × A × ΔT', description: 'Heat loss through a surface', variables: { Q: 'Heat Loss Rate (W)', U: 'Overall Heat Transfer Coeff. (W/m²·K)', A: 'Area (m²)', ΔT: 'Temp Diff (K)' } }]
      },
      {
        id: 'entropy-change',
        name: 'Entropy Change',
        icon: 'fas fa-random',
        formulas: [{ id: 'entropy-change-calc', name: 'Entropy Change', formula: 'ΔS = Q / T', description: 'Entropy change for reversible process', variables: { ΔS: 'Entropy Change (J/K)', Q: 'Heat Exchange (J)', T: 'Temperature (K)' } }]
      },
      {
        id: 'work-done',
        name: 'Work Done',
        icon: 'fas fa-briefcase',
        formulas: [{ id: 'work-done-calc', name: 'Work Done (Isobaric)', formula: 'W = P × ΔV', description: 'Work done at constant pressure', variables: { W: 'Work Done (J)', P: 'Pressure (Pa)', ΔV: 'Volume Change (m³)' } }]
      },
      {
        id: 'cop-refrigeration',
        name: 'COP of Refrigerator',
        icon: 'fas fa-snowflake',
        formulas: [{ id: 'cop-calc', name: 'Coefficient of Performance', formula: 'COP = Qc / W_in', description: 'Efficiency of a refrigerator', variables: { COP: 'COP', Qc: 'Heat Removed (J)', W_in: 'Work Input (J)' } }]
      },
      {
        id: 'boiler-efficiency',
        name: 'Boiler Efficiency',
        icon: 'fas fa-industry',
        formulas: [{ id: 'boiler-eff', name: 'Boiler Efficiency', formula: 'η = (Q_out / Q_in) × 100', description: 'Efficiency of a boiler', variables: { η: 'Efficiency (%)', Q_out: 'Heat Output (steam)', Q_in: 'Heat Input (fuel)' } }]
      },
      {
        id: 'fluid-mechanics',
        name: 'Fluid Mechanics',
        icon: 'fas fa-water',
        formulas: [{ id: 'reynolds-num', name: 'Reynolds Number', formula: 'Re = (ρ × v × D) / μ', description: 'Predicts flow regime', variables: { Re: 'Reynolds Number', ρ: 'Density (kg/m³)', v: 'Velocity (m/s)', D: 'Diameter (m)', μ: 'Dynamic Viscosity (Pa·s)' } }]
      },
      {
        id: 'flow-rate',
        name: 'Flow Rate',
        icon: 'fas fa-wind',
        formulas: [{ id: 'flow-rate-calc', name: 'Flow Rate', formula: 'Q = A × v', description: 'Volumetric flow rate', variables: { Q: 'Flow Rate (m³/s)', A: 'Area (m²)', v: 'Velocity (m/s)' } }]
      },
      {
        id: 'fluid-velocity',
        name: 'Fluid Velocity',
        icon: 'fas fa-tachometer-alt',
        formulas: [{ id: 'velocity-calc', name: 'Fluid Velocity', formula: 'v = Q / A', description: 'Velocity of fluid flow', variables: { v: 'Velocity (m/s)', Q: 'Flow Rate (m³/s)', A: 'Area (m²)' } }]
      },
      {
        id: 'pressure-drop',
        name: 'Pressure Drop',
        icon: 'fas fa-arrow-down',
        formulas: [{ id: 'pressure-drop-calc', name: 'Pressure Drop (Darcy)', formula: 'ΔP = f × (L/D) × (ρv²/2)', description: 'Pressure loss in pipe', variables: { ΔP: 'Pressure Drop (Pa)', f: 'Friction Factor', L: 'Length (m)', D: 'Diameter (m)', ρ: 'Density (kg/m³)', v: 'Velocity (m/s)' } }]
      },
      {
        id: 'head-loss',
        name: 'Head Loss',
        icon: 'fas fa-level-down-alt',
        formulas: [{ id: 'head-loss-calc', name: 'Head Loss', formula: 'hf = f × (L/D) × (v²/2g)', description: 'Energy loss due to friction', variables: { hf: 'Head Loss (m)', f: 'Friction Factor', L: 'Length (m)', D: 'Diameter (m)', v: 'Velocity (m/s)', g: 'Gravity (9.81 m/s²)' } }]
      },
      {
        id: 'darcy-friction',
        name: 'Darcy Friction Factor',
        icon: 'fas fa-road',
        formulas: [{ id: 'darcy-calc', name: 'Friction Factor (Laminar)', formula: 'f = 64 / Re', description: 'Friction factor for laminar flow', variables: { f: 'Friction Factor', Re: 'Reynolds Number' } }]
      },
      {
        id: 'pipe-diameter',
        name: 'Pipe Diameter',
        icon: 'fas fa-circle',
        formulas: [{ id: 'pipe-dia-calc', name: 'Pipe Diameter', formula: 'D = √(4Q / πv)', description: 'Required diameter for flow', variables: { D: 'Diameter (m)', Q: 'Flow Rate (m³/s)', v: 'Velocity (m/s)' } }]
      },
      {
        id: 'pump-power',
        name: 'Pump Power',
        icon: 'fas fa-cogs',
        formulas: [{ id: 'pump-power-calc', name: 'Pump Power', formula: 'P = (ρ × g × Q × h) / η', description: 'Power required by pump', variables: { P: 'Power (W)', ρ: 'Density (kg/m³)', g: 'Gravity (9.81 m/s²)', Q: 'Flow Rate (m³/s)', h: 'Head (m)', η: 'Efficiency (0-1)' } }]
      },
      {
        id: 'hydraulic-power',
        name: 'Hydraulic Power',
        icon: 'fas fa-water',
        formulas: [{ id: 'hyd-power-calc', name: 'Hydraulic Power', formula: 'P = Q × ΔP', description: 'Power delivered to fluid', variables: { P: 'Power (W)', Q: 'Flow Rate (m³/s)', ΔP: 'Pressure Diff (Pa)' } }]
      },
      {
        id: 'bernoulli',
        name: 'Bernoulli Equation',
        icon: 'fas fa-balance-scale',
        formulas: [{ id: 'bernoulli-calc', name: 'Bernoulli (Solve P2)', formula: 'P2 = P1 + 0.5ρ(v1²-v2²) + ρg(h1-h2)', description: 'Conservation of energy', variables: { P2: 'Pressure 2 (Pa)', P1: 'Pressure 1 (Pa)', ρ: 'Density (kg/m³)', v1: 'Vel 1 (m/s)', v2: 'Vel 2 (m/s)', h1: 'Height 1 (m)', h2: 'Height 2 (m)' } }]
      },
      {
        id: 'manufacturing',
        name: 'Manufacturing',
        icon: 'fas fa-industry',
        formulas: [{ id: 'cutting-speed-calc', name: 'Cutting Speed', formula: 'V = (π × D × N) / 1000', description: 'Speed of cutting tool or workpiece', variables: { V: 'Cutting Speed (m/min)', D: 'Diameter (mm)', N: 'RPM (rev/min)' } }]
      },
      {
        id: 'feed-rate',
        name: 'Feed Rate',
        icon: 'fas fa-angle-double-right',
        formulas: [{ id: 'feed-rate-calc', name: 'Feed Rate', formula: 'Vf = n × z × fz', description: 'Speed of tool travel', variables: { Vf: 'Feed Rate (mm/min)', n: 'RPM', z: 'Number of Teeth', fz: 'Feed per Tooth (mm)' } }]
      },
      {
        id: 'machining-time',
        name: 'Machining Time',
        icon: 'fas fa-clock',
        formulas: [{ id: 'machining-time-calc', name: 'Machining Time', formula: 'T = L / Vf', description: 'Time required for machining', variables: { T: 'Time (min)', L: 'Length of Cut (mm)', Vf: 'Feed Rate (mm/min)' } }]
      },
      {
        id: 'mrr',
        name: 'Material Removal Rate',
        icon: 'fas fa-trash-alt',
        formulas: [{ id: 'mrr-calc', name: 'MRR (Milling)', formula: 'MRR = d × w × Vf', description: 'Volume of material removed per unit time', variables: { MRR: 'MRR (cm³/min)', d: 'Depth of Cut (mm)', w: 'Width of Cut (mm)', Vf: 'Feed Rate (mm/min)' } }]
      },
      {
        id: 'surface-roughness',
        name: 'Surface Roughness',
        icon: 'fas fa-align-justify',
        formulas: [{ id: 'roughness-calc', name: 'Theoretical Surface Roughness', formula: 'Ra = (f²) / (32 × r)', description: 'Roughness in turning', variables: { Ra: 'Roughness (μm)', f: 'Feed per Rev (mm)', r: 'Nose Radius (mm)' } }]
      },
      {
        id: 'welding-heat',
        name: 'Welding Heat Input',
        icon: 'fas fa-burn',
        formulas: [{ id: 'welding-heat-calc', name: 'Heat Input', formula: 'H = (V × I × 60) / (S × 1000)', description: 'Energy transferred per unit length', variables: { H: 'Heat Input (kJ/mm)', V: 'Voltage (V)', I: 'Current (A)', S: 'Travel Speed (mm/min)' } }]
      },
      {
        id: 'solidification-time',
        name: 'Solidification Time',
        icon: 'fas fa-cube',
        formulas: [{ id: 'chvorinov-calc', name: "Chvorinov's Rule", formula: 'T = B × (V / A)²', description: 'Time for casting to solidify', variables: { T: 'Time (s)', B: 'Mold Constant (s/cm²)', V: 'Volume (cm³)', A: 'Surface Area (cm²)' } }]
      },
      {
        id: 'tool-life',
        name: 'Tool Life',
        icon: 'fas fa-hourglass-end',
        formulas: [{ id: 'taylor-tool-life', name: "Taylor's Equation", formula: 'T = (C / V)^(1/n)', description: 'Expected life of a cutting tool', variables: { T: 'Tool Life (min)', V: 'Cutting Speed (m/min)', C: 'Taylor Constant', n: 'Taylor Exponent' } }]
      },
      {
        id: 'dynamics',
        name: 'Dynamics & Kinematics',
        icon: 'fas fa-running',
        formulas: [{ id: 'ang-vel', name: 'Angular Velocity', formula: 'ω = v / r', description: 'Relation between linear and angular velocity', variables: { ω: 'Angular Velocity (rad/s)', v: 'Linear Velocity (m/s)', r: 'Radius (m)' } }]
      }
    ]
  },
  {
    id: 'civil',
    name: 'Civil Engineering',
    icon: 'fas fa-building',
    calculators: [
      {
        id: 'construction',
        name: 'Construction',
        icon: 'fas fa-hard-hat',
        formulas: [
          {
            id: 'concrete-volume',
            name: 'Concrete Volume',
            formula: 'V = L × W × D × Q',
            description: 'Volume of concrete required',
            variables: {
              V: 'Volume (m³)',
              L: 'Length (m)',
              W: 'Width (m)',
              D: 'Depth (m)',
              Q: 'Quantity (nos)'
            }
          },
          {
            id: 'block-count',
            name: 'Block Calculator',
            formula: 'N = V_wall / V_block',
            description: 'Number of blocks (AAC/Concrete)',
            variables: {
              N: 'Number of Blocks',
              V_wall: 'Volume of Wall',
              V_block: 'Volume of Block with Mortar'
            }
          },
          {
            id: 'cement-calc',
            name: 'Cement Calculator',
            formula: 'Cement = (Ratio_C / Total) * Vol_dry * Density',
            description: 'Calculate Cement bags required',
            variables: {
              C: 'Cement (bags)',
              Ratio: 'Mix Ratio',
              Vol: 'Volume'
            }
          },
          {
            id: 'sand-calc',
            name: 'Sand Calculator',
            formula: 'Sand = (Ratio_S / Total) * Vol_dry',
            description: 'Calculate Sand quantity',
            variables: {
              S: 'Sand (m³)',
              Ratio: 'Mix Ratio',
              Vol: 'Volume'
            }
          },
          {
            id: 'aggregate-calc',
            name: 'Aggregate Calculator',
            formula: 'Agg = (Ratio_A / Total) * Vol_dry',
            description: 'Calculate Aggregate quantity',
            variables: {
              A: 'Aggregate (m³)',
              Ratio: 'Mix Ratio',
              Vol: 'Volume'
            }
          },
          {
            id: 'brick-count',
            name: 'Brick Calculation',
            formula: 'N = V_wall / V_brick',
            description: 'Number of bricks required for a wall',
            variables: {
              N: 'Number of Bricks',
              V_wall: 'Volume of Wall',
              V_brick: 'Volume of Single Brick with Mortar'
            }
          },
          {
            id: 'concrete-mix',
            name: 'Concrete Mix',
            formula: 'Vol_dry = Vol_wet × 1.54',
            description: 'Calculate Cement, Sand, Aggregate for Mix',
            variables: {
              V_dry: 'Dry Volume',
              V_wet: 'Wet Volume',
              Ratio: 'Mix Ratio (C:S:A)'
            }
          },
          {
            id: 'mortar',
            name: 'Mortar Calculation',
            formula: 'Vol_dry = Vol_wet × 1.33',
            description: 'Calculate Cement and Sand for Mortar',
            variables: {
              C: 'Cement',
              S: 'Sand',
              Ratio: 'Mix Ratio (C:S)'
            }
          },
          {
            id: 'plastering',
            name: 'Plastering',
            formula: 'Vol = Area × Thickness',
            description: 'Calculate Cement and Sand for Plastering',
            variables: {
              Area: 'Wall Area',
              T: 'Thickness',
              Ratio: 'Mix Ratio'
            }
          },
          {
            id: 'flooring',
            name: 'Flooring',
            formula: 'Tiles = Area / TileSize',
            description: 'Calculate Number of Tiles',
            variables: {
              Area: 'Floor Area',
              TileSize: 'Length × Width'
            }
          },
          {
            id: 'paint',
            name: 'Painting',
            formula: 'Qty = (Area / Coverage) × Coats',
            description: 'Calculate Paint Quantity',
            variables: {
              Area: 'Wall Area',
              Coverage: 'm²/Liter',
              Coats: 'Number of Coats'
            }
          }
        ]
      },
      {
        id: 'structural',
        name: 'Structural',
        icon: 'fas fa-girders',
        formulas: [
          {
            id: 'beam-load',
            name: 'Beam Load',
            formula: 'UDL = (L × W × D × ρ × g) / L',
            description: 'Self weight of beam per meter',
            variables: {
              UDL: 'Load (N/m)',
              ρ: 'Density (kg/m³)',
              g: 'Gravity (m/s²)'
            }
          },
          {
            id: 'bending-moment',
            name: 'Bending Moment',
            formula: 'M = FL/4 (Point) or WL/8 (UDL)',
            description: 'Maximum bending moment',
            variables: {
              M: 'Moment (N⋅m)',
              F: 'Force (N)',
              L: 'Span (m)'
            }
          },
          {
            id: 'shear-force',
            name: 'Shear Force',
            formula: 'V = F/2 (Point) or wL/2 (UDL)',
            description: 'Maximum Shear Force',
            variables: {
              V: 'Shear (kN)',
              F: 'Load (kN)',
              L: 'Span (m)'
            }
          },
          {
            id: 'beam-deflection',
            name: 'Beam Deflection Calculator',
            formula: 'δ = (P × L³) / (48 × E × I)',
            description: 'Deflection of SS Beam (Point Load)',
            variables: {
              δ: 'Deflection (mm)',
              P: 'Load (N)',
              E: 'Modulus',
              I: 'Inertia'
            }
          },
          {
            id: 'column-load',
            name: 'Axial Load Calculator',
            formula: 'Pu = 0.4fck⋅Ac + 0.67fy⋅Asc',
            description: 'Axial Load Capacity of Column',
            variables: {
              Pu: 'Capacity (kN)',
              fck: 'Concrete Grade',
              fy: 'Steel Grade',
              Ac: 'Area Concrete'
            }
          },
          {
            id: 'slab-thickness',
            name: 'Slab Thickness',
            formula: 'd = Span / Ratio',
            description: 'Effective Depth for Stiffness',
            variables: {
              d: 'Eff. Depth',
              Span: 'Slab Span',
              Ratio: 'L/d Ratio'
            }
          },
          {
            id: 'footing-size',
            name: 'Footing Size',
            formula: 'Area = (Load × 1.1) / SBC',
            description: 'Required Footing Area',
            variables: {
              A: 'Area (m²)',
              P: 'Column Load',
              SBC: 'Soil Capacity'
            }
          },
          {
            id: 'reinforcement',
            name: 'Steel Reinforcement',
            formula: 'Weight = Vol × % × Density',
            description: 'Steel quantity estimate',
            variables: {
              W: 'Weight (kg)',
              V: 'Concrete Vol',
              p: 'Percentage'
            }
          },
          {
            id: 'safety-factor',
            name: 'Structural Safety Factor Calculator',
            formula: 'SF = Ultimate / Working',
            description: 'Structural Safety Factor',
            variables: {
              SF: 'Factor',
              Ult: 'Ultimate Load',
              Work: 'Working Load'
            }
          }
        ]
      },
      {
        id: 'geotechnical',
        name: 'Geotechnical',
        icon: 'fas fa-mountain',
        formulas: [
          {
            id: 'bearing-capacity',
            name: 'Bearing Capacity',
            formula: 'qu = cNc + qNq + 0.5γBNγ',
            description: "Terzaghi's Bearing Capacity (Strip)",
            variables: {
              qu: 'Ult. Capacity (kPa)',
              c: 'Cohesion (kPa)',
              φ: 'Friction Angle',
              γ: 'Unit Weight'
            }
          },
          {
            id: 'safe-bearing',
            name: 'Safe Bearing Capacity',
            formula: 'q_safe = q_u / FS',
            description: 'Determine Safe Load based on FS',
            variables: {
              qs: 'Safe Capacity',
              qu: 'Ult. Capacity',
              FS: 'Safety Factor'
            }
          },
          {
            id: 'soil-density',
            name: 'Soil Density',
            formula: 'γ = Weight / Volume',
            description: 'Unit Weight Determination',
            variables: {
              γ: 'Density (kN/m³)',
              W: 'Weight',
              V: 'Volume'
            }
          },
          {
            id: 'earth-pressure',
            name: 'Earth Pressure',
            formula: 'P = 0.5 K γ H²',
            description: 'Lateral Earth Pressure (Rankine)',
            variables: {
              P: 'Thrust (kN/m)',
              K: 'Coeff (Ka/Kp)',
              H: 'Height (m)'
            }
          },
          {
            id: 'compaction',
            name: 'Compaction Density',
            formula: 'ρd = ρb / (1 + w)',
            description: 'Dry Density from Wet Density',
            variables: {
              ρd: 'Dry Density',
              ρb: 'Bulk Density',
              w: 'Moisture %'
            }
          },
          {
            id: 'slope-stability',
            name: 'Slope Stability',
            formula: 'FS = (c + σ tanφ) / τ',
            description: 'Infinite Slope Analysis',
            variables: {
              FS: 'Factor Safety',
              β: 'Slope Angle',
              φ: 'Friction Angle'
            }
          },
          {
            id: 'settlement',
            name: 'Settlement',
            formula: 'Sc = [Cc H / (1+e0)] log((p0+Δp)/p0)',
            description: 'Primary Consolidation Settlement',
            variables: {
              Sc: 'Settlement',
              Cc: 'Comp. Index',
              p0: 'Stress'
            }
          },
          {
            id: 'cbr',
            name: 'CBR Value',
            formula: 'CBR = (Load / Standard) × 100',
            description: 'California Bearing Ratio',
            variables: {
              CBR: 'Ratio (%)',
              L: 'Test Load',
              S: 'Std. Load'
            }
          },
          {
            id: 'pile-capacity',
            name: 'Pile Capacity',
            formula: 'Qu = αcAs + 9cAb',
            description: 'Axial Capacity of Pile (Cohesive)',
            variables: {
              Qu: 'Capacity',
              c: 'Cohesion',
              d: 'Diameter'
            }
          },
          {
            id: 'moisture-content',
            name: 'Moisture Content',
            formula: 'w = (Ww / Wd) × 100',
            description: 'Water content determination',
            variables: {
              w: 'Moisture %',
              Ww: 'Water Weight',
              Wd: 'Dry Weight'
            }
          }
        ]
      },
      {
        id: 'surveying',
        name: 'Surveying',
        icon: 'fas fa-map-marked-alt',
        formulas: [
          {
            id: 'level-diff',
            name: 'Level Difference',
            formula: 'RL_next = (RL + BS) - FS',
            description: 'Rise and Fall Method',
            variables: {
              RL: 'Reduced Level',
              BS: 'Backsight',
              FS: 'Foresight'
            }
          }
        ]
      },
      {
        id: 'surveying',
        name: 'Surveying',
        icon: 'fas fa-map-marked-alt',
        formulas: [
          {
            id: 'level-difference',
            name: 'Level Difference',
            formula: 'HI = RL + BS, RL_next = HI - FS',
            description: 'Height of Instrument Method',
            variables: {
              RL: 'Reduced Level',
              BS: 'Backsight',
              FS: 'Foresight'
            }
          },
          {
            id: 'gradient',
            name: 'Gradient',
            formula: 'Gradient = Rise / Run',
            description: 'Slope Calculation',
            variables: {
              Rise: 'Vertical Dist',
              Run: 'Horizontal Dist',
              θ: 'Angle'
            }
          },
          {
            id: 'land-area',
            name: 'Land Area Calculator',
            formula: 'Area = A1 + A2 (Triangulation)',
            description: 'Calculate Area of Rect, Triangle, or Irregular Polygon',
            variables: {
              Area: 'Total Area',
              s: 'Sides',
              d: 'Diagonal'
            }
          },
          {
            id: 'chain-survey',
            name: 'Chain Survey',
            formula: 'L = (l\'/l) * L\'',
            description: 'True Length Correction',
            variables: {
              L: 'True Length',
              l_act: 'Actual Length',
              l_std: 'Std Length'
            }
          },
          {
            id: 'distance-conversion',
            name: 'Distance Conversion',
            formula: 'Unit Conversion',
            description: 'Convert Length Units',
            variables: {
              D: 'Distance',
              From: 'Source Unit',
              To: 'Target Unit'
            }
          },
          {
            id: 'area-conversion',
            name: 'Area Conversion',
            formula: 'Unit Conversion',
            description: 'Convert Land Areas',
            variables: {
              A: 'Area',
              From: 'Source Unit',
              To: 'Target Unit'
            }
          }
        ]
      },
      {
        id: 'transportation',
        name: 'Transportation',
        icon: 'fas fa-road',
        formulas: [
          {
            id: 'ssd',
            name: 'Stopping Sight Distance',
            formula: 'SSD = vt + v²/2g(f±G)',
            description: 'Distance required to stop vehicle safely',
            variables: {
              SSD: 'Distance (m)',
              v: 'Speed (m/s)',
              t: 'Reaction Time (s)',
              f: 'Friction Coeff'
            }
          },
          {
            id: 'osd',
            name: 'Overtaking Sight Distance',
            formula: 'OSD = d1 + d2 + d3',
            description: 'Safe Overtaking Distance',
            variables: {
              OSD: 'Distance (m)',
              v: 'Overtaking Speed',
              vb: 'Overtaken Speed'
            }
          },
          {
            id: 'pavement',
            name: 'Pavement Thickness',
            formula: 'T = (219 * N^0.155) / CBR^0.35',
            description: 'Flexible Pavement Design (Approx)',
            variables: {
              T: 'Thickness (mm)',
              N: 'Traffic (msa)',
              CBR: 'Soil Strength %'
            }
          },
          {
            id: 'traffic-flow',
            name: 'Traffic Flow',
            formula: 'q = k × v or q = 3600/h',
            description: 'Traffic Stream Models',
            variables: {
              q: 'Flow (veh/hr)',
              k: 'Density',
              v: 'Speed',
              h: 'Headway'
            }
          }
        ]
      },
      {
        id: 'environmental',
        name: 'Environmental',
        icon: 'fas fa-leaf',
        formulas: [
          {
            id: 'water-demand',
            name: 'Water Demand Calculator',
            formula: 'Q = Population × LPCD',
            description: 'Estimate Total Water Requirement',
            variables: {
              Pop: 'Population',
              LPCD: 'Litres/Capita'
            }
          },
          {
            id: 'rainwater',
            name: 'Rainwater Harvesting Calculator',
            formula: 'V = Area × Rainfall × C',
            description: 'Potential Harvestable Water',
            variables: {
              A: 'Roof Area',
              R: 'Rainfall',
              C: 'Coeff.'
            }
          },
          {
            id: 'runoff',
            name: 'Runoff Calculator',
            formula: 'Q = C × I × A',
            description: 'Rational Method for Peak Runoff',
            variables: {
              C: 'Coeff.',
              I: 'Intensity',
              A: 'Area'
            }
          },
          {
            id: 'tank-capacity',
            name: 'Water Tank Capacity Calculator',
            formula: 'V = L×W×D or πr²D',
            description: 'Volume of Rect/Cylindrical Tanks',
            variables: {
              V: 'Volume',
              D: 'Depth',
              Dim: 'L/W or Dia'
            }
          },
          {
            id: 'sewage-flow',
            name: 'Sewage Flow Calculator',
            formula: 'Q_sew = 0.80 × Water Demand',
            description: 'Estimate Sewage Generation',
            variables: {
              Q: 'Sewage',
              W: 'Water Supply'
            }
          }
        ]
      },
      {
        id: 'quantity',
        name: 'Quantity & Utilities',
        icon: 'fas fa-calculator',
        formulas: [
          {
            id: 'staircase',
            name: 'Staircase Calculator',
            formula: 'Risers = H / R, Tread_run = T × (R-1)',
            description: 'Design Staircase Steps',
            variables: {
              H: 'Height',
              R: 'Riser',
              T: 'Tread'
            }
          },
          {
            id: 'railing',
            name: 'Railing Length',
            formula: 'L = Length × Floors',
            description: 'Estimate Railing Quantity',
            variables: {
              L: 'Length',
              N: 'Floors'
            }
          },
          {
            id: 'excavation',
            name: 'Excavation Volume',
            formula: 'V = L × W × D × Nos',
            description: 'Earthwork Volume',
            variables: {
              V: 'Volume',
              D: 'Depth'
            }
          },
          {
            id: 'plinth-area',
            name: 'Plinth Area',
            formula: 'PA = Carpet Area + Wall Area',
            description: 'Built-up Area Estimation',
            variables: {
              PA: 'Plinth Area',
              CA: 'Carpet Area'
            }
          },
          {
            id: 'carpet-area',
            name: 'Carpet Area',
            formula: 'CA = Built-up × (1 - %deduction)',
            description: 'Usable Area Estimation',
            variables: {
              CA: 'Carpet Area',
              BA: 'Built-up'
            }
          }
        ]
      }
    ]
  }
];

export const unitConversions = {
  voltage: { V: 1, mV: 0.001, kV: 1000 },
  current: { A: 1, mA: 0.001, μA: 0.000001 },
  resistance: { Ω: 1, kΩ: 1000, MΩ: 1000000 },
  power: { W: 1, mW: 0.001, kW: 1000, MW: 1000000 },
  capacitance: { F: 1, mF: 0.001, μF: 0.000001, nF: 0.000000001, pF: 0.000000000001 },
  inductance: { H: 1, mH: 0.001, μH: 0.000001 },
  force: { N: 1, kN: 1000, lbf: 4.448 },
  mass: { kg: 1, g: 0.001, lb: 0.453592 },
  length: { m: 1, mm: 0.001, cm: 0.01, km: 1000, in: 0.0254, ft: 0.3048 },
  area: { 'm²': 1, 'cm²': 0.0001, 'mm²': 0.000001, 'in²': 0.00064516, 'ft²': 0.092903 },
  pressure: { Pa: 1, kPa: 1000, MPa: 1000000, GPa: 1000000000, psi: 6895, bar: 100000 },
  stress: { Pa: 1, kPa: 1000, MPa: 1000000, GPa: 1000000000, psi: 6895 },
  temperature: { K: 1 }, // Temperature handling is usually special-cased for C/F conversion
  volume: { 'm³': 1, L: 0.001, 'cm³': 0.000001 },
  time: { s: 1, min: 60, h: 3600 },
  velocity: { 'm/s': 1, 'km/h': 0.277778, 'mph': 0.44704 },
  angular_velocity: { 'rad/s': 1, 'rpm': 0.10472 },
  viscosity: { 'Pa·s': 1, 'cP': 0.001 },
  energy: { J: 1, kJ: 1000, cal: 4.184, kcal: 4184, Wh: 3600, kWh: 3600000 },
  specific_heat: { 'J/kg·K': 1, 'kJ/kg·K': 1000, 'cal/g·°C': 4184 },
  frequency: { Hz: 1, kHz: 1000, MHz: 1000000, GHz: 1000000000 },
  apparent_power: { VA: 1, kVA: 1000, MVA: 1000000 },
  reactive_power: { VAR: 1, kVAR: 1000, MVAR: 1000000 },
  angle: { deg: 1, rad: 57.2958 },
  capacity: { Ah: 1, mAh: 0.001 }
};
