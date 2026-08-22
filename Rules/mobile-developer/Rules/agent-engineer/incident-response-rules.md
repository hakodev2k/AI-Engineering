# Agent Incident Response Rules
## Purpose
Contain harmful or incorrect agent behavior quickly while preserving evidence.
## Scope
Security, safety, data, reliability, and cost incidents involving agents.
## MUST
- Provide a mechanism to disable risky agent capabilities or tool access rapidly.
- Preserve relevant logs, traces, model/tool versions, approvals, and state for investigation.
- Base root-cause conclusions on evidence and add regression coverage for confirmed failures.
## MUST NOT
- Delete evidence to make an incident appear resolved.
- Restore autonomy before the triggering risk is controlled and verified.
## SHOULD
- Maintain playbooks for runaway loops, data leakage, tool misuse, provider outage, and unsafe output.
## Exceptions
Evidence retention must still respect privacy and legal requirements.
## Verification
Run incident exercises, kill-switch tests, evidence-reconstruction drills, and corrective-action reviews.