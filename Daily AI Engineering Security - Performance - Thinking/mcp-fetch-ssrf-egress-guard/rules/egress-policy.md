# Egress Security Rules

- Every model-controlled outbound URL MUST pass `scripts/url_guard.py` before network access.
- Every redirect target MUST be revalidated; an allow decision for the original URL MUST NOT authorize a redirect.
- Only configured schemes MUST be accepted; HTTP(S) SHOULD be the default set.
- Userinfo embedded in URLs MUST be rejected.
- All resolved addresses MUST be evaluated. A hostname MUST be denied if any resolved address is blocked.
- Loopback, link-local, private, reserved, multicast, unspecified, and configured sensitive CIDRs MUST be denied by default.
- Internal destinations MUST NOT be enabled globally for convenience. If required, they MUST use an explicit narrow allowlist and separate deployment policy.
- DNS failures MUST fail closed for security-sensitive fetches.
- Redirect count MUST be bounded by configuration.
- The application SHOULD also enforce network-level egress restrictions; this guard MUST NOT be presented as a firewall replacement.
- Audit logs MUST record decision, normalized host, resolved IPs, rule/reason, request correlation ID, and policy version; they MUST NOT record credentials or authorization headers.
- Human approval MUST be required before intentionally expanding a production allowlist to sensitive/internal destinations.
- Security tests MUST include IPv4, IPv6, literal IP, localhost aliases, private networks, link-local metadata ranges, allowlist subdomains, and redirect revalidation.
- A failed security test MUST block completion. The verifier MUST NOT weaken a rule merely to make a fixture pass.