# Performance Incident Rules
## Purpose
Restore service quickly while preserving evidence and preventing unsafe tuning during incidents.
## Scope
Acute database latency, saturation, blocking, throughput collapse, and resource exhaustion.
## MUST
- Establish impact, timeline, workload change, saturation signals, and recent changes before broad remediation when time permits.
- Prefer reversible mitigations that reduce impact while preserving diagnostic evidence.
- Record commands, configuration changes, and observed outcomes during response.
## MUST NOT
- Perform destructive data actions or irreversible production changes without human approval.
- Clear caches, restart services, or kill sessions reflexively when doing so destroys evidence or creates greater risk.
## SHOULD
- Separate immediate mitigation from root-cause remediation and follow-up prevention.
## Exceptions
Imminent availability or data-safety threats may require rapid action within established incident authority.
## Verification
Review incident timeline, telemetry, change audit, mitigation results, root-cause evidence, and follow-up actions.