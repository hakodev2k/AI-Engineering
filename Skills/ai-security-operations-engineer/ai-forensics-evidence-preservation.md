# AI Forensics Evidence Preservation

## Purpose
Preserve investigation-quality evidence from AI incidents so responders can reconstruct what happened without unnecessarily retaining sensitive user or model data.

## When to use
Use for suspected compromise, data exposure, tool misuse, credential abuse, coordinated attacks, or incidents likely to require legal, compliance, or executive review.

## Inputs
Incident timeline, relevant logs, traces, prompts or derived metadata, responses, retrieval provenance, tool calls, identity events, configurations, model versions, and deployment records.

## Preconditions
Evidence handling requirements, retention rules, and access controls are understood.

## Context to inspect
Inspect source log retention, model/provider auditability, session identifiers, clock synchronization, immutable storage options, redaction pipelines, and change histories.

## Core knowledge
AI incident reproduction often depends on context that traditional logs omit: model/version, system instructions, retrieved documents, tool state, sampling settings, conversation history, and policy configuration. Evidence integrity and minimization must be balanced.

## Procedure
1. Define the incident hypotheses evidence must support or refute.
2. Identify volatile evidence at risk of expiration or overwrite.
3. Preserve relevant raw events with timestamps and source provenance.
4. Record model, application, policy, retrieval, and tool configuration versions.
5. Hash or otherwise protect evidence integrity where appropriate.
6. Redact or tokenize sensitive content for working copies while preserving governed originals only when necessary.
7. Record collection method, collector, time, and transformations.
8. Restrict evidence access and maintain chain-of-custody requirements where applicable.
9. Validate that investigators can reconstruct the event sequence.

## Decision points
Preserve full content only when justified by investigative need and policy. Prefer metadata, hashes, or targeted excerpts when they provide sufficient evidence.

## Common failure patterns
Relying on screenshots, losing model/version context, mixing evidence with analyst notes, exporting excessive customer data, and failing to capture ephemeral provider logs.

## Verification
Implemented means required evidence is preserved. Verified means an independent investigator can reconstruct the relevant sequence and verify integrity and provenance.

## Expected output
Evidence inventory, custody record, protected artifacts, configuration snapshot, and reconstruction notes.

## Stop conditions
Escalate when legal hold, regulated data, cross-border data restrictions, or unavailable provider evidence changes permissible handling.