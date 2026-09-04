# Model Fallback Rules

## Purpose
Ensure model substitution preserves required capabilities, safety controls, and operational expectations instead of silently changing agent behavior.

## Scope
Applies to primary and fallback language, reasoning, embedding, multimodal, or specialized models used in agent workflows.

## MUST
- Every production fallback model MUST be evaluated for the capabilities required by the workflow, including structured output, tool use, context limits, safety constraints, and task quality where relevant.
- Routing criteria MUST define when fallback is allowed and when the workflow must fail closed.
- The model identity and relevant version or configuration MUST be recorded for each run.
- A fallback model MUST NOT receive broader tool authority, data access, or action scope than the primary model.
- Capability mismatches that can affect correctness or safety MUST produce an explicit controlled failure.
- High-risk workflow fallbacks MUST have regression evidence before production enablement.

## MUST NOT
- An unevaluated model MUST NOT be introduced automatically into consequential production workflows.
- Model providers or variants MUST NOT be treated as behaviorally equivalent without evidence.
- Fallback routing MUST NOT conceal materially lower confidence or missing capabilities when these affect the result.

## SHOULD
- Fallbacks SHOULD be tiered by task class, risk, latency, and cost rather than using one universal substitute.
- The system SHOULD expose fallback frequency and quality impact as operational metrics.

## Exceptions
Emergency fallback requires bounded scope, documented risk, enhanced monitoring, human approval for consequential workflows, and a defined removal or validation plan.

## Verification
Force fallback routes in staging, run the same reliability and task evaluation suites against each eligible model, inspect tool-call correctness, and compare safety and failure behavior with the primary path.