# Research — Repository-Open Execution Quarantine Guard

## Topic
Repository-open execution quarantine for AI coding workspaces

## Category
Security

## Problem
A cloned repository can contain project-local agent/editor configuration that executes commands before a developer has meaningfully reviewed the workspace. Current 2026 campaigns combine dependency install hooks with Claude Code `SessionStart` hooks and VS Code `runOn: folderOpen` tasks, turning clone/open/session-start into an execution boundary.

## Why it matters now
This is no longer hypothetical. Public reporting in 2026 documents active campaigns and product vulnerabilities where repository-local configuration runs attacker-controlled commands on project open or agent session start. Traditional dependency pinning, SCA and package-install approval do not cover execution that happens before installation.

## Affected users
- Developers cloning unfamiliar repositories or reviewing pull requests locally.
- Teams using Claude Code, VS Code, Cursor-like editors, or agent-enabled IDEs.
- Platform teams distributing devcontainers/workspaces and golden developer images.
- Security teams whose controls currently focus on package installation and CI rather than workspace-open triggers.

## Current public evidence

### Observed evidence
1. Pillar Security, 2026-08-04, reported the ChainDrop campaign carrying both a Claude Code `SessionStart` hook and a VS Code `folderOpen` task, in addition to npm `preinstall`, so opening an infected checkout could execute the payload without installing the package. Source: https://www.pillar.security/blog/chaindrop-when-opening-a-repository-becomes-execution
2. Anthropic's containment engineering write-up states that project-local `.claude/settings.json` hooks previously executed before the folder trust dialog and describes the remediation pattern: defer parsing/execution until after trust is established. Source: https://www.anthropic.com/engineering/how-we-contain-claude
3. Microsoft VS Code issue #309406 documents `tasks.json` with `runOn: folderOpen` silently executing arbitrary commands from a cloned repository and calls out the weakness of generic Workspace Trust when the user is not shown the command that will run. Source: https://github.com/microsoft/vscode/issues/309406
4. SafeDep reported malicious npm packages using a hijacked Claude Code `SessionStart` hook so malware re-executed on every agent session start. Source: https://safedep.io/malicious-npm-packages-claude-code-hooks/

## Existing approaches
- Workspace/folder trust prompts in editor/agent products.
- Product fixes that defer project-local config parsing/execution until trust acceptance.
- SCA/package malware scanning and dependency lock/pinning.
- Endpoint detection for known malicious files/IOCs.
- Manual review of `.vscode`, `.claude`, package scripts and other project automation.

## Remaining limitations
- Trust is frequently binary and coarse: a user may trust source code without realizing that trust enables repository-controlled startup commands.
- Different products implement distinct startup/config surfaces, so a repo can be safe for one editor and unsafe for another.
- SCA focuses on dependencies; repo-borne hooks can execute before package installation.
- IOC-only detection misses new payloads and benign-looking commands that fetch remote content.
- Manual review is easy to skip and difficult to make repeatable across many repositories.

## Root-cause analysis
1. Repository data and executable workspace configuration share the same distribution channel.
2. Startup/session lifecycle hooks are high-authority events but are often treated as convenience configuration.
3. Trust decisions are not always scoped to the exact commands/configuration being enabled.
4. Multiple execution surfaces (`SessionStart`, `folderOpen`, install scripts, tasks) are reviewed independently rather than as one pre-execution trust boundary.
5. Security checks happen after workspace activation rather than before any project-local automation can run.

## Improvement opportunity
Add a deterministic, product-agnostic pre-open scanner and quarantine workflow. Scan known repository-controlled auto-execution surfaces before launching the editor/agent, classify findings by trigger and command behavior, fail closed on startup hooks or silent auto-run tasks unless explicitly approved, and bind approval to content hashes so changed configuration requires re-review.

## Proposed solution
This package provides:
- a no-dependency static scanner for high-risk repo-open/session-start/install surfaces;
- hash-bound approval policy;
- enforceable rules for trust-before-execution;
- a reviewer role separate from the consuming agent;
- a quarantine workflow with deterministic blocking exit codes;
- tests proving detection of the primary 2026 attack shapes.

## Metrics
- `startup_exec_surfaces_detected` per repository.
- `unapproved_blocking_findings` before workspace activation.
- `% repositories opened only after scanner pass`.
- `approval_hash_mismatch_count` after configuration drift.
- False-positive rate on approved internal repositories.
- Time from clone to safe-open decision.

## Trigger
Any clone, checkout, branch switch, pull-request checkout, archive extraction, or remote workspace sync before launching an editor or coding agent that consumes project-local configuration.

## Inputs
Repository path, policy file, optional approval records.

## Outputs
Machine-readable findings, blocking exit status, content hashes for approval, human-readable evidence.

## Verification
A package is verified only when malicious fixtures for `SessionStart` and `folderOpen` are blocked, benign repositories pass, changed risky config invalidates prior approval, and no scanner action executes project-controlled commands.
