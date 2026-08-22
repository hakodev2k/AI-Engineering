# Engineering Rules

## MUST
- MUST measure the full enabled tool catalog before changing selection behavior.
- MUST treat tool-definition tokens as a separate budget from conversation/tool-result tokens.
- MUST preserve every explicitly pinned or workflow-required tool.
- MUST block promotion when required tools alone exceed the configured hard budget and escalate instead of silently dropping one.
- MUST record selector inputs, selected tool names, token estimate/exact count, selector version, and fallback round without recording secrets.
- MUST use bounded fallback: maximum rounds come from configuration and can never be unlimited.
- MUST verify required-tool recall on representative fixtures before production rollout.
- MUST compare task-quality or deterministic availability checks before claiming optimization success.
- MUST distinguish estimated tokens from provider-tokenizer measurements and billing data.
- MUST invalidate/rebuild selection indexes when tool name/description/schema materially changes.

## MUST NOT
- MUST NOT inject the entire catalog merely because retrieval confidence is low if doing so would violate the model/context hard limit.
- MUST NOT silently remove information required for correctness to achieve a token target.
- MUST NOT use model-generated hidden reasoning as the selector audit trail; store explicit query, scores, decisions, and verification status instead.
- MUST NOT trim parameter constraints, enum semantics, required fields, auth/safety descriptions, or destructive-action warnings from a schema solely to reduce tokens.
- MUST NOT claim lower cost or latency without measurement from the target runtime/provider.
- MUST NOT lower recall/quality thresholds after a failed regression merely to mark the optimization verified.

## SHOULD
- SHOULD keep a compact server/tool summary separate from promoted full schemas.
- SHOULD use a provider-native tool-search/deferred-loading feature when available and benchmark it against the deterministic baseline.
- SHOULD pin safety/control tools that must always remain callable.
- SHOULD prefer task-scoped selection rather than session-wide static enable/disable state.
- SHOULD monitor largest schemas and repeated description boilerplate for safe author-side simplification.
- SHOULD maintain separate benchmark slices for common, ambiguous, rare, and multi-tool tasks.
- SHOULD treat schema changes as cache/index version changes.
- SHOULD report p50/p95 selection latency when semantic retrieval services are introduced.

## Observable policy checks
A run is compliant only if its report can answer: full-catalog tokens, selected tokens, selected/total tools, pinned-tool presence, fallback count, benchmark recall, quality regression status, and whether exact or estimated tokenization was used.
