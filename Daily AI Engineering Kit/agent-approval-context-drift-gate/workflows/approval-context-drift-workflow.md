# Approval Context Drift Workflow

## Trigger
A workflow is about to request or consume approval for an action whose effect could be dangerous, privileged, production-facing, high risk, or critical.

## Entry conditions
The intended action, target environment, resources, repository revision, plan, commands, permissions, and executor are identifiable.

## Inputs
Task requirements, policy, repository/tool state, executable plan, resource set, command/tool calls, permission scopes.

## Flow

```text
Stabilize plan
  -> Capture approval context
  -> Fingerprint context
  -> Human approval
  -> Reconstruct live context
  -> Drift evaluation
  -> Independent review (high/critical)
  -> Final gate
  -> Execute side effect
  -> Record execution separately
```

## Stages
1. **Stabilize** — coordinator resolves blockers and freezes the intended action.
2. **Capture** — Approval Context Curator builds the context and fingerprint.
3. **Approve** — human approves the exact fingerprint when required.
4. **Reconstruct** — curator re-reads revision/environment/resources/commands/permissions immediately before execution.
5. **Detect drift** — run `python3 scripts/evaluate-context-drift.py approved-context.json current-context.json --output drift.json`.
6. **Invalidate if changed** — any `drifted` result stops execution. Create a new context and obtain a new approval; never mutate old evidence.
7. **Independent review** — high/critical work goes to Approval Context Verifier. Reviewer must not be executor.
8. **Final gate** — run `python3 scripts/evaluate-final-gate.py current-context.json approval.json --review review.json` when review is required. Low/medium may omit `--review` unless local policy is stricter.
9. **Execute** — only after `verified`. Execution uses the exact approved resources/commands/permissions/environment.
10. **Record** — persist actual tool result separately; gate verification is not execution proof.

## Produced artifacts
- approval context JSON
- context fingerprint
- approval record
- drift report
- optional independent review
- final-gate output
- separate execution receipt/log

## Checkpoints
- Before approval: all context fields known.
- After approval: context immutable.
- Immediately before side effect: zero drift.
- Before high/critical execution: independent approved review.

## Retry rules
Transient repository/tool state read failure may retry once. No retry for context mismatch, rejection, self-review, permission denial, unknown target, or changed risk. Preserve both failed reads/errors and prior evidence.

## Failure paths
- Drift -> block, preserve evidence, rebuild context, request new approval.
- Missing/denied approval -> block and escalate to human owner.
- Permission failure -> block; do not widen permission automatically.
- Unknown environment/resource -> block until resolved.
- Tool failure after execution begins -> preserve result and reconcile actual side effect before any replay.

## Approval points
Explicit human approval is mandatory for production deployment, destructive SQL, schema/data/file deletion, force push/history rewrite, infrastructure/secret/production-config changes, breaking APIs, security weakening, irreversible migration, large dependency upgrades, and any policy-designated dangerous action.

## Definition of Done
- Current context fingerprint equals approved fingerprint.
- No material drift exists.
- Required independent review is approved and not self-review.
- Required human approval is explicit and current.
- Final gate returns `verified`.
- Execution, if performed, is recorded separately with unresolved outcome clearly stated.
