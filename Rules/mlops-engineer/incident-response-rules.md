# ML Incident Response Rules

## Purpose
Contain and diagnose production ML failures while preserving evidence and controlling model-specific risk.

## Scope
Covers service outages, harmful predictions, data corruption, drift-related degradation, pipeline failures, and compromised ML artifacts.

## MUST
- Critical ML systems MUST have incident ownership, escalation paths, and containment options such as rollback, traffic disablement, fallback, or job suspension.
- Responders MUST preserve model version, configuration, data/feature versions, telemetry, deployment history, and relevant artifacts for diagnosis.
- User or safety impact MUST be prioritized over proving a technical hypothesis.
- High-risk containment actions MUST follow established incident authority and approval boundaries.
- Post-incident analysis MUST distinguish triggering event, contributing conditions, detection gaps, and corrective controls.

## MUST NOT
- Responders MUST NOT retrain and redeploy blindly as a substitute for bounding the failure.
- Evidence MUST NOT be destroyed through log cleanup, artifact replacement, or mutable overwrites during investigation.

## SHOULD
- Runbooks SHOULD include model-quality incidents, not only infrastructure failures.
- Corrective actions SHOULD address systemic controls rather than only the immediate symptom.

## Exceptions
Emergency actions may bypass normal change flow only under authorized incident procedures and MUST be reconciled afterward.

## Verification
Review runbooks, drills, incident timelines, retained lineage/telemetry, containment records, approvals, postmortems, and completion of corrective actions.