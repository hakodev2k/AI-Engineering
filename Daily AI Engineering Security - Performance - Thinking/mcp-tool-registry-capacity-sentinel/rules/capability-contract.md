# Rules: Agent Capability Contract

1. Every tool-dependent task **MUST** identify its task-critical capabilities before execution.
2. A connector's “connected” state **MUST NOT** be treated as proof that required tools are model-visible.
3. Required tools **MUST** be observed in the client-visible registry or loaded through a documented deferred-loading mechanism before the agent depends on them.
4. Registry truncation or filtering **MUST** produce a blocking diagnostic when it removes a required tool.
5. Platform capacity limits **SHOULD** be recorded explicitly when known.
6. Recovery loops **MUST** have a maximum of 2 attempts.
7. A workflow **MUST NOT** repeatedly refresh/reconnect indefinitely.
8. A required capability **MUST NOT** be deleted from the task contract merely to make validation pass.
9. Tool-count optimization **MUST NOT** weaken authentication, authorization, least privilege, or approval policy.
10. Dangerous tools **MUST NOT** be automatically enabled to increase coverage.
11. Before/after inventories and fingerprints **MUST** be retained as verification evidence.
12. Completion **MUST NOT** be claimed when required-tool coverage is below 100% unless the task is explicitly re-scoped by an authorized human.
13. The agent performing recovery **MUST NOT** be the sole verifier when missing tools could cause an irreversible action or false completion claim.