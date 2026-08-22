# Workflow: Secure Local Upload

## Trigger
Add/change a tool that uploads, exports, attaches, or transfers a local file.

## Goal
Constrain local-file reads to explicit roots before content leaves the server.

## Inputs
Tool path argument, operation, transport model, allowed roots, size/symlink policy.

## Baseline
Measure current guarded-sink coverage and execute malicious/benign fixtures before changes.

## Stages
1. Observe schema-to-file-read flows.
2. Measure baseline coverage and failures.
3. Diagnose missing/duplicated/incorrect validation.
4. Form a minimal confinement hypothesis.
5. Implement the central gate before file open.
6. Measure again with traversal, symlink, outside-root, size and valid fixtures.
7. Independent Security Verifier review.

## Checkpoints
After baseline, implementation, and independent verification.

## Metrics
Coverage, malicious-fixture block rate, valid-fixture success, exceptions, false positives.

## Retry policy
At most two implementation/retest cycles. Never resolve a failure by broadening the root or disabling canonicalization without documented human security approval.

## Stop conditions
Complete only after verification. Stop/escalate when a required source cannot be safely represented or any sink remains uncovered.

## Failure path
Fail closed; preserve non-secret evidence; disable the risky local-path capability if necessary.

## Verification
`python -m unittest tests/test_upload_path_guard.py` plus independent sink tracing.

## Definition of Done
Implemented, measured, independently verified, and no blocking security finding remains.