# Workflow: Audit → Remediate → Verify

## Trigger
Workflow/action change, new AI action, security review, or scanner failure.

## Goal
Remove deterministic untrusted-data-to-shell paths and constrain command-capable agent workflows without reducing required security controls.

## Inputs
Repository root, policy, changed workflow files, event triggers, permissions, and scanner evidence.

## Baseline
Run `python scripts/scan_github_actions.py <repo> --policy config/policy.json --json-out baseline.json`. Record finding counts by severity and affected workflow.

## Context
GitHub expression evaluation order, event trust, runner type, secrets, checked-out ref, action identity/version, agent permissions, and external-user triggerability.

## Stages
1. **Observe** — Security Reviewer records changed files and baseline findings.
2. **Measure** — Scanner produces deterministic source/sink evidence.
3. **Diagnose** — Trace each finding to event input, expression expansion, shell/action sink, permissions, and runner boundary.
4. **Hypothesize** — Choose minimal remediation: `env:` boundary, safer action argument, base-ref checkout, reduced permissions, trusted-user gate, or isolated job.
5. **Implement** — Maintainer applies only the selected remediation.
6. **Measure again** — Re-run scanner on the final snapshot.
7. **Independent verify** — Security Reviewer checks diff and effective permissions.
8. **Complete** — Archive before/after evidence and residual risks.

## Checkpoints
- C1: baseline exists before edits.
- C2: source/sink path documented for every blocker.
- C3: remediation does not introduce broader permissions or secrets.
- C4: final scanner has zero unapproved blockers.
- C5: independent review complete for high-risk changes.

## Metrics
Blocking findings, explicit-permission coverage, external-trigger count, wildcard authorization count, and unresolved exceptions.

## Retry policy
At most two remediation cycles for the same finding. A third failure requires human security review.

## Stop conditions
Stop immediately if remediation requires exposing secrets, weakening runner isolation, adding write permission unrelated to the task, or executing attacker-controlled code to validate the fix.

## Failure path
Preserve baseline/final evidence, mark verification failed, and hand off with the exact unresolved source/sink path.

## Verification
A successful scan is necessary but not sufficient: final effective permissions, event trigger, checkout ref, runner, and secrets must also be manually reviewed.

## Definition of Done
Evidence documented; baseline captured; root cause identified; blocking interpolation removed; permissions preserved or reduced; scanner passes; high-risk diff independently reviewed; residual risks documented; no secret exposure or unsafe test execution occurred.
