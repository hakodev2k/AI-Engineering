# Agent Lifecycle Config Attestation Gate

**Category:** Security

## Problem
Agent runtimes increasingly compose security-sensitive configuration from project files, user settings, lifecycle state, subagent definitions, nested workspaces, MCP declarations, and sandbox/permission policy. Recent reports show the declared configuration can differ from the effective configuration after subagent spawn, nested-project rooting, resume, or fork. A policy that looks restrictive in source can therefore fail open or fail closed at runtime.

## Evidence
See `evidence/research.md`. Current public reports include Codex configuration/sandbox failures and Claude Code nested-workspace sandbox loss, with concrete reproductions from August 2026.

## Existing approach
Products provide declarative config, managed settings, workspace trust, permission/sandbox policy, per-agent definitions, and documentation about inheritance.

## Existing limitations
Static review proves only what was configured, not what a specific runtime actor actually received. Merge/inheritance semantics differ across lifecycle transitions. Nested roots and spawned agents can select different configuration sources. Silent drops are especially dangerous because the parent may demonstrate a restriction that the child does not enforce.

## Proposed improvement
Before privileged work, derive a canonical protected configuration contract, obtain an observed effective-config snapshot from the actual actor/session, and compare the two deterministically. Bind the attestation to actor ID, project root, lifecycle operation, and configuration hashes. Missing or weaker protected configuration blocks privileged execution.

## Architecture
```text
README.md
evidence/research.md
skills/effective-config-attestation.md
rules/lifecycle-config-rules.md
subagents/config-security-verifier.md
workflows/attest-before-privileged-work.md
hooks/pre-privileged-actor.md
scripts/attest_config.py
tests/test_attest_config.py
```

## Installation
Python 3.9+ only. No third-party dependencies.

## Configuration
Represent declared and observed effective configuration as JSON. Protected paths are dot-separated keys such as `sandbox.enabled`, `sandbox.allowUnsandboxedCommands`, `network.allowedDomains`, `mcp_servers`, and `permissions.deny`. Choose paths that your runtime can actually observe.

## Usage
`python3 scripts/attest_config.py declared.json observed.json --protected sandbox.enabled --protected permissions.deny --actor child-17 --lifecycle spawn`

Exit code `0` means every protected path is present and canonically equal. Exit code `2` means a protected mismatch or missing path. Exit code `1` means invalid input/runtime error.

## Workflow
Observe declared policy → capture baseline effective config → spawn/resume/fork/root actor → capture effective config → attest protected fields → block or proceed → independently verify evidence.

## Metrics
- protected-field attestation coverage
- mismatch count by lifecycle transition
- missing-field count
- privileged actions blocked before attestation
- attestation latency
- false-positive/false-negative rate from controlled fixtures

## Verification
**Implemented:** the pre-privileged gate invokes the deterministic attestor. **Measured:** baseline and transition-specific mismatch rates are recorded. **Verified:** tests prove exact-match pass, missing-path block, changed-value block, and independent review confirms the snapshot comes from the effective runtime rather than the same source file being checked.

## Safety
The tool never weakens policy or executes project-controlled commands. It compares evidence only. A child cannot self-approve a mismatch. Dangerous exceptions require explicit human approval outside the child actor.

## Failure handling
Detection: missing snapshot, parse failure, protected mismatch. Evidence: JSON report plus SHA-256 hashes. Retry: one fresh snapshot after a known lifecycle race. Fallback: run the work in a parent/session whose effective policy can be proven. Escalation: human security review. Stop if a protected mismatch remains.

## Definition of Done
Current evidence documented; protected contract defined; runtime snapshot source identified; baseline captured; deterministic attestation integrated; mismatch blocks privileged work; tests pass; lifecycle transition is recorded; independent verifier confirms evidence provenance; no secrets are logged; no blocking mismatch remains.