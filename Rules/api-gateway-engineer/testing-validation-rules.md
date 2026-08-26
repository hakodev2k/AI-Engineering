# Testing and Validation

## Purpose
Require deterministic evidence that gateway behavior is correct across normal, boundary, and failure conditions.

## Scope
Unit, configuration, integration, contract, load, security, and failure testing.

## MUST
- Critical routes MUST have automated tests for expected success and representative failure behavior.
- Security policies MUST include negative tests proving unauthorized or malformed traffic is rejected.
- Gateway changes MUST test interaction with representative upstream behavior.
- Tests MUST be deterministic enough to distinguish product failure from test instability.

## MUST NOT
- MUST NOT rely solely on configuration parsing as proof of runtime correctness.
- MUST NOT delete or weaken regression tests simply to make a change pass.
- MUST NOT claim production readiness from happy-path tests alone.

## SHOULD
- Contract and routing tests SHOULD run in CI.
- Failure tests SHOULD cover timeout, upstream error, partial outage, and saturation where relevant.

## Exceptions
Missing automation requires documented manual evidence, risk, owner, and a plan where recurring verification is needed.

## Verification
Inspect CI results, coverage of critical routes, negative tests, integration fixtures, failure tests, and reproducibility across runs.