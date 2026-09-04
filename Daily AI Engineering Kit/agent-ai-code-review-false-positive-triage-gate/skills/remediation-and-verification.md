# Skill: Remediation and Verification

## Purpose
Apply the smallest change for a confirmed review defect and prove the original claim is resolved without introducing unrelated regressions.

## Inputs
A validated finding with `status=confirmed`, reproduction evidence, affected code, and repository-native verification commands.

## Procedure
1. Re-run the confirming reproduction before editing.
2. Identify the narrowest change that addresses the evidenced cause.
3. Check whether the change alters public contracts, persistence, production configuration, security boundaries, or dependencies; stop for approval if it does.
4. Implement only the scoped remediation.
5. Run formatter/linter when repository-native commands exist.
6. Re-run the original reproduction.
7. Run affected unit/integration tests and the smallest relevant build/static analysis.
8. Inspect the diff for unrelated edits.
9. Update evidence with exact commands, exit codes, and artifacts.
10. Hand off to the Verification Agent; the implementer must not self-certify a blocking finding.

## Verification
The original reproduction must no longer fail for the claimed defect, relevant regression checks must pass, and independent verification must succeed.

## Failure handling
At most two implementation retries are allowed. Each retry must preserve prior failure evidence and change the hypothesis or remediation based on new evidence. After two failures, stop with `verification.result=blocked`.

## Stop conditions
Stop on successful independent verification, exhausted retry budget, missing permissions, or any approval-required boundary.
