# Workflow: Agent Output Schema Contract Gate

## Trigger
Any change to a producer prompt, model/tool configuration, serializer, schema, enum, structured-output instruction, or consumer parser that can affect a machine-consumed agent output.

## Entry conditions
- Contract owner identified.
- Baseline schema or explicit `no-baseline` state recorded.
- Candidate revision identified.
- Direct consumers discoverable.

## Inputs
Producer/consumer code, baseline schema, candidate schema, policy, representative instances, replay commands, migration/approval evidence.

## Flow

```text
Trigger
  ↓
Inventory producer + consumers
  ↓
Validate baseline/candidate schemas
  ↓
Generate deterministic compatibility diff
  ↓
Replay candidate instances against consumers
  ↓
Contract Analyst classification
  ↓
Independent Consumer Compatibility Review
  ↓
Final deterministic gate
  ├─ verified
  ├─ migration-required
  ├─ human-approval-required
  └─ blocked
```

## Stages

### 1. Contract inventory
Owner: Contract Analyst.
Produced artifact: contract record based on `templates/contract-record.json`.
Checkpoint: producer, consumers, contract name/version, baseline/candidate paths and revisions must exist.

### 2. Schema validation
Run `scripts/validate-contract-instance.py` against representative candidate instances. Invalid structured output blocks handoff.

### 3. Compatibility comparison
Run `scripts/compare-contract-schemas.py` with baseline, candidate, and policy. Preserve the report exactly.

### 4. Consumer replay
Run configured deterministic consumer checks. Record command/check id, consumer, result, evidence path, revision, and candidate schema hash.

### 5. Semantic review
Contract Analyst separates structural facts from semantic findings such as unit changes, status meaning changes, ordering guarantees, identifier semantics, or confidence interpretation.

### 6. Independent review
Consumer Compatibility Reviewer verifies hashes, inventory coverage, replay evidence, and semantic changes. Reviewer must differ from candidate author for migration-required or breaking changes.

### 7. Final gate
Run `scripts/evaluate-contract-gate.py` with contract record, compatibility report, review record, and policy.

## Retry rules
- Tool/transient execution failure: maximum 1 retry after preserving the first failure.
- Invalid schema or invalid output instance: no automatic retry; fix the source and rerun as a new attempt.
- Consumer replay test failure: no blind retry. Investigate; retry once only if evidence proves a transient environmental cause.
- Business/semantic incompatibility: never retried automatically.

## Stop conditions
- Missing baseline for a contract already consumed in production.
- Unknown direct consumer for a high-risk contract.
- Invalid candidate schema or instance.
- Breaking change without migration plan and approval.
- Reviewer is not independent where required.
- Schema hashes or revisions are stale/mismatched.

## Approval points
Human approval is mandatory before releasing a breaking contract, removing a field/enum still used by consumers, weakening validation/security constraints, or changing externally visible semantics that can cause irreversible side effects.

## Failure paths
- Validation failure → `blocked`.
- Compatible additive change + successful replay → continue to review/gate.
- Migration-required change → block release until migration evidence and consumer readiness exist.
- Breaking change → `human-approval-required` after migration evidence; otherwise `blocked`.
- Missing/stale evidence → `blocked`.

## Definition of Done
- Baseline/candidate schemas are identified and hashed.
- Representative candidate instance validates.
- Compatibility report exists.
- All mandatory consumer replay checks pass.
- Semantic changes are explicitly classified.
- Independent review is complete where required.
- Required approval exists and matches the exact candidate revision/schema hash.
- Final gate returns `verified`.
- Remaining non-blocking risks are documented.