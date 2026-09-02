# Release Verification Rules

## Purpose
Ensure releases are proven healthy by production-relevant evidence rather than deployment completion alone.

## Scope
Applies to post-deployment checks, smoke tests, synthetic tests, health gates, and release acceptance.

## MUST
- Every material release MUST define explicit success and failure criteria before deployment.
- Verification MUST cover critical user paths, dependencies, error rates, latency, and expected state transitions relevant to the change.
- Release health MUST be evaluated against pre-release baselines or established objectives where practical.
- Failed verification MUST stop further rollout or trigger rollback/recovery according to predefined criteria.

## MUST NOT
- MUST NOT equate a successful deployment command with a successful release.
- MUST NOT ignore degraded telemetry because functional smoke tests pass.
- MUST NOT close release monitoring before delayed failure modes have a reasonable chance to surface for the change class.

## SHOULD
- Automate deterministic verification gates.
- Use targeted synthetic transactions for critical workflows.

## Exceptions
Exceptions require documented reason, residual risk, alternative evidence, and accountable approval.

## Verification
Inspect release checklists, automated gates, synthetic results, service telemetry, baseline comparisons, and rollback decisions.
