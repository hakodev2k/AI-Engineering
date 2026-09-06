# Workflow: Audit, Remediate, Verify MCP Authorization

## Trigger
New MCP deployment, transport/proxy change, auth change, enabled-tool change, backend credential change, security advisory, or periodic privileged-service review.

## Goal
Prove that reachable callers cannot inherit backend authority without explicit authentication and authorization.

## Inputs
Effective deployment configuration, runtime network evidence, caller classes, tool inventory, backend permission summary.

## Baseline
Capture listener bind, reachable trust zones, inbound auth mode, number of privileged tools, backend credential scope, and preflight result before changes.

## Context
Use `skills/audit-auth-boundary.md` and enforce `rules/authz-boundary-rules.md`.

## Stages
1. **Observe** — implementation owner gathers sanitized effective configuration and runtime listener/proxy evidence.
2. **Measure baseline** — run `scripts/verify_mcp_auth_boundary.py` against the normalized deployment record.
3. **Diagnose** — identify failed invariants: exposure, missing caller identity, missing per-caller authorization, over-broad backend authority, or unnecessary mutating tools.
4. **Form hypothesis** — choose the smallest safe remediation that removes the failed path.
5. **Implement** — add/strengthen inbound auth, isolate network exposure, split caller classes, reduce backend scope, or enable read-only mode.
6. **Measure again** — rerun the deterministic gate and capture changed metrics.
7. **Verify** — `subagents/security-verifier.md` independently checks runtime state and evidence.
8. **Complete** — record Implemented, Measured, and Verified separately.

## Responsible agent
Implementation owner for stages 1–6; independent security verifier for stage 7.

## Tools
Configuration readers, runtime listener inspection, network-policy inspection, MCP tool listing, audit logs, Python 3 standard library checker.

## Outputs
Baseline result, remediation record, post-change result, verification record, residual-risk statement.

## Checkpoints
- Before any production mutation.
- After each auth/exposure/tool-surface change.
- Before declaring the deployment verified.

## Metrics
- Unauthenticated reachable privileged listeners: 0.
- Privileged tools without caller authorization: 0.
- Wildcard/public bind without inbound auth: 0.
- Unnecessary backend privileges: minimized and documented.

## Retry policy
Maximum 3 remediation iterations. A retry MUST follow an evidence-backed configuration change; rerunning unchanged inputs is not a retry strategy.

## Stop conditions
Stop immediately on missing effective configuration, unknown exposure, leaked secret material, or a dangerous test lacking approval. Stop after 3 failed remediation iterations and escalate.

## Failure path
Detection: checker nonzero exit or independent verification failure. Evidence: preserve sanitized input/result and runtime observations. Fallback: bind to loopback/private boundary and disable mutating tools. Escalation: platform/security owner. Completion remains blocked.

## Verification
Pass requires deterministic gate success plus independent confirmation of effective runtime state. A configuration-only pass is Measured, not Verified.

## Definition of Done
Evidence documented; baseline captured; root cause identified; remediation implemented; checker passes; runtime exposure confirmed; tool/caller matrix confirmed; backend scope reviewed; no secrets exposed; independent verification complete; no blocker remains.
