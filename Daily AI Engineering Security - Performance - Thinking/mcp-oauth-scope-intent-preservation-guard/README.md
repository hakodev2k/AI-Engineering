# MCP OAuth Scope Intent Preservation Guard

## Topic
Preserve explicit client scope intent across MCP OAuth discovery, authorization, refresh, and step-up flows.

## Category
Security

## Problem
MCP clients can combine operator configuration, server metadata, prior grants, refresh state, and runtime scope challenges using implicit precedence. A later metadata or SDK branch can silently replace required client scopes, including `offline_access`, causing authorization downgrade or breaking scheduled/background agents after access-token expiry.

## Evidence
Current public evidence and source links are documented in `evidence/research.md`. The strongest current signal is Hermes Agent issue #93719 (2026-08-24), combined with the MCP TypeScript SDK step-up issue #2255 and the 2026-07-28 MCP authorization specification.

## Existing approach
Clients generally rely on OAuth discovery, SDK-managed refresh/step-up handling, and explicit per-server configuration. These are necessary but do not guarantee that operator-required scopes remain invariant through every branch.

## Existing limitations
- Scope provenance is often collapsed into one mutable set.
- Discovery metadata may accidentally become precedence rather than compatibility information.
- Refresh and step-up paths can have different merge behavior.
- Non-interactive jobs may fail only after token expiry.

## Proposed improvement
Maintain a deterministic scope-intent contract: required scopes are immutable unless configuration changes; desired/challenge/granted scopes are merged with provenance; unsupported mandatory scopes block; refresh survivability is checked explicitly rather than assumed.

## Architecture
```text
mcp-oauth-scope-intent-preservation-guard/
├── README.md
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-auth-scope-check.md
├── rules/
│   └── oauth-scope-integrity.md
├── scripts/
│   └── mcp_scope_guard.py
├── skills/
│   └── oauth-scope-diagnosis.md
├── subagents/
│   └── oauth-verifier.md
├── tests/
│   └── test_mcp_scope_guard.py
└── workflows/
    └── diagnose-and-harden.md
```

## Installation
Python 3.10+ only; the reference script uses the standard library and has no external dependencies.

## Configuration / input
Create a sanitized JSON file containing any of: `required_scopes`, `desired_scopes`, `supported_scopes`, `granted_scopes`, `challenge_scopes`, and `require_refresh`. Values are scope-name arrays. Never include tokens or secrets.

Example:
```json
{
  "required_scopes": ["offline_access", "files.read"],
  "supported_scopes": ["offline_access", "files.read", "files.write"],
  "granted_scopes": ["files.read"],
  "challenge_scopes": ["files.write"],
  "require_refresh": true
}
```

## Usage
From the package root:
```bash
python scripts/mcp_scope_guard.py scope-input.json --pretty
```
Exit `0` means scope invariants pass, `1` means a policy/invariant violation, and `2` means invalid input or I/O failure.

## Workflow
Follow `workflows/diagnose-and-harden.md`: Observe → baseline → diagnose first mutation → form one hypothesis → implement smallest correction → measure again → bounded retry (max 2) → independent verification.

## Metrics
- Required-scope loss count: target 0.
- Scope provenance completeness: target 100% for requested scopes.
- Step-up union correctness: target 100% in regression fixtures.
- Unexpected interactive reauthorization for intended background workloads: target 0 after verified rollout.

## Verification
Run:
```bash
python -m unittest discover -s tests -p 'test_*.py'
```
The suite verifies required-scope preservation, blocking on unsupported required scopes, step-up accumulation, and provenance output. Production integration verification should additionally observe the actual authorization-request scopes and post-expiry behavior without recording credentials.

## Safety
The package never performs OAuth, launches a browser, stores credentials, or modifies authorization policy. It MUST NOT be used to broaden permissions merely to make a failing integration work. See `rules/oauth-scope-integrity.md`.

## Failure handling
Detection: non-zero analyzer/test result or actual requested scope divergence. Evidence: sanitized scope sets and provenance. Retry: maximum two evidence-backed implementation iterations. Fallback: revert auth change and retain diagnostics. Escalation: platform/security owner. Stop: unsupported mandatory scope, ambiguous operator intent, credential exposure risk, or retry limit reached.

## Status model
- **Implemented**: scope analyzer and enforcement contract exist.
- **Measured**: baseline and post-change scope sets are captured.
- **Verified**: regression tests pass, integration behavior matches the contract, and `subagents/oauth-verifier.md` independently approves the change.

## Definition of Done
Evidence documented; current approaches and limitations identified; required scopes defined; deterministic guard integrated; tests pass; before/after scope sets measured; no required scope lost; refresh assumptions documented; independent verification complete; no secrets exposed; no blocking issue remains.

## Customization
Extend the script only with non-secret metadata and preserve provenance. Product-specific adapters may translate client configuration into the analyzer input, but MUST keep the core required-scope invariants unchanged unless an operator explicitly changes policy.
