# External Dependency Testing

## Purpose
Test integrations with third-party services reliably while preserving confidence in real contracts and failure behavior.

## When to use
Use for payment, identity, email, storage, partner APIs, SaaS integrations, or other external dependencies.

## Inputs
Provider contract, sandbox access, quotas, failure semantics, integration code, business expectations.

## Context to inspect
Authentication, rate limits, timeouts, retries, webhooks, idempotency, sandbox differences, versioning, and provider SLAs.

## Core knowledge
Use layered evidence: deterministic stubs for application behavior, contract/sandbox checks for compatibility, and limited real integration tests for infrastructure assumptions. Retries require idempotency and bounded backoff.

## Procedure
1. Identify business-critical provider interactions.
2. Define provider boundary and adapter contract.
3. Stub deterministic success and documented failure modes.
4. Test timeout, rate-limit, malformed response, and unavailable-service handling.
5. Verify retry and circuit behavior without retry storms.
6. Test idempotency for retried writes.
7. Validate webhooks/signatures and duplicate delivery where relevant.
8. Run a small sandbox/real-provider compatibility suite.
9. Track provider API/version changes.
10. Keep credentials out of logs and source.

## Decision points
Prefer stubs for fault injection; prefer sandbox/real calls for contract drift. Avoid making every CI test depend on provider uptime.

## Common failure patterns
Mock-only confidence, real-provider dependency for all tests, leaking secrets, unlimited retries, assuming sandbox equals production.

## Verification
Demonstrate behavior for success, transient failure, permanent failure, duplicate requests, and current provider contract.

## Expected output
Resilient integration tests with controlled external dependency risk.

## Stop conditions
Escalate when testing could incur charges, affect real customers, or exceed authorized provider use.