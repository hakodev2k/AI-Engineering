# Research: Pretrust Git Config Execution Guard

## Topic
Pretrust Git configuration command execution in AI coding agents.

## Category
Security

## Problem
Repository-local Git configuration can contain executable behavior. Agents that collect Git metadata before workspace trust may execute attacker-controlled commands outside normal model tool-permission/sandbox boundaries.

## Why it matters now
September 2026 public disclosures describe this class across coding agents; CVE-2026-72718 documents a concrete Goose path where system Git consumed attacker-controlled `core.fsmonitor`.

## Affected users
Developers opening archive/shared repositories, coding-agent users, review bots, IDE integrations, and platform builders wrapping Git.

## Current public evidence
### Observed evidence
1. Red Hat CVE-2026-72718: `goose review` can consume malicious repository Git config and `core.fsmonitor`, executing with user privileges. https://access.redhat.com/security/cve/cve-2026-72718
2. Goose advisory GHSA-r5pp-p5r8-466r and v1.44.0 remediation identify the affected review path and patched release. https://github.com/aaif-goose/goose/security/advisories/GHSA-r5pp-p5r8-466r ; https://github.com/aaif-goose/goose/releases/tag/v1.44.0
3. September 3 GitSpawn reporting describes the same poisoned Git-config mechanism across multiple coding agents and the archive-delivery risk. https://cybersecuritybeat.com/2026/09/03/poisoned-git-configs-make-ai-coding-agents-run-attacker-commands/
4. Independent Codex vulnerability reporting identifies repository-local `core.fsmonitor` during metadata collection and a patched release. https://intel.aikido.dev/cve/AIKIDO-2026-960660

### Interpretation
The common failure is trust ordering: deterministic metadata collection is assumed non-executing and occurs before explicit trust/tool controls.

### Proposed solution
A static, product-agnostic pretrust gate that parses Git metadata without invoking Git and blocks command-bearing configuration before any Git subprocess.

## Existing approaches
Upgrade patched products; override/disable `core.fsmonitor`; workspace trust; avoid untrusted archive repositories.

## Remaining limitations
Patches are product/path specific; custom wrappers can regress; trust prompts may happen after metadata collection; model tool sandboxes do not govern pre-model Git subprocesses.

## Root-cause analysis
Trust sequencing; incorrect assumption that metadata commands cannot execute helpers; mismatch between model tool controls and pre-model subprocesses; fragmented Git invocation paths.

## Improvement opportunity
Make `no Git before static trust check` a reusable invariant for agents, IDE launchers, review bots, and repository indexers.

## Relevant sources
- https://access.redhat.com/security/cve/cve-2026-72718
- https://github.com/aaif-goose/goose/security/advisories/GHSA-r5pp-p5r8-466r
- https://github.com/aaif-goose/goose/releases/tag/v1.44.0
- https://cybersecuritybeat.com/2026/09/03/poisoned-git-configs-make-ai-coding-agents-run-attacker-commands/
- https://intel.aikido.dev/cve/AIKIDO-2026-960660

## Status
Implemented by package artifacts; measured by deterministic fixtures; verified only when included tests pass.