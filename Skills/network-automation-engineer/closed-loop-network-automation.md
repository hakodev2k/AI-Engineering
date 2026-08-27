# Closed-Loop Network Automation

## Purpose
Safely automate detect-decide-act-verify loops without turning telemetry noise into outages.

## When to use
Use for mature remediation, traffic engineering, compliance correction, and self-healing workflows with well-understood failure modes.

## Inputs
Trusted telemetry, desired state, decision policy, action API, blast-radius limits, rollback, and human escalation rules.

## Context to inspect
Signal quality, historical false positives, topology, action idempotency, rate limits, incidents, and maintenance state.

## Core knowledge
Closed-loop systems require hysteresis, confidence, bounded action, cooldown, and independent verification. Automation must fail safe under stale or contradictory data.

## Procedure
1. Define a narrow condition with measurable evidence.
2. Establish signal freshness and confidence requirements.
3. Require persistence/hysteresis to avoid flapping.
4. Calculate affected scope and enforce hard blast-radius limits.
5. Check current incidents/maintenance and preconditions.
6. Execute one bounded idempotent action.
7. Verify intended outcome using independent signals.
8. Roll back or escalate on failure.
9. Apply cooldown/rate limits.
10. Audit every decision and tune from outcomes.

## Decision points
Automate deterministic low-risk remediation first; keep ambiguous routing/security decisions human-approved. Prefer advisory mode before autonomous mode.

## Common failure patterns
Reacting to one noisy metric, repeated oscillation, cascading remediation, stale telemetry, and success defined as API 200 rather than service recovery.

## Verification
Replay historical incidents, inject false signals, test stale-data fail-safe behavior, and measure false-action rate.

## Expected output
Bounded control loop, policy, audit trail, rollback, and confidence metrics.

## Stop conditions
Disable autonomous action on signal-quality degradation, repeated rollback, unexplained oscillation, or blast-radius uncertainty.