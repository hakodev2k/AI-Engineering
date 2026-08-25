# Testing and Simulation Rules
## Purpose
Build layered evidence before exposing hardware and people to new robot behavior.
## Scope
Unit, integration, simulation, hardware-in-loop, bench, and robot tests.
## MUST
- Test critical invariants, boundaries, faults, recovery paths, and unsafe-command rejection.
- Progress from lower-risk environments to hardware with explicit entry criteria.
- Identify simulation assumptions and validate important sim-to-real gaps with measurements.
- Make regression tests deterministic or explicitly quantify tolerated nondeterminism.
## MUST NOT
- Treat simulation success as sufficient evidence for physical safety.
- Run first-of-kind high-energy tests without bounded speed/force/workspace controls.
## SHOULD
- Preserve failing scenarios as automated regressions where practical.
## Exceptions
Skipping a test layer requires documented reason, equivalent evidence, risk assessment, and approval when consequential.
## Verification
Review CI results, coverage of critical scenarios, simulator configuration, HIL records, test protocols, and hardware evidence.