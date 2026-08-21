# Rules: Prompt Cache and Token Budget

- Cache optimization MUST begin with a measured baseline for comparable request classes.
- Every profiled request MUST preserve provider-facing block order in its manifest.
- Correctness-required context MUST NOT be removed, truncated, summarized, or moved solely to increase cache hits unless task-quality regression is independently verified.
- Static-required content SHOULD precede volatile content when semantics and instruction hierarchy allow it.
- Dynamic user/task content MUST NOT be mislabeled as static to force a cache breakpoint.
- Explicit cache breakpoints MUST be placed only after a prefix shown to be stable across the configured minimum number of comparable requests.
- Cached-token ratio MUST be calculated from actual provider usage fields when available; estimated cache hits MUST NOT be reported as measured.
- Missing or incompatible usage metrics MUST be reported as an observability gap.
- Raw secrets, credentials, authorization headers, and sensitive payloads MUST NOT be written to manifests.
- Large inline files SHOULD be compared against stable file/reference forms when the provider supports them; the preferred form MUST be chosen by benchmark and correctness evidence.
- Provider/router migrations MUST trigger a fresh cache baseline because adapter behavior and usage reporting can differ.
- Optimization loops MUST be bounded to at most two unproductive structural hypotheses before re-diagnosis.
- A token optimization MUST NOT be marked Verified if quality regression exceeds `max_quality_regression_rate`.
- Completion MUST distinguish Implemented, Measured, and Verified.
