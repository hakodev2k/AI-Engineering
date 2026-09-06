# Workflow: Safe Repository Onboarding

## Trigger
Untrusted repository is about to enter agent Git context collection.
## Goal
Prevent repository-controlled Git configuration from executing before trust.
## Inputs
Repository path, provenance, policy.
## Baseline
Pretrust Git invocation count; target 0.
## Context
Only scanner-required deterministic metadata.
## Stages
Observe → measure baseline → static scan → classify finding → human-approved remediation/isolation → rescan → independent verify → permit Git.
## Responsible agent
Repository Trust Audit diagnoses; Security Verifier verifies.
## Tools
Python scanner/unittest only in pretrust stage.
## Outputs
JSON result, decision, verification status, optional remediation record.
## Checkpoints
C1 no Git run; C2 deterministic result; C3 remediation approved if applicable; C4 independent verification passed.
## Metrics
Latency, blocks/errors, pretrust Git calls, tests.
## Retry policy
Inspection error maximum 1 after local correction; security block 0 automatic retries.
## Stop conditions
Blocked/ambiguous config, failed test, or pretrust Git execution.
## Failure path
Quarantine and human escalation; never bypass or weaken policy.
## Verification
Run scanner plus `python -m unittest tests/test_git_pretrust_guard.py`.
## Definition of Done
All checkpoints pass and Git starts only after verified pretrust decision.