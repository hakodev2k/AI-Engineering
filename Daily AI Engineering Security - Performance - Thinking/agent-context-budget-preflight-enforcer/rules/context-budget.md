# Context Budget Rules

- Every model request **MUST** be measured after dynamic context assembly and before invocation.
- The budget **MUST** reserve configured output tokens and a safety margin.
- System, security, current-user, authorization, and required-evidence context **MUST NOT** be removed merely to reduce token usage.
- Token reduction **MUST** use measured before/after counts.
- Reduction loops **MUST** be bounded by `max_reduction_cycles`.
- If safe reduction cannot fit the request, execution **MUST** block or use an explicit fallback such as task splitting, verified checkpoint continuation, or a larger supported context window.
- Unknown/invalid model context limits **MUST NOT** be replaced by a guessed production value.
- Tool schemas, retrieval, memory, history and tool outputs **MUST** be counted as separate observable components when present.
- Output reserve **MUST NOT** be consumed silently to make input fit.
- Low-value duplicate/reloadable context **SHOULD** be reduced before unique evidence or user-provided data.
- Quality **MUST** be regression-tested after introducing a new reducer.
- Performance improvement **MUST NOT** be claimed without comparable baseline measurements.