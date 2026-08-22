# Battery and Energy Rules
## Purpose
Avoid unnecessary battery drain and thermal impact from mobile workloads.
## Scope
Networking, location, sensors, timers, wakeups, background work, CPU, and radio usage.
## MUST
- Continuous high-cost sensors or location modes MUST be justified by active product need and stopped promptly when no longer needed.
- Repeating work MUST have bounded frequency and lifecycle ownership.
- Energy-intensive behavior MUST be measured for material features.
## MUST NOT
- Tight polling loops or unnecessary wake locks MUST NOT be used for convenience.
- Background refresh frequency MUST NOT exceed platform policy or product need.
## SHOULD
- Batch network and compute work and prefer significant-change/event APIs when suitable.
## Exceptions
Safety-critical or real-time experiences may spend more energy with explicit product justification and measurement.
## Verification
Use platform energy profilers, battery scenarios, background traces, sensor audits, and long-duration tests.