# MCP URL Boundary Rules

- Caller-controlled MCP destinations MUST be treated as untrusted network input.
- The runtime MUST permit only `https` by default; `http` requires an explicit scoped exception.
- Destinations MUST be canonicalized and DNS-resolved before authorization.
- Loopback, RFC1918/private, link-local, unspecified, multicast, reserved and cloud-metadata destinations MUST be denied unless an explicit approved policy names the exact target.
- Redirect targets MUST be revalidated before following them.
- Authorization MUST apply to the effective resolved destination, not only the original hostname string.
- Caller-supplied bearer tokens, cookies, proxy credentials and sensitive headers MUST NOT be forwarded to a destination that has not been separately authorized for those credentials.
- Validation errors and indeterminate DNS results MUST fail closed.
- Security decisions MUST be logged without secret values.
- Bypasses MUST require human approval, documented owner, reason and expiration.
- The implementing agent MUST NOT be the sole verifier.