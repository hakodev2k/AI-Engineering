# Research — Nested Repository Trust-Boundary Drift

## Problem
AI coding agents often operate in monorepos, vendored repositories, submodules, fixtures, examples, or nested projects. Security controls applied at the workspace root can silently stop matching once execution, delegation, or writes enter a nested trust root. Two concrete failure classes are currently visible: nested Git metadata remains writable even when the top-level `.git` is protected, and nested project settings can shadow stricter parent sandbox policy.

## Category
**Security**

## Why it matters now
Nested repositories are common in real development workflows and are attractive persistence/escape surfaces because they contain executable Git hooks, config, agent settings, task metadata, and independent project boundaries. A parent workspace that appears locked down may therefore provide weaker protection below nested roots.

## Current public signals

### Signal 1 — Codex nested `.git` bypass
OpenAI Codex issue #37081, opened 2026-08-05, reports that the `workspace-write` sandbox protects the top-level `.git` but not `.git` directories belonging to nested repositories. The reproduction shows a write to the root hook path denied while a hook file can be written under `vendor/sub/.git/hooks`. The reported impact is deferred execution with user privileges when a later Git operation touches that nested repository outside the sandbox.

Source: https://github.com/openai/codex/issues/37081

### Signal 2 — Claude nested project drops parent sandbox configuration
Anthropic Claude Code issue #83035, opened 2026-08-01, reports that a nested project containing its own `.claude/settings.local.json` without a `sandbox` key can replace rather than inherit the parent workspace sandbox configuration. The report describes subagents rooted in the child project executing unsandboxed operations that the parent policy denied.

Source: https://github.com/anthropics/claude-code/issues/83035

### Supporting signal — legitimate nested repos complicate blanket blocking
Claude Code issue #61909 describes a security control that blocks `.git/hooks` writes broadly and the resulting request for a trusted-hooks allowlist because legitimate workflows also install hooks. This demonstrates why the problem cannot be solved safely by indiscriminately denying all nested metadata forever; policy needs explicit trust classification and controlled exceptions.

Source: https://github.com/anthropics/claude-code/issues/61909

## Observed evidence
- Workspace-root security semantics do not necessarily propagate to nested repositories/projects.
- Nested `.git` directories can represent executable persistence surfaces.
- Nested project configuration can alter or erase inherited agent sandbox restrictions.
- Blanket prohibition can break legitimate hook-management workflows.

## Interpretation
A robust agent host should treat every nested repository or agent-config root as a new trust boundary rather than assuming the workspace root policy applies transitively. Before delegating into or modifying a nested root, the host should inventory that root, compare effective policy against the parent contract, and either prove equivalence/strengthening or fail closed.

## Proposed engineering solution
Create a deterministic **Nested Repository Trust-Boundary Guard** that:
1. discovers nested Git repositories and agent configuration roots;
2. classifies sensitive metadata (`.git`, `.claude`, `.codex`, `.agents`) and executable persistence surfaces;
3. computes a normalized trust manifest with path, owner/root relation, policy files, hook presence and mutable metadata flags;
4. checks parent-policy inheritance expectations and explicit allowlists;
5. blocks delegation/write/execute when a nested root is unknown or weaker than the parent contract;
6. requires human approval for intentional hook/config changes in nested roots;
7. emits no secret contents and performs no mutation.

## Existing approaches and limitations
### Root-level sandbox protections
Effective for the primary project but may have path-scope assumptions that do not recurse to independently rooted metadata.

### Repository trust prompts
Useful for deciding whether a project is trusted initially, but they do not continuously prove that nested child roots inherit equivalent restrictions.

### Blanket `.git/hooks` write denial
Reduces persistence risk but breaks intentional project hook installation and does not cover non-Git nested agent settings.

### Manual review
Humans can inspect nested repositories and settings, but monorepos change over time and submodules/vendor directories can be added after initial trust review.

## Root-cause hypotheses
1. Security policy is attached to one project/workspace root rather than a hierarchy of trust roots.
2. Path checks special-case only the first metadata directory below a writable root.
3. Nested settings use replacement semantics rather than monotonic inheritance.
4. Agents/subagents can re-root execution without an explicit policy re-attestation step.
5. Trusted exceptions are not represented as auditable, path-specific contracts.

## Improvement target
A compliant integration should demonstrate:
- 100% discovery of nested Git roots in regression fixtures;
- zero unapproved writes to nested `.git/hooks`, Git config, `.claude`, `.codex`, or `.agents` control files;
- every delegation/re-root event has a matching trust-manifest entry;
- child policy never silently weakens a parent security baseline;
- approved exceptions are path-scoped, operation-scoped, time-bounded where practical, and logged;
- no destructive mutation by the detector itself.

## Threat model
### Assets
Developer credentials, repository integrity, workstation execution context, protected branches, agent policy, network restrictions.

### Attack/failure paths
Indirect prompt injection from nested content; malicious vendored repo; compromised submodule; agent-created nested repo; stale local trust assumptions; nested settings that shadow parent controls; hook planting followed by unsandboxed Git execution.

### Trust boundaries
Workspace root → nested repository; parent agent config → nested agent config; sandboxed agent write → later unsandboxed Git/hook execution; parent agent → subagent rooted in child project.

## Sources
1. OpenAI Codex #37081 — https://github.com/openai/codex/issues/37081 — 2026-08-05.
2. Anthropic Claude Code #83035 — https://github.com/anthropics/claude-code/issues/83035 — 2026-08-01.
3. Anthropic Claude Code #61909 — https://github.com/anthropics/claude-code/issues/61909 — 2026-05-23.
