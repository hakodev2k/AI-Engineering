# Rules: Tool Context Budget

- Every optimization run MUST capture a baseline for schema/input tokens and startup/first-turn latency.
- Correctness-critical or explicitly required tools MUST NOT be deferred to meet a token target.
- Tool activation MUST be task-aware and MUST use an explicit budget.
- Static instructions, tool schemas, dynamic context and retrieved/tool output SHOULD be measured separately.
- Duplicate or irrelevant tool schemas SHOULD be deferred before compressing correctness-critical task context.
- Prompt caching MAY reduce repeated cost but MUST NOT be counted as context-window capacity savings.
- A budget change MUST be rejected if representative-task quality or critical-tool recall regresses beyond configured tolerance.
- Deferred tools MUST remain discoverable through a bounded fallback path when the runtime supports lazy activation.
- The same benchmark corpus MUST be used for before/after comparison.
- Token savings MUST NOT be reported as verified until quality and regression checks pass.
