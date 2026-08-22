# Polling Performance Rules

## MUST
- MUST establish a baseline before changing poll behavior.
- MUST define material status fields and fingerprint normalized state outside the model loop.
- MUST suppress unchanged non-terminal status from model context when no decision is required.
- MUST bound poll count and total wall-clock wait.
- MUST reset backoff only on material state change.
- MUST emit terminal states immediately.
- MUST circuit-break an unchanged deterministic failure signature after at most one confirmation retry.
- MUST measure terminal-state detection latency after optimization.

## MUST NOT
- MUST NOT claim performance improvement without before/after measurements.
- MUST NOT use short fixed polling indefinitely.
- MUST NOT forward full historical/final child messages on every roster poll when compact status fields suffice.
- MUST NOT treat volatile timestamps as material progress by default.
- MUST NOT keep polling a stale `running` state beyond configured age/budget without escalation.
- MUST NOT hide genuine state changes merely to save tokens.

## SHOULD
- SHOULD use exponential backoff with a bounded maximum interval and optional jitter at the integration layer.
- SHOULD separate polling execution from model-visible event emission.
- SHOULD track no-change suppression ratio and model-visible events independently from raw poll count.
- SHOULD choose intervals according to expected task duration/service guidance.
- SHOULD retain a compact audit record for suppressed polls.