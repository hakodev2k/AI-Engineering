# Testing and Verification

## Purpose
Require evidence that configuration produces intended behavior before and after activation.

## Scope
Linting, schema checks, semantic tests, integration tests, canaries, and post-change validation.

## MUST
- Configuration changes MUST pass syntax and schema validation where applicable.
- High-risk changes MUST include behavior-level verification, not only static validation.
- Critical configuration logic MUST have regression tests for known failure modes.
- Tests MUST cover effective configuration after defaults and overrides are resolved.
- Post-activation verification MUST confirm expected service or policy behavior using relevant telemetry.

## MUST NOT
- A valid file format MUST NOT be treated as evidence of operational correctness.
- Tests MUST NOT rely on production mutation when equivalent validation can be performed safely elsewhere.
- Failed verification MUST NOT be ignored without documented risk acceptance and authorization.

## SHOULD
- Use representative staging or ephemeral environments for integration validation.
- Add regression coverage after configuration-caused incidents.

## Exceptions
When pre-production fidelity is insufficient, use bounded production rollout with stronger observability and explicit stop conditions.

## Verification
Inspect CI results, test cases, rendered configuration, canary evidence, and post-change metrics. Confirm tests exercise invalid inputs, boundary values, precedence, compatibility, and critical behavioral outcomes.