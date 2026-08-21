# Test Oracle Contamination Workflow

## Trigger
Run when AI creates or changes tests/assertions for feature work, bug fixes, refactors, production regressions, public contracts, security, money, migration, or other behavior where a false-positive test would be costly.

## Entry conditions
- Behavior under test is identifiable.
- Evidence sources can be inspected.
- Repository/test context is available.

## Inputs
Requirement evidence, implementation owner, risk classification, repository revision/context, policy.

## Flow

```text
Trigger
  ↓
Collect independent evidence
  ↓
Create oracle claims
  ↓
Fingerprint oracle + policy
  ↓
Generate/edit tests
  ↓
Inventory assertions
  ↓
Detect contamination
  ↓
Run tests + mutation evidence when required
  ↓
Independent review when required
  ↓
Final oracle gate
  ↓
Verified / Blocked
```

## Stages

### 1. Evidence and oracle planning — Oracle Curator
Use `skills/derive-independent-oracle.md`. Produce claims following `schemas/oracle-claim.schema.json`.

Checkpoint: every claim has source, evidence, risk, independence marker.

### 2. Fingerprint
Run:
`python scripts/fingerprint-oracle.py --claims <claims.json> --policy config/oracle-policy.json --output <fingerprint.json>`

Checkpoint: record oracle and policy fingerprints before review.

### 3. Test creation/execution — Implementation/Test Agent
Generate the smallest test set that exercises the claims. Test execution proves only execution status, not oracle integrity.

### 4. Assertion inventory
Run:
`python scripts/extract-test-assertions.py --repo <repo> --output <assertions.json>`

### 5. Contamination detection
Run:
`python scripts/detect-oracle-contamination.py --claims <claims.json> --assertions <assertions.json> --policy config/oracle-policy.json --output <contamination.json>`

Any blocker stops autonomous progress until claims/tests are corrected from independent evidence.

### 6. Mutation/fault evidence
For high/critical risk, run the host repository's mutation tool or deliberate fault-injection workflow and export:
`{"mutants": <int>, "killed": <int>}`.

This stage does not prescribe a mutation framework; the host repository chooses one.

### 7. Independent review — Oracle Verifier
Required for high-risk and any warning-driven review. Follow `skills/review-test-oracle.md`; produce `schemas/oracle-review.schema.json` compliant output.

### 8. Final gate
Run:
`python scripts/evaluate-oracle-gate.py --claims <claims.json> --contamination <contamination.json> --policy config/oracle-policy.json [--mutation <mutation.json>] [--review <review.json>] --implementation-owner <owner> --output <gate.json>`

## Produced artifacts
Claims, fingerprint, assertion inventory, contamination report, mutation evidence where required, review where required, final gate report.

## Retry rules
- Transient filesystem/tool invocation failure: maximum 1 retry; preserve the first failure evidence.
- Validation, contamination, review rejection, or mutation threshold failure: 0 automatic retries. Correct the underlying evidence/test and restart from the changed stage.
- Never retry until success.

## Failure paths
- Missing independent source → stop and request human/domain clarification.
- Stale fingerprint → regenerate contamination/review from current claims/policy.
- Mutation failure → preserve surviving mutants; improve oracle/test rather than lowering policy.
- Permission/tool absence → report blocked; do not silently elevate permissions or substitute unverified evidence.

## Approval points
Stop before production deployment, breaking public contract, schema/destructive data change, security weakening, force push, or any policy-listed dangerous action.

## Definition of Done
- Claims exist and are evidence-bound.
- No contamination blocker remains.
- Required test execution completed separately.
- Required mutation threshold passes.
- Required independent review is approved and fingerprint-current.
- Final gate status is `verified`.
- Remaining non-blocking risks are recorded.
