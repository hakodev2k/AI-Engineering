# Research

## Topic
Semantic test oracles for AI-agent permission hooks

## Category
Security

## Problem
A hook or permission control can be syntactically valid and execute without error while still allowing the action it exists to block. The same policy can also behave differently across host modes, IDE surfaces, restarts, or working directories. Exit-code-only or “hook ran successfully” tests can therefore create false confidence.

## Why it matters now
Fresh August 2026 Claude Code reports show both an incorrect first-party hook tester oracle and runtime surfaces where `ask`/hook enforcement is skipped or transformed. These are security-boundary failures, not style problems.

## Affected users
Developers authoring PreToolUse/PermissionRequest hooks, platform teams enforcing agent permissions, plugin authors, security engineers, and organizations using coding agents for infrastructure or production changes.

## Current public evidence
### Observed evidence
1. Anthropic Claude Code issue #83800, opened **2026-08-04**, reports `test-hook.sh` returning success for a hook that allowed the write it was designed to deny. The reported root cause is that both exit 0 and exit 2 are treated as successful test execution instead of comparing the actual semantic outcome with an expected decision. https://github.com/anthropics/claude-code/issues/83800
2. Claude Code issue #87639, opened **2026-08-18**, reports interactive auto mode ignoring both matching `permissions.ask` rules and a PreToolUse `permissionDecision: "ask"`, allowing the Bash command to run. https://github.com/anthropics/claude-code/issues/87639
3. Claude Code issue #86754, opened **2026-08-14**, reports the VS Code extension silently resolving both static `ask` rules and PreToolUse `ask` decisions to allow with no prompt. https://github.com/anthropics/claude-code/issues/86754
4. Claude Code issue #85430, opened **2026-08-10**, reports a project PreToolUse hook not firing for one working directory while `permissions.deny` from the same settings file still fires. https://github.com/anthropics/claude-code/issues/85430
5. GitHub's current Copilot hooks reference documents that hook outcomes depend on event type and host behavior; for example, `permissionRequest` can short-circuit normal permission flow, `preToolUse` non-timeout errors fail closed, but hook timeouts are fail-open. https://docs.github.com/en/copilot/reference/hooks-reference

### Interpretation
Hook correctness has two separate layers: **hook decision correctness** and **effective runtime enforcement**. A unit test can prove the first but not the second. A reusable verifier needs an explicit expected decision and runtime observation keyed to the same case.

## Existing approaches
- Vendor hook-development test scripts.
- Manual command execution and visual confirmation.
- Configuration review of allow/ask/deny rules.
- Ad hoc unit tests around hook code.
- Runtime logs without a shared expectation matrix.

## Remaining limitations
- “Process exited normally” is not the same as “policy decision was correct.”
- Exit code and JSON output jointly determine semantics in some hook systems.
- Runtime mode/surface can change the effective decision after hook execution.
- Manual tests do not scale across tool/input/mode matrices.
- Missing runtime observations are often treated as absence of failure instead of failed verification.

## Root-cause analysis
1. Test oracle validates execution success instead of authorization semantics.
2. Expected policy is not encoded as machine-readable test data.
3. Unit-hook and host-runtime verification use separate evidence formats.
4. High-risk negative cases receive less coverage than happy-path allows.
5. Permission-mode and UI-surface differences are not part of regression matrices.

## Improvement opportunity
Define an expectation matrix keyed by stable case IDs, infer semantic hook decisions deterministically, require runtime observations for effective enforcement, and fail closed on missing/mismatched evidence.

## Goal
Prevent a security hook from being declared verified when it allows a prohibited action or when the host fails to enforce its decision.

## Metrics
False-allow count, decision mismatch rate, missing observation count, high-risk case coverage, mode/surface coverage, verification latency.

## Trigger
Creation/change of a permission hook, agent/runtime upgrade, new permission mode or UI surface, or any report that a hook/rule did not fire or prompt.

## Inputs
Case matrix, trusted hook executable for unit testing, optional host-produced runtime observation JSONL.

## Outputs
Per-case observed/expected decisions, missing/mismatch list, deterministic pass/fail exit code.

## Proposed solution
Use `scripts/verify_hook_policy.py` with the rules and two-stage workflow in this package.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/83800
- https://github.com/anthropics/claude-code/issues/87639
- https://github.com/anthropics/claude-code/issues/86754
- https://github.com/anthropics/claude-code/issues/85430
- https://docs.github.com/en/copilot/reference/hooks-reference
