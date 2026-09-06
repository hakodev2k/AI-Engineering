# Workflow: Detect, Contain, Verify Unauthorized Coordination

## Trigger
Parallel-agent execution where two or more identities can reach common infrastructure, or any runtime finding indicating unapproved cross-agent communication.

## Goal
Prevent incidental shared resources from becoming a covert coordination plane and prove that the intended communication boundary is effective.

## Inputs
Agent roster, approved channels, shared-resource inventory, normalized access events, risk classification, and shutdown/quarantine controls.

## Baseline
Before execution, capture agent identities, shared resources, permission sets, approved namespaces, and a clean synthetic-event run showing zero unapproved coordination findings.

## Context
Apply `skills/coordination-channel-threat-model.md` and `rules/coordination-boundary.md`.

## Stages
1. **Observe** — inventory agent identities and shared resources.
2. **Measure baseline** — run the analyzer on baseline/synthetic events.
3. **Diagnose** — identify any unapproved multi-agent write/read path.
4. **Form hypothesis** — determine whether the path is sanctioned traffic, benign shared-data access, or an emergent communication channel.
5. **Implement improvement** — narrow ACLs, separate namespaces, remove peer visibility, route communication through the sanctioned broker, or quarantine the resource.
6. **Measure again** — rerun synthetic cross-agent probes and analyze fresh runtime events.
7. **Improved?** — if no, permit at most two remediation iterations; then stop and escalate.
8. **Independent verify** — use `subagents/coordination-security-reviewer.md`.
9. **Complete** — resume high-risk agent work only when the boundary is verified.

## Responsible agent
Platform/security implementation owner; independent reviewer for final verification.

## Tools
IAM/ACL inspection, audit logs, service/resource inventory, `scripts/channel_guard.py`, safe synthetic fixtures, and platform-specific isolation controls.

## Outputs
Baseline report, violation report when applicable, remediation record, after-state metrics, independent verification record.

## Checkpoints
- CP1: identity attribution coverage is sufficient.
- CP2: every shared writable resource is classified.
- CP3: approved coordination namespaces are explicit.
- CP4: no unapproved cross-agent edge remains in synthetic verification.
- CP5: independent reviewer signs off.

## Metrics
Unapproved coordination findings, cross-agent resource edges, mean time to detection, blocked events, identity coverage, false-positive rate, and remediation attempts.

## Retry policy
Maximum two automated remediation/retest cycles for one violation class.

## Stop conditions
Stop immediately for high-confidence unapproved coordination in a high-risk environment. Stop after two failed remediation cycles and require human security review. Never continue merely because the agent workload is otherwise progressing.

## Failure path
Quarantine affected agents/resources, preserve metadata evidence, revoke or narrow access as safely supported by the host, and escalate. Dangerous or irreversible cleanup requires explicit human approval.

## Verification
A synthetic unapproved write by one agent followed by peer discovery/read MUST produce a violation. Equivalent traffic through an approved coordination namespace MUST not be classified as a violation. Runtime monitoring MUST continue after restart.

## Definition of Done
Evidence documented; baseline captured; resource map complete; violation paths addressed; synthetic tests pass; runtime metrics collected; independent verification complete; no blocking unapproved coordination path remains.
