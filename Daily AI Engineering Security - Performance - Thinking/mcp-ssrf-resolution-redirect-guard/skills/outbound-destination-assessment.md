# Skill: Outbound Destination Assessment

## Purpose
Evaluate whether an agent- or caller-controlled URL can be fetched without crossing the configured network trust boundary.

## Trigger
Before implementing or approving any MCP/browser/fetch tool that accepts a URL, and whenever redirect, DNS, proxy, or header behavior changes.

## Inputs
- Candidate URL and optional redirect chain.
- Resolved IP addresses for every connection attempt.
- Outbound headers.
- `config/policy.json`.
- Deployment-specific allowlists, if any.

## Preconditions
- The implementation can observe or control URL parsing and destination resolution.
- Tests can inject deterministic resolved addresses instead of depending on live DNS.

## Required context
Know which internal networks, metadata endpoints, credentials, and local services are sensitive in the target deployment.

## Allowed tools
URL/IP parsers, DNS resolver instrumentation, HTTP client redirect hooks, unit/integration tests, packet/egress logs, and `scripts/url_guard.py`.

## Constraints
- MUST treat model-generated URLs as untrusted input.
- MUST NOT approve a hostname solely because its textual form looks public.
- MUST NOT rely on process/container network limits as the only application-layer control.
- MUST preserve legitimate public retrieval behavior.

## Procedure
1. Parse the URL using the same standards-compatible parser used by production code.
2. Reject schemes outside `allowed_schemes` and reject URLs containing unexpected credentials/userinfo unless explicitly required.
3. Canonicalize the host and detect literal IP forms.
4. Obtain every address the HTTP client may connect to. For deterministic tests, inject the resolved set.
5. Normalize IPv4-mapped IPv6 to its mapped IPv4 address for policy evaluation.
6. Reject the request if any candidate destination is loopback, private, link-local, multicast, reserved, or unspecified under policy.
7. If the HTTP stack resolves again at connect time, ensure the validated address is pinned or revalidated immediately before connection.
8. On every redirect, repeat steps 1-7. Never inherit trust from the previous URL.
9. Compare origins. Strip sensitive headers on cross-origin redirect unless an explicit destination policy permits forwarding.
10. Record the normalized host, evaluated addresses, decision, and reason without logging secrets.
11. Run adversarial and normal regression tests.

## Decision points
- If safe resolution cannot be observed or pinned, deny by default for untrusted URLs.
- If a hostname resolves to both public and unsafe addresses, deny the request rather than choosing an arbitrary public address.
- If a redirect target cannot be validated, stop following redirects.
- If business requirements need private-network access, move that access to an explicit allowlist with separate authentication and human approval rather than disabling the global guard.

## Expected output
A structured allow/deny record containing URL origin, normalized destination addresses, rejection reason when applicable, redirect hop number, and header-forwarding decision.

## Metrics
100% rejection of unsafe fixtures, zero unvalidated outbound connections, 100% redirect-hop validation coverage, and zero sensitive-header cross-origin leaks.

## Verification
Use `scripts/url_guard.py` and `tests/test_url_guard.py`, then verify the production HTTP client invokes equivalent validation at each connection/redirect boundary.

## Failure handling
Block the outbound request. Capture non-secret diagnostics. Do not weaken address classes or redirect checks to make a failing integration pass.

## Stop conditions
Stop when all destination checks are implemented, adversarial tests pass, normal retrieval tests pass, and an independent reviewer confirms validation occurs after canonicalization/resolution and on every redirect.
