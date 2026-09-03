# Testing and Conformance Rules

## Purpose
Ensure flag behavior is verified before it controls production behavior.

## Scope
Applies to evaluation logic, SDK wrappers, targeting, fallbacks, rollout configuration, and cross-runtime behavior.

## MUST
- Critical flags MUST have automated tests for enabled, disabled, and fallback states.
- Targeting rules MUST include representative positive, negative, and boundary cases.
- Cross-SDK behavior MUST be covered by conformance tests when multiple runtimes consume the same contract.
- Tests MUST verify failure behavior when the provider or cached configuration is unavailable or invalid.
- Release-critical flag changes MUST be validated in a production-like environment before broad activation.

## MUST NOT
- MUST NOT mock away all flag behavior in tests that claim to verify flag-driven application logic.
- MUST NOT rely only on happy-path tests for kill switches or entitlement-sensitive flags.
- MUST NOT accept flaky evaluation tests as normal behavior.

## SHOULD
- Test fixtures SHOULD use canonical flag definitions and deterministic subject identifiers.

## Exceptions
Manual-only verification requires documented rationale and reproducible evidence.

## Verification
Inspect unit, integration, conformance, failure-injection, and environment validation test results.