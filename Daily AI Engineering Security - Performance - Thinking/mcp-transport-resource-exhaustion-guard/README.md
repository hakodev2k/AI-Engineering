# MCP Transport Resource Exhaustion Guard

**Category:** Security

## Problem
MCP HTTP transports can be made to retain unbounded stream buffers or server sessions, allowing a remote or unauthenticated peer to exhaust memory and deny service.

## Evidence
Current public evidence and source links are in `evidence/research.md`.

## Existing approach
Upgrading patched SDK versions is necessary, and some implementations expose idle timeouts or transport limits. These controls are often library-specific and do not provide a reusable preflight/runtime contract across MCP clients and servers.

## Existing limitations
Operators may not know which transports are exposed, whether limits are active, or whether a future SDK/config regression removes them. Patch-only remediation does not provide continuous verification.

## Proposed improvement
Add a transport resource budget gate that validates session TTL/count and streaming-buffer limits before startup, then deterministically evaluates runtime observations against those limits.

## Architecture
- `config/limits.json` — explicit resource budgets
- `scripts/resource_guard.py` — deterministic evaluator
- `tests/test_resource_guard.py` — regression tests
- `skills/transport-resource-analysis.md` — investigation procedure
- `rules/resource-boundaries.md` — enforceable controls
- `subagents/security-verifier.md` — independent reviewer
- `workflows/measure-diagnose-remediate.md` — bounded remediation loop
- `hooks/preflight.md` — blocking startup hook
- `evidence/research.md` — current public evidence

## Installation
Python 3.10+; no third-party dependencies.

## Usage
`python scripts/resource_guard.py --observation observation.json --limits config/limits.json`

## Inputs
A JSON observation containing transport role, active sessions, oldest idle session age, current buffered bytes, and endpoint exposure.

## Outputs
Machine-readable `allow` or `block` decision with reason codes.

## Metrics
Peak buffer bytes, active sessions, idle-session age, memory RSS, guard block rate, process OOM/crash count.

## Verification
Run `python -m unittest tests/test_resource_guard.py` and verify patched SDK versions separately in dependency management.

## Safety
Fail closed for unknown/unbounded limits on internet-exposed MCP transports. Do not log credentials, request bodies, or secrets.

## Failure handling
Detection: limit violation or missing bound. Evidence: guard JSON plus process metrics. Retry policy: maximum 2 configuration corrections. Fallback: disable remote transport or bind to trusted/local scope. Escalation: security owner. Stop condition: any reproducible unbounded-growth path blocks completion.

## Definition of Done
**Implemented:** limits configured and preflight hook integrated.  
**Measured:** representative normal and adversarial observations collected.  
**Verified:** tests pass, patched dependencies are confirmed, no unbounded session/buffer path remains, and no secrets are exposed.

## Customization
Tune limits to workload baselines; increases require measured justification and must preserve a finite upper bound.
