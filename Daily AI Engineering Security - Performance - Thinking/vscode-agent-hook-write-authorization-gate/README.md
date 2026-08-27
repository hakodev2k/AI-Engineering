# VS Code Agent Hook Write Authorization Gate

**Category:** Security  
**Research date:** 2026-08-28 (UTC+7)

## Problem
Agent-editable hook configuration can turn a text/file edit into later shell execution. Recent VS Code security fixes show that prompt-influenced agents could write custom-agent hook configuration without a confirmation boundary, allowing attacker-controlled commands to execute when the agent was invoked.

## Evidence
See `evidence/research.md` for CVE-2026-70335 / GHSA-w79w-rj9h-vg4f, current VS Code hook guidance, approval controls, and the associated issue.

## Existing approach
Current VS Code releases require confirmation for sensitive hook configuration changes; VS Code also provides tool approvals, workspace trust, sandboxing, and enterprise hook policies.

## Existing limitations
A product-specific confirmation fixes one path, but reusable agent systems still need a deterministic rule for recognizing executable configuration, detecting unsafe commands, preserving workspace boundaries, and requiring approval before a write is activated.

## Proposed improvement
Add a pre-write authorization gate for hook/custom-agent configuration. The gate classifies target paths, parses JSON hook definitions, rejects unsafe command patterns and out-of-workspace references, and requires an explicit approval artifact for executable-hook changes.

## Architecture / Actual package tree
```text
vscode-agent-hook-write-authorization-gate/
├── README.md
├── evidence/research.md
├── config/policy.json
├── scripts/hook_policy_guard.py
├── tests/test_hook_policy_guard.py
├── skills/hook-threat-model.md
├── rules/hook-authorization.md
├── subagents/security-verifier.md
├── workflows/secure-hook-change.md
└── hooks/pre-hook-config-change.md
```

## Installation
Python 3.10+; no third-party packages.

## Configuration
Edit `config/policy.json`; keep `require_approval` enabled for executable-hook changes.

## Usage
`python scripts/hook_policy_guard.py --file .github/hooks/security.json --workspace . --policy config/policy.json --approved`

Omit `--approved` to verify that a proposed executable-hook change is correctly blocked pending confirmation.

## Workflow
Follow `workflows/secure-hook-change.md`: observe → baseline → diagnose → validate → approval checkpoint → validate again → independent verification → activate.

## Metrics
Executable-hook changes blocked without approval; unsafe command patterns blocked; workspace escapes blocked; false-positive count; independent-verification coverage.

## Verification
Run `python -m unittest tests/test_hook_policy_guard.py`.

## Safety
Fail closed on malformed executable config or unknown command structures. Never auto-approve hook configuration generated from untrusted content. Never log secrets.

## Failure handling
Detection is a non-zero validator exit with machine-readable reasons. Maximum retries: 2 corrections. Fallback: disable hooks or require manual editing. Escalate ambiguous command execution paths. Stop if approval provenance is missing.

## Definition of Done
**Implemented:** validator and blocking integration installed.  
**Measured:** fixtures exercise allowed, approval-required, unsafe-command, and path-escape cases.  
**Verified:** tests pass and an independent reviewer confirms no executable-hook write bypasses approval.

## Customization
Extend path and pattern policy conservatively. Do not weaken explicit approval, workspace containment, or independent verification.
