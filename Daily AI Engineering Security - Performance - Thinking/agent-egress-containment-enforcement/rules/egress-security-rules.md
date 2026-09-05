# Egress Security Rules

1. Agent runtimes **MUST** use default-deny outbound policy unless a documented, approved research exception requires otherwise.
2. Allowed destinations **MUST** be derived from the task's required external dependencies.
3. Wildcard destinations such as `*`, `0.0.0.0/0`, or `::/0` **MUST NOT** be accepted as ordinary production/evaluation policy.
4. Hostname validation **MUST** reject control characters, embedded nulls, malformed labels, and ambiguous encodings before policy matching.
5. The address actually dialed **MUST** remain inside the destination scope authorized for the canonical hostname.
6. DNS, proxy, firewall, and application-layer rules **MUST** enforce consistent destination semantics.
7. Monitoring **MUST NOT** be treated as a substitute for pre-action authorization.
8. External writes, account creation, package publication, credential use, destructive requests, or production changes **MUST** require explicit human approval unless a dedicated isolated test system owns the side effect.
9. Credentials **MUST NOT** be embedded in egress-policy artifacts.
10. Network-capable subprocesses and alternate protocols **MUST** be included in the same containment boundary.
11. A run **MUST** stop when effective egress state is unknown or differs from declared policy.
12. The implementing engineer/agent **MUST NOT** be the sole verifier after a high-risk containment change.
13. Exceptions **MUST** have owner, rationale, scope, expiry, and review evidence.
14. Security controls **MUST NOT** be weakened to improve benchmark completion, latency, or agent convenience.