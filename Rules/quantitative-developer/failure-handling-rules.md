# Failure Handling Rules

## Purpose
Make failures explicit, bounded, and safe rather than converting uncertainty into plausible quantitative outputs.

## Scope
Applies to data, models, solvers, integrations, services, and execution workflows.

## MUST
- Failure modes MUST distinguish unavailable, stale, invalid, unsupported, and non-convergent states when downstream actions differ.
- Unexpected exceptions MUST preserve diagnostic context and propagate to an appropriate containment boundary.
- Retries MUST have bounded attempts, backoff where appropriate, and idempotency analysis.
- Fallbacks MUST be documented, observable, and validated for the conditions in which they activate.
- Financially consequential failure states MUST default to a safe action defined with domain owners.

## MUST NOT
- Unexpected exceptions MUST NOT be silently swallowed.
- Stale values MUST NOT silently masquerade as current values.
- Failed calculations MUST NOT be replaced with zero, previous value, or another estimate unless that fallback is explicitly approved.

## SHOULD
- Use typed or structured error states for domain-significant failures.
- Test compound failures, not only isolated component failures.

## Exceptions
Exceptions require documented failure semantics, bounded impact, monitoring, and approval when safety is affected.

## Verification
Use fault injection, timeout tests, stale-data simulations, retry/idempotency tests, log and metric inspection, and end-to-end checks that downstream actions remain safe.