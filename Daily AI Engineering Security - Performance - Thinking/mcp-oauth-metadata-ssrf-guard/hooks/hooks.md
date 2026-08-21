# Hooks

## Pre-Discovery URL Validation
**Trigger:** immediately before fetching any MCP/OAuth metadata-derived URL.

**Action:** run the common URL policy validator with operation kind `fetch`.

**Command:** `python scripts/url_policy.py --policy config/policy.json --kind fetch --url "$URL"`

**Expected result:** exit 0 and JSON decision `ALLOW` before network I/O.

**Failure behavior:** exit non-zero; do not issue the request; surface reason code.

## Redirect Validation
**Trigger:** an HTTP response contains 3xx + `Location`.

**Action:** resolve the target against current URL and repeat full URL/DNS validation before the next request.

**Command:** use `scripts/safe_fetch.py`, which disables automatic redirects and validates every hop.

**Expected result:** every hop appears in sanitized audit output with `ALLOW`.

**Failure behavior:** terminate the fetch; never follow denied or over-budget redirect.

## Pre-Browser OAuth Validation
**Trigger:** immediately before opening `authorization_endpoint` in a browser.

**Action:** validate with operation kind `browser`.

**Command:** `python scripts/url_policy.py --policy config/policy.json --kind browser --url "$AUTHORIZATION_URL"`

**Expected result:** approved browser scheme/host and exit 0.

**Failure behavior:** do not launch browser; require corrected metadata or explicit reviewed policy change.

## Post-Change Security Regression
**Trigger:** URL-discovery, HTTP, OAuth, redirect or browser-launch code changes.

**Action:** run deterministic regression tests.

**Command:** `python -m unittest discover -s tests -p 'test_*.py' -v`

**Expected result:** all adversarial and positive fixtures pass.

**Failure behavior:** block merge/release; maximum two implementation retries before escalation.

## Final Verification
**Trigger:** before marking SSRF hardening complete.

**Action:** confirm all discovered sinks call the common boundary, no implicit redirects remain, tests pass, and production exceptions are reviewed.

**Expected result:** verification report separates Implemented, Measured and Verified.

**Failure behavior:** completion status remains unverified; never waive a blocking private-network fixture for convenience.
