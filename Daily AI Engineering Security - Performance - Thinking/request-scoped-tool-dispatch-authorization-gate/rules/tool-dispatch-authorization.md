# Rules: Tool Dispatch Authorization

- The dispatcher **MUST** treat model output as untrusted input.
- The dispatcher **MUST** derive an immutable authorized tool set for the current request before model execution.
- A requested tool **MUST** be canonicalized exactly once before authorization and resolution.
- A requested tool **MUST NOT** be resolved or executed unless its canonical identity exists in the request's authorized set.
- Global registries **MUST NOT** be used as an authorization fallback.
- Subject, tenant, and privilege attributes **MUST** be checked deterministically for sensitive tools.
- Sensitive callbacks **SHOULD** repeat critical authorization checks as defense in depth.
- Human approval **MUST** be required for tools configured as approval-gated; approval **MUST** bind to the exact canonical tool and relevant arguments.
- Authorization failures **MUST** fail closed and emit a non-secret reason code.
- Logs **MUST NOT** contain credentials, secret-bearing arguments, or unrestricted tool outputs.
- Any change to resolver fallback, aliases, or dynamic registration **MUST** run negative forged-call tests.
- The implementing engineer/agent **MUST NOT** be the only verifier for high-risk dispatch changes.
- Security tests **MUST** prove that denied tool calls never reach callback code.
- Teams **SHOULD** minimize the process-wide registry when practical, but registry minimization **MUST NOT** replace dispatch authorization.
