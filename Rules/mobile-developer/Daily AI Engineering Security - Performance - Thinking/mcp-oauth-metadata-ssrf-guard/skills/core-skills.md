# Core Skills

## Skill 1 — OAuth Metadata Trust-Boundary Audit

**Purpose:** determine whether an MCP client can be induced to fetch or open attacker-controlled destinations through OAuth discovery.

**Trigger:** adding remote MCP OAuth, changing discovery logic, changing redirect behavior, or reviewing a client after a security report.

**Inputs:** client source, HTTP/browser helpers, OAuth discovery sequence, deployment network model, policy config.

**Preconditions:** identify all functions that consume `resource_metadata`, `authorization_servers`, `issuer`, `authorization_endpoint`, `token_endpoint`, `registration_endpoint`, `jwks_uri`, `revocation_endpoint`, and redirect `Location` values.

**Required context:** workspace trust model, whether the client runs on developer laptops or cloud hosts, allowed development exceptions.

**Tools:** source search, `scripts/url_policy.py`, unit/integration tests, optional packet/egress logs.

**Procedure:**
1. Enumerate every metadata-derived URL sink.
2. Classify each sink as `server-fetch`, `browser-navigation`, or `callback`.
3. Record existing scheme, host, DNS, redirect and size/timeout checks.
4. Run the policy script against public, private, loopback, link-local and mixed-address fixtures.
5. Trace redirects and confirm every hop is revalidated.
6. Check whether DNS is resolved once but the connection can use a different address; require peer verification or connection pinning where available.
7. Confirm browser navigation has its own scheme policy and never inherits permissive server-fetch exceptions.
8. Produce findings with severity, reachable attack path and exact missing control.

**Decisions:** block when any resolved address is non-global unless the exact host is explicitly allowlisted for a controlled development environment. Treat ambiguous DNS and malformed URLs as deny.

**Constraints:** do not make live requests to cloud metadata services or internal hosts during testing.

**Expected output:** trust-boundary map, failing fixtures, remediation locations and policy rationale.

**Metrics:** discovered URL sinks covered by common validator; adversarial fixture block rate; redirect-hop validation coverage.

**Verification:** independent reviewer confirms all sinks route through the same policy boundary.

**Failure handling:** if source paths are incomplete, mark coverage unknown and stop before declaring the client safe.

**Stop conditions:** all URL sinks are classified and either guarded or explicitly documented as non-network/non-browser values.

## Skill 2 — Resolution-Aware URL Validation

**Purpose:** make URL authorization depend on the destination actually reachable by the client, not only the URL string.

**Trigger:** before any HTTP fetch of metadata-derived URLs.

**Inputs:** candidate URL, policy, DNS resolver results, operation kind.

**Preconditions:** URL parsed successfully and operation kind is known.

**Tools:** deterministic URL parser, DNS resolver, `ipaddress`, policy config.

**Procedure:**
1. Reject unsupported schemes and embedded username/password.
2. Normalize hostname with IDNA handling supplied by the runtime; reject empty hostnames.
3. If hostname is an IP literal, classify it directly.
4. Otherwise resolve A/AAAA records with bounded timeout.
5. Reject if any candidate address is loopback, private, link-local, multicast, unspecified, reserved or otherwise non-global when `require_global_ip=true`.
6. Apply exact host allow/deny policy only after normalization.
7. Return a structured decision containing URL, normalized host, resolved IPs and reason code; never include credentials.
8. At connection time, when the HTTP stack exposes the peer address, verify that the peer remains in the approved set or passes the same address policy.

**Decisions:** `ALLOW`, `DENY_POLICY`, `DENY_DNS`, `DENY_PARSE`.

**Constraints:** do not silently fall back from HTTPS to HTTP.

**Expected output:** deterministic decision object suitable for logs and enforcement.

**Metrics:** false-negative rate in adversarial tests; policy latency; DNS failure rate.

**Verification:** unit tests cover IPv4, IPv6, hostname resolution, mixed global/non-global results and malformed URL cases.

**Failure handling:** fail closed on DNS/parse ambiguity.

**Stop conditions:** decision emitted before network activity.

## Skill 3 — Redirect and Browser Endpoint Guard

**Purpose:** prevent a safe-looking initial URL from redirecting to an unsafe network destination or browser scheme.

**Trigger:** HTTP 3xx response or before launching an authorization URL.

**Inputs:** current URL, redirect target or authorization URL, redirect count, policy.

**Preconditions:** automatic redirect following is disabled in the HTTP client.

**Tools:** safe-fetch wrapper, URL policy validator.

**Procedure:**
1. Resolve relative `Location` against the current approved URL.
2. Reject redirects beyond `max_redirects`.
3. Re-run full URL/DNS policy for every hop.
4. Never copy bearer/client credentials to a different origin unless the OAuth implementation explicitly requires and validates that origin.
5. For browser navigation, apply `browser_allowed_schemes` independently; reject `file:`, custom schemes, `javascript:`, `data:` and unexpected HTTP.
6. Log only origin, decision and reason code.

**Expected output:** approved redirect/browser target or a hard deny.

**Metrics:** redirect-to-private block rate; disallowed-browser-scheme block rate.

**Verification:** adversarial chain tests including public→private, public→loopback and HTTPS→HTTP.

**Failure handling:** deny and surface actionable error; never auto-relax policy.

**Stop conditions:** target is approved or operation is blocked.
