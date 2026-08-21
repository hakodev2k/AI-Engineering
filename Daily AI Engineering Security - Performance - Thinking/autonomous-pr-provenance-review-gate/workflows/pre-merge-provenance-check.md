# Workflow — Pre-Merge Provenance Check

## Trigger
PR opened/updated, new commit pushed, sensitive path changed, approval submitted, or merge requested.

## Goal
Ensure merge confidence comes from enforceable repository controls and independent review rather than apparent social consensus.

## Inputs
PR metadata, changed paths, commit signatures, review records, latest push time, Code Owner signal, required status checks, agent/session references when available, policy.

## Baseline
Repository's existing branch/ruleset requirements plus the configured provenance policy.

## Stages
1. **Observe** — collect authoritative PR, commit, review, and check metadata.
2. **Classify** — identify sensitive paths.
3. **Measure controls** — calculate independent approvals, latest-push approval, signature coverage, Code Owner coverage, and status-check state.
4. **Diagnose** — enumerate missing or stale evidence without guessing actor identity.
5. **Gate** — run `scripts/provenance_gate.py`.
6. **Review** — for sensitive or `additional_review_required` cases, invoke `subagents/security-verifier.md`.
7. **Complete** — allow only after all blocking requirements pass.

## Responsible agent
Workflow owner collects facts; Independent Security Verifier validates sensitive decisions.

## Tools
SCM API, branch/ruleset API, CI status API, diff inspection, deterministic gate.

## Outputs
Fact snapshot, gate decision, verifier decision, and missing evidence/remediation list.

## Checkpoints
- Changed-path set captured from authoritative source.
- Latest push timestamp captured before evaluating review freshness.
- Required checks evaluated after latest commit.
- Sensitive decisions independently verified.

## Metrics
Coverage of sensitive PRs, signature coverage, independent-approval coverage, stale-approval rejection count, required-check pass rate, malicious-fixture block rate, legitimate-fixture false-block rate.

## Retry policy
One metadata refresh plus one fallback fetch. No autonomous identity investigation loop.

## Stop conditions
Stable authoritative metadata and completed gate; or bounded fetch retries exhausted, which escalates instead of allowing merge.

## Failure path
Required metadata missing or required control failing => block. Nonblocking provenance unknown => additional review. Never weaken branch/security controls to clear the queue.

## Verification
Sensitive changes require a verifier distinct from the implementing actor/agent.

## Definition of Done
All blocking evidence exists and passes; review independence is satisfied; status checks pass; sensitive-path requirements pass; verifier confirms; no unresolved blocking issue remains.