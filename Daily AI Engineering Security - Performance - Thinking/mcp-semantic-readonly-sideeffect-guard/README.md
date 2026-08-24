# MCP Semantic Read-Only Side-Effect Guard

**Category:** Security

## Problem
MCP database tools can advertise or enforce a `read-only` mode while still permitting operations whose surface syntax looks read-like but whose semantics create side effects. Recent 2026 examples include Amazon DocumentDB aggregation stages such as `$out`/`$merge`; older MCP database incidents show the same class through SQL functions, Cypher procedures, and discovery-only filtering.

## Evidence and existing approach
See `evidence/research.md`. Existing mitigations include patching known servers, lexical deny/allow lists, hiding write tools, and relying on model instructions. These are useful but incomplete because the authoritative control must exist at execution time and preferably at the backing datastore identity.

## Proposed improvement
Treat read-only as an end-to-end invariant: classify each requested operation by semantic effect, deny ambiguous or write-capable constructs in the MCP layer, execute with datastore credentials that cannot write, and verify the effective privilege with negative tests.

## Architecture
```
mcp-semantic-readonly-sideeffect-guard/
├── README.md
├── evidence/research.md
├── rules/readonly-invariants.md
├── skills/semantic-effect-review.md
├── subagents/security-verifier.md
├── workflows/diagnose-and-harden.md
├── hooks/pre-release-readonly-check.md
├── scripts/readonly_guard.py
└── tests/test_readonly_guard.py
```

## Installation
Requires Python 3.10+ and no third-party packages.

## Configuration
The reference script consumes JSON describing an operation. Supported modes are `documentdb`, `sql`, and `cypher`. It is intentionally conservative and is a preflight control, not a replacement for datastore authorization.

## Usage
`python scripts/readonly_guard.py --mode documentdb --input operation.json`

Exit codes: `0` allowed, `2` policy block, `3` invalid input/configuration.

## Workflow
Use `workflows/diagnose-and-harden.md`: observe current read-only claims, capture baseline negative tests, enumerate semantic side-effect paths, harden MCP validation and datastore credentials, then rerun the same tests. Retries are bounded to two remediation cycles.

## Metrics
Track blocked write-capable constructs, datastore-level write denials, negative-test coverage, false-positive rate, and configuration drift between declared and effective read-only state.

## Verification
Run `python -m unittest tests/test_readonly_guard.py`. A deployment is Verified only when known side-effect fixtures are blocked by preflight and an independent datastore identity also lacks write privileges.

## Safety
The verifier MUST use disposable fixtures or read-only credentials. It MUST NOT prove the boundary by mutating production data. Human approval is required before any live privilege or credential change.

## Failure handling
On parser uncertainty, unknown operation families, or datastore privilege uncertainty, fail closed for autonomous execution and escalate for human review. Maximum remediation retries: 2.

## Definition of Done
Implemented: semantic guard and policy are integrated. Measured: baseline and post-change negative tests are recorded. Verified: all blocking fixtures pass, datastore least privilege is independently confirmed, no secret material is logged, and no blocking uncertainty remains.

## Customization
Extend `classify()` in the script with datastore-specific AST or driver metadata when available. Prefer native database authorization over ever-growing string deny lists.