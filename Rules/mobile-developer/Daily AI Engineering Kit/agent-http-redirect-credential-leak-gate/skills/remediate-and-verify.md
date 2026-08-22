# Remediate and Verify

## Purpose
Implement the smallest change that prevents credential leakage without silently breaking legitimate redirect flows.

## Inputs
Confirmed finding, affected client code, tests, policy, and acceptance criteria.

## Process
1. Add a failing regression test reproducing the unsafe hop with fake credentials.
2. Prefer disabling automatic redirects for privileged clients.
3. Resolve and validate each `Location` target before constructing the next request.
4. Recreate the redirected request without sensitive headers when the host changes.
5. Reject HTTPS downgrade and disallowed/private destinations.
6. Preserve method/body semantics only when application requirements explicitly allow them.
7. Run focused tests, then the repository's relevant broader test suite.
8. Generate a fresh sanitized chain and gate report.
9. Inspect the diff for unrelated changes and newly introduced logging.
10. Hand evidence to the Verification Agent.

## Expected output
Code change, regression test, fresh gate report, test evidence, and residual-risk note.

## Verification
The original reproduction must now be blocked or sanitized; approved same-host redirects must still work; no real secret may appear in logs or fixtures.

## Failure handling
Allow at most two implementation/test-fix cycles. Preserve each failing test result. After two failed cycles, stop and escalate with evidence.

## Approval boundary
Stop before production deployment, proxy/DNS/firewall changes, secret rotation, or expansion of an allowlist.
