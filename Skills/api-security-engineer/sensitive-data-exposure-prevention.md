# Sensitive Data Exposure Prevention

## Purpose
Prevent APIs from returning, logging, caching, or propagating sensitive data beyond what consumers are authorized and expected to receive.

## When to use
Use for APIs handling PII, credentials, financial data, health data, secrets, internal identifiers, audit data, or multi-tenant resources.

## Inputs
Data classification, response schemas, authorization policies, logging/tracing configuration, cache behavior, downstream consumers, retention requirements.

## Preconditions
Know which data elements are sensitive, who may access them, and whether masking, tokenization, or omission is required.

## Context to inspect
Response DTOs, serializers, error payloads, logs, traces, metrics labels, caches, analytics events, debug endpoints, exports, and third-party integrations.

## Core knowledge
Data minimization reduces breach impact. Authorization should be enforced before serialization. Sensitive values should not become telemetry dimensions. Masking is not equivalent to access control, and encryption does not justify excessive collection or exposure.

## Procedure
1. Classify fields in requests, responses, and telemetry.
2. Remove data not required by the consumer contract.
3. Apply field-level authorization where needed.
4. Use dedicated response models rather than persistence entities.
5. Redact secrets and sensitive identifiers from errors and logs.
6. Review cache keys and cache scope for tenant isolation.
7. Protect exported and asynchronous data flows.
8. Verify TLS and storage protections where applicable.
9. Add tests asserting forbidden fields are absent.
10. Review retention and deletion behavior.

## Decision points
Prefer omission over masking when consumers do not need a field. Use tokenization where stable references are required without exposing source values. Apply stronger controls to high-impact exports than ordinary reads.

## Common failure patterns
Returning full entities, verbose exception payloads, tokens in URLs or logs, cross-tenant cache reuse, sensitive metric labels, debug endpoints exposing configuration, and undocumented response fields.

## Verification
Inspect representative payloads, logs, traces, caches, and exports. Run authorization tests across roles and tenants and verify sensitive fields remain absent where prohibited.

## Expected output
A minimized data-exposure model with enforceable response rules, telemetry redaction, tests, and retention controls.

## Stop conditions
Escalate when data classification is unavailable, legal/contractual requirements are unclear, or consumers depend on sensitive fields without an approved purpose.