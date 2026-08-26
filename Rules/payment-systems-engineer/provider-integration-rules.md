# Payment Provider Integration Rules

## Purpose
Keep third-party payment dependencies bounded, observable, and replaceable.

## Scope
Processor, acquirer, gateway, wallet, bank, and payment-network integrations.

## MUST
- Provider SDKs and APIs MUST be isolated behind explicit integration boundaries.
- Provider-specific statuses, errors, and identifiers MUST be translated into stable internal contracts.
- Timeouts, retry policies, authentication, rate limits, and regional behavior MUST be documented and enforced per operation.
- Provider API version changes MUST be compatibility-reviewed before production rollout.
- Integration code MUST preserve raw provider identifiers and enough response metadata for investigation without storing prohibited sensitive data.

## MUST NOT
- MUST NOT leak provider-specific semantics into core payment state without translation.
- MUST NOT retry non-idempotent provider operations blindly.
- MUST NOT assume provider success from transport success alone.

## SHOULD
- Integrations SHOULD support controlled fallback or graceful degradation where the business model permits it.

## Exceptions
Exceptions require documented coupling, migration impact, operational risk, and approval.

## Verification
Review adapters, contract tests, timeout/retry configuration, versioning evidence, sandbox tests, and production telemetry.