# MCP Untrusted Server Instructions Quarantine
**Category:** Security

## Problem
MCP server-controlled instruction text can cross into trusted agent-control context and influence privileged tool behavior.

## Evidence
See `evidence/research.md` for August 2026 MCP, VS Code and AWS signals.

## Existing approach
Pattern scanners, human approvals, sandboxes and endpoint/tool allowlists reduce risk but do not preserve provenance across prompt assembly.

## Existing limitations
Heuristics miss semantic attacks; approval fatigue obscures authorship; cache scope may exceed trust scope.

## Proposed improvement
Treat MCP instructions as untrusted data with deterministic provenance, cache and high-risk-tool gates.

## Architecture
- `evidence/research.md`
- `skills/mcp-instruction-threat-analysis.md`
- `rules/trust-boundary.md`
- `workflows/research-diagnose.md`
- `hooks/pre-tool-call.md`
- `scripts/mcp_instruction_guard.py`
- `tests/test_mcp_instruction_guard.py`

## Installation
Python 3.10+; no third-party dependencies.

## Usage
`python scripts/mcp_instruction_guard.py --event event.json`

## Metrics
Attack-fixture block rate; public-cache violations; high-risk approval coverage; false-positive review count.

## Verification
Run `python -m unittest tests/test_mcp_instruction_guard.py`.

## Safety
Fail closed. Never place secrets in fixtures or logs. Human approval is required for high-risk actions.

## Failure handling
Maximum diagnostic retries: 2. Fallback: disable affected MCP binding. Escalate provenance or privileged-action ambiguity.

## Definition of Done
Implemented: guard/hook integrated. Measured: fixtures and metrics captured. Verified: tests pass, no server text is elevated to trusted policy, no secrets exposed.
