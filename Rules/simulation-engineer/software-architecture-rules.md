# Simulation Software Architecture Rules
## Purpose
Keep model logic, numerical infrastructure, experiment orchestration, and I/O independently testable.
## Scope
Modules, dependencies, interfaces, plugins, and extension points.
## MUST
- Separate domain equations/model behavior from orchestration and presentation concerns.
- Make dependency direction and public contracts explicit.
- Protect core model semantics with regression and architecture tests.
## MUST NOT
- Hide material model assumptions inside generic infrastructure code.
- create cyclic dependencies that obscure state ownership.
## SHOULD
- Isolate replaceable solvers and external systems behind narrow interfaces.
## Exceptions
Performance-driven coupling requires measured benefit, documented trade-off, and targeted tests.
## Verification
Review dependency graphs, interfaces, architecture tests, and change impact.