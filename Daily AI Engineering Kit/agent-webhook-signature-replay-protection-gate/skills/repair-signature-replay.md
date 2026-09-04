# Skill: Repair Signature and Replay Protection

## Purpose
Implement the smallest safe correction to a confirmed webhook verification or replay defect.

## Inputs
Boundary map, confirmed finding, provider contract, nearby tests.

## Preconditions
The defect is supported by evidence. Required secrets are referenced symbolically, never copied into task artifacts.

## Process
1. State the defect and acceptance criteria in one paragraph.
2. Select the narrowest boundary that can enforce the provider contract.
3. Preserve exact raw bytes if signing requires them.
4. Verify signature and timestamp before side effects.
5. Add atomic replay reservation using provider event ID or a stable signed-data-derived key.
6. Define duplicate semantics explicitly: reject, acknowledge-without-reprocessing, or provider-specific equivalent.
7. Add bounded retention/expiry to replay state where appropriate.
8. Add tests for valid, invalid signature, stale timestamp, malformed input, first delivery, duplicate delivery, and concurrent duplicate delivery when feasible.
9. Run formatting/build/tests and deterministic scripts.
10. Inspect the diff for unrelated changes, logging leaks, contract changes, and unsafe fallback paths.
11. Produce evidence for independent verification.

## Expected output
Small code/test diff plus evidence JSON.

## Verification
Implementation is not complete until an independent verifier confirms the affected boundary and tests.

## Failure handling
At most two implementation retries after a failed verification/test cycle. Preserve outputs from every failed cycle.

## Approval stop
Stop before production config/secret changes, deployments, infrastructure changes, breaking contracts, or weakened controls.
