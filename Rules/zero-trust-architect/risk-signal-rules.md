# Risk Signal Rules

## Purpose
Ensure contextual risk signals improve access decisions without becoming opaque, stale, or unreliable inputs.

## Scope
Applies to identity risk, device posture, location context, behavior analytics, security intelligence, session context, workload posture, and environmental risk inputs.

## MUST
- Every risk signal used in an access decision MUST have a documented source, semantic meaning, expected freshness, failure behavior, and accountable owner.
- High-impact deny, step-up, or privilege-reduction decisions MUST use signals whose quality and limitations are understood and reviewable.
- Signal freshness MUST be enforced according to how quickly the underlying condition can change.
- Risk policies MUST define behavior when a required signal is unavailable, contradictory, or outside its validity window.
- Material changes to risk scoring, thresholds, or signal composition MUST be evaluated against representative legitimate and security-relevant scenarios before production use.
- False-positive and false-negative impact SHOULD be measured for signals driving significant user or operational consequences.
- Risk decisions MUST be logged with enough reason metadata to support investigation without disclosing sensitive internals to unauthorized users.

## MUST NOT
- A single noisy or weak signal MUST NOT independently authorize high-value access.
- An opaque risk score MUST NOT be treated as unquestionable evidence for critical access decisions when its inputs or behavior cannot be bounded.
- Stale posture, security, or identity signals MUST NOT be treated as current indefinitely.
- Risk controls MUST NOT silently degrade to permissive behavior when a mandatory signal pipeline fails.

## SHOULD
- Multiple independent signals SHOULD be combined when high-confidence risk discrimination is required.
- Policies SHOULD use step-up authentication or scoped restriction when that response is safer and less disruptive than unconditional denial.
- Signal-health monitoring SHOULD detect unexpected drops, spikes, lag, or distribution changes.

## Exceptions
Exceptions require the affected policy, rationale, evidence, signal limitation, compensating controls, risk, owner, expiry, and approval for high-value resources.

## Verification
Inspect signal definitions, freshness settings, source health, policy thresholds, historical distributions, decision logs, simulation results, false-positive reviews, and failure tests with unavailable or conflicting signals.