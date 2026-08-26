# Payment Security and PCI Scope

## Purpose
Minimize payment-data exposure and design systems that reduce attack surface and PCI DSS scope.

## When to use
Use when handling card payments, payment tokens, checkout flows, provider integrations, logs, storage, or infrastructure changes affecting cardholder data.

## Inputs
Data-flow diagrams, provider integration mode, stored fields, network boundaries, access model, compliance requirements.

## Context to inspect
Frontend collection, APIs, logs, queues, databases, backups, secrets, IAM, observability, third-party scripts.

## Core knowledge
Sensitive authentication data has strict handling restrictions. Tokenization/hosted fields can reduce exposure but do not automatically remove all scope. Security depends on complete data-flow understanding, least privilege, segmentation, encryption, key management, patching, monitoring, and evidence.

## Procedure
1. Map cardholder/sensitive data from collection through deletion.
2. Eliminate unnecessary collection and storage.
3. Prefer provider-hosted/tokenized collection when product requirements permit.
4. Classify every persisted/transmitted field.
5. Redact sensitive data from logs and traces.
6. Enforce TLS and secure service authentication.
7. Apply least privilege and environment separation.
8. Protect and rotate secrets/keys.
9. Review third-party client-side dependencies.
10. Define retention and secure deletion.
11. Add detection for accidental sensitive-data leakage.
12. Validate controls with the responsible security/compliance owner.

## Decision points
Choose lower-scope integration patterns unless direct handling provides necessary capability whose compliance cost is understood and approved.

## Common failure patterns
Logging PAN/CVV, assuming encryption alone solves compliance, copying production data to lower environments, broad access, and undocumented data flows.

## Verification
Run data-discovery checks, inspect logs/traces, validate IAM and network controls, test secret rotation, and obtain required compliance evidence.

## Expected output
A minimized, documented payment-data footprint with enforceable security controls and verified scope assumptions.

## Stop conditions
Escalate any uncertain handling of regulated cardholder or sensitive authentication data to security/compliance owners.