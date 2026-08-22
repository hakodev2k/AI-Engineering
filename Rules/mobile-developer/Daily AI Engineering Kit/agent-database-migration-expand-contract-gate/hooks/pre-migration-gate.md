# Hook: Pre-Migration Gate

## Trigger
Before a migration plan is approved for implementation or before a changed migration is executed in an approved non-production environment.

## Preconditions
Migration files are known and repository state is available.

## Action
Run `python scripts/scan-migration-risk.py <migration-files> --json-out migration-risk.json` and inspect whether policy-listed risky operations exist.

## Expected result
Exit code 0 means no scanner-detected blocking token. Exit code 1 means review/approval is required; it does not prove the migration is unsafe, only that deterministic risk evidence exists. Exit code 2 means invocation/input failure.

## Failure behavior
Scanner findings block automatic continuation until reviewed. Tool/input failures may be retried at most twice if transient. Do not bypass a finding by editing policy without explicit human approval.

## Blocking
Yes for unreviewed findings and invalid inputs.
