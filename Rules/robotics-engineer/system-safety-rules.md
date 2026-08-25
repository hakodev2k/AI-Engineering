# System Safety Rules
## Purpose
Prevent robotic behavior from creating unacceptable risk to people, property, or the environment.
## Scope
Robot hardware, software, autonomy, commissioning, and field operation.
## MUST
- Define hazards, safe states, operating limits, and safety assumptions before enabling motion.
- Implement independent protective measures for credible high-severity hazards.
- Validate emergency-stop and protective-stop behavior under representative faults.
- Record residual risks and required operator controls.
## MUST NOT
- Treat application software as the sole protection for a safety-critical hazard without justified architecture.
- Bypass interlocks or safety limits to accelerate testing.
- Enable unvalidated autonomous motion around people.
## SHOULD
- Prefer fail-safe, diagnosable designs and bounded-energy test modes.
- Reassess hazards after material hardware, control, payload, environment, or autonomy changes.
## Exceptions
Any deviation requires documented hazard analysis, evidence, residual risk, compensating controls, and authorized human approval.
## Verification
Review hazard analysis, safety requirements, test records, fault-injection results, stop-distance evidence, and configuration against the deployed system.