# Delegated Agent Policy Continuity Guard

**Category:** Security

## Problem
Security hooks and policy outcomes can lose visibility, unique identity, or parent propagation when execution crosses from a parent into subagents or agent-team teammates. A control that works in one topology can therefore appear globally enabled while leaving delegated execution partially unobserved.

## Evidence
See `evidence/research.md`. Current public reports show missing `PermissionRequest` dispatch for agent-team teammates and parent-visible results that omit child denials while reusing parent session identity.

## Existing approach
Managed hooks, PreToolUse decisions, PermissionRequest hooks, session-scoped locks, and parent orchestration.

## Existing limitations
Configuration does not prove runtime coverage. Delegation topology may change event dispatch, child identity may be ambiguous, and a denied child action may not propagate to the parent.

## Proposed improvement
Runtime-attest policy continuity per topology using harmless canaries, unique delegate/correlation identities, mandatory child-to-parent decision reconciliation, independent verification, and fail-closed gating for protected delegated work.

## Architecture
- `skills/delegation-policy-attestation.md` defines the reusable attestation procedure.
- `rules/delegated-control-boundary.md` defines enforceable security invariants.
- `subagents/policy-continuity-verifier.md` independently verifies coverage.
- `workflows/attest-delegate-reconcile.md` provides the bounded execution path.
- `hooks/pre-delegation-attestation.md` blocks unproven protected fan-out.
- `scripts/verify_attestation.py` deterministically validates evidence.
- `tests/attestation-fixtures.json` supplies pass/failure boundary fixtures.

## Package tree
```text
README.md
evidence/research.md
skills/delegation-policy-attestation.md
rules/delegated-control-boundary.md
subagents/policy-continuity-verifier.md
workflows/attest-delegate-reconcile.md
hooks/pre-delegation-attestation.md
scripts/verify_attestation.py
tests/attestation-fixtures.json
```

## Installation
Requires Python 3.9+. Integrate the pre-delegation gate into the orchestration layer before spawning delegates with repository write, shell, secret, MCP, production, or privilege-sensitive capabilities.

## Configuration
Define protected operations, supported topologies, required hook/control events, policy fingerprint/hash, attestation expiry conditions, and a parent-controlled event channel.

## Usage
Produce an attestation JSON matching the structure described by the Skill, then run:

`python3 scripts/verify_attestation.py attestation.json --require-topology agent-team --policy-hash "$POLICY_HASH"`

Exit 0 means PASS, 2 means invalid evidence/configuration, and 3 means policy coverage is not proven.

## Workflow
Observe policy → harmless canary → correlate delegate identity → reconcile child outcome → diagnose gaps → gate/remediate → retry once → independent verify.

## Metrics
Topology coverage ratio, required-event delivery rate, denial propagation success, identity collision count, false-success count, attestation latency, and unsafe delegations blocked.

## Verification
Verify that each protected topology produces all required control events, delegate identities are unique, child deny/ask outcomes are represented in parent state, policy hashes match, and no unresolved decision remains.

## Safety
Canaries must be harmless. Missing evidence is never allow. Protected delegation remains blocked when coverage is unproven. Exceptions for high-risk actions require explicit human approval and documented rationale.

## Failure handling
Detection: missing event, identity collision, parent mismatch, or verifier exit 3. Evidence: attestation/event records. Retry: one fresh delegate. Fallback: use a topology with proven controls or execute at the parent. Escalation: human approval. Stop after the second failed attestation.

## Implemented / Measured / Verified
**Implemented** means guard integration exists. **Measured** means topology coverage and propagation metrics were collected. **Verified** means deterministic and independent checks pass against runtime evidence.

## Definition of Done
Evidence documented; protected topologies identified; canaries executed; policy hash captured; every required event observed; child decisions reconcile to parent; identities unique; tests/verifier pass; no secret exposure; no blocking issue remains.

## Customization
Extend required control events for network, MCP, path, secret, or repository-history policies. Keep the fail-closed semantics and topology-specific attestation rather than assuming inheritance.