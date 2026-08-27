# Network API Integration

## Purpose
Integrate safely with controller, cloud, vendor, and infrastructure APIs used in network automation.

## When to use
Use when provisioning through SDN controllers, cloud networking, IPAM, DNS, firewalls, load balancers, or vendor platforms.

## Inputs
API specification, authentication, rate limits, resource models, desired workflow, error semantics, and sandbox access.

## Context to inspect
API versions, pagination, async jobs, idempotency, webhooks, quotas, RBAC, and deprecation notices.

## Core knowledge
HTTP success does not always mean workflow completion; many network APIs are eventually consistent or asynchronous. Rate limits and version drift require explicit handling.

## Procedure
1. Pin supported API version and capability.
2. Use scoped machine identity and secure secret retrieval.
3. Build typed/validated request and response models.
4. Implement timeouts and bounded retries with backoff/jitter.
5. Handle pagination and async job polling.
6. Use idempotency mechanisms where provided.
7. Normalize provider errors into workflow categories.
8. Log correlation IDs without secrets.
9. Verify resulting network state independently.
10. Add contract tests and deprecation monitoring.

## Decision points
Use SDKs when maintained and transparent; direct REST/gRPC when SDK abstraction is stale or incomplete.

## Common failure patterns
Infinite polling, retrying validation errors, ignoring pagination, hard-coded tokens, assuming eventual state is immediate, and no version pinning.

## Verification
Contract tests, sandbox integration, failure injection, rate-limit tests, and independent post-state validation.

## Expected output
Resilient adapter with explicit contracts, error handling, telemetry, and tests.

## Stop conditions
Stop on undocumented destructive semantics, insufficient API permissions, or incompatible API/model versions.