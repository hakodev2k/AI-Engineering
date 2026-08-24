# Workflow: CLI Contract Change

## Trigger

A change touches command registration, parser configuration, public flags, positional arguments, defaults, accepted values, help semantics, or documented exit codes.

## Entry conditions

A supported baseline revision is known and the repository can generate or manually review a normalized CLI contract.

## Stages

1. **Context — CLI Contract Explorer**: locate entry points, parser definitions, relevant docs/tests, and baseline contract.
2. **Plan — implementation owner**: identify intended CLI changes and compatibility expectations.
3. **Execute — implementation owner**: implement the smallest scoped change.
4. **Generate candidate — CLI Contract Explorer or deterministic adapter**: materialize the candidate contract from changed behavior.
5. **Compare — deterministic gate**: run `scripts/compare_cli_contract.py`.
6. **Checkpoint**:
   - compatible: continue;
   - breaking: stop and run `skills/review-cli-regression.md`;
   - invalid/error: stop and repair deterministic input/tooling.
7. **Test — implementation owner**: run parser, help, unit/integration, and representative CLI tests.
8. **Verify — Verification Agent**: reproduce comparison and confirm runtime behavior matches the candidate contract.
9. **Complete**: attach contract report and verification evidence to the parent change.

## Retry rules

- Invalid contract/extractor failure: one retry after deterministic correction.
- Build/test failure: maximum two implementation/fix cycles.
- Comparator breaking finding: no automatic retries; fix or seek explicit approval.
- Tool transport failure: maximum two retries if no repository/system mutation occurred.

Preserve baseline, candidate, comparator report, test output, and approval evidence across retries.

## Approval points

Explicit human approval is mandatory before accepting a breaking contract. The approval must reference exact findings and migration/release evidence.

## Failure paths

Missing baseline, unresolved comparator findings, runtime/contract mismatch, failed tests, or missing approval are blocking.

## Definition of Done

- Baseline and candidate contracts are valid.
- Comparator result is reproducible.
- No unapproved breaking findings remain.
- Runtime behavior matches candidate contract.
- Required CLI tests pass.
- Approval/migration evidence exists for any accepted break.
- Retry bounds were not exceeded.