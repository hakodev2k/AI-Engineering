# Engineering Rules

## MUST
- MUST measure baseline context tokens before claiming an optimization.
- MUST assign a stable `logical_key` to every suppressible host-generated context item.
- MUST include the first occurrence of a logical item.
- MUST include a logical item whenever its normalized content fingerprint changes.
- MUST include all events marked `always_include`.
- MUST treat unknown source types as non-deduplicable until explicitly classified.
- MUST keep user messages, current tool results, safety policy, authorization decisions, and active recovery errors out of automatic deduplication.
- MUST use deterministic fingerprints for enforcement decisions.
- MUST bound ledger retention and payload size.
- MUST record token savings separately from task-quality verification.
- MUST fail the verification gate if any required context is suppressed.
- MUST replay the same event stream for before/after token comparison.
- MUST use an actual provider token counter when available for production metrics; estimates must be labeled estimates.
- MUST preserve source and logical identity in decision telemetry.
- MUST avoid logging full suppressed content merely to prove it was suppressed.
- MUST cap remediation loops at two policy changes before human escalation.

## MUST NOT
- MUST NOT deduplicate based only on visual similarity or an LLM judgment in the default enforcement path.
- MUST NOT remove content solely because it is old if it remains the current required version.
- MUST NOT use `/compact`, `/clear`, restart, or prompt caching as evidence that repeated injection is fixed.
- MUST NOT silently drop changed versions of a rule, attachment, or reminder.
- MUST NOT deduplicate security controls to achieve a token target.
- MUST NOT count cache-read tokens as eliminated context-window usage.
- MUST NOT claim latency improvement without measurement.
- MUST NOT keep an unbounded fingerprint ledger.
- MUST NOT suppress a payload whose source cannot explain whether replay is safe.
- MUST NOT weaken quality or correctness thresholds to reach the token-reduction target.

## SHOULD
- SHOULD fix the largest repeat producer before introducing broad global policies.
- SHOULD prefer exact fingerprint deduplication over semantic deduplication.
- SHOULD expose per-source budgets and duplicate ratios.
- SHOULD emit a compact freshness/reference marker when the host requires visibility that a known item is still active.
- SHOULD invalidate the old active version when the same logical key changes.
- SHOULD benchmark p50/p95 admission latency.
- SHOULD evaluate representative long-running sessions rather than only synthetic short prompts.
- SHOULD retain enough decision metadata to reproduce why an event was included or suppressed without retaining unnecessary payload text.
- SHOULD run enforcement in observe-only mode before production activation when integrating into an existing agent host.
