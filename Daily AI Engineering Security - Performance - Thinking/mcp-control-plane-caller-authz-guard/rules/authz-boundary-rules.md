# Rules: MCP Control-Plane Authorization Boundary

1. The MCP listener MUST authenticate inbound callers independently of any backend credential held by the server.
2. A backend API token, cloud credential, kubeconfig, service account, or registry token MUST NOT be treated as proof of inbound caller identity.
3. A listener reachable beyond a loopback or explicitly isolated trust zone MUST require application-layer authentication or a verified authenticated proxy boundary.
4. Mutating, destructive, administrative, deployment, secret-reading, or external-egress tools MUST have explicit caller authorization.
5. Shared listener secrets MAY establish possession but SHOULD NOT be used where different callers require different privileges; use separate identities or isolated instances.
6. The backend credential MUST be least privilege for the enabled tool surface and MUST NOT exceed the minimum environment/project scope without documented approval.
7. Read-only mode MUST be enabled when writes are not required.
8. Wildcard binds (`0.0.0.0`, `::`) MUST be treated as externally reachable unless network evidence proves isolation.
9. Network ACLs, Origin checks, Host checks, and CORS MUST NOT be considered substitutes for caller authentication.
10. Every runtime change to listener exposure, proxying, authentication, tool registration, read-only state, or backend credential scope MUST invalidate the previous authorization attestation.
11. Secrets MUST NOT appear in logs, evidence files, prompts, test fixtures, or tool arguments used only for policy verification.
12. Dangerous active verification against production MUST require explicit human approval and a rollback plan.
13. The implementing engineer MUST NOT be the sole verifier for a privileged MCP deployment.
14. Completion MUST be blocked when the deterministic preflight reports an authorization-boundary violation.
