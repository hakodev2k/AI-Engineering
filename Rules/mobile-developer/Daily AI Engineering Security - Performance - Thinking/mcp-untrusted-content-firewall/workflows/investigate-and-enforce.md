# Workflow — Investigate and Enforce External Content Trust

## Trigger
Any agent workflow that ingests external tool/fetch/MCP content and may later perform privileged actions.

## Goal
Prevent untrusted data from silently becoming privileged instructions while retaining usable benign content.

## Inputs
External payload, provenance, intended action, policy config, approval state, test corpus.

## Baseline
Before rollout capture: number of external payloads, percentage with provenance, number of privileged follow-on calls, approval rate, and known adversarial/benign fixture outcomes.

## Stages
1. Observe source and downstream action.
2. Attach provenance and trust tier.
3. Validate schema/content type.
4. Run deterministic risk scan.
5. Form policy decision: allow, allow-with-taint, review, block.
6. If privileged action follows tainted content, require explicit scoped approval.
7. Execute only allowed action.
8. Record audit evidence.
9. Run regression fixtures.
10. Independent verifier reviews results.

## Responsible agents
Implementation agent configures integration; Security Verifier independently validates.

## Checkpoints
- Provenance present before model ingestion.
- Risk decision persisted before downstream call.
- Approval recorded before privileged action.
- Audit record written after decision.

## Metrics
Provenance coverage, risky-chain escalations, blocked critical fixtures, false-positive rate, false-negative rate, review latency.

## Retry policy
Policy evaluation may retry once for transient local I/O failure. Scanner/parser logic errors do not auto-retry; fail closed for privileged actions.

## Stop conditions
Stop immediately if provenance cannot be established for a privileged chain, policy config is invalid, or a critical adversarial fixture is auto-allowed.

## Failure path
Quarantine content, deny privileged follow-on actions, emit audit event, request human review.

## Verification
Security Verifier runs corpus and checks audit traceability.

## Definition of Done
100% tested external payloads have provenance; all critical adversarial fixtures are blocked/reviewed; privileged chains cannot bypass approval; benign false-positive rate is documented; audit records are reproducible.
