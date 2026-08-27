# Health and Readiness Rules

## Purpose
Ensure traffic is routed only to instances capable of serving it and health signals do not worsen incidents.

## Scope
Covers liveness, readiness, startup checks, dependency checks, and traffic-manager health endpoints.

## MUST
- Liveness and readiness semantics MUST be distinct when restartability differs from traffic readiness.
- Readiness MUST reflect local ability to serve expected traffic without requiring every optional dependency to be healthy.
- Health endpoints MUST be cheap, bounded, and protected from exposing sensitive internals.
- Probe thresholds MUST tolerate expected transient behavior without masking sustained failure.
- Startup behavior MUST prevent traffic before required initialization completes.

## MUST NOT
- MUST NOT make liveness depend on a remote dependency in a way that can restart an entire healthy fleet during dependency outage.
- MUST NOT report healthy solely because the process is running.
- MUST NOT expose credentials, stack traces, or sensitive topology through public health endpoints.

## SHOULD
- Deep diagnostic checks SHOULD be separate from orchestration probes.
- Probe behavior SHOULD be tested during slow startup and dependency degradation.

## Exceptions
Exceptions require orchestration rationale, failure analysis, safeguards, and review.

## Verification
Inspect probe definitions, deployment configuration, failure simulations, startup tests, security review, and fleet behavior during dependency outages.