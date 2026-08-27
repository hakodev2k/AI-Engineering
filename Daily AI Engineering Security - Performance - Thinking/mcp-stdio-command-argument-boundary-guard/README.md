# MCP stdio Command Argument Boundary Guard
**Category:** Security

## Problem
MCP clients and agent platforms may validate only the executable name for a stdio server while allowing attacker-controlled arguments to reach shell-capable wrappers. That turns an apparently approved executable into arbitrary command execution.

## Evidence
See `evidence/research.md`. The immediate trigger is Chainlit CVE-2026-45018, published 2026-08-25, plus earlier agent-shell safety bypasses showing that executable-only classification is not a sufficient authorization boundary.

## Existing approach
Common controls include executable allowlists, MCP disabled-by-default settings, user approval, sandboxing, and shell-command scanners.

## Existing limitations
Executable-only allowlists do not authorize argument semantics. Shell wrappers and package runners can convert an allowed binary plus dangerous flags into arbitrary code execution. User approval is weak when UI shows an approved executable but not the effective command contract.

## Proposed improvement
Represent stdio launch configuration as structured `executable + argv`, bind it to a named server policy, reject shell command strings, forbid interpreter execution flags and shell metacharacters, and allow only configured argument prefixes/patterns.

## Package tree
- `config/policy.json`
- `evidence/research.md`
- `skills/command-boundary-analysis.md`
- `rules/stdio-command-boundary.md`
- `subagents/security-reviewer.md`
- `workflows/research-diagnose.md`
- `workflows/verify-regression.md`
- `hooks/pre-mcp-spawn.md`
- `scripts/command_guard.py`
- `tests/test_command_guard.py`

## Installation
Python 3.10+. No third-party packages.

## Usage
`python scripts/command_guard.py --event event.json --policy config/policy.json`

The event MUST contain `server_id`, `transport`, `executable`, and `argv` where `argv` is a JSON array.

## Metrics
Blocked unsafe launches, exact-contract coverage, approval bypass count, false-positive count, secret exposure count.

## Verification
`python -m unittest tests/test_command_guard.py`

## Safety
The guard fails closed. It never executes the proposed command and never reads credentials.

## Failure handling
Detection: non-zero exit code and machine-readable reasons. Maximum policy-adjustment retries: 2. Fallback: disable the affected MCP server. Escalate any request that requires shell interpretation or an irreversible command.

## Definition of Done
**Implemented:** structured launch contract and blocking hook are integrated.  
**Measured:** regression fixtures cover benign and malicious argument forms.  
**Verified:** tests pass, independent reviewer confirms no executable-only authorization path remains, and no secrets are logged.
