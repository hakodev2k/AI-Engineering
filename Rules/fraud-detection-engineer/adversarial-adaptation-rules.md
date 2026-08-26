# Adversarial Adaptation Rules

## Purpose
Design fraud controls for intelligent adversaries who probe, adapt, and coordinate.

## Scope
Detection logic, model exposure, attack monitoring, evasion analysis, and control hardening.

## MUST
- Detection design MUST assume observable decisions can be probed and exploited.
- Sensitive thresholds, features, and internal reason codes MUST be disclosed only when authorized and necessary.
- Sudden shifts in attack patterns or control hit rates MUST trigger investigation.
- Evasion hypotheses MUST be tested against evidence before broad countermeasures are deployed.

## MUST NOT
- MUST NOT expose detailed fraud logic in client-controlled code when server-side enforcement is feasible.
- MUST NOT respond to suspected evasion with unbounded customer-impact changes.

## SHOULD
- Controls SHOULD use defense in depth and avoid dependence on one easily spoofed signal.
- Detection teams SHOULD maintain adversarial test cases for known tactics.

## Exceptions
Require documented operational need, threat assessment, and compensating controls.

## Verification
Review client/server boundaries, reason-code exposure, attack telemetry, adversarial tests, and post-incident findings.