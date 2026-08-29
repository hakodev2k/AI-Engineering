# Skill: Evidence and Authority Revalidation

## Purpose
Convert a proposed consequential action into an auditable decision record and verify that every critical mutable fact is supported by a sufficiently authoritative, fresh source.

## Trigger
Before configuration/repository/production mutation, irreversible operations, scope expansion, completion claims, or resuming a failed/interrupted task.

## Inputs
Proposed action, decision record, authority registry, source observations, approval record, and impact classification.

## Preconditions
Consequential actions are identifiable before execution and the relevant authority sources can be queried or explicitly declared unavailable.

## Required context
Current task requirements, allowed scope, canonical-source registry, current repository/runtime state, prior failure state, and approval boundaries.

## Allowed tools
Read-only canonical-source/API/config inspection, VCS status/diff, issue/task status checks, deterministic decision gate, test/verification tools.

## Constraints
- MUST NOT request hidden chain-of-thought.
- MUST use observable fields: Facts, Assumptions, Evidence, Hypotheses, Decision, Risks, Verification status.
- MUST NOT treat agent-authored prose as user approval.
- Memory MAY suggest a fact to check but MUST NOT override a higher-authority source.
- Failed-session state MUST be revalidated before reuse.

## Procedure
1. Decompose the proposed action into required decision facts.
2. Mark each item as Fact, Assumption, or Hypothesis.
3. For each Fact, identify source ID, observation timestamp, authority rank, version/fingerprint, and whether the fact is mutable.
4. Compare the source against `config/authority-registry.example.json` or the deployment-specific registry.
5. Refresh mutable facts that exceed their age budget or whose version/fingerprint differs from the current authority source.
6. Validate approval scope for actions that expand or cross a mutation boundary.
7. State the decision criteria and residual risks in the decision record.
8. Run `scripts/authority_freshness_gate.py`.
9. If result is `revalidate`, refresh only the listed facts and re-run. Maximum attempts: policy limit, default 2.
10. If `block`, stop mutation and escalate with evidence.
11. For high-impact actions, hand off to an independent verifier before execution/completion.

## Decision points
- Missing evidence for critical fact → revalidate.
- Authority below minimum → revalidate from stronger source or block.
- Stale mutable fact → re-read current source.
- Approval absent/out of scope → block pending explicit approval.
- Conflicting high-authority sources → block and escalate; do not average or guess.

## Expected output
Decision gate report listing status, unsupported/stale facts, authority violations, approval gaps, and required refresh actions.

## Metrics
Authoritative-evidence coverage, stale-fact rate, unsupported conclusion rate, revalidation count, rollback/rework rate, and independent verification coverage.

## Verification
Replay known incidents with stale memory/session facts and verify the gate requires current canonical evidence before allowing consequential action.

## Failure handling
If a required canonical source is unavailable, do not substitute memory as authority. Record the unavailable source, apply bounded retries, then block/escalate.

## Stop conditions
Maximum two revalidation cycles by default; conflicting authority; missing required approval; unchanged evidence after refresh; or any high-impact decision that cannot be independently verified.
