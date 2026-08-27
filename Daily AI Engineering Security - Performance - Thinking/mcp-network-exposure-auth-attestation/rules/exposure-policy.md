# Rules: MCP Exposure Policy

- Effective runtime state MUST be measured before claiming a server is private or authenticated.
- A wildcard or non-loopback listener MUST NOT expose high-risk capabilities without approved authentication enforced on that exact listener/route.
- Non-loopback MCP transport MUST use TLS unless an equivalent authenticated encrypted transport is independently verified.
- Configuration-file intent MUST NOT be accepted as proof that authentication is active.
- Credential-read plus outbound-network capability MUST NOT be exposed on a non-loopback listener without the strongest configured authentication boundary.
- Tool capability inventory MUST include shell, file read/write, admin, credential access, and outbound networking when present.
- Secrets MUST NOT be written to attestation evidence or logs.
- Security exceptions MUST require explicit human approval, an owner, expiry, and compensating control.
- Verification SHOULD be repeated after restart, image/package upgrade, proxy change, or tool-set change.
