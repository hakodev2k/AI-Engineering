# Vision Model Security and Privacy

## Purpose
Assess and reduce security and privacy risks in vision datasets, training pipelines, model artifacts, inference APIs, and captured media.

## When to use
Use before handling sensitive imagery, exposing inference externally, adopting third-party checkpoints, or deploying into adversarial environments.

## Inputs
Data flows, threat model, model artifacts, dependencies, deployment architecture, access controls, retention rules, and applicable privacy requirements.

## Preconditions
System owners can identify sensitive data and security boundaries.

## Context to inspect
Inspect image uploads/streams, metadata, face/identity content, storage, logs, temporary files, model provenance, serialization formats, preprocessing parsers, APIs, rate limits, and downstream outputs.

## Core knowledge
Vision systems face ordinary application threats plus adversarial examples, malicious media parsers, poisoned data, model supply-chain risk, membership leakage, sensitive visual-content exposure, and model extraction. Security controls should be layered rather than delegated to model robustness.

## Procedure
1. Map sensitive data and trust boundaries end to end.
2. Minimize collected imagery and metadata to what the task requires.
3. Define encryption, access, retention, and deletion controls.
4. Validate third-party model and dataset provenance/licensing.
5. Sandbox or harden untrusted media decoding where applicable.
6. Scan dependencies and avoid unsafe model deserialization paths.
7. Threat-model poisoning, evasion, extraction, and abuse scenarios relevant to deployment.
8. Add authorization, input limits, rate limits, and audit logging at service boundaries.
9. Prevent raw sensitive media from leaking into ordinary logs or debug artifacts.
10. Test malformed, oversized, and adversarially unusual inputs.
11. Define incident response and revocation for compromised models/data.
12. Reassess security when data sources or deployment exposure change.

## Decision points
Prefer data minimization over post-hoc anonymization. Use redaction/on-device processing when raw-media transfer is unnecessary. Apply adversarial training only when the threat model and measured benefit justify its cost.

## Common failure patterns
Trusting file extensions, logging raw images by default, loading untrusted pickled checkpoints, unrestricted public inference, keeping images indefinitely, and claiming adversarial robustness without threat-specific tests.

## Verification
Verify access boundaries, retention/deletion behavior, dependency and artifact provenance, malformed-input handling, audit evidence, and threat-model test cases.

## Expected output
A vision-specific threat assessment with implemented controls, validation evidence, residual risks, and incident actions.

## Stop conditions
Stop and escalate if sensitive-data authorization is missing, artifact provenance is suspicious, security testing requires unauthorized production access, or residual risk exceeds approved limits.