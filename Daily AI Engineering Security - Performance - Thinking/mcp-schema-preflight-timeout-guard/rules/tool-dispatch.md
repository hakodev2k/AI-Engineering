# Rules: MCP Tool Dispatch

- Every concrete MCP tool call **MUST** be schema-preflighted when a usable schema is available.
- Known schema violations **MUST NOT** be dispatched to the MCP server.
- Validation feedback **MUST** identify the failing argument path and constraint when possible.
- A generic/deferred tool bridge **MUST** resolve the concrete schema before dispatch; provider-visible generic schemas **MUST NOT** be treated as sufficient validation evidence.
- Deterministic invalid-input failures **MUST NOT** consume remote retry attempts unchanged.
- Identical invalid calls **MUST** have a bounded retry budget; default maximum is one repair attempt after the first rejection.
- Timeouts **MUST** be finite and **MUST** be measured from actual dispatch, not from preflight start.
- Timeout increases **MUST NOT** be used to mask known validation errors.
- Legitimate long-running operations **SHOULD** use progress reporting, async job handles, or tool-specific timeout policy rather than a global extreme timeout.
- Schema-unavailable or unsupported-schema states **MUST** be reported explicitly; the runtime **MUST NOT** claim that a call was validated when it was not.
- Preflight **MUST NOT** bypass existing authorization, human approval, middleware, hooks, sandbox, or audit controls.
- Performance improvement **MUST** be demonstrated using before/after latency, dispatch, and retry metrics.
- A regression test **MUST** prove that valid calls still dispatch and invalid fixtures do not.
