# AI Step Design and Guardrails

## Purpose
Use AI inside an automation workflow only where probabilistic reasoning adds value, while bounding outputs with contracts, validation, permissions, and fallback behavior.

## When to use
Use for classification, extraction, summarization, drafting, semantic routing, or bounded decision support. Do not use AI where a deterministic rule is simpler, safer, and maintainable.

## Inputs
Task definition, model options, input data, output schema, quality criteria, risk level, cost/latency budget, and fallback path.

## Context to inspect
Inspect representative inputs, edge cases, prompt templates, model configuration, downstream side effects, evaluation data, privacy restrictions, and current deterministic alternatives.

## Core knowledge
AI output is untrusted data. Reliability comes from narrowing the task, providing sufficient context, requiring structured output, validating semantics, measuring quality, and preventing direct high-impact action without controls.

## Procedure
1. Define the AI task and measurable acceptance criteria.
2. Confirm AI is justified over deterministic logic.
3. Minimize and sanitize input context.
4. Define an explicit output schema and allowed values.
5. Create prompt instructions that separate data from instructions.
6. Validate syntax and business semantics after generation.
7. Define confidence or quality gates using task-appropriate evidence.
8. Route uncertain/high-risk cases to fallback or human review.
9. Restrict tools and downstream permissions to minimum required scope.
10. Add timeout, retry, and provider-failure behavior.
11. Build an evaluation set covering normal and adversarial cases.
12. Monitor quality, drift, cost, latency, and escalation rate.

## Decision points
Prefer smaller/cheaper models when quality is adequate. Use human review when errors are costly. Avoid model self-confidence as the sole quality signal.

## Common failure patterns
Free-form output parsed with fragile regex, prompt injection through retrieved/user data, autonomous irreversible actions, no evaluation set, leaking sensitive data, and retrying bad prompts indefinitely.

## Verification
Run offline evaluations plus adversarial and malformed-input tests; verify schema enforcement and downstream permissions independently from apparent output quality.

## Expected output
A bounded AI workflow step with task definition, prompt, schema, validation, fallback, evaluation, permissions, and monitoring.

## Stop conditions
Stop when quality cannot be measured, required data use is not authorized, or the proposed AI output would directly drive unacceptable irreversible actions without independent control.