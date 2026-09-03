# Rules: SSRF Boundary

- Every untrusted outbound URL **MUST** be parsed and canonicalized before authorization.
- The effective destination **MUST** be evaluated after DNS/IP resolution and immediately before connection when the client can re-resolve.
- Every redirect target **MUST** be re-authorized independently; trust **MUST NOT** carry across redirect hops.
- Any destination classified as loopback, private, link-local, multicast, reserved, or unspecified **MUST** be denied unless it is present in a narrowly scoped explicit allowlist.
- IPv4-mapped IPv6 addresses **MUST** be evaluated according to the mapped IPv4 address as well as their IPv6 representation.
- A hostname resolving to both allowed and denied addresses **MUST** be denied for untrusted requests.
- Outbound schemes **MUST** be restricted to the configured allowlist. `file:`, `gopher:`, `ftp:`, custom schemes, and local IPC schemes **MUST NOT** be enabled by default.
- Sensitive headers **MUST NOT** be forwarded to a different origin after redirect without explicit destination authorization.
- Agent/model output **MUST NOT** be treated as proof that a URL is trusted.
- Validation failures **MUST** fail closed and produce non-secret structured telemetry.
- Security tests **MUST** include IPv4 loopback/private/link-local, IPv6 loopback/link-local/ULA, IPv4-mapped IPv6, mixed safe/unsafe resolution, and redirect-to-unsafe cases.
- Production code **SHOULD** pin the connection to a validated address or provide an equivalent time-of-check/time-of-use defense against DNS rebinding.
- Operators **SHOULD** layer network egress controls underneath this guard; those controls **MUST NOT** replace application-layer validation.
