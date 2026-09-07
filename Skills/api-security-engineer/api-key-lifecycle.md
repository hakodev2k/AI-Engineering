# API Key Lifecycle Management

## Purpose
Design and operate API key authentication so keys are minimally privileged, securely issued, rotated, monitored, and revoked without unnecessary service disruption.

## When to use
Use for partner APIs, machine clients that cannot support stronger identity protocols, legacy integrations, service credentials, or migration away from static shared secrets.

## Inputs
Client inventory, key storage model, scope model, issuance process, rotation requirements, revocation needs, audit data, gateway/application validation behavior.

## Preconditions
Confirm API keys are an acceptable authentication mechanism for the risk level and identify where stronger mechanisms should be preferred.

## Context to inspect
Key generation, entropy, storage, hashing, display, transport, scopes, expiration, rotation overlap, revocation, usage logs, rate limits, and incident procedures.

## Core knowledge
API keys are bearer secrets and generally provide weaker identity semantics than OAuth, workload identity, or mTLS. Store verifiers securely rather than plaintext when possible, display secrets once, scope keys narrowly, and make rotation routine rather than exceptional.

## Procedure
1. Inventory keys, owners, consumers, and permissions.
2. Generate high-entropy unpredictable secrets using a cryptographic RNG.
3. Store only a secure verifier/hash where protocol design permits.
4. Separate public key identifier from secret material.
5. Assign explicit scopes, tenant context, environment, and expiration.
6. Provide secure issuance and one-time secret display.
7. Implement overlapping rotation so clients can migrate safely.
8. Support immediate revocation and compromised-key response.
9. Apply per-key rate limits and anomaly monitoring.
10. Prevent keys from appearing in URLs, repositories, logs, or analytics.
11. Periodically identify stale and unused keys.
12. Test rotation and revocation under active traffic.

## Decision points
Prefer OAuth/workload identity for sophisticated clients needing delegation, short-lived credentials, or stronger identity. Use API keys when operational constraints justify them and risk is controlled. Choose expiration periods based on compromise impact and rotation capability.

## Common failure patterns
Never-expiring keys, plaintext database storage, shared keys across clients, keys in query strings, no ownership metadata, rotation requiring downtime, and inability to revoke independently.

## Verification
Create, authenticate, rotate, revoke, and expire a test key. Confirm old credentials stop working at the intended time and telemetry identifies the correct client without logging the secret.

## Expected output
A controlled API-key lifecycle with issuance, scoping, storage, rotation, revocation, monitoring, and evidence of operational testing.

## Stop conditions
Escalate when clients cannot rotate secrets, keys must carry privileges beyond acceptable risk, or the platform cannot revoke compromised credentials promptly.