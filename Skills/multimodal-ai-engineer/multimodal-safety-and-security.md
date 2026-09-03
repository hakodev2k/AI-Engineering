# Multimodal Safety and Security

## Purpose
Identify and mitigate security and safety risks unique to systems that ingest or generate multiple modalities, including hidden instructions, malicious media, sensitive content, and cross-modal prompt injection.

## When to use
Use during threat modeling, before production deployment, when adding external media ingestion, or after discovering adversarial or unsafe multimodal behavior.

## Inputs
Architecture, trust boundaries, supported modalities, model/provider behavior, content policies, threat model, incident history.

## Preconditions
Identify which inputs are user-controlled, externally retrieved, privileged, or capable of influencing tools and downstream actions.

## Context to inspect
Inspect image text/OCR, document attachments, audio transcription, metadata, URLs, retrieved media, tool permissions, generated files, content filters, storage, and audit logs.

## Core knowledge
Instructions can be embedded in images, documents, audio, metadata, or retrieved content. Semantic models may obey adversarial content that deterministic parsers would treat as data. Safety classification can also disagree across modalities. Privileged actions must never rely solely on untrusted multimodal interpretation.

## Procedure
1. Map trust boundaries for every modality and data source.
2. Classify system instructions, user instructions, retrieved data, and media content separately.
3. Treat embedded text or speech from untrusted media as data by default.
4. Validate file type, size, codec, and parser safety before model use.
5. Apply least privilege to tools reachable from multimodal outputs.
6. Add content and policy checks before consequential actions.
7. Test cross-modal prompt injection and conflicting instructions.
8. Test hidden, obfuscated, and low-visibility content.
9. Redact or minimize sensitive data where possible.
10. Log provenance and action authorization decisions.
11. Add human approval for high-impact ambiguous cases.
12. Regression-test defenses after model/provider changes.

## Decision points
Use deterministic policy enforcement outside the model for non-negotiable controls. Permit model-mediated actions only when authorization and input provenance are independently validated.

## Common failure patterns
Trusting OCR text as instructions; scanning text but not images; allowing media to indirectly trigger privileged tools; storing sensitive raw media indefinitely; relying on one model to both generate and approve an action.

## Verification
Run adversarial multimodal test cases, validate permission boundaries, inspect audit trails, and confirm unsafe inputs cannot bypass deterministic controls.

## Expected output
A multimodal threat model, tested controls, authorization boundaries, privacy safeguards, and regression suite.

## Stop conditions
Stop deployment when privileged actions can be influenced by untrusted media without independent authorization or when required privacy/content controls cannot be enforced.