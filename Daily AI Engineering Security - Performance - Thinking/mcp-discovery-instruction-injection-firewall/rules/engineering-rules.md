# Engineering Rules

## MUST

1. Treat every remote MCP `instructions` payload as untrusted unless the host has an explicit managed trust policy for that exact server identity.
2. Route remote instruction payloads through deterministic validation before model exposure.
3. Keep remote instructions out of system/developer instruction channels.
4. Attach source identity, trust class, payload hash, policy version, and taint state to every accepted instruction envelope.
5. Enforce hard byte/character limits before semantic processing.
6. Reject malformed Unicode, invalid encodings, and policy-prohibited control characters.
7. Require host-side authorization for sensitive tools after tainted content has entered the session.
8. Treat write, destructive, credential-bearing, external-egress, privilege-changing, repository-mutation, and production actions as sensitive unless policy explicitly says otherwise.
9. Fail closed if policy loading, trust lookup, or authorization cannot be completed.
10. Record allow/taint/block and approval decisions with structured reason codes.
11. Redact secrets and sensitive payload content from audit logs.
12. Revalidate cached instruction content when policy or validator version changes.
13. Partition caches by trust identity and tenant/session boundary when instruction caching is enabled.
14. Preserve the original source classification throughout downstream planning and tool execution.
15. Use an independent verifier for changes that alter security policy, trust configuration, or sensitive-tool classification.

## MUST NOT

1. Do not treat delimiters, XML tags, Markdown fences, or phrases such as “ignore these instructions” as security boundaries.
2. Do not allow model output to change trust class, disable taint, or self-approve a sensitive action.
3. Do not use server-provided annotations as proof that a tool or server is safe.
4. Do not place raw untrusted MCP instructions in a global/public cache by default.
5. Do not reuse cached instructions across tenants, server identities, or trust classes.
6. Do not log full remote instruction payloads when they may contain secrets or user data.
7. Do not silently truncate content and then treat the truncated result as trusted.
8. Do not weaken validation because a server previously behaved benignly.
9. Do not permit unlimited retries after a security block.
10. Do not let an untrusted instruction request additional permissions, credentials, network scope, secret access, or approval bypass.
11. Do not infer user approval from model-generated text.
12. Do not continue with sensitive tool execution when authorization state is missing or ambiguous.

## SHOULD

1. Maintain a small allowlist of managed first-party MCP servers with pinned identities where operationally feasible.
2. Prefer structural data from MCP discovery over free-form natural-language instructions.
3. Keep remote instruction envelopes short and only include content needed for the immediate task.
4. Store payload hashes and reason codes rather than raw content in normal audit events.
5. Use explicit reason-code enums so security metrics can be aggregated without LLM interpretation.
6. Test policy with benign and adversarial fixtures on every change.
7. Keep a reviewed sensitive-tool registry in source control.
8. Expire tainted discovery caches quickly and invalidate them when server identity or policy changes.
9. Surface the source of a sensitive request to the human approver.
10. Separate security-policy code from prompt templates so model changes do not alter enforcement.
11. Measure false positives and false negatives using reviewed regression cases.
12. Prefer deterministic normalization and matching before any optional model-based risk classifier.