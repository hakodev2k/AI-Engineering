# Cost and Latency Rules

## Purpose
Control prompt-induced cost and latency without sacrificing required correctness or safety.

## Scope
Token usage, model selection, retries, context size, tool calls, and response length.

## MUST
- Cost or latency optimizations MUST preserve required behavioral and safety contracts.
- Material optimization claims MUST be supported by before/after measurements on representative workloads.
- Retry policies MUST be bounded and account for duplicate cost and side effects.
- Context growth MUST be monitored where it can materially affect latency or spend.

## MUST NOT
- MUST NOT remove critical instructions, evidence, or validation solely to reduce token count.
- MUST NOT downgrade models based only on price if required quality or safety thresholds fail.
- MUST NOT use uncontrolled recursive prompting or retries.

## SHOULD
- Prompts SHOULD request the minimum sufficient output for the consuming workflow.
- Repeated stable context SHOULD be structured for caching when the platform supports it.

## Exceptions
Higher-cost or slower paths are acceptable when justified by higher-risk decisions, difficult inputs, or required quality.

## Verification
Compare benchmark runs, token and latency telemetry, retry counts, and quality regressions before approving optimizations.