# Token and Cost Optimization

## Purpose
Reduce AI operating cost without sacrificing required quality or reliability.

## When to use
Use when token spend, request cost, or context growth becomes material.

## Inputs
Token logs, request distribution, model pricing, prompts, context payloads, cache opportunities, quality thresholds.

## Preconditions
Have baseline quality and cost measurements.

## Context to inspect
System prompts, history, retrieved context, output lengths, model mix, duplicate calls, retries, batching, caching.

## Core knowledge
Cost depends on model choice, input/output tokens, repeated context, retries, tool loops, retrieval size, and traffic distribution. Optimization must be measured against quality.

## Procedure
1. Attribute spend by feature, model, and request type.
2. Identify oversized prompts and repeated context.
3. Trim irrelevant history and retrieval context.
4. Move deterministic work out of the model.
5. Use smaller models where evaluations pass.
6. Cache safe repeated computations.
7. Bound outputs and agent steps.
8. Reduce avoidable retries and duplicate calls.
9. Re-measure cost and quality by traffic slice.
10. Set budgets and alerts for regressions.

## Decision points
Use model cascades when simple requests dominate. Cache only when freshness, privacy, and key design are safe.

## Common failure patterns
Optimizing token count before measuring spend, aggressive truncation that harms quality, caching sensitive outputs, and ignoring retries/tool loops.

## Verification
Compare cost per successful task, quality scores, latency, and error rates before and after.

## Expected output
Measured savings with preserved acceptance criteria and documented trade-offs.

## Stop conditions
Stop when quality cannot be measured or optimization would violate data/freshness constraints.