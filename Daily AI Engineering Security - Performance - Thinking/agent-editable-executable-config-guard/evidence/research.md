# Research — Agent-Editable Executable Configuration Guard

## Topic
Agent-editable configuration that can later execute code.

## Category
Security

## Problem
AI coding agents can be allowed to edit project files automatically while some project files are themselves executable control-plane configuration. A prompt injection can therefore turn an apparently ordinary file edit into persistence or shell execution when lifecycle hooks, custom-agent definitions, tasks, or equivalent configuration are invoked later.

## Why it matters now
On 2026-08-11 Microsoft published GHSA-w79w-rj9h-vg4f for VS Code: a crafted prompt injection could make Copilot write custom agent files containing lifecycle hooks without confirmation; invoking the custom agent could then execute attacker-controlled shell commands. The same VS Code 1.132.1 security release also fixed GHSA-3hjg-cwxj-qfc6, where the Claude integration's `acceptEdits` mode could edit files outside the workspace without an approval prompt. Together they show that edit permission and execution permission can collapse when executable configuration is not treated as a separate capability boundary.

## Affected users
Developers using coding agents, platform teams enabling auto-edit modes, teams distributing repository-local agent configuration, and security teams relying on workspace-level edit approval as the primary control.

## Current public evidence
### Observed evidence
1. Microsoft VS Code GHSA-w79w-rj9h-vg4f, published 2026-08-11: custom agent hook RCE through agent-written lifecycle hook configuration; patched in VS Code 1.132.1 by requiring confirmation before editing agent/hook configuration. https://github.com/microsoft/vscode/security/advisories/GHSA-w79w-rj9h-vg4f
2. Microsoft VS Code GHSA-3hjg-cwxj-qfc6, published 2026-08-11: Claude `Edit automatically` could write outside the intended workspace; patched in 1.132.1. https://github.com/microsoft/vscode/security/advisories/GHSA-3hjg-cwxj-qfc6
3. VS Code AI security documentation, updated in August 2026, explicitly separates approvals, session isolation, agent isolation, and secure handling of agent capabilities. https://code.visualstudio.com/docs/agents/run/security

### Interpretation
The recurring weakness is capability composition: a broad edit grant is unsafe when a subset of editable files can register commands, hooks, tools, or future execution. Path-based workspace trust alone is insufficient because the dangerous property is semantic: editing certain configuration changes future executable behavior.

### Proposed solution
Introduce a deterministic pre-write gate that classifies executable-control configuration by path and content, requires explicit approval for writes that introduce or change command-bearing fields, binds approval to the exact content hash, and independently verifies the resulting configuration before execution.

## Existing approaches
- Workspace trust and per-edit approval prompts.
- Sensitive-file confirmation in current VS Code builds.
- Agent isolation/worktrees.
- General prompt-injection guidance and code scanning.

## Remaining limitations
- Generic auto-edit modes can still be implemented by other hosts without a semantic distinction between source files and executable control-plane files.
- Path-only allowlists miss newly introduced config locations or renamed formats.
- A one-time approval can become stale after file contents change.
- Code scanners often inspect application code, not agent lifecycle configuration.

## Root-cause analysis
1. Edit capability and execution-registration capability are conflated.
2. Trust is attached to workspace/path rather than the semantic effect of a change.
3. Approval is not always content-addressed.
4. The writer and verifier can be the same agent.
5. Execution may occur later, separated from the original approval context.

## Improvement opportunity
Use a portable guard before every agent-originated write to privileged configuration. Detect risky paths plus command-bearing keys, emit stable SHA-256 fingerprints, block unapproved changes, and require an independent final verifier before any lifecycle hook is enabled.

## Goal
Prevent prompt-injected or accidental agent edits from silently creating a new execution path.

## Metrics
- privileged-config writes detected per task;
- blocked unapproved executable changes;
- approval hash mismatch count;
- security test pass rate;
- false-positive rate on known-safe configuration;
- number of executions whose config fingerprint was independently verified.

## Trigger
Any agent write/create/rename affecting agent, editor, task, hook, workflow, or lifecycle configuration.

## Inputs
Repository root, candidate file path, proposed content, optional approved SHA-256 digest.

## Outputs
ALLOW/BLOCK decision, reason codes, content digest, detected executable indicators.

## Verification
The package is verified when malicious hook fixtures are blocked, benign non-executable config passes, stale approvals fail after content mutation, and no test invokes payload commands.

## Relevant sources
- https://github.com/microsoft/vscode/security/advisories/GHSA-w79w-rj9h-vg4f
- https://github.com/microsoft/vscode/security/advisories/GHSA-3hjg-cwxj-qfc6
- https://code.visualstudio.com/docs/agents/run/security
