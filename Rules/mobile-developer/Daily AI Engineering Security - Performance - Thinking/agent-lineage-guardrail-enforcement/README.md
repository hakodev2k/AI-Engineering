# Agent Lineage Guardrail Enforcement

**Category:** Security

## Problem
Multi-agent coding can create policy gaps when hooks or permission controls apply differently to parent agents, in-process subagents, and separately spawned teammates. Missing caller identity also prevents deterministic per-actor policy and complete audit trails.

## Evidence
See `evidence/research.md` for recent public reports and official permission-model context.

## Existing approach
Managed settings, allow/deny rules, PreToolUse/PermissionRequest hooks, and spawn-time prompt restrictions.

## Existing limitations
Spawn-time checks cannot govern every later action; hook delivery can differ across agent execution modes; current events may not expose enough stable identity to distinguish actors.

## Proposed improvement
Bind every agent to explicit lineage metadata and an immutable root policy hash, probe enforcement after child startup, and fail closed on high-risk calls without attributable policy proof.

## Architecture
- `skills/lineage-policy-verification.md` defines the reusable verification procedure.
- `rules/lineage-enforcement-rules.md` defines enforceable invariants.
- `subagents/lineage-security-verifier.md` provides independent verification.
- `workflows/enforce-lineage-guardrails.md` defines bounded execution/recovery.
- `hooks/pre-child-high-risk-call.md` blocks unsafe descendant actions.
- `scripts/verify_lineage.py` deterministically validates lineage records.

## Package tree
```text
README.md
evidence/research.md
skills/lineage-policy-verification.md
rules/lineage-enforcement-rules.md
subagents/lineage-security-verifier.md
workflows/enforce-lineage-guardrails.md
hooks/pre-child-high-risk-call.md
scripts/verify_lineage.py
```

## Installation
Requires Python 3.9+. Integrate lineage IDs and policy hashes at the orchestrator/wrapper boundary; do not trust model-authored identity fields.

## Configuration
Define protected tool classes, root policy source, canonical policy serialization, audit sink, and trusted actor-ID issuer. Compute SHA-256 over the canonical effective policy.

## Usage
Generate `lineage.json` from trusted spawn records and run:
`python3 scripts/verify_lineage.py lineage.json --expected-policy-sha256 <hash>`

## Workflow
Observe → measure hook coverage → diagnose gaps → bind lineage/policy → probe child → execute → independently verify. One propagation retry maximum.

## Metrics
Descendant hook coverage, high-risk call attribution coverage, policy mismatches, blocked violations, false positives, verification latency.

## Verification
Security is **Implemented** when lineage enforcement is integrated, **Measured** when before/after coverage exists, and **Verified** only when an independent verifier proves all expected descendants and protected calls have matching policy evidence.

## Safety
Missing identity on high-risk actions is a BLOCK, not implicit allow. A child cannot approve or weaken its own policy. Dangerous exceptions require explicit human approval.

## Failure handling
Detection: missing hook event, unknown actor, policy mismatch. Evidence: lineage ledger and audit log. Retry: one relaunch. Fallback: parent/direct execution under known policy. Escalation: human review. Stop when high-risk attribution remains unresolved.

## Definition of Done
Current evidence documented; baseline coverage measured; all descendants receive stable lineage; every protected call is attributable; required policy hashes match; safe probes pass; independent verification passes; no secrets are exposed; no blocking issue remains.

## Customization
Adapt actor identifiers and audit transport to the host platform while retaining trusted issuance, immutable policy binding, fail-closed high-risk behavior, bounded retry, and independent verification.