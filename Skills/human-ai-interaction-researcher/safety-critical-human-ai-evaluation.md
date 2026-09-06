# Safety-Critical Human-AI Evaluation

## Purpose
Evaluate human-AI interaction where errors can cause substantial physical, financial, legal, operational, or other consequential harm, with emphasis on detection, escalation, and safe boundaries.

## When to use
Use for high-stakes decision support, consequential automation, safety-sensitive operations, or systems where inappropriate reliance can create severe harm.

## Inputs
Hazard analysis, system capabilities, task workflow, user roles, failure modes, safeguards, escalation procedures, and domain requirements.

## Context to inspect
Inspect model evaluations, incident history, authority boundaries, human review requirements, time pressure, alarms, overrides, fallback modes, audit trails, and training requirements.

## Core knowledge
Average usability is insufficient for safety-critical systems. Research must focus on hazardous scenarios, rare failures, workload, automation surprise, alarm fatigue, recoverability, and whether users retain the expertise and authority required to intervene.

## Procedure
1. Review hazards with domain, safety, and engineering stakeholders.
2. Map each hazard to human detection, decision, and intervention requirements.
3. Select representative and worst-credible interaction scenarios.
4. Use simulations or controlled environments rather than creating real harm.
5. Test normal operation, degraded performance, ambiguous output, and failure escalation.
6. Measure detection latency, decision quality, workload, reliance, and recovery.
7. Evaluate whether warnings are actionable under realistic time pressure.
8. Test handoffs between AI, operators, and escalation roles.
9. Examine cumulative effects of repeated false alarms or reliable automation.
10. Document residual risks and required operational controls.

## Decision points
Prefer fail-safe defaults when uncertainty is high and consequences are severe. Require qualified human review where judgment cannot be reliably automated. Use automation only within explicitly validated operating boundaries.

## Common failure patterns
Testing only nominal cases, generic warnings, unrealistic expert availability, assuming a human can always catch errors, excessive alerts, and treating approval clicks as meaningful oversight.

## Verification
Demonstrate that critical hazards are detected and contained within required limits in representative simulations and that residual risks have named owners.

## Expected output
A safety-focused interaction evaluation with hazard scenarios, human-control findings, workload evidence, failure containment, residual risk, and required safeguards.

## Stop conditions
Stop when testing could create real unacceptable harm, domain safety expertise is absent, or the system lacks an authorized emergency or fallback procedure.