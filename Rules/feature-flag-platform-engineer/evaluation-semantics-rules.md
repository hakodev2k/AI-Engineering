# Evaluation Semantics Rules

## Purpose
Make feature-flag evaluation deterministic, explainable, and consistent across runtimes.

## Scope
Applies to targeting rules, precedence, prerequisites, percentage rollout, context attributes, and fallbacks.

## MUST
- Evaluation order MUST be explicitly defined and consistent across supported SDKs.
- Percentage rollout MUST use stable bucketing for the same flag, subject, and allocation configuration.
- Prerequisite evaluation MUST detect cycles and fail safely.
- Missing context attributes MUST have deterministic behavior.
- Evaluation results SHOULD expose reason metadata when the platform supports it.

## MUST NOT
- MUST NOT depend on unordered data structures when rule order affects outcomes.
- MUST NOT silently coerce incompatible attribute types in security- or entitlement-sensitive rules.
- MUST NOT produce divergent results across SDKs for equivalent inputs without documented platform limitations.

## SHOULD
- Semantics SHOULD be specified with executable conformance tests.

## Exceptions
Runtime-specific deviations require documented rationale and consumer-visible limitations.

## Verification
Run cross-SDK conformance suites, property tests, deterministic bucketing tests, cycle tests, and reason-code inspection.