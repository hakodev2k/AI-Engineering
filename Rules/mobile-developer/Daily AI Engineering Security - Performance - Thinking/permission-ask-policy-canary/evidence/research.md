# Research — Permission Ask Policy Canary

## Topic
Permission Ask Policy Canary

## Category
Security

## Problem
Agent permission configurations can appear valid while an `ask` gate is not actually enforced on a specific client surface or autonomy mode. A silent mismatch is dangerous because operators may believe destructive commands require confirmation when the host executes them automatically.

## Why it matters now
Recent Claude Code reports describe `permissions.ask` rules that are loaded and displayed but do not prompt, plus a separate VS Code report where a `PreToolUse` hook returning `ask` is auto-approved in auto-accept mode. A later report reproduced auto-mode bypass for destructive commands on macOS and Windows while `deny` continued to work. These are independent signals that configured intent and runtime enforcement can diverge.

## Affected users
- Developers using autonomous coding agents.
- Teams relying on `ask` rules for destructive shell, git, deployment, database, or egress actions.
- Platform engineers using hooks as safety gates.
- Security teams validating agent permission profiles across CLI, IDE, Desktop, and subagent surfaces.

## Current public evidence
### Observed evidence
1. anthropics/claude-code #81041 (2026-07-25): `permissions.ask` rules were reported as loaded and visible in `/permissions` but not enforced; equivalent `deny` rules worked.
2. anthropics/claude-code #82518 (2026-07-30): a `PreToolUse` hook returning `permissionDecision: ask` prompted in CLI but was reported auto-approved in the VS Code extension when auto-accept was enabled.
3. anthropics/claude-code #83766 (2026-08-04): an 8-case matrix reported auto mode executing commands matching explicit `ask` rules without prompts, including destructive git/PowerShell cases; `deny` still worked.
4. anthropics/claude-code #51689 is an older duplicate report of auto mode bypassing explicit `ask` permissions, indicating recurrence rather than a single isolated configuration mistake.

### Interpretation
The general engineering failure is a missing runtime proof that configured approval semantics are active on the exact host/version/mode being used. Configuration inspection alone is insufficient because parsing/UI presentation and enforcement are separate layers.

### Proposed solution
Add a non-destructive permission canary that runs before unattended/autonomous operation. It evaluates synthetic probe observations against the intended policy and blocks autonomy if any `ask` probe executed without confirmation, any `deny` probe executed, or the runtime cannot demonstrate the expected decision path.

## Existing approaches
- Inspect the permissions configuration and UI.
- Trust documented precedence (`deny`, `ask`, `allow`).
- Use `PreToolUse` hooks.
- Move especially dangerous actions to `deny`.
- Rely on sandboxing to reduce impact.

## Remaining limitations
- UI/config presence does not prove enforcement.
- Behavior can differ by surface, version, and permission mode.
- Hooks may be evaluated but their `ask` decision may not produce a prompt on every surface.
- Sandboxing limits effects but does not prove human approval happened.
- Manual spot checks are easy to forget after upgrades.

## Root-cause analysis
1. Policy declaration and runtime enforcement are separate components.
2. Multiple surfaces can implement permission handling differently.
3. Auto/autonomy modes add classifiers and shortcuts that may alter decision flow.
4. Safety controls are often tested only when configured, not continuously after upgrades.
5. A silent fail-open is difficult to notice until a dangerous action occurs.

## Improvement opportunity
Treat permission semantics like an executable contract. Maintain harmless canary cases and verify observed decisions before enabling high-autonomy sessions or after host/version/config changes.

## Metrics
- canary pass rate by host/version/mode;
- number of fail-open `ask` observations;
- number of failed `deny` observations;
- time from version/config change to validation;
- autonomy sessions started without a fresh passing canary (target: zero);
- false-positive rate of the canary harness.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/81041
- https://github.com/anthropics/claude-code/issues/82518
- https://github.com/anthropics/claude-code/issues/83766
- https://github.com/anthropics/claude-code/issues/51689
- https://github.com/anthropics/claude-code/issues/58864

## Evidence status
**Implemented:** this package provides deterministic observation validation and an execution workflow.

**Measured:** adopting teams must run probes on their actual surfaces and record outcomes.

**Verified:** only after the canary matrix passes for every autonomy surface/mode in scope.