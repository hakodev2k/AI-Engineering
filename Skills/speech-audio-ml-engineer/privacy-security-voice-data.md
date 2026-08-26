# Privacy and Security for Voice Data

## Purpose
Protect sensitive speech, biometric, transcript, and speaker-derived information throughout the ML lifecycle.

## When to use
Use when collecting, labeling, training on, storing, serving, or debugging voice data.

## Inputs
Data flows, retention policy, consent basis, threat model, access model, jurisdictions, model behavior.

## Context to inspect
Inspect raw audio stores, transcripts, embeddings, logs, annotation vendors, model artifacts, exports, access controls, and deletion paths.

## Core knowledge
Voice can reveal identity and sensitive content. Speaker embeddings may be biometric data. Minimize collection, retention, access, and secondary use; treat model artifacts as possible leakage surfaces.

## Procedure
1. Map data from capture through deletion.
2. Classify sensitive fields and derived artifacts.
3. Confirm purpose and permitted use.
4. Minimize retained raw audio and identifiers.
5. Enforce least privilege and encryption.
6. Separate production data from developer access.
7. Test deletion/retention workflows.
8. Threat-model replay, impersonation, exfiltration, and model leakage.
9. Audit third-party processing.

## Decision points
Use de-identification only when it preserves task validity. Prefer on-device or ephemeral processing when it materially reduces exposure and meets product constraints.

## Common failure patterns
Indefinite debug retention, treating embeddings as anonymous, copying production audio locally, weak vendor boundaries, and missing deletion propagation.

## Verification
Audit access, retention, encryption, deletion, and representative incident controls.

## Expected output
A documented, minimized, enforceable voice-data security design.

## Stop conditions
Stop processing when consent, legal basis, data rights, or security approval is unresolved.