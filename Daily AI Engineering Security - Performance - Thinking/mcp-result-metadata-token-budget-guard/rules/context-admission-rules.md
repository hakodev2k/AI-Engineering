# Context Admission Rules

- Systems MUST measure raw tool-result size and metadata size separately before optimizing.
- The canonical MCP response MUST be retained unchanged outside the model-context projection.
- Filters MUST NOT remove fields required for authorization, security decisions, request/result correlation, cache partitioning, pagination, continuation, task state, or correctness.
- Stable display-only metadata SHOULD be represented once or omitted from repeated model context after verification.
- Data-URI icons and equivalent binary/display payloads SHOULD NOT enter model context unless the task explicitly requires them.
- Optimization MUST report before/after tokens or bytes using the same capture.
- Token reduction MUST NOT be called successful if answer quality or tool correctness regresses beyond the defined acceptance threshold.
- Filtering rules MUST be explicit by path; blanket `_meta` deletion is prohibited.
- Unknown metadata MUST be preserved until its semantics are reviewed.