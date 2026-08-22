# Test Design Rules
## Purpose
Create efficient tests that expose meaningful defects rather than merely exercise paths.
## Scope
Functional, integration, system, exploratory, and regression test design.
## MUST
- Cover valid, invalid, boundary, state-transition, permission, and failure behavior when relevant.
- Make expected results explicit and independently observable.
- Design tests around behavior and risk rather than implementation details unless implementation verification is intentional.
## MUST NOT
- Duplicate tests without a distinct risk or diagnostic purpose.
- Use happy-path coverage as a substitute for boundary and failure analysis.
## SHOULD
- Apply equivalence partitioning, boundary analysis, decision tables, state models, and pairwise techniques where they reduce redundancy.
## Exceptions
Exploratory charters may defer exact cases but must state mission, scope, and evidence captured.
## Verification
Peer-review test design against requirements, risk map, boundary conditions, and defect history.