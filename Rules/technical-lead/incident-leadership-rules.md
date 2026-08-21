# Incident Leadership Rules
## Purpose
Restore service safely while preserving evidence and clear ownership.
## Scope
Production incidents requiring technical coordination.
## MUST
- Incidents MUST establish severity, incident owner, communication path, current impact, and next action.
- Mitigation MUST prioritize reducing user/business impact before speculative root-cause work when appropriate.
- Significant incidents MUST preserve timeline and evidence for follow-up analysis.
## MUST NOT
- Make multiple uncontrolled high-risk changes that destroy causal evidence.
- Declare resolution without verifying recovery signals.
## SHOULD
- Separate incident command, technical investigation, and stakeholder communication for major incidents.
## Exceptions
Small incidents may combine roles if ownership remains explicit.
## Verification
Review incident timeline, telemetry, decisions, recovery evidence, post-incident actions, and ownership.