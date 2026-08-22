# Test Evidence Freshness Workflow

```text
Trigger
  -> Discover required verification set
  -> Capture current revision/input state
  -> Execute verification
  -> Record evidence
  -> Freshness evaluation
  -> Edit/rebase/config/dependency change?
       yes -> invalidate affected evidence -> rerun affected set
       no  -> continue
  -> Independent review for high-risk categories
  -> Final freshness gate
  -> Verified
```

## Trigger
Run when an AI agent is about to claim a code change is verified, prepare/merge a PR, release, or consume previously captured green build/test evidence after repository state may have changed.

## Entry conditions
- Repository and target base are identifiable.
- Required verification expectations are known or can be derived from repository configuration.
- Policy is available.

## Inputs
Source/base revisions, changed files, lockfiles/configuration, verification commands, environment identity where relevant, prior evidence records, actor identities.

## Stages
1. **Context discovery — Evidence Curator.** Locate test/build/static-analysis commands and inputs near the changed modules. Do not load unrelated repository content.
2. **State binding — Evidence Curator.** Capture exact revisions and compute input/environment fingerprints.
3. **Execute — Implementation/Test owner.** Run the selected verification commands. Dangerous actions are excluded.
4. **Evidence capture — Evidence Curator.** Persist one structured record per result; `unknown` stays unknown.
5. **Freshness gate — deterministic script.** Run `scripts/evaluate-freshness.py` for every required record.
6. **Invalidation loop.** If source/base/config/dependencies/environment/policy changed, mark affected results stale. Rerun only the sufficient affected verification set.
7. **High-risk review — Evidence Verifier.** Independently review current evaluation fingerprint/revision for configured categories.
8. **Final gate — deterministic script.** Run `scripts/evaluate-final-gate.py` over all required evaluations and review when needed.

## Checkpoints
- Before edits: preserve existing evidence separately from current evidence.
- After each edit/rebase/dependency/config change: recompute fingerprints before trusting any pass.
- Before final claim: `HEAD`, base revision, fingerprints, and review must still match.
- Before any approval-required action: stop for explicit human approval; this package never performs the action itself.

## Retry rules
- Maximum transient retries: `config/freshness-policy.json:max_transient_retries` (default 1).
- Retryable: command-launch infrastructure glitch, temporary CI artifact metadata/read failure.
- Not retryable without state change: failing tests, stale revisions, stale fingerprints, missing environment identity, permission/policy failures, unknown side-effect outcomes.
- Preserve first failure output and all stale records.
- After retry budget is exhausted, stop and escalate with evidence.

## Failure paths
- **Validation/fingerprint failure:** stop and correct inputs.
- **Build/test failure:** remediate implementation, then start a fresh evidence cycle.
- **Tool failure:** one bounded retry if transient.
- **Permission failure:** stop; do not escalate privileges silently.
- **Environment mismatch:** recapture in the intended environment or block.
- **High-risk review blocked:** return to remediation; reviewer does not implement the fix.

## Produced artifacts
Input fingerprint JSON, evidence records, freshness evaluations, optional independent review, final gate report, referenced command logs/reports.

## Definition of Done
- Every required verification result is `passed` and `fresh` for exact current source/base revisions.
- Relevant inputs/environment match current fingerprints.
- Required high-risk independent review is approved and current.
- Final gate returns `verified`.
- Remaining risks are recorded.
- No approval-required action was executed without explicit approval.
- `executed` and `verified` status are not conflated.