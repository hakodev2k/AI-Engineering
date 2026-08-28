# MCP Read-Only Content Privilege Escalation Guard

**Category:** Security

## Problem
A read-only MCP server can still become the delivery path for instructions that cause a connected coding agent to use shell, filesystem, network, Git, or deployment privileges.

## Evidence
`evidence/research.md` documents fresh August 2026 evidence, led by CVE-2026-75130 and corroborated by multi-agent/MCP prompt-injection studies.

## Existing approach
Server-side sanitization, prompt-injection detection, tool allowlists, sandboxing, approvals, and read-only MCP design.

## Existing limitations
Read-only server permissions do not constrain the consuming agent; heuristics are not authorization; provenance is often flattened; and approvals may not bind the exact untrusted input to the privileged action.

## Proposed improvement
Enforce provenance-aware, deterministic privilege crossing. Untrusted MCP content remains data, cannot authorize tools, and requires trusted policy plus configured human approval before privileged actions.

## Architecture
```text
mcp-readonly-content-privilege-escalation-guard/
├── README.md
├── config/policy.json
├── evidence/research.md
├── hooks/pre-privileged-tool.md
├── rules/trust-boundary-rules.md
├── scripts/mcp_content_guard.py
├── skills/provenance-threat-analysis.md
├── subagents/security-verifier.md
├── tests/test_mcp_content_guard.py
└── workflows/
    ├── regression-verification.md
    └── research-and-threat-model.md
```

## Installation
Python 3.10+; no third-party dependencies.

## Configuration
Classify trusted origins and privileged tools in `config/policy.json`. Keep the default deny posture for untrusted authorization.

## Usage
Serialize an event to `event.json` and run:
`python scripts/mcp_content_guard.py --event event.json --policy config/policy.json`

## Workflow
Use `workflows/research-and-threat-model.md` for integration analysis and `workflows/regression-verification.md` for changes.

## Metrics
Untrusted privilege crossings; attack-fixture block rate; approval coverage; benign data-only pass rate; secret exposure count; false-positive review count.

## Verification
Run:
`python -m unittest tests/test_mcp_content_guard.py`

## Safety
The guard never executes requested tools. It hashes content for auditability and must not log secret material.

## Failure handling
Privileged ambiguity fails closed. Maximum implementation corrections: 2. Safe fallback is data-only use or disabling the privileged binding.

## Definition of Done
**Implemented:** provenance and privilege gate integrated.  
**Measured:** benign/adversarial fixture metrics captured.  
**Verified:** independent security reviewer confirms attack paths are blocked, tests pass, permissions remain least-privilege, and no secrets are exposed.

## Customization
Extend origin classification and tool privilege classes for the host agent platform, but never let untrusted content become an authorization source.
