# Agentic CI Origin Authorization Guard

## Topic
Origin-bound authorization for privileged agentic CI actions.

## Category
Security

## Problem
A trusted bot can relay attacker-controlled intent into a privileged workflow, causing the downstream gate to authorize the relay identity rather than the untrusted originating principal.

## Evidence
See `evidence/research.md` for August 2026 ADK reporting, Microsoft agentic CI research, TaintAWI results, and CVE-2026-48168.

## Existing approach
Immediate actor/association checks, branch protection, least-privilege tokens, prompt filtering, and separate agent workflows.

## Existing limitations
These controls do not necessarily preserve the initiating principal across bot/agent relays. A trusted bot command can become an unintended authorization bridge.

## Proposed improvement
Normalize origin provenance before privileged actions and deterministically fail closed unless the origin itself is trusted or a separately bound human approval exists.

## Architecture
- `evidence/research.md` — current evidence, existing approaches, gap, root cause.
- `skills/authorize-agentic-ci-origin.md` — reusable decision procedure.
- `rules/origin-authorization.md` — enforceable security invariants.
- `subagents/security-verifier.md` — independent verification role.
- `workflows/authorize-privileged-agent-action.md` — bounded implementation/verification flow.
- `hooks/pre-privileged-action.md` — blocking integration point.
- `scripts/origin_auth_guard.py` — dependency-free deterministic guard.
- `tests/test_origin_auth_guard.py` — regression and attack-path tests.

## Installation
Requires Python 3.9+. Copy this directory into the workflow repository. No third-party Python packages are required.

## Configuration
Create a policy JSON containing `trusted_origin_associations` and optional `repositories`. Feed a normalized event containing origin actor/association, source event, relay actor, capability, repository, and ref.

## Usage
Run `python3 scripts/origin_auth_guard.py --event event.json --policy policy.json` before any privileged step. Exit 0 allows; exit 2 denies/requires approval; exit 3 is a blocking parse/policy error.

## Workflow
Follow `workflows/authorize-privileged-agent-action.md`. Establish the existing authorization baseline first, then integrate the gate, replay fixtures, and require independent verification.

## Metrics
Provenance completeness, malicious relay block rate, trusted-origin allow rate, approval rate, and authorization false positives.

## Verification
Run `python3 -m unittest tests/test_origin_auth_guard.py`. The untrusted-origin fixture must not be upgraded by a trusted relay bot; malformed provenance must fail closed.

## Safety
The guard never reads secrets or performs privileged mutations. It must run before tokens/secrets are exposed. Do not convert a denial into an allow based on model-generated prose.

## Failure handling
Detection: nonzero exit or verifier finding. Evidence: normalized non-secret provenance plus SHA-256 evidence hash. Retry: maximum two implementation iterations for code defects; authorization denial is not retried. Fallback: require human approval outside the model path. Escalation: security owner. Stop: unresolved provenance or verifier failure.

## Definition of Done
**Implemented:** deterministic gate and hook integrated. **Measured:** baseline and post-change attack fixtures captured. **Verified:** malicious relay blocked, trusted flow preserved, malformed input fails closed, independent verifier passes, and no privileged step precedes authorization.

## Customization
Extend capability names and origin associations in policy, but do not remove origin binding or fail-closed behavior.
