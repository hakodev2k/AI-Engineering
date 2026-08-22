# Verify Replay Resistance

## Purpose
Independently prove the implementation, not merely re-read it.

## Procedure
1. Validate evidence schema.
2. Reconstruct at least one valid signed fixture independently.
3. Mutate one byte of body and prove rejection.
4. Alter signature and prove rejection.
5. Test missing/malformed headers.
6. Test timestamps immediately inside and outside configured boundaries when timestamps are supported.
7. Deliver the same event twice and assert the protected side-effect count remains one.
8. Deliver concurrent duplicates and assert the same invariant.
9. Confirm replay claim is atomic and TTL is at least the configured policy.
10. Confirm parsing/business code is unreachable on failed authenticity.
11. Run build, focused tests, and relevant integration tests.
12. Confirm no secrets or raw sensitive payloads were introduced into logs/fixtures.
13. Mark `verified` only with passing evidence; otherwise `blocked` and list exact failures.

## Retry
Transient infrastructure/test-runner failure: maximum 2 retries. Assertion failures are not transient and must return to implementation.