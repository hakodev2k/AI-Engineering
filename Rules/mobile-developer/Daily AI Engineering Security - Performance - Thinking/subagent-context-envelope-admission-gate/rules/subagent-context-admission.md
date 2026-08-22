# Rules: Subagent Context Admission

- The dispatcher MUST identify the model that will actually execute the subagent before calculating context capacity.
- The dispatcher MUST use that model's verified context limit; it MUST NOT substitute the coordinator/session model's limit.
- The complete envelope MUST include system instructions, tool schemas, inherited history, attachments, retrieval, required task context, user input, output reserve, and configured headroom.
- Required correctness, safety, authorization, and acceptance-criteria context MUST NOT be removed to make an envelope fit.
- Output reserve MUST NOT be lower than `minimum_output_reserve`.
- A dispatch MUST be blocked when the required-only envelope exceeds the effective budget and no approved larger-context route exists.
- Optional context MAY be removed only when it is explicitly classified optional and its removal is recorded.
- Duplicate history SHOULD be removed before optional tool schemas, attachments, or retrieval content.
- Tool schemas SHOULD be loaded lazily when the task does not require them at dispatch time.
- Unknown model limits MUST block dispatch when policy is fail-closed.
- A model reroute MUST recalculate the complete envelope; previous admission MUST NOT be reused across models.
- The implementation MUST report headroom or deficit in tokens and MUST distinguish measured values from estimates.
- An unchanged overflowing envelope MUST NOT be retried.
- A successful dispatch MUST retain evidence of the admission decision for regression analysis.
