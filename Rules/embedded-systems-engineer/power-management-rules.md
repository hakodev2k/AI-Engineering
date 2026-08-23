# Power Management Rules

## Purpose
Make power-state transitions safe, measurable, and compatible with system requirements.

## Scope
Sleep states, wake sources, clocks, regulators, peripherals, battery operation, and brownouts.

## MUST
- Define allowed power states, entry/exit sequencing, retained state, and wake conditions.
- Validate data integrity and peripheral safety across sleep, reset, and brownout transitions.
- Measure power consumption against explicit budgets.

## MUST NOT
- Disable required safety monitoring solely to reduce power.
- Assume wake-up timing or retained state without target evidence.

## SHOULD
- Centralize power-state coordination where independent subsystem transitions can conflict.

## Exceptions
Power-budget deviations require measured evidence and system-owner approval.

## Verification
Measure current profiles on representative hardware and test sleep/wake, brownout, reset, and low-battery scenarios.