# Units and Dimensional Analysis Rules
## Purpose
Prevent scale, conversion, and dimensional defects.
## Scope
Inputs, state variables, equations, interfaces, datasets, and outputs.
## MUST
- Define units for every dimensional quantity at system boundaries.
- Perform explicit conversions at controlled boundaries.
- Check dimensional consistency of equations and derived quantities.
## MUST NOT
- Depend on undocumented implicit unit conventions across modules.
- Mix coordinate, angle, time, or temperature conventions without explicit conversion.
## SHOULD
- Encode units in types or validated metadata where tooling permits.
## Exceptions
Dimensionless normalized representations require documented normalization and inverse transformation.
## Verification
Use dimensional checks, boundary tests, known-value tests, and review of conversion code.