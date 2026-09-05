# Security and Abuse Incident Response

## Purpose
Handle adversarial use of AI systems including prompt injection, credential abuse, model extraction, tool abuse, automated attacks, and malicious content pipelines.

## When to use
Use when telemetry suggests intentional exploitation or unauthorized capability use.

## Inputs
Request traces, identities, IP/device signals, tool actions, rate patterns, model outputs, authorization logs, threat indicators.

## Preconditions
Coordinate with security incident procedures and preserve forensic evidence.

## Context to inspect
AuthN/AuthZ, API keys, quotas, tool scopes, model gateway, RAG sources, prompt-injection controls, audit logs, abuse detection.

## Core knowledge
AI security incidents may exploit model behavior to reach conventional systems. Security boundaries must not depend on model obedience.

## Procedure
1. Identify active attack paths.
2. Block or rate-limit malicious principals where justified.
3. Disable compromised credentials.
4. Restrict risky tools and external side effects.
5. Preserve request and action evidence.
6. Determine whether unauthorized access occurred.
7. Hunt for related indicators across tenants and time.
8. Patch deterministic security controls.
9. Validate with adversarial replay.
10. Monitor for attacker adaptation.

## Decision points
Prefer deterministic authorization and isolation controls over prompt-only mitigations.

## Common failure patterns
Treating prompt injection as only a content issue, blocking one string signature, leaving tool permissions unchanged, and losing correlation IDs.

## Verification
Attack path is closed under replay and adjacent variants; unauthorized resources are inaccessible.

## Expected output
Security incident scope, containment, indicators, remediation, and validation.

## Stop conditions
Escalate under the security response plan for credential compromise, unauthorized access, or active exploitation.