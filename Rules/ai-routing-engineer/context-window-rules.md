# Context Window Rules

## Purpose
Prevent routing failures caused by context limits, truncation, and model-specific input constraints.

## Scope
Token estimation, context budgets, system prompts, tool schemas, retrieved content, output reserves, and truncation.

## MUST
- Routing MUST reserve sufficient context for required instructions, user input, tool definitions, retrieved data, and expected output.
- Token estimation MUST account for the actual target model or a conservative compatible approximation.
- Required safety or policy instructions MUST be protected from truncation.
- Overflow behavior MUST be explicit: reject, summarize, chunk, retrieve selectively, or route to a larger-context target.
- Context transformations MUST preserve provenance when content omission can affect correctness.

## MUST NOT
- MUST NOT silently drop high-priority instructions to fit a target model.
- MUST NOT route requests beyond verified model context limits.
- MUST NOT assume advertised maximum context is operationally appropriate for every latency or quality requirement.

## SHOULD
- Maintain output-token reserves based on task class.
- Measure context utilization and overflow frequency in production.

## Exceptions
Exceptions require documented risk and task-specific validation.

## Verification
Inspect token-budget tests, overflow cases, prompt snapshots, context telemetry, and model-limit configuration.