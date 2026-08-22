# Rules: Credential Egress Policy

- Authenticated outbound requests **MUST** pass destination authorization before credentials are attached.
- Destination policy **MUST** bind each credential class to approved schemes, hosts, and ports.
- User/model/retrieval-controlled hostname or URL input **MUST NOT** directly determine where service credentials are sent.
- Host validation **MUST** use canonicalized hostnames and explicit exact/suffix semantics; substring matching **MUST NOT** be used.
- IP literals **MUST** be denied unless explicitly required and separately allowlisted.
- DNS results **MUST** be checked against prohibited/private/special ranges when the integration is intended for public service endpoints.
- Redirects from credential-bearing requests **MUST** be disabled or the redirect destination **MUST** pass the same binding policy before credentials are forwarded.
- URL userinfo **MUST** be rejected unless explicitly required.
- TLS verification **MUST NOT** be disabled to bypass destination failures.
- Tests **MUST** use synthetic credentials only.
- Denied destinations **MUST** fail before network transmission containing authorization material.
- Audit logs **MUST NOT** contain secret values; they **SHOULD** include tool, credential class, canonical destination, decision, and matched rule.
- Policy changes that broaden egress **MUST** receive human security review.
- Failure to resolve or validate a destination **MUST** fail closed for credential-bearing requests.