# Recover Quarantined Test

## Purpose
Prove that a quarantined test is stable again before restoring it as a blocking CI check.

## Inputs
Quarantine evidence, candidate fix revision, test command, policy, and failure history.

## Preconditions
The cause/fix is documented or an explicit stabilization change exists. Candidate revision is immutable during verification.

## Procedure
1. Read the original evidence and quarantine reason.
2. Confirm the candidate revision contains the intended repair and no unrelated weakening of assertions.
3. Run the isolated test repeatedly on the candidate revision until `recovery_consecutive_passes` is reached or one failure occurs.
4. If one failure occurs, reset the consecutive-pass counter and stop removal; preserve the new failure evidence.
5. Run the relevant containing suite once after isolated stability is proven.
6. Inspect the diff for skips, relaxed assertions, increased sleeps/timeouts, disabled checks, or environment-specific bypasses.
7. Have the Verification Agent independently review the evidence.
8. Remove quarantine only after all recovery checks pass and required approval is present.

## Expected output
Candidate revision, consecutive pass count, containing-suite result, diff-risk findings, verification status, and `remove` or `keep` decision.

## Verification
Recovery requires the exact configured consecutive pass threshold plus a passing containing suite. A test made trivially passing by weakening behavior is not recovered.

## Failure handling
Any valid test failure keeps quarantine active. Infrastructure failures may be retried twice and do not count. Permission failures stop the workflow.

## Stop conditions
A valid failure occurs, unsafe changes are found, required approval is missing, or recovery is independently verified.
