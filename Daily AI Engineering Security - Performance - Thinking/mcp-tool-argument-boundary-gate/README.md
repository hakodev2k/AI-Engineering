# MCP Tool Argument Boundary Gate

**Category:** Security

## Problem
LLM-generated MCP tool arguments can reach shell/process, network, credential-bearing, or filesystem sinks with insufficient argument-level validation.

## Evidence
`evidence/research.md` documents current 2026 advisories covering MCP command injection, credential redirection, and symlink-based workspace escape.

## Existing approach
Tool allowlists, JSON schema, workspace roots, approval prompts, sandboxes, and vendor-specific fixes.

## Existing limitations
Tool-level permission does not prove argument safety; schemas validate type rather than trust; lexical path checks miss symlinks; credentialed clients may accept attacker-selected destinations.

## Proposed improvement
A fail-closed pre-tool-call gate with sink-specific validation: shell metacharacter rejection for legacy string execution, explicit host allowlists, proxy bans for credential-bearing calls, and canonical path-root enforcement.

## Architecture
```text
README.md
config/tool-argument-policy.json
schemas/tool-call.schema.json
evidence/research.md
skills/argument-threat-analysis.md
rules/argument-boundary.md
subagents/security-verifier.md
workflows/validate-and-execute.md
workflows/regression-verification.md
hooks/pre-tool-call.md
scripts/mcp_arg_guard.py
tests/test_mcp_arg_guard.py
```

## Installation
Python 3.10+; no third-party dependencies.

## Configuration
Edit `config/tool-argument-policy.json` to match actual tool names, trusted hosts, and canonical workspace roots. Keep default deny.

## Usage
Create a tool-call envelope matching `schemas/tool-call.schema.json` and run:
`python scripts/mcp_arg_guard.py --event tool-call.json --policy config/tool-argument-policy.json`

For real filesystem use, populate canonical path results from a trusted `realpath` preflight before executing the tool.

## Workflow
Use `workflows/validate-and-execute.md` on every side-effecting call and `workflows/regression-verification.md` after tool or policy changes.

## Metrics
Attack-fixture block rate, unknown-tool deny rate, host or proxy violations, canonical path escapes, false positives.

## Verification
Run:
`python -m unittest tests/test_mcp_arg_guard.py`

## Safety
Defense in depth only: patch vulnerable dependencies, use structured argv execution, least-privilege credentials, sandboxing, and human approval for exceptional high-risk actions. Never weaken security for performance.

## Failure handling
Detection uses deterministic reason codes. One corrected call may be attempted; repeated denial disables the tool and escalates. No secret values are logged.

## Definition of Done
**Implemented:** pre-tool guard integrated before side effects.  
**Measured:** attack and benign fixture metrics captured.  
**Verified:** tests pass, independent verifier confirms sink coverage, attack paths are blocked, permission boundaries are preserved, and no secrets are exposed.

## Customization
Add tool-specific validators rather than broad exceptions. Prefer narrower hosts and roots and structured process arguments.
