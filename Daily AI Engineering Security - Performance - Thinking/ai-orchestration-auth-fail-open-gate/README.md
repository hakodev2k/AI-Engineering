# AI Orchestration Auth Fail-Open Gate

**Category:** Security  
**Run date:** 2026-09-05 (UTC+7)

## Problem
AI orchestration dashboards and agent-management endpoints can become security-critical control planes because they hold model credentials, privileged tools, databases, and execution sessions. Recent incidents and advisories show a recurring failure mode: an endpoint expected to sit behind authentication is reachable through a fail-open bug, missing middleware, broad network binding, or overly permissive route whitelist.

## Evidence
See `evidence/research.md`. The evidence distinguishes observed facts, interpretation, and the proposed engineering control.

## Existing approach
Teams typically rely on framework authentication middleware, reverse proxies, route allowlists, network placement, and manual pre-release review. Vendors patch individual endpoints after discovery.

## Existing limitations
These controls are fragmented. A route can accidentally skip middleware; prefix-based whitelist matching can cover more routes than intended; a backend may trust an upstream proxy while remaining directly reachable; and a health check can pass even when protected resources are anonymously accessible. The METR disclosure also shows that a one-off agent dashboard can silently fail open without an immediate signal.

## Proposed improvement
Add a deterministic deployment admission gate that models every exposed AI/agent surface and blocks dangerous combinations before release. The gate requires explicit authentication state, route-match semantics, direct-reachability state, and criticality. It fails closed when facts are unknown.

## Architecture
- `evidence/research.md` — current public signals and root-cause analysis.
- `skills/auth-boundary-audit.md` — evidence-driven assessment skill.
- `rules/auth-fail-closed.md` — enforceable security invariants.
- `subagents/security-verifier.md` — independent reviewer.
- `workflows/observe-harden-verify.md` — bounded remediation workflow.
- `hooks/predeploy-auth-negative-test.md` — blocking pre-deploy hook.
- `scripts/auth_surface_gate.py` — deterministic admission checker.
- `config/surfaces.example.json` — safe example configuration.
- `tests/test_auth_surface_gate.py` — regression tests.

## Installation
Python 3.10+; standard library only.

## Configuration
Describe each externally or internally reachable surface in JSON. `auth_mode` must be one of `required`, `none`, `optional`, or `upstream`. `route_match` must be `exact`, `prefix`, or `none`. `critical` is true for endpoints that can execute agents/tools, reveal or rotate credentials, modify data, administer workspaces, or reach privileged infrastructure.

## Usage
`python scripts/auth_surface_gate.py config/surfaces.example.json`

Exit codes: `0` pass, `2` blocking policy finding, `1` invalid/unknown input.

## Workflow
Observe effective routes and network paths -> capture baseline -> diagnose middleware/binding/whitelist behavior -> form a specific root-cause hypothesis -> harden the smallest responsible layer -> run gate -> execute negative-auth tests -> independent verification.

## Metrics
Anonymous critical endpoints; direct backends relying only on upstream auth; optional-auth critical endpoints; prefix-whitelisted critical endpoints; negative-auth test failures; approved exceptions; time-to-detect auth regressions.

## Verification
**Implemented:** policy, checker, workflow, tests, and reviewer role exist.  
**Measured:** every modeled surface produces a deterministic pass/fail result and baseline counts.  
**Verified:** regression tests pass, negative-auth probes receive deny responses, direct bypass paths are absent, and an independent reviewer signs off.

## Safety
Do not weaken authentication to make the gate pass. Do not put credentials in configuration or test fixtures. Production probes must be non-destructive. Authentication and authorization are separate: passing this gate does not replace least-privilege authorization review.

## Failure handling
Detection is any nonzero gate result or unexpected success from a negative-auth probe. Retry remediation at most twice. If effective auth state remains unknown or a critical anonymous path persists, keep deployment blocked and escalate to the security owner.

## Definition of Done
Evidence is documented; all surfaces are inventoried; baseline captured; blocking findings resolved; tests pass; negative-auth behavior verified; network bypass checked; risks/exceptions recorded; independent approval complete; no secrets included.

## Customization
Extend critical capability classification or add organization-specific route classes, but preserve fail-closed handling for unknown auth state and critical surfaces.