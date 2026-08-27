# Root Cause Analysis Rules

## Purpose
Turn reliability failures into evidence-backed system improvements rather than superficial blame or symptom fixes.

## Scope
Applies to significant incidents, recurring degradations, near misses, and systemic reliability defects.

## MUST
- Root-cause claims MUST be supported by evidence that explains the observed failure sequence.
- Analysis MUST distinguish trigger, contributing conditions, detection gaps, amplification mechanisms, and recovery factors where relevant.
- Corrective actions MUST map to evidenced failure mechanisms and have owners plus verification criteria.
- Human error MUST be analyzed in the context of system design, controls, information, and incentives.
- Unknowns and competing hypotheses MUST remain explicit when evidence is incomplete.

## MUST NOT
- MUST NOT label the last code change as root cause solely because of temporal correlation.
- MUST NOT close analysis with only retraining or reminders when system controls can prevent recurrence.
- MUST NOT fabricate certainty from incomplete telemetry.

## SHOULD
- Analyses SHOULD identify why safeguards failed or were absent.
- Corrective actions SHOULD favor durable risk reduction over incident-specific patches.

## Exceptions
A lighter analysis may be used for low-impact events if recurrence risk is demonstrably small and the decision is recorded.

## Verification
Review timelines, telemetry, change records, reproductions, hypotheses, action-to-cause traceability, and follow-up validation.