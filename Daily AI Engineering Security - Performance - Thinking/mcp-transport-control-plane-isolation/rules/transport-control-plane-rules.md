# Rules: MCP Transport Control Plane

1. MCP management endpoints **MUST** require authenticated identity when reachable outside a trusted local-only boundary.
2. End-user requests **MUST NOT** provide arbitrary stdio command strings, shell fragments, executable paths, or environment definitions.
3. Stdio clients **MUST** select a developer/admin-predeclared server identity.
4. Process execution **MUST NOT** use a shell when an argv-style API is sufficient.
5. User-defined remote MCP servers **MUST** be disabled by default.
6. Enabling user-defined remote servers **MUST** require a non-empty explicit destination grant.
7. Remote URLs **MUST** use `http`/`https`, **MUST NOT** contain URL credentials, and **MUST** be canonicalized before comparison.
8. Literal loopback, private, link-local, multicast, reserved, and unspecified IP destinations **MUST** be rejected unless an explicit higher-trust exception exists.
9. Redirects and server-provided follow-up endpoints **MUST** be independently checked against the destination grant.
10. Runtime deployments **SHOULD** resolve-and-pin approved hostnames or enforce equivalent egress policy against DNS rebinding/TOCTOU.
11. Caller-supplied forwarding headers **MUST** be positive-allowlisted; `Host`, `Cookie`, proxy/forwarding, and hop-by-hop headers **MUST NOT** be caller-controlled.
12. Credentials **MUST** be scoped to the approved destination and **MUST NOT** be logged.
13. MCP process/session creation **MUST** have a finite per-client concurrency limit.
14. Authentication **MUST NOT** substitute for command, destination, header, or resource validation.
15. Application validation **MUST NOT** substitute for host/container egress controls where sensitive networks are reachable.
16. Security tests **MUST** include denied and approved cases using harmless fixtures.
17. Any irreversible production exception that expands MCP authority **MUST** require explicit human approval.
