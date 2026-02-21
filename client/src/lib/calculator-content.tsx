import React from 'react';
import { Formula } from './formulas';
// Hardcoded bespoke text overrides mapped by formula/calculator ID for specific future optimizations.
const contentOverrides: Record<string, {
    howToUse?: string;
    explanation?: React.ReactNode;
    applications?: React.ReactNode;
    faqs?: Array<{
        question: string; answer: string;
    }>;
}> = {
    // Example specific override:
    // 'voltage': { howToUse: "Select Ohm's Law calculator, input...", ... }
};

export const getHowToUse = (formula: any, fallbackName: string) => {
    if (!formula) return `Select the ${fallbackName} calculator and input your known variables into the fields provided. The calculation processes automatically. Use "Clear" to reset the parameters.`;
    if (contentOverrides[formula.id]?.howToUse) return contentOverrides[formula.id].howToUse;

    const variableNames = formula.variables ? Object.values(formula.variables).join(', ') : 'the required inputs';
    return `To use the ${formula.name} calculator effectively, input your known parameters for ${variableNames} into the specified fields. The tool will automatically compute the missing variable utilizing the active equation. Use the "Clear" button to wipe the values when starting a new calculation.`;
};

export const getEngineeringExplanation = (disciplineId: string, formula: any, fallbackName: string) => {
    if (formula && contentOverrides[formula.id]?.explanation) return contentOverrides[formula.id].explanation;

    const baseText = (() => {
        if (disciplineId === 'electrical') {
            return (
                <React.Fragment>
                    <p>
                        Electrical engineering is fundamentally rooted in the study and application of electricity, electronics, and electromagnetism. This discipline governs everything from microscopic semiconductor devices to massive interconnected power grids that spanning continents. At its core, electrical engineering relies on the movement of electrons through conductive materials, driven by electromotive force (voltage) and opposed by resistance or impedance.
                    </p>
                    <p>
                        The foundational principles of classical electromagnetism were unified by James Clerk Maxwell in the 19th century. Maxwell's equations describe how electric charges produce electric fields, how currents produce magnetic fields, and how changing magnetic fields induce electromotive forces—a phenomenon known as Faraday's Law of Induction. This principle of electromagnetic induction is the heartbeat of modern power generation and transmission, enabling transformers to step voltages up and down efficiently.
                    </p>
                    <p>
                        In circuit theory, Ohm's Law ($V = IR$) forms the baseline relationship between voltage, current, and resistance in DC circuits. As systems transition to Alternating Current (AC), the concept of resistance expands into impedance ($Z$), which incorporates the complex effects of capacitance and inductance. Capacitors store energy in electric fields and oppose changes in voltage, while inductors store energy in magnetic fields and oppose changes in current. This interplay creates phase shifts between voltage and current waveforms in AC systems.
                    </p>
                    <p>
                        Electrical engineers utilize these principles to design power distribution networks, ensuring power quality, load balancing, and fault protection. Protection mechanisms like circuit breakers and relays are calibrated using rigorous short-circuit calculations to isolate faults safely and rapidly. Overall, this discipline requires a deep understanding of complex mathematics to analyze transient responses, steady-state power flow, and the delicate balance required to maintain a synchronized electrical grid.
                    </p>
                </React.Fragment>
            );
        } else if (disciplineId === 'mechanical') {
            return (
                <React.Fragment>
                    <p>
                        Mechanical engineering is one of the broadest and oldest engineering disciplines, focusing on the design, analysis, manufacturing, and maintenance of mechanical systems. It marries the principles of classical physics—specifically mechanics, kinematics, thermodynamics, and fluid dynamics—with materials science to create functional machinery, structures, and tools.
                    </p>
                    <p>
                        The bedrock of mechanical engineering rests on Sir Isaac Newton's three laws of motion. The second law ($F = ma$) is particularly vital, establishing the quantitative relationship between the forces applied to an object, its mass, and its resulting acceleration. This forms the basis of statics (the study of forces in equilibrium) and dynamics (the study of forces and motion). Engineers apply statics to ensure structures like bridges and building frames can withstand expected loads without failure, utilizing concepts of stress (internal force per area) and strain (deformation).
                    </p>
                    <p>
                        Thermodynamics is another essential pillar, governing the transfer of heat and energy. The laws of thermodynamics dictate limits on the efficiency of engines and refrigerators. Mechanical engineers use these laws to optimize HVAC systems, internal combustion engines, and power plants. Fluid mechanics, the study of how fluids (liquids and gases) behave at rest and in motion, is equally critical. It underpins the design of aerodynamic vehicle profiles, hydraulic systems, pumps, and piping networks, utilizing principles like Bernoulli's equation to balance pressure, velocity, and elevation.
                    </p>
                    <p>
                        In machine design, engineers must select materials based on their properties—such as yield strength, hardness, and fatigue limits—to ensure components like gears, shafts, and bearings suffer minimum wear over their lifespan. Modern mechanical engineering relies heavily on Computer-Aided Design (CAD) and Finite Element Analysis (FEA) to simulate complex physical interactions, predicting failure points and optimizing designs long before physical prototypes are manufactured.
                    </p>
                </React.Fragment>
            );
        } else if (disciplineId === 'civil') {
            return (
                <React.Fragment>
                    <p>
                        Civil engineering focuses on the planning, design, construction, and maintenance of the physical and naturally built environment. It is the discipline responsible for the fundamental infrastructure that sustains modern society, encompassing roads, bridges, canals, dams, airports, sewage systems, pipelines, and structural components of buildings.
                    </p>
                    <p>
                        Structural engineering, a core sub-discipline, involves analyzing and designing structures to support or resist loads. Engineers must calculate the forces (such as gravity, wind, earthquakes, and live dynamic loads) acting on a structure and design load-bearing elements (beams, columns, slabs) to safely transmit those forces to the foundation. This requires a profound understanding of material properties, particularly concrete and steel. Reinforced concrete takes advantage of concrete's high compressive strength combined with steel's high tensile strength, creating resilient composite beams and columns.
                    </p>
                    <p>
                        Geotechnical engineering is equally critical, dealing with the behavior of earth materials. Every civil engineering project requires a stable foundation, making it essential to understand soil mechanics and rock mechanics. Engineers analyze soil bearing capacity, settlement, slope stability, and groundwater conditions to design safe foundations, retaining walls, and tunnels. Terzaghi's principle of effective stress is a cornerstone concept here, dictating how soil strength depends on the pressure from solid particles rather than pore water.
                    </p>
                    <p>
                        Furthermore, civil engineering bridges the gap between infrastructure and nature through environmental and water resources engineering. This involves designing systems to manage clean water supply, wastewater treatment, and stormwater drainage to prevent flooding. Overall, civil engineers must balance rigorous structural calculations with environmental sustainability, economic constraints, and public safety regulations to execute large-scale, long-lasting projects.
                    </p>
                </React.Fragment>
            );
        }
        return null;
    })();

    const specificIntro = formula ? (
        <p className="mb-4 font-medium">
            This specific calculation operates by evaluating {formula.variables ? Object.values(formula.variables).join(', ') : 'the specified parameters'}. The formula `{formula.formula}` defines the mathematical relationship where {formula.description.toLowerCase()}, ensuring accuracy when working within bounds.
        </p>
    ) : (
        <p className="mb-4 font-medium">
            The {fallbackName} calculator isolates physical variables allowing engineers to precisely evaluate localized conditions before applying them to macroscopic designs.
        </p>
    );

    return (
        <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            {specificIntro}
            {baseText}
        </div>
    );
};

export const getPracticalApplications = (disciplineId: string, formula: any, fallbackName: string) => {
    if (formula && contentOverrides[formula.id]?.applications) return contentOverrides[formula.id].applications;

    if (formula) {
        const varKeys = formula.variables ? Object.keys(formula.variables).join(' and ') : 'these';
        if (disciplineId === 'electrical') {
            return `Electrical engineers extensively apply the ${formula.name} calculator when sizing components such as breakers, cables, or transformers that rely strictly on ${varKeys} variables to ensure safety mechanisms do not prematurely trip or fail during surge conditions.`;
        }
        if (disciplineId === 'mechanical') {
            return `Mechanical engineers deploy the ${formula.name} formula during the blueprinting and testing stages to correctly size moving machinery, balancing variables like ${varKeys} to guarantee performance longevity and mitigate premature wear resulting from stress fatigue.`;
        }
        if (disciplineId === 'civil') {
            return `Civil engineers require the ${formula.name} calculations out in the field and the design office, balancing ${varKeys} factors to confidently verify load safety standards for municipal infrastructures and large-scale structural concrete deployments.`;
        }
    }

    return `Engineers rely on the ${fallbackName} tools extensively in physical design planning to ensure all elements satisfy the strict limits dictated by classical physics and local regulatory codes.`;
};

export const getFAQs = (formula: any, fallbackName: string) => {
    const overrideFaqs = formula ? contentOverrides[formula.id]?.faqs : undefined;
    if (overrideFaqs) return overrideFaqs;

    const toolName = formula?.name || fallbackName;

    return [
        {
            question: `Are the outputs for the ${toolName} calculations universally applicable?`,
            answer: `Yes, the underlying logic uses standardized formulas (${formula?.formula || "classical physics"}). However, real-world deployment always demands evaluating specific environmental conditions and adhering to local regulatory codes (e.g., NEC, IEEE, or ACI safety factor ratings).`
        },
        {
            question: `What happens if I input mixed unit prefixes into the ${toolName} fields?`,
            answer: `Calculators require inputs to align with absolute base units or specific scale prefixes outlined on the labels. For conversions prior to calculating, please utilize the sidebar Unit Converter tool.`
        },
        {
            question: `How precise is the ${toolName} generator?`,
            answer: `The algorithm calculates precision accurate up to float processing limits, natively rounding to acceptable engineering decimal places to prevent infinite trailing digits from distorting UI legibility.`
        },
        {
            question: `Can the ${toolName} equation run backwards?`,
            answer: `Most fields in the app are dynamically scoped. You can leave one targeted parameter blank and populate the others to resolve the missing integer if the underlying mathematical relationships support inverse derivation natively.`
        },
        {
            question: `Are these ${toolName} values safe for production?`,
            answer: `While the calculators are mathematically flawless representations of theoretical physics, they should act as a supplement, never replacing verified field testing and certified Professional Engineer (PE) signatory approvals.`
        }
    ];
};

export const calculatorDescriptions: Record<string, string> = {
    // Strength of Materials
    'stress': `
### Normal Stress (σ)

**Definition:**
Normal stress is the internal resisting force per unit area acting normal (perpendicular) to the cross-section of a material. It arises when an external force is applied to a body, causing it to deform. In simple terms, it is a measure of the intensity of the internal forces distributed over a given cross-sectional area.

**Formula:**
The formula for calculating normal stress is:
\\[ \\sigma = \\frac{F}{A} \\]
Where:
- \\( \\sigma \\) (Sigma) is the normal stress (Pa or N/m²).
- \\( F \\) is the applied force acting perpendicular to the area (N).
- \\( A \\) is the cross-sectional area (m²).

**Types of Normal Stress:**
1.  **Tensile Stress:** Occurs when the applied force pulls the material apart, causing elongation. It is typically considered positive.
2.  **Compressive Stress:** Occurs when the applied force pushes the material together, causing shortening. It is typically considered negative.

**Applications:**
- Designing structural members like columns and beams.
- Analyzing the strength of cables and ropes under tension.
- Determining the required cross-sectional area for machine components to withstand loads.

**Unit System:**
- **SI Units:** Pascal (Pa), Kilopascal (kPa), Megapascal (MPa). Note: 1 MPa = 1 N/mm².
- **US Customary Units:** Pounds per square inch (psi), Kips per square inch (ksi).
`,
    'strain': `
### Normal Strain (ε)

**Definition:**
Normal strain is a dimensionless quantity that measures the deformation of a material relative to its original length. It defines how much a material has stretched or compressed under an applied load.

**Formula:**
The formula for normal strain is:
\\[ \\epsilon = \\frac{\\Delta L}{L_0} \\]
Where:
- \\( \\epsilon \\) (Epsilon) is the normal strain (dimensionless).
- \\( \\Delta L \\) is the change in length (deformation) (m).
- \\( L_0 \\) is the original length (m).

**Sign Convention:**
- **Positive Strain:** Elongation (Tensile).
- **Negative Strain:** Contraction (Compressive).

**Relationship to Stress:**
In the elastic region of many materials, strain is directly proportional to stress, a relationship described by Hooke's Law:
\\[ \\sigma = E \\cdot \\epsilon \\]
Where \\( E \\) is the Modulus of Elasticity (Young's Modulus).

**Applications:**
- Measuring material deformation in testing laboratories.
- Monitoring structural health using strain gauges.
- Calculating thermal expansion effects.
`,
    'youngs-modulus': `
### Young's Modulus (E)

**Definition:**
Young's Modulus, also known as the Modulus of Elasticity, is a measure of the stiffness of a solid material. It defines the relationship between stress and strain in a material in the linear elastic regime of a uniaxial deformation.

**Formula:**
From Hooke's Law:
\\[ E = \\frac{\\sigma}{\\epsilon} \\]
Where:
- \\( E \\) is Young's Modulus (Pa).
- \\( \\sigma \\) is the uniaxial stress (Pa).
- \\( \\epsilon \\) is the uniaxial strain (dimensionless).

**Physical Meaning:**
A material with a high Young's Modulus is stiff definition (e.g., steel, diamond), meaning it deforms very little under load. A material with a low Young's Modulus is flexible (e.g., rubber, nylon).

**Common Values:**
- **Steel:** ~200 GPa
- **Aluminum:** ~69 GPa
- **Glass:** ~50-90 GPa
- **Rubber:** ~0.01-0.1 GPa

**Applications:**
- Material selection for engineering design based on stiffness requirements.
- Calculating beam deflection and column buckling loads.
- Analyzing composite materials.
`,
    'shear-stress': `
### Shear Stress (τ)

**Definition:**
Shear stress is the component of stress coplanar with a material cross-section. Unlike normal stress which acts perpendicular to the surface, shear stress acts parallel to the surface. It arises from shear forces, which are pairs of equal and opposing forces acting on opposite sides of an object.

**Formula:**
The average shear stress is calculated as:
\\[ \\tau = \\frac{V}{A} \\]
Where:
- \\( \\tau \\) (Tau) is the shear stress (Pa).
- \\( V \\) is the shear force (N).
- \\( A \\) is the area resisting the shear (m²).

**Applications:**
- Analyzing bolted and riveted joints.
- Designing drive shafts and couplings (torsional shear stress).
- Evaluating beam webs for shear failure.
- Understanding fluid flow (viscous shear).

**Failure Mode:**
Materials often fail in shear differently than in tension. Ductile materials (like mild steel) tend to yield in shear at about 57.7% of their tensile yield strength (von Mises criterion).
`,
    'shear-strain': `
### Shear Strain (γ)

**Definition:**
Shear strain measures the change in angle between two originally perpendicular line segments within a material. While normal strain involves a change in length, shear strain involves a shape change (distortion).

**Formula:**
For small deformations:
\\[ \\gamma \\approx \\tan(\\gamma) = \\frac{\\delta}{L} \\]
Where:
- \\( \\gamma \\) (Gamma) is the shear strain (radians).
- \\( \\delta \\) is the transverse deformation (m).
- \\( L \\) is the perpendicular length (m).

**Modulus of Rigidity (G):**
Shear stress and shear strain are related by the Modulus of Rigidity (Shear Modulus) \\( G \\):
\\[ \\tau = G \\cdot \\gamma \\]

**Applications:**
- Torsion of shafts.
- Deflection of beams due to shear (Timoshenko beam theory).
- Soil mechanics and geological faulting.
`,
    'bending-stress': `
### Bending Stress (σ)

**Definition:**
Bending stress is the normal stress induced in a beam when it is subjected to a bending moment. It varies linearly across the cross-section, being zero at the neutral axis and maximum at the extreme fibers (top and bottom surfaces).

**Formula:**
The flexure formula is:
\\[ \\sigma = -\\frac{M \\cdot y}{I} \\]
Where:
- \\( \\sigma \\) is the bending stress (Pa).
- \\( M \\) is the internal bending moment (N·m).
- \\( y \\) is the perpendicular distance from the neutral axis to the point of interest (m).
- \\( I \\) is the Area Moment of Inertia of the cross-section about the neutral axis (m⁴).

**Sign Convention:**
Typically, a positive bending moment causes compression in the top fibers and tension in the bottom fibers (smiling beam). Detailed analysis requires careful attention to signs.

**Key Concepts:**
- **Neutral Axis:** The axis where stress and strain are zero.
- **Section Modulus (S):** A geometric property defined as \\( I/c \\), where \\( c \\) is the distance to the extreme fiber. Max stress \\( \\sigma_{max} = M/S \\).

**Applications:**
- Determining the load capacity of beams (girders, floor joists).
- Designing vehicle chassis rails.
- Analyzing leaf springs.
`,
    'bending-moment': `
### Bending Moment (M)

**Definition:**
A bending moment is the reaction induced in a structural element when an external force or moment is applied to the element causing the element to bend. It is a measure of the bending effect at a specific cross-section of a beam.

**Formula (Cantilever Beam with Point Load):**
For a simple cantilever beam of length \\( L \\) with a point load \\( F \\) at the end:
\\[ M = F \\cdot L \\]
For a simply supported beam with a central point load:
\\[ M_{max} = \\frac{F \\cdot L}{4} \\]

**Relationship to Shear Force:**
The derivative of the bending moment with respect to distance \\( x \\) is the shear force \\( V(x) \\):
\\[ \\frac{dM}{dx} = V \\]

**Applications:**
- Constructing Shear and Moment Diagrams (V-M Diagrams).
- Determining the location and magnitude of maximum bending for design.
- Reinforcing concrete beams (placing steel where tension occurs).
`,
    'torsional-stress': `
### Torsional Stress (τ)

**Definition:**
Torsional stress (or shear stress due to torsion) occurs when a torque is applied to a shaft, causing it to twist. The stress varies linearly from zero at the center to a maximum at the outer surface.

**Formula:**
\\[ \\tau = \\frac{T \\cdot r}{J} \\]
Where:
- \\( \\tau \\) is the torsional shear stress (Pa).
- \\( T \\) is the applied torque (N·m).
- \\( r \\) is the radial distance from the center (m).
- \\( J \\) is the Polar Moment of Inertia (m⁴).

**Polar Moment of Inertia (J):**
For a solid circular shaft of diameter \\( D \\):
\\[ J = \\frac{\\pi D^4}{32} \\]
For a hollow shaft:
\\[ J = \\frac{\\pi (D_{outer}^4 - D_{inner}^4)}{32} \\]

**Applications:**
- Designing power transmission shafts (automotive driveshafts, propeller shafts).
- Sizing bolts and screws to prevent stripping during tightening.
- Analysis of drill bits.
`,
    'beam-deflection': `
### Beam Deflection (δ)

**Definition:**
Beam deflection is the displacement of a point on a beam from its original unloaded position. Limiting deflection is a crucial serviceability requirement in structural design to prevent cracking, misalignment, or uncomfortable vibrations.

**Formula (Cantilever Beam with End Load):**
Max deflection at the free end:
\\[ \\delta = \\frac{F L^3}{3 E I} \\]
**Formula (Simply Supported Beam with Center Load):**
Max deflection at the center:
\\[ \\delta = \\frac{F L^3}{48 E I} \\]
Where:
- \\( \\delta \\) is the deflection (m).
- \\( F \\) is the load (N).
- \\( L \\) is the length (m).
- \\( E \\) is the Modulus of Elasticity (Pa).
- \\( I \\) is the Moment of Inertia (m⁴).

**Dependencies:**
Deflection is highly sensitive to span length (cubic relationship) and depth of the beam (effect on \\( I \\)).

**Applications:**
- Ensuring floor systems do not sag noticeably.
- Designing bridges to maintain clearances.
- Precision machine tool beds.
`,
    'fos': `
### Factor of Safety (FoS)

**Definition:**
The Factor of Safety (also known as safety factor) is a term describing the structural capacity of a system beyond the expected loads or actual loads. It implies the margin of security against failure.

**Formula:**
\\[ \\text{FoS} = \\frac{\\text{Failure Stress}}{\\text{Allowable Stress}} \\]
Or:
\\[ \\text{FoS} = \\frac{\\text{Yield Strength}}{\\text{Working Stress}} \\]

**Interpretation:**
- **FoS < 1:** The design is unsafe and will likely fail.
- **FoS = 1:** The structure is at the limit of its capacity.
- **FoS > 1:** The design has a margin of safety.
Common values range from 1.1 (aerospace, highly controlled) to 10+ (elevators, rough estimates).

**Selection Criteria:**
The choice of FoS depends on:
- Uncertainty in material properties.
- Uncertainty in load definition.
- Consequences of failure (loss of life vs. minor damage).
- Cost of over-engineering.

**Applications:**
- Every aspect of engineering design to ensure reliability and safety.
`
};
