# Speech Privacy and Security

## Purpose
Protect speech systems against privacy violations, unauthorized biometric use, prompt/command abuse, replay and synthesis attacks, data leakage, and insecure audio handling.

## When to use
Use when designing, reviewing, or deploying systems that collect, store, transmit, transform, identify, or synthesize human speech.

## Inputs
- Data flows and architecture
- Retention policies
- Identity and authorization model
- Threat model
- Model capabilities
- Regulatory and consent requirements

## Context to inspect
Inspect raw audio retention, transcript storage, speaker embeddings, voice cloning, authentication flows, third-party APIs, encryption, access control, auditability, and whether speech can trigger consequential actions.

## Core knowledge
Voice can contain content, identity, health-adjacent cues, background conversations, and location/context clues. Speaker embeddings may be biometric data. Synthetic speech raises impersonation risks. Speech-command systems need authorization independent of acoustic confidence.

## Procedure
1. Map audio, transcript, embedding, and model-output data flows.
2. Classify sensitive assets and retention requirements.
3. Minimize collection and default to shortest justified retention.
4. Encrypt data in transit and at rest where stored.
5. Restrict access by least privilege and audit sensitive operations.
6. Separate speaker verification confidence from authorization decisions.
7. Threat-model replay, synthetic speech, voice conversion, prompt injection through transcribed audio, and malicious uploads.
8. Add content/type/size validation and resource-abuse limits.
9. Require explicit consent and governance for voice cloning or biometric enrollment.
10. Test deletion, revocation, and incident-response procedures.
11. Review third-party processors and cross-boundary data transfers.

## Decision points
Do not store raw audio when derived features or transient processing suffice. Use multi-factor controls for high-risk actions. Disable cloning or enrollment when consent cannot be verified.

## Common failure patterns
- Treating voice similarity as authorization
- Retaining recordings indefinitely for debugging
- Exposing transcripts in verbose logs
- Ignoring synthesized/replayed attack audio
- Reusing speaker embeddings across purposes without governance

## Verification
Verify access controls, retention/deletion tests, threat-model mitigations, audit trails, attack simulations, and privacy review evidence.

## Expected output
A speech security/privacy assessment with mitigations, data-handling controls, residual risks, and approval requirements.

## Stop conditions
Stop if lawful basis or consent is unclear, high-risk biometric handling lacks governance, or unresolved attacks could authorize consequential actions.