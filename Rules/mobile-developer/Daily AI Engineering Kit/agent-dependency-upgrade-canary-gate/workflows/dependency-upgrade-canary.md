# Workflow: Dependency Upgrade Canary

## Trigger
A developer requests an upgrade of one dependency or a tightly bounded dependency set.

## Entry conditions
- Upgrade request is available.
- Repository is accessible.
- Required build/test tools can be identified.

## Inputs
Request matching `schemas/upgrade-request.schema.json`, repository root, policy configuration.

## Context
Relevant manifests, lockfiles, central version files, affected source/tests, package graph, Git history/status, release or migration guidance when risk requires it.

## Flow
`Trigger -> Investigate -> Approval Gate -> Baseline -> Canary Upgrade -> Restore -> Build/Test -> Diff Review -> Independent Verify -> Complete`

### Stage 1 — Investigate
Owner: `subagents/dependency-upgrade-investigator.md`.
Run `skills/assess-dependency-upgrade.md` and `scripts/detect-ecosystem.py`.
Artifact: assessment with scope, risk, expected files, verification commands.
Checkpoint: target and current version must be proven.

### Stage 2 — Approval gate
If `config/policy.yaml` marks the change as approval-required, stop with `needs-approval`. No editing may begin until explicit approval exists.

### Stage 3 — Baseline
Owner: implementation agent.
Run `hooks/pre-upgrade.md`, which invokes `scripts/capture-baseline.py`.
Checkpoint: clean Git start and baseline JSON required.

### Stage 4 — Canary upgrade
Owner: implementation agent using `skills/execute-canary-upgrade.md`.
Change only the target dependency and mechanically required compatibility code. Inspect dependency delta immediately after restore/install.

### Stage 5 — Verification commands
Run request-specific restore/build/test commands. A failed deterministic command creates a failure record and a new hypothesis before any retry.

### Stage 6 — Post-upgrade gate
Run `hooks/post-upgrade.md`, invoking `scripts/verify-upgrade.py`.
Artifact: `.ai/dependency-upgrade-canary/verification.json`.

### Stage 7 — Independent verification
Owner: `subagents/dependency-upgrade-verifier.md`.
Review baseline, verification JSON, command output, final dependency graph, and Git diff.

## Retry rules
- Maximum retries per transient command: 2.
- Maximum implementation fix/verify cycles: 2.
- Retryable: network/package-registry transient failures, flaky external tool invocation when evidence suggests transience.
- Not retryable without a changed hypothesis: compiler errors, deterministic test failures, dependency conflicts.
- Never retry permission failures by increasing privileges.
- Preserve baseline, command output, and verification evidence across retries.

## Approval points
Explicit human approval is required for all entries listed under `risk.approval_required_for` in `config/policy.yaml`, plus production/configuration/security/destructive actions described in `rules/dependency-upgrade-rules.md`.

## Failure paths
- Ambiguous target -> `blocked`.
- Dirty repository with clean-start policy -> `blocked`.
- Approval missing -> `needs-approval`.
- Dependency resolution broadens scope after two methods -> `failed`.
- Build/test failure after two evidence-based fix cycles -> `failed`.
- Verification detects unapproved high-risk change -> `needs-approval`.

## Stop conditions
Stop on success, missing approval, permission failure, ambiguous scope, two failed retry/fix cycles, or an unsafe/unbounded dependency delta.

## Definition of Done
- Baseline exists and proves starting state.
- Requested dependency change is present.
- No unexplained direct-dependency drift exists.
- Restore/build/tests and request verification commands pass.
- Final diff is reviewed.
- Required approvals are evidenced.
- Independent verifier returns `verified`.
- Remaining non-blocking risks are documented.
