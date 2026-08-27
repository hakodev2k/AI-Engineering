# Workflow — Write Request Verification

## Trigger
Any AI-agent file-write request, especially after ingesting untrusted repository, web, issue, or tool-output content.

## Goal
Allow ordinary workspace edits while preventing silent modification of execution-sensitive state.

## Inputs
Target path, workspace root, write operation, approval state, policy.

## Baseline
Record current guard version, sensitive-path policy, attack fixtures, and expected decisions.

## Stages
1. Observe the requested write and its provenance.
2. Canonicalize target path and resolve parent symlinks.
3. Classify workspace boundary and sensitive-path status.
4. Form the hypothesis: the write is either ordinary source state or execution-sensitive state.
5. Run `scripts/write_gate.py`.
6. If `require_approval`, pause for explicit human approval; never self-approve.
7. If `block`, preserve reason codes and stop.
8. If `allow`, perform only the authorized write.
9. Run regression tests after guard/policy changes.
10. Independent verifier checks the result.

## Checkpoints
Before path classification; before any sensitive write; after regression tests.

## Metrics
Sensitive-write approval coverage, path-escape block rate, attack-fixture pass rate, ordinary-write false positives.

## Retry policy
Maximum 2 diagnostic retries for classification/configuration defects. Authorization failures are not retried autonomously.

## Stop conditions
Missing workspace root, unresolved path ambiguity, symlink escape, missing approval, policy parse failure, or exhausted retries.

## Failure path
Fail closed, preserve evidence, and escalate to the security verifier or human owner.

## Verification
Run `python -m unittest tests/test_write_gate.py`; independently inspect any newly added sensitive pattern.

## Definition of Done
Implemented, measured, and independently verified with no unresolved path escape or approval bypass.
