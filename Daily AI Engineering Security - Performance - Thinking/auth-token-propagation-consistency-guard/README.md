# Auth Token Propagation Consistency Guard

**Category:** Security

## Problem
Multi-process AI clients can become split-brain: the UI appears authenticated while the app-server/request layer has no usable token or disagrees about identity. Privileged operations must not depend on presentation-layer login state alone.

## Evidence
See `evidence/research.md`. Current Codex reports independently document successful/visible login followed by `hasToken=false`, 401s, missing-token request paths, and failure to self-heal despite credential state on disk.

## Existing approach / limitations
Restart, re-login, clear caches, or retry refresh may recover some cases but can be disruptive and do not mechanically prove identity continuity. Silent fallback to another credential would create a security boundary violation.

## Proposed improvement
Collect only safe authentication metadata from participating components, reconcile effective principal and credential availability before authenticated actions, fail closed on inconsistency, then perform bounded refresh/re-auth recovery and re-verify.

## Architecture
- `skills/auth-state-reconciliation.md`
- `rules/auth-boundary-rules.md`
- `subagents/auth-boundary-verifier.md`
- `workflows/reconcile-recover-verify.md`
- `hooks/pre-authenticated-dispatch.md`
- `scripts/auth_state_contract.py`
- `evidence/research.md`

## Installation
Python 3.9+. No third-party dependencies. Integrate the pre-dispatch hook where UI/session, credential provider/app-server, and request-layer status can be represented as redacted metadata.

## Configuration
Use opaque principal/account identifiers; fields should include `component`, `authenticated`, `principal`, `credential_present`, and `expiry_state`. The request component defaults to `request`. Never include raw token material.

## Usage
`python3 scripts/auth_state_contract.py auth-state.json`

Exit 0 = PASS, 2 = invalid/unverifiable input, 3 = BLOCK.

## Workflow
Observe → reconcile → diagnose split-brain/missing/expired/mismatched state → one refresh → measure again → optional one explicit re-auth → verify identity → complete or BLOCK.

## Metrics
Split-brain detections, prevented tokenless requests, 401-after-login rate, principal mismatches, recovery attempts, recovery latency, repeated login loops.

## Verification
Run the contract before and after recovery. Where supported, issue a harmless authenticated identity/status request and compare its principal to the expected contract before higher-impact operations.

## Safety
Fail closed. Never log credentials. Never silently change account, workspace, API key, credential class, or identity to make an operation succeed.

## Failure handling
Detection: contract failure, 401, or auth-status divergence. Evidence: redacted component snapshot. Retry: one refresh and one re-auth maximum. Fallback: block authenticated work and surface explicit failure. Escalate on mismatch or persistent absence. Stop after bounded recovery fails.

## Implemented / Measured / Verified
Implemented = contract/hook integrated. Measured = divergence and recovery metrics captured. Verified = actual request path has a usable credential, principal continuity is proven, verification request succeeds, and independent reviewer passes.

## Definition of Done
Evidence documented; redacted baseline captured; split-brain cause identified; recovery or implementation change applied; request path credential present; one principal consistent; no secret exposed; security checks pass; independent verification complete; no blocking issue remains.

## Customization
Add adapters for desktop, CLI, IDE, OAuth broker, or service-token environments while retaining safe metadata and fail-closed identity continuity.