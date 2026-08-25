# Developer Platform Incident Rules
## Purpose
Restore shared engineering systems safely and learn from failures.
## Scope
Incidents affecting CI, builds, registries, developer portals, caches, and shared tooling.
## MUST
- Incident response MUST establish impact, current evidence, owner, and restoration priority.
- Mitigations MUST prefer reversible actions and preserve diagnostics when feasible.
- Production configuration changes, destructive operations, or access escalation MUST require authorized human approval.
- Post-incident review MUST distinguish contributing conditions from unsupported assumptions.
## MUST NOT
- MUST NOT erase logs or evidence to recover capacity unless explicitly approved and retained elsewhere.
- MUST NOT declare resolution without verifying developer-facing recovery.
## SHOULD
- Communication SHOULD state impact, known facts, uncertainty, mitigation, and next update.
## Exceptions
Immediate life-safety or severe security containment follows applicable emergency policy.
## Verification
Inspect timeline, approvals, telemetry, recovery checks, and tracked corrective actions.