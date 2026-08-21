# Research — Agent Symlink Write-Target Integrity Guard

## Problem
AI coding agents commonly create temporary files, replace scripts, edit generated files, and run shell redirections. A path that appears to be inside the workspace may actually be a symbolic link, junction, or other indirection to a sensitive target outside the intended write boundary. If the agent or shell follows that link, a seemingly harmless write can overwrite runtime components, credentials, system files, or another repository.

## Category
Security

## Why it matters now
Recent public reports show this failure mode in active coding-agent products rather than only in historical sandbox research.

## Current public signals

### OpenAI Codex issue #32026 — July 10, 2026
A public Codex Desktop issue reports that an agent-created temporary Git path remained a symlink to the live Codex runtime Git wrapper. A later shell redirection intended to replace the temporary wrapper followed the symlink and overwrote the live runtime dependency, producing a recursive exec loop and severe host instability.
Source: https://github.com/openai/codex/issues/32026

### Claude Code GHSA-vp62-r36r-9xqp — April 20, 2026
Anthropic published a high-severity advisory for a sandbox escape where symlink following allowed arbitrary file writes outside the workspace. The advisory demonstrates that workspace path checks are insufficient when canonical targets are not enforced.
Source: https://github.com/anthropics/claude-code/security/advisories/GHSA-vp62-r36r-9xqp

### Claude Code GHSA-4vp2-6q8c-pvq2 — June 25, 2026
Anthropic published a moderate advisory for an insecure temporary-file path in `/copy` that enabled response disclosure and symlink-based file write. This is a separate product surface showing that temporary-file workflows remain vulnerable to link races and target substitution.
Source: https://github.com/anthropics/claude-code/security/advisories/GHSA-4vp2-6q8c-pvq2

### Claude Code GHSA-4q92-rfm6-2cqx — February 6, 2026
Anthropic also disclosed a permission-deny bypass through symbolic links: denied files could be accessed through allowed symlink paths. Although primarily a read-control issue, it reinforces the same root problem: authorization must be evaluated against resolved targets, not only lexical paths.
Source: https://github.com/anthropics/claude-code/security/advisories/GHSA-4q92-rfm6-2cqx

## Observed evidence
- A write through a symlink has corrupted a live agent runtime dependency.
- Symlink-following has enabled writes outside a coding agent's intended workspace sandbox.
- Temporary-file logic has produced another independent symlink-write vulnerability.
- Permission systems that evaluate only apparent paths can be bypassed through link indirection.

## Interpretation
Agent write authorization must bind the requested path to its canonical destination and revalidate the binding immediately before mutation. Prompt instructions such as “only edit files in this repo” are insufficient because shell semantics can dereference links after the model has chosen an apparently safe path.

## Existing approaches
### Workspace allowlists
Agents commonly limit writes to the repository root or configured writable roots.
Limitation: lexical containment does not prove that the final target remains inside the root.

### Sandbox filesystem rules
OS/runtime sandboxes can block writes outside allowed areas.
Limitation: implementation mistakes around symlink resolution have produced real escapes, and not every agent execution mode uses the same sandbox.

### Prompt-level safety rules
Instructions can tell the model not to touch symlinks or sensitive paths.
Limitation: the model may not know a path is a symlink; shell redirection, rename, copy, archive extraction, and generated temporary files can dereference links implicitly.

### Temporary files
Creating a temp file and moving it into place is safer than direct overwrite when implemented correctly.
Limitation: predictable names, pre-existing links, non-atomic checks, or unsafe destination replacement can reintroduce target substitution.

## Root-cause hypotheses
1. Authorization is performed on a lexical path before resolving the destination.
2. Check and write are separated by enough time for a link target to change (TOCTOU).
3. Shell redirection bypasses application-level write guards.
4. Parent directory components can themselves be symlinks/junctions.
5. Temporary-file creation does not use exclusive creation and same-directory atomic replacement.
6. Agent runtimes treat workspace ownership as equivalent to destination ownership.

## Proposed engineering solution
A deterministic write-target integrity layer:
1. Resolve every existing path component and canonicalize the destination parent.
2. Reject symlink/reparse-point leaf targets by default for mutation workflows.
3. Require the canonical parent and final destination to remain inside explicitly configured writable roots.
4. Capture a pre-write fingerprint of link state and target identity.
5. Revalidate immediately before mutation.
6. Prefer exclusive temp-file creation in the destination directory plus atomic replace.
7. Treat shell redirections and file-moving commands as write operations requiring preflight.
8. Log only paths and metadata, never file contents or secrets.

## Success metrics
- 100% of known symlink/junction escape fixtures blocked before mutation.
- Zero writes outside configured canonical roots in integration tests.
- Zero mutation of symlink leaf targets under default policy.
- Preflight overhead measured and kept below an explicit project threshold (default target: p95 < 25 ms for local filesystems).
- 100% of high-risk shell redirection fixtures detected.
- No policy bypass introduced by parent-directory links.

## Threat model
### Assets
Repository integrity, agent runtime binaries/scripts, credentials/configuration, neighboring repositories, user home files, CI workspaces.

### Attack/failure sources
Malicious repository symlinks, indirect prompt injection causing writes to attacker-chosen paths, stale temporary links, compromised generated content, accidental shell redirection, race conditions.

### Trust boundaries
Model/tool request → tool runner; apparent workspace path → filesystem canonical target; temporary filename → final destination; sandbox policy → OS filesystem behavior.

## Non-goals
- Replacing OS sandboxing.
- Automatically following and editing symlink targets.
- Supporting privileged/system writes without explicit human approval.
- Detecting every filesystem virtualization technology on every OS; unsupported resolution must fail closed for protected operations.

## Sources
1. OpenAI Codex issue #32026, opened 2026-07-10: https://github.com/openai/codex/issues/32026
2. Anthropic Claude Code GHSA-vp62-r36r-9xqp, published 2026-04-20: https://github.com/anthropics/claude-code/security/advisories/GHSA-vp62-r36r-9xqp
3. Anthropic Claude Code GHSA-4vp2-6q8c-pvq2, published 2026-06-25: https://github.com/anthropics/claude-code/security/advisories/GHSA-4vp2-6q8c-pvq2
4. Anthropic Claude Code GHSA-4q92-rfm6-2cqx, published 2026-02-06: https://github.com/anthropics/claude-code/security/advisories/GHSA-4q92-rfm6-2cqx
