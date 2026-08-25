# Autonomy State Machine Rules
## Purpose
Make autonomous behavior explicit, bounded, and recoverable.
## Scope
Modes, mission logic, behavior trees, state machines, recovery, and operator handoff.
## MUST
- Define legal states, transitions, guards, entry/exit effects, timeout behavior, and fault states.
- Make authority between manual, assisted, and autonomous modes unambiguous.
- Ensure recovery actions have bounded attempts and escalation paths.
- Preserve enough state to diagnose unexpected transitions.
## MUST NOT
- Hide safety-critical mode transitions inside incidental callbacks or undocumented side effects.
- Loop indefinitely on recovery while the robot remains in a hazardous or blocking condition.
## SHOULD
- Prefer explicit deterministic transition logic for high-consequence behavior.
## Exceptions
Adaptive decision logic requires equivalent observability, constraints, and validation evidence.
## Verification
Use transition coverage, model/state tests, timeout/fault injection, operator-handoff tests, and event logs.