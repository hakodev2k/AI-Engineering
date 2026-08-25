# Code and Architecture Rules
## Purpose
Keep robotics software maintainable without obscuring physical-system boundaries and failure semantics.
## Scope
Modules, dependencies, concurrency, interfaces, error handling, and shared libraries.
## MUST
- Separate hardware access, estimation, planning, control, safety, and application concerns where their failure modes or rates differ.
- Make ownership of mutable state and concurrency explicit.
- Preserve diagnostic context for unexpected errors and propagate consequential failures to a responsible layer.
- Document public contracts and compatibility expectations for reusable robot components.
## MUST NOT
- Silently swallow unexpected exceptions or hardware faults.
- Introduce hidden cross-module state that can change physical behavior without an explicit interface.
## SHOULD
- Prefer cohesive modules with dependency direction that keeps safety/control policy testable.
## Exceptions
Architecture deviations require documented constraints, trade-offs, and verification strategy.
## Verification
Use code review, static analysis, architecture tests, dependency inspection, concurrency tests, and interface regression tests.