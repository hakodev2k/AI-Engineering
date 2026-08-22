# Subagents

## Exposure Mapper
- **Mission:** enumerate secret sources, tools, and downstream sinks.
- **Responsibility:** build the trust-boundary map and identify bypass paths.
- **Inputs:** tool registry, runtime config, logging/persistence architecture.
- **Required context:** agent execution lifecycle.
- **Allowed tools:** read-only repo/config inspection, synthetic test execution.
- **Forbidden actions:** production credential inspection, policy weakening.
- **Expected output:** exposure matrix with guarded/unverified status.
- **Completion criteria:** every registered tool result has a documented sanitizer path and sink set.
- **Handoff target:** DLP Implementer.

## DLP Implementer
- **Mission:** implement deterministic pre-persistence detection/redaction.
- **Responsibility:** detector registry, span merging, output envelopes, size limits, fail-closed behavior.
- **Inputs:** exposure matrix, policy, test fixtures.
- **Required context:** tool-result adapter interfaces.
- **Allowed tools:** code edits, local unit tests, benchmark scripts.
- **Forbidden actions:** embedding real secrets in fixtures; disabling scanner on errors.
- **Expected output:** guard implementation plus metrics hooks.
- **Completion criteria:** seeded detector tests pass and every adapter uses sanitized output.
- **Handoff target:** Security Verifier.

## Security Verifier
- **Mission:** independently test whether secrets can still reach model/transcript/log sinks.
- **Responsibility:** adversarial fixtures, bypass attempts, sink inspection, false-positive review.
- **Inputs:** implementation, policy, exposure map.
- **Required context:** expected sink behavior and threat model.
- **Allowed tools:** synthetic canaries, integration tests, transcript/log inspection.
- **Forbidden actions:** changing implementation while acting as verifier; using real credentials.
- **Expected output:** verification report with evidence and residual risks.
- **Completion criteria:** all required canaries blocked/redacted; no unverified sink remains.
- **Handoff target:** release owner / human reviewer.

## Incident Reviewer
- **Mission:** handle cases where a real secret escaped before or despite the guard.
- **Responsibility:** determine sinks reached, credential scope, rotation requirements, containment, and regression case.
- **Inputs:** redacted audit event, timestamps, tool ID, affected credential identifier.
- **Required context:** credential owner and downstream retention policies.
- **Allowed tools:** audit metadata, secret-management rotation workflow, repository history checks.
- **Forbidden actions:** copying leaked plaintext into incident tickets or chat.
- **Expected output:** containment checklist and new regression fixture using synthetic replacement values.
- **Completion criteria:** credential rotated/revoked when required, persisted copies addressed, regression coverage added.
- **Handoff target:** security owner.

## Delegation rule
The DLP Implementer cannot be the sole Security Verifier. High-confidence leakage fixes require independent verification with synthetic secrets.