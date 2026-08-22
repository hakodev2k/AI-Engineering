# Egress Safety Rules

## MUST
- Validate every agent-controlled or data-derived outbound URL before network access.
- Use an explicit hostname allowlist and HTTPS by default.
- Resolve DNS immediately before connection and reject the destination if any answer is non-global or falls in a blocked CIDR.
- Revalidate every redirect hop when redirects are explicitly enabled.
- Fail closed when parsing, DNS resolution, or policy loading fails.
- Require explicit human approval before adding a new external hostname to the allowlist.
- Preserve decision evidence without secrets, authorization headers, cookies, or URL userinfo.

## MUST NOT
- Do not allow `localhost`, loopback, private, link-local, metadata-service, multicast, reserved, or unspecified addresses.
- Do not trust a hostname merely because its text looks public.
- Do not use substring/suffix tricks as a substitute for exact allowlisting.
- Do not follow redirects automatically under the default policy.
- Do not accept URLs containing username/password authority fields.
- Do not weaken CIDR, DNS, scheme, or redirect controls to make a task succeed.
- Do not send credentials to a destination that was not independently authorized for those credentials.

## SHOULD
- Pin outbound access behind a shared HTTP client/egress proxy so validation cannot be skipped by individual agents.
- Keep allowlists narrow and service-specific.
- Log normalized hostname, decision, reason, and public resolved IPs for auditability.
- Test IPv4, IPv6, encoded-host, trailing-dot, redirect, and DNS-rebinding-style cases in CI.
