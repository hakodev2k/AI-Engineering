# Error Handling Rules

## Purpose
Make failures explicit, diagnosable, and compatible with Go error semantics.

## Scope
Error creation, wrapping, classification, propagation, retries, and boundary translation.

## MUST
- Returned errors MUST preserve causal context with wrapping when callers need the chain.
- Stable error classification MUST use supported mechanisms such as `errors.Is` or `errors.As`.
- Boundary layers MUST translate internal failures without leaking sensitive implementation detail.
- Ignored errors MUST be explicitly justified.

## MUST NOT
- MUST NOT compare wrapped errors by fragile string matching.
- MUST NOT silently swallow unexpected errors.
- MUST NOT log and return the same error at every layer without an observability reason.
- MUST NOT expose secrets or sensitive payloads in errors.

## SHOULD
- Error messages SHOULD state the failed operation and relevant non-sensitive context.
- Sentinel errors SHOULD be limited to stable caller-relevant conditions.

## Exceptions
Deliberately ignored best-effort failures require documented impact and observability expectations.

## Verification
Test classification and wrapping, inspect ignored-return static-analysis findings, and review logs/API responses for leakage and duplication.