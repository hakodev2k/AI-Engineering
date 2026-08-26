# Data Quality Incident Management Rules
## Purpose
Contain, diagnose, communicate, and resolve quality incidents safely.
## Scope
Triage, severity, containment, correction, replay, and post-incident learning.
## MUST
- Incidents MUST identify affected data windows, consumers, severity, and current trust status.
- Containment MUST prioritize preventing further propagation of known-bad data.
- Corrections and replays MUST be validated before trusted publication resumes.
- Significant incidents MUST record root cause or bounded causal evidence and prevention actions.
## MUST NOT
- MUST NOT silently backfill or rewrite critical historical data during an active incident without approval.
- MUST NOT close incidents solely because a pipeline reran successfully.
## SHOULD
- Incident communication SHOULD state uncertainty explicitly.
## Exceptions
Emergency containment may precede full diagnosis when reversible and authorized.
## Verification
Review timelines, evidence, consumer notices, replay validation, approvals, and post-incident actions.