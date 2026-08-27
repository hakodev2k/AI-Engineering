# Research — Marimo Notebook Metadata Execution Guard

**Category:** Security  
**Research date:** 2026-08-27 (UTC+7)

## Topic
Prevent attacker-controlled notebook metadata from becoming executable MCP/process configuration before notebook code runs.

## Problem
Developer artifacts can carry configuration metadata that is implicitly trusted by tooling. In marimo versions before 0.23.15, a crafted notebook could place an attacker-controlled MCP command in notebook configuration; opening the notebook in edit mode could launch it as a local subprocess before any cell execution.

## Why it matters now
CVE-2026-75149 was published on 2026-08-19 and received broad technical coverage on 2026-08-25. The underlying fix in marimo was merged on 2026-07-23. The same configuration boundary also exposed credential/traffic-affecting settings, showing the issue is broader than one command field.

## Affected users
AI/data developers opening externally sourced notebooks, notebook-platform maintainers, IDE/integration teams, and engineering organizations that exchange executable notebook artifacts.

## Current public evidence

### Observed evidence
1. CVE-2026-75149 describes code injection through an attacker-controlled MCP command embedded in notebook configuration, launched when the notebook is opened in edit mode before cells execute. Affected versions are before 0.23.15.  
   https://www.cve.org/CVERecord?id=CVE-2026-75149  
   https://github.com/advisories/GHSA-gfgh-xp6v-q37q
2. marimo PR #10281 states that PEP 723 notebook metadata is attacker-controllable and has highest precedence over operator config. The patch moved to an explicit safe allowlist and added regression coverage for credential- and traffic-affecting sections including AI, MCP, completion, secrets and server settings.  
   https://github.com/marimo-team/marimo/pull/10281
3. The marimo fix commit documents the shared sanitization change and regression tests.  
   https://github.com/marimo-team/marimo/commit/1a21bd71e258438d2511136b5edacc94c08855f4
4. Independent coverage on 2026-08-25 explains that the MCP command could run before cell execution and notes that the patched release is 0.23.15.  
   https://thehackernews.com/2026/08/marimo-notebook-flaw-could-run-mcp.html

### Interpretation
The reusable failure mode is a trust-boundary error: artifact-authored metadata is merged into operator/runtime configuration before the artifact is trusted. The dangerous transition is configuration-to-side-effect, not merely notebook-cell execution.

## Existing approaches
- Upgrade marimo to a patched version.
- Allowlist safe embedded configuration sections.
- Strip credential-, traffic-, server- and process-affecting metadata.
- Treat downloaded notebooks as untrusted artifacts.
- Add regression tests at the shared configuration merge point.

## Remaining limitations
- Version upgrades do not protect other notebook/agent platforms with similar metadata-to-side-effect behavior.
- Blocklists age poorly as new configuration keys are added.
- UI trust warnings are easy to bypass operationally and may occur after configuration parsing.
- Static artifact review is inconsistent across teams and CI pipelines.
- Side effects may occur before a user reaches an obvious execution boundary.

## Root-cause analysis
1. Artifact metadata and local operator configuration shared one merge path.
2. Artifact-controlled values received excessive precedence.
3. Side-effect-capable sections were not explicitly classified.
4. Trust decisions were deferred until after parsing/initialization.
5. Security tests targeted individual keys instead of the capability class.

## Improvement opportunity
Provide a reusable pre-open metadata gate that defaults to an allowlist of non-side-effect sections, detects MCP/process/network/secret/server configuration, emits a machine-readable decision, and can block CI/import/open workflows before the artifact reaches runtime initialization.

## Goal
No untrusted artifact can introduce process-launch, credential, network-destination, secret, server or MCP runtime configuration without explicit trust elevation.

## Metrics
- malicious-fixture block rate
- safe-metadata pass rate
- side-effect-key coverage
- false-positive review rate
- number of artifacts opened without a pre-open decision

## Trigger
Any externally sourced or changed notebook artifact before edit/open/import.

## Inputs
Notebook text, metadata namespace, provenance/trust state, configured safe-section allowlist.

## Outputs
`allow`, `quarantine`, or `block` with reasons and detected risky paths.

## Relevant sources
- https://www.cve.org/CVERecord?id=CVE-2026-75149
- https://github.com/advisories/GHSA-gfgh-xp6v-q37q
- https://github.com/marimo-team/marimo/pull/10281
- https://github.com/marimo-team/marimo/commit/1a21bd71e258438d2511136b5edacc94c08855f4
- https://thehackernews.com/2026/08/marimo-notebook-flaw-could-run-mcp.html
