# Evidence Retention Governance

## MUST
- Bind every evidence bundle to a concrete `task_id` and creation time.
- Keep a SHA-256 hash and retrievable storage reference for every evidence record.
- Preserve evidence required by `verified` and `blocked` claims at least as reference metadata.
- Re-evaluate retention after any claim, evidence, sensitivity, source, importance, or policy change.
- Treat source evidence retention separately from agent-context inclusion.
- Keep secret, credential, and personal-sensitive evidence out of agent context.
- Fail closed when mandatory evidence is stale and current verification depends on it.
- Preserve bundle and retention fingerprints across handoffs.
- Require an independent reviewer for critical evidence when policy requires it.
- Require explicit human approval before deleting source evidence, removing audit/security artifacts, purging production logs, or weakening retention policy.
- Use bounded retries: one transient tool retry, zero automatic validation retries, two rebudget cycles maximum.
- Distinguish `executed` from `verified` claims.

## MUST NOT
- Delete source artifacts merely to satisfy a context budget.
- Replace verification evidence with an untraceable natural-language summary.
- Reclassify sensitivity or importance downward solely to make the budget pass.
- Embed secret values, credentials, access tokens, private keys, or personal-sensitive payloads.
- Treat a stale hash/reference as current evidence.
- Let the implementation owner self-approve critical retention decisions when self-review is disabled.
- Remove failure/security evidence from the bundle because it is inconvenient or verbose.
- Retry semantic, security, policy, or permission failures as if they were transient.
- Silently increase permissions to fetch or delete evidence.
- Report success when the final retention gate is not `verified`.

## SHOULD
- Keep full content only when it materially improves current reasoning.
- Prefer summaries for medium-value evidence and reference-only metadata for low-value evidence.
- Keep repository-native artifacts in their authoritative location and store references instead of copies.
- Use immutable artifact URLs, commit SHAs, run IDs, or content-addressed references where available.
- Record facts separately from hypotheses and decisions.
- Refresh only the stale evidence needed for active claims rather than reloading unrelated context.
- Keep adapters for provider-specific storage outside the core policy and scripts.
