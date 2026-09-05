# Payment Provider Integration Rules

## Purpose
Keep external provider integrations explicit, isolated, and safe under provider-specific behavior.

## Scope
Payment gateways, acquirers, processors, wallets, bank APIs, and alternative payment methods.

## MUST
- Provider-specific request, response, error, and status semantics MUST be normalized behind a defined integration boundary.
- Provider capabilities and limitations MUST be documented for supported payment flows.
- Ambiguous provider outcomes MUST be reconciled before issuing a new money-moving command.
- Provider version changes MUST be compatibility-tested before production rollout.
- Provider credentials and endpoints MUST be environment-separated.

## MUST NOT
- MUST NOT leak provider-specific assumptions throughout unrelated domain logic.
- MUST NOT map unknown provider errors to success.
- MUST NOT switch providers for an in-flight financial action unless the workflow explicitly supports safe migration.

## SHOULD
- Maintain contract tests against provider sandbox or approved simulators.

## Exceptions
Require documented behavior, fallback risk, evidence, and approval.

## Verification
Review integration boundaries, provider mappings, contract tests, version configuration, and failure scenarios.