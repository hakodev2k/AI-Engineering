# Security Intelligence Rules

## Purpose
Use external and internal security intelligence as qualified evidence for operational decisions.

## Scope
Security advisories, indicators, intelligence feeds, internal observations, and campaign context used by security operations.

## MUST
- Intelligence MUST record source, confidence, freshness, scope, and known limitations when used for operational decisions.
- Indicators MUST be validated against local context before high-impact blocking or escalation.
- Expired or superseded intelligence MUST be retired or re-evaluated.
- Intelligence-derived detections MUST remain testable independent of the original report.

## MUST NOT
- MUST NOT make attribution claims from a single weak indicator.
- MUST NOT treat third-party severity or confidence as a substitute for local evidence.

## SHOULD
- Intelligence SHOULD prioritize durable behaviors and context over brittle indicators where practical.

## Exceptions
Urgent intelligence may trigger temporary precautionary controls when risk is material; such controls require rapid validation and expiry.

## Verification
Review intelligence records, source metadata, confidence notes, resulting detections or controls, and expiry handling.