# Skill: MCP Process Lifecycle Baseline

## Purpose
Measure whether local MCP process ownership remains bounded across lifecycle events before attempting optimization or cleanup.

## Trigger
Use when adding or changing resume, fork, reconnect, plugin reload, MCP discovery, desktop/app-server lifecycle, or when long-lived agent hosts become progressively slower.

## Inputs
- `config/policy.json`.
- Normalized process snapshots before and after the lifecycle action.
- Set of live logical owner/session IDs.
- The exact lifecycle sequence exercised.

## Preconditions
The snapshot producer MUST identify MCP processes and SHOULD provide `owner_id`, `server_identity`, `scope_key`, `host_instance`, and `age_seconds`. Do not infer ownership from PID alone when a stronger identifier exists.

## Required context
Know which MCP servers are intentionally shared/singleton and which are per-session. Adjust `identity` or scope normalization before raising allowed duplicate counts.

## Allowed tools
OS process inspection, application logs, read-only session metadata, `scripts/mcp_process_audit.py`, test runner.

## Constraints
- MUST measure before changing cleanup behavior.
- MUST NOT kill a process solely because its command contains `mcp`.
- MUST NOT weaken the policy to make a regression pass.
- SHOULD capture at least three repeated resume/close cycles when reproducing an accumulation bug.

## Procedure
1. Record a quiet baseline process snapshot.
2. Execute one declared lifecycle action without unrelated workload.
3. Record a second snapshot after the configured grace interval.
4. Normalize logical identity as host + scope + server unless the host provides a stronger identity.
5. Run the audit and retain its JSON output.
6. Repeat the action up to three cycles to determine whether counts converge or grow.
7. Form a hypothesis tied to a specific transition: spawn-before-reap, missing owner teardown, duplicate discovery, or transport-close/process-live mismatch.
8. Apply the smallest host-side fix.
9. Repeat the same sequence and compare metrics.

## Decision points
- If duplicate count is stable but intentional, correct the identity model rather than allowing arbitrary multiplicity.
- If process count grows each cycle, treat the lifecycle path as leaking even if CPU/RSS is initially small.
- If the process is ownerless but younger than grace, remeasure after grace before declaring an orphan.

## Expected output
Before/after audit JSON, lifecycle sequence, hypothesis, implementation evidence, and measured comparison.

## Metrics
MCP process count, duplicate identity count, maximum active generations, orphan count, oldest orphan age, and count delta per lifecycle cycle.

## Verification
The same deterministic lifecycle sequence MUST return to the configured steady-state bounds on repeated runs and `python -m unittest tests/test_mcp_process_audit.py` MUST pass.

## Failure handling
Capture the violating PIDs/identities and logs. Do not automatically terminate uncertain processes. Escalate when ownership cannot be proven.

## Stop conditions
Stop after three unsuccessful remediation iterations, on ambiguous ownership that could affect unrelated work, or when remediation would require destructive process termination without approval.
