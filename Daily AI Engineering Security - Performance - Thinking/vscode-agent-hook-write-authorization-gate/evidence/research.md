# Research — VS Code Agent Hook Write Authorization Gate

## Topic
Agent-written lifecycle hook configuration can become deferred shell execution.

## Category
Security

## Problem
A coding agent allowed to edit repository configuration may create or modify hook/custom-agent files that later execute shell commands. If authorization is attached only to the immediate edit tool, a configuration write can establish a deferred execution path outside the original approval boundary.

## Why it matters now
Microsoft disclosed a high-severity VS Code vulnerability on 2026-08-11 in which prompt injection could cause Copilot to write custom agent files containing lifecycle hooks without confirmation; invoking the custom agent could then execute attacker-controlled shell commands with the user's privileges. The fix in VS Code 1.132.1 added confirmation before editing agent/hook configuration. Current VS Code documentation also states that hooks execute shell commands with VS Code's permissions and should be reviewed carefully.

## Affected users
Developers using coding agents, teams sharing repository hook/custom-agent configuration, IDE/plugin authors, agent-platform builders, and enterprises allowing agent-generated configuration.

## Current public evidence

### Observed evidence
1. **GHSA-w79w-rj9h-vg4f / CVE-2026-70335**, published 2026-08-11: crafted prompt injection could cause VS Code <=1.132.0 to write custom agent files with lifecycle hooks without confirmation; patched in 1.132.1 by requiring confirmation. https://github.com/microsoft/vscode/security/advisories/GHSA-w79w-rj9h-vg4f
2. **VS Code issue #330322**, opened 2026-08-11, tracks the same custom-agent hook command-execution vulnerability and patch. https://github.com/microsoft/vscode/issues/330322
3. **VS Code hook documentation**, approved 2026-08-05, says hooks run shell commands at agent lifecycle points, execute with VS Code's permissions, and require review, least privilege, input validation, and secure credential handling. https://github.com/microsoft/vscode-docs/blob/main/docs/agent-customization/hooks.md
4. **VS Code approval documentation**, approved 2026-07-29, documents explicit tool/command approval controls and sandboxing. https://github.com/microsoft/vscode-docs/blob/main/docs/agents/approvals.md

### Interpretation
The reusable engineering problem is a **write-to-execution boundary**: a file edit that looks like ordinary repository mutation can register code that executes later. Approval should bind to the semantic effect of the file change, not only the editor operation.

## Existing approaches
Product patches requiring confirmation for hook/custom-agent changes; workspace trust; tool/terminal approval prompts; sandboxing; enterprise policies that can disable hooks; manual code review.

## Remaining limitations
Generic coding agents may not classify hook configuration as executable policy; path allowlists do not inspect commands; deferred execution separates risky effect from the initial approval event; human review is inconsistent without a deterministic classifier; repositories can reference scripts outside the expected workspace.

## Root-cause analysis
1. Executable configuration is treated as ordinary text.
2. Authorization is attached to tool type (`edit`) rather than semantic consequence (`register shell command`).
3. Deferred execution separates the effect from the approval event.
4. Path and command validation are split across subsystems.
5. Prompt-influenced agents may act on untrusted workspace/web/MCP content.

## Improvement opportunity
Use a deterministic pre-write gate that classifies hook/custom-agent paths, parses hook JSON, extracts command-bearing fields, rejects unsafe shell patterns and workspace escapes, requires explicit approval for executable-hook registration, and emits stable reason codes for audit/regression tests.

## Relevant sources
- https://github.com/microsoft/vscode/security/advisories/GHSA-w79w-rj9h-vg4f
- https://github.com/microsoft/vscode/issues/330322
- https://github.com/microsoft/vscode-docs/blob/main/docs/agent-customization/hooks.md
- https://github.com/microsoft/vscode-docs/blob/main/docs/agents/approvals.md
