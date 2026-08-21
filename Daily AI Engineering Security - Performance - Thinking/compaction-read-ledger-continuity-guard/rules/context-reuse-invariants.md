# Rules: Context Reuse Invariants

- Every reusable tool/file payload **MUST** have a stable artifact identity and content/version hash before it is deduplicated.
- Compaction **MUST NOT** silently discard the ledger required to recognize unchanged artifacts already represented in session state.
- An unchanged artifact already captured in full **SHOULD** return a lightweight reference or targeted delta instead of reinjecting the full payload.
- Changed content **MUST** be treated as new evidence even when the artifact path is unchanged.
- Required context **MUST NOT** be removed merely to meet a token budget.
- Optimization **MUST** establish a token/latency baseline before changing context behavior.
- Optimization **MUST** measure tokens/task and replay-specific metrics after the change.
- A claimed token improvement **MUST NOT** be accepted when task-quality or correctness checks regress beyond configured tolerance.
- Provider cache-read metrics **MUST** be reported separately from logical duplicate-payload metrics.
- Full large outputs **SHOULD** be stored as searchable artifacts with bounded model-visible previews when complete inline content is not immediately required.
- Compaction summaries **SHOULD** identify artifacts whose content is represented so the runtime can rehydrate references without unnecessary rereads.
- Retry/optimization loops **MUST** be bounded; this package permits at most two distinct optimization hypotheses per investigation.
