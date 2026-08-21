# Integration Guide

## Goal
Integrate one reusable SSRF/navigation boundary into an MCP client so every OAuth metadata-derived URL is checked consistently before HTTP or browser use.

## Recommended insertion points
Guard these values when they are consumed, not only when parsed:
- protected-resource metadata URL from `WWW-Authenticate`;
- `authorization_servers[]`;
- authorization-server/OIDC metadata discovery candidates;
- `authorization_endpoint` before browser launch;
- `token_endpoint`, `registration_endpoint`, `jwks_uri`, `revocation_endpoint` before fetch;
- every HTTP redirect `Location`.

## 1. Copy the policy engine
Use `scripts/url_policy.py` as a reference implementation or port the same invariants into the application's native language. Production code should expose a function equivalent to:

`ValidateEndpoint(url, operationKind, policy) -> Decision`

The decision must include an allow/deny result and stable reason code. Network activity must happen only after `ALLOW`.

## 2. Centralize policy
Start from `config/policy.json`. Keep production and development policy separate. Do not enable loopback HTTP globally to fix one local test environment. If local MCP development requires loopback HTTP, scope the exception to the exact development profile and exact hosts.

## 3. Replace implicit redirects
Many HTTP clients automatically follow redirects. Disable that behavior for OAuth metadata fetches. On 3xx:
1. read `Location`;
2. resolve relative target against the current URL;
3. enforce redirect budget;
4. run full scheme + DNS/IP policy on the target;
5. issue the next request only after approval.

Do not forward `Authorization` or other sensitive headers across an origin change unless the OAuth protocol flow explicitly requires that destination and it has been independently validated.

## 4. Bound the response
Set connect/read timeout, redirect count, and response-size limits. Metadata is structured control data; it should not require unbounded downloads. Reject oversized or malformed metadata before downstream processing.

## 5. Handle DNS rebinding residual risk
Pre-resolution blocks obvious non-global destinations but does not fully bind the later TCP connection to the approved answer. Prefer one of:
- an HTTP transport that exposes the connected peer IP and re-check it;
- resolve-and-connect-to-approved-IP while preserving TLS SNI/hostname verification;
- an egress proxy/firewall enforcing the same destination policy.

If none is available, document this as residual risk rather than claiming complete DNS-rebinding resistance.

## 6. Separate browser policy
`authorization_endpoint` is not a generic fetch URL. Validate it with operation kind `browser` and a strict scheme allowlist. Never pass arbitrary metadata values directly to `webbrowser.open`, `open`, `start`, `xdg-open`, `Process.Start`, or equivalent OS launchers.

## 7. Logging
Log:
- operation kind;
- normalized host/origin;
- allow/deny;
- reason code;
- redirect hop count;
- policy version.

Do not log authorization codes, access/refresh tokens, client secrets, full query strings containing sensitive values, or response bodies by default.

## 8. Testing
Run:

`python -m unittest discover -s tests -p 'test_*.py' -v`

Required fixture families:
- public HTTPS allowed;
- RFC1918 blocked;
- loopback blocked;
- IPv4 and IPv6 link-local/private blocked;
- cloud metadata address blocked;
- mixed global/private DNS answers blocked;
- explicit private IP literal blocked;
- HTTP blocked in production;
- embedded credentials blocked;
- unsafe browser scheme blocked;
- DNS failure fails closed.

For redirect integration tests, use local synthetic transport/mocks rather than real internal endpoints. Assert that the mocked private destination receives zero requests.

## 9. Rollout strategy
1. Observe-only mode is acceptable only in a non-production staging environment to inventory compatibility.
2. Fix or explicitly review legitimate exceptions.
3. Enable enforcement before production release.
4. Monitor deny reason counts and OAuth failure rate.
5. Treat a sudden rise in private/link-local deny events as a security signal, not merely an interoperability issue.

## 10. .NET mapping
For .NET clients, place the policy in a `DelegatingHandler` or dedicated OAuth discovery client. Configure `HttpClientHandler.AllowAutoRedirect = false`. Use `Dns.GetHostAddressesAsync` with bounded cancellation and `IPAddress` classification. For stronger rebinding resistance, use `SocketsHttpHandler.ConnectCallback` to bind connection behavior to approved resolution while preserving TLS hostname validation. Validate browser targets before `Process.Start(new ProcessStartInfo(url) { UseShellExecute = true })`.

## Failure handling
- Parse/DNS/policy failure: deny, no retry for policy errors.
- Transient DNS/network failure after an allow decision: at most one retry.
- Compatibility break: capture sanitized endpoint metadata, keep security controls enabled, request a narrowly scoped policy review.
- Repeated unexplained deny events: escalate to security review.

## Definition of Done
Integration is complete only when all metadata-derived URL sinks are guarded, automatic redirects cannot bypass the guard, browser navigation is separately validated, adversarial fixtures pass, positive public OAuth fixtures still work, and residual peer-IP limitations are documented or mitigated.
