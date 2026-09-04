# Rules — Sandbox Boundary Security

1. Untrusted/model-generated code **MUST NOT** receive live host functions, constructors, prototypes, class instances, Error objects, accessors, symbols, native handles, or language-bridge objects.
2. Values crossing from host to sandbox **MUST** be reduced to primitives, arrays, and plain data objects whose complete reachable graph is serializable and capability-free.
3. Boundary validation **MUST** cover both successful tool results and exceptional/error paths.
4. Unknown or unclassified boundary values **MUST** fail closed.
5. The runtime **MUST NOT** rely on AST validation alone as proof of sandbox isolation.
6. Security-sensitive execution **MUST NOT** share production secrets with the sandbox process unless the risk is explicitly accepted by a human security owner.
7. General model-controlled code with filesystem/network impact **SHOULD** execute in a separate process/container/VM with least privilege, restricted network egress, and minimal mounts.
8. An upgrade to sandbox, schema, proxy, VM, tool-discovery, or language-bridge dependencies **MUST** trigger boundary regression tests before release.
9. Host-side exceptions **MUST** be converted to inert data records before crossing the boundary; raw exception objects **MUST NOT** cross.
10. A passing membrane probe **MUST NOT** be described as proving an in-process sandbox cannot be escaped; verification is limited to tested capabilities and paths.
11. Any confirmed host-capability exposure **MUST** block completion until removed, isolated, or explicitly escalated for a safe shutdown/disable decision.
12. The implementing agent **MUST NOT** be the sole verifier for high-risk sandbox changes.
13. Automated remediation loops **MUST** be bounded to the configured maximum attempts.
14. Tests and evidence **MUST NOT** contain real credentials, customer data, or destructive exploit payloads.
