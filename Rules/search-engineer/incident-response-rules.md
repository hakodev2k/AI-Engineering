# Search Incident Response

## Purpose
Restore safe search service quickly while preserving evidence and preventing repeated failure.

## Scope
Relevance incidents, outages, indexing failures, security exposure, latency events, and data corruption.

## MUST
- Establish user impact, affected query/document scope, timeline, and current system state from evidence.
- Prefer reversible mitigations that reduce impact before speculative broad changes.
- Preserve logs, metrics, traces, configuration versions, and index/model identifiers needed for root-cause analysis.
- Escalate suspected unauthorized data exposure immediately under the applicable security process.
- Document follow-up actions with owners after material incidents.

## MUST NOT
- destroy diagnostic evidence during mitigation when avoidable.
- declare resolution solely because traffic recovered; verify correctness, freshness, and relevance as applicable.
- execute destructive production recovery actions without required human approval.

## SHOULD
- Reproduce or bound root cause before permanent corrective changes.
- Add regression detection for confirmed failure modes.

## Exceptions
Emergency action may precede full diagnosis when needed to limit harm, but must be bounded, observable, authorized, and documented afterward.

## Verification
Review incident timeline, telemetry, change history, mitigation evidence, recovery validation, and post-incident actions.