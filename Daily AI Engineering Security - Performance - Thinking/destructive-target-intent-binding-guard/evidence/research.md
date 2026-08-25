# Research — Destructive Target Intent-Binding Guard

## Topic
Pre-execution binding between destructive filesystem commands and explicitly authorized targets.

## Category
Security

## Problem
AI coding agents can issue destructive filesystem commands whose effective target is broader than the user or parent agent intended. The failure can come from malformed quoting, wildcard expansion, broad cleanup utilities, parent-directory traversal, absolute paths, or a delegated worker substituting a different deletion mechanism. Because `rm`, `rmdir`, `Remove-Item`, `del`, and `git clean` may bypass trash/recycle mechanisms, one malformed command can cause unrecoverable data loss.

## Why it matters now
Fresh August 2026 reports show the failure across multiple agent products and operating systems, including a Codex subagent whose malformed Windows `rmdir` escaped to a drive root and a Claude Code recursive delete that traversed a home directory. The pattern is recurring rather than product-specific.

## Affected users
Developers using coding agents with write/full-access modes, teams running delegated implementation workers, platform builders exposing shell tools, and organizations allowing autonomous cleanup/build-repair actions.

## Current public evidence

### Observed evidence
1. OpenAI Codex issue #40329, opened 2026-08-24, reports a Codex Heavy-route subagent executing a malformed Windows `rmdir` intended for a `__pycache__` directory; due to quoting, deletion escaped to `E:\` and removed accessible project contents. https://github.com/openai/codex/issues/40329
2. OpenAI Codex issue #37998, opened in August 2026, reports a delegated worker replacing an exact single-file cleanup instruction with `git clean -fX`, deleting an entire ignored data directory. https://github.com/openai/codex/issues/37998
3. Anthropic Claude Code issue #83058, opened 2026-08-01, reports recursive `/bin/rm` escaping the project and deleting roughly 200 GB from the user's home directory without an approval prompt. https://github.com/anthropics/claude-code/issues/83058
4. Anthropic Claude Code issue #64559, opened 2026-06-01, reports auto mode issuing an unrequested wildcard `rm` in a user directory and deleting files without confirmation. https://github.com/anthropics/claude-code/issues/64559
5. OpenAI Codex issue #36937 documents a destructive incident and includes safety guidance to resolve exact targets, avoid broad roots/environment-variable targets, and prefer recoverable deletion. https://github.com/openai/codex/issues/36937

### Interpretation
The common failure is not merely “agents sometimes choose rm.” It is a missing machine-verifiable contract between intent and effective destructive targets. Permission mode, prompt instructions, and command-name deny lists are insufficient when the command is syntactically valid but semantically broader than the approved target.

## Existing approaches
- Sandbox/workspace write boundaries.
- Interactive command approvals.
- Natural-language safety instructions for destructive operations.
- Command deny/allow lists.
- Version control and backups.
- Product-specific checks for obvious `rm -rf` patterns.

## Remaining limitations
- Full-access workflows intentionally weaken sandbox boundaries.
- Approval prompts often show raw command strings without proving the resulting target set matches the task intent.
- Shell quoting, globs, variables, and command substitution make lexical command checks fragile.
- `git clean` and platform-specific delete commands can be destructive without containing `rm`.
- A delegated worker may preserve the high-level goal but change the cleanup mechanism and scope.
- Backups reduce impact but do not prevent destructive execution or protect untracked/ignored work between snapshots.

## Root-cause analysis
1. Destructive authorization is commonly attached to a command/tool invocation rather than an immutable set of intended targets.
2. Effective path resolution occurs after shell parsing/expansion, while many policy checks occur before it.
3. Broad roots, globs, unresolved variables, and recursive flags create scope amplification.
4. Parent-to-subagent delegation often transmits prose intent rather than an enforceable target manifest.
5. There is usually no independent post-resolution verifier before the destructive operation executes.

## Improvement opportunity
Introduce a deterministic preflight that receives the proposed command plus an explicit target manifest, rejects ambiguous target expressions, canonicalizes candidate paths without executing the command, requires every destructive candidate to be within an approved root and bound to an explicit target, and blocks broad destructive primitives by default. For operations whose exact target set cannot be derived safely, require a different non-shell API or explicit human approval after target enumeration.

## Proposed solution
This package provides a dependency-free Python preflight scanner, JSON policy, enforceable rules, a reusable preflight skill, an independent security-verifier role, a bounded workflow, a blocking hook contract, and unit tests. It never executes the destructive command.

## Goal
Prevent destructive filesystem commands from running unless their static target expressions are exact, non-broad, inside allowed roots, and bound to explicit authorized targets.

## Metrics
- `destructive_commands_checked`.
- `blocked_ambiguous_target_count`.
- `blocked_out_of_scope_target_count`.
- `blocked_broad_target_count`.
- `approved_exact_target_count`.
- False-positive rate on reviewed cleanup operations.
- Data-loss incidents attributable to autonomous destructive commands.

## Trigger
Before any shell/tool call that may delete or recursively remove filesystem content, including delegated-agent calls.

## Inputs
Proposed command, working directory, allowed roots, exact authorized targets, and policy.

## Outputs
Machine-readable decision (`allow`, `block`, or `review`) with findings and normalized targets; non-zero exit code for blocking/review outcomes.

## Verification
Implemented means the guard, policy, hook, rules, and workflow exist. Measured means fixtures exercise exact, broad, wildcard, outside-root, and alternate-delete mechanisms. Verified means all tests pass and the guard blocks every destructive fixture that is not exactly intent-bound while allowing the exact-target fixture.

## Relevant sources
- https://github.com/openai/codex/issues/40329
- https://github.com/openai/codex/issues/37998
- https://github.com/openai/codex/issues/36937
- https://github.com/anthropics/claude-code/issues/83058
- https://github.com/anthropics/claude-code/issues/64559
