# Privacy and Data Handling Rules

## Purpose
Minimize privacy risk in media, metadata, diagnostics, and recordings.

## Scope
Media content, IP/candidate data, session metadata, recordings, transcripts, telemetry, and retention.

## MUST
- Collection MUST be limited to data necessary for an explicit product or operational purpose.
- Recording/transcription state MUST be authorized and clearly represented to affected clients as required by policy and law.
- Retention and access controls MUST be defined for media-derived data and sensitive metadata.
- Diagnostic identifiers MUST avoid unnecessary direct personal identifiers.

## MUST NOT
- MUST NOT capture raw media for debugging by default.
- MUST NOT retain sensitive session data indefinitely.
- MUST NOT repurpose collected media/metadata outside approved purpose without review.

## SHOULD
- Prefer aggregate or redacted telemetry when it answers the operational question.

## Exceptions
Expanded collection requires documented purpose, duration, access, approval, and deletion plan.

## Verification
Review data flows, telemetry samples, storage policies, access controls, retention jobs, and privacy assessments.