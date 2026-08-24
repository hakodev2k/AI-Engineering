# Hook: Pre Merge

## Trigger

Before merging a change that can affect the public CLI.

## Preconditions

Candidate contract, comparator report, and CLI test evidence are current for the final diff.

## Action

1. Re-run `scripts/compare_cli_contract.py` on the final candidate.
2. Run repository-native CLI tests.
3. Confirm report timestamp/evidence corresponds to the final diff.
4. Require explicit approval evidence for every accepted breaking finding.
5. Hand evidence to independent verification when the change is high-risk or intentionally breaking.

## Expected result

No unapproved breaking findings and all required tests pass.

## Failure behavior

Block merge. Do not refresh the baseline to suppress findings.

## Blocking

Yes.