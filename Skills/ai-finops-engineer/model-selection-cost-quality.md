# Model Selection Cost-Quality Trade-offs

## Purpose
Evaluate model choices using quality-adjusted economics so teams do not select models solely by benchmark score or unit price.

## When to use
Use when choosing between model sizes, providers, open-weight models, fine-tuned variants, or routing tiers.

## Inputs
- Task-specific evaluation results
- Latency and reliability metrics
- Token/request volumes
- Provider or infrastructure costs
- Operational support costs
- Business success criteria

## Context to inspect
Inspect task segments, prompt lengths, output lengths, fallback rates, model hosting requirements, licensing, hardware needs, and expected traffic growth.

## Core knowledge
The cheapest model per token may be more expensive per successful task if quality is poor; the strongest model may waste spend on easy traffic. Senior analysis compares cost at the outcome level and recognizes model heterogeneity across task segments.

## Procedure
1. Define task-level quality and success thresholds.
2. Collect representative evaluation data for candidate models.
3. Measure latency, error, retry, and fallback behavior.
4. Calculate direct and operational cost per successful task.
5. Segment results by task complexity or traffic class.
6. Identify quality plateaus where more expensive models add little value.
7. Evaluate routing or cascade strategies where appropriate.
8. Model traffic growth and price uncertainty.
9. Pilot the preferred configuration on controlled traffic.
10. Verify quality, latency, and cost simultaneously.
11. Document exceptions requiring premium models.

## Decision points
Choose a smaller model when quality remains above the task threshold. Use routing when task difficulty is predictable enough to justify complexity. Self-host only when volume and operational capability support the economics.

## Common failure patterns
Using generic benchmarks instead of production tasks, ignoring retries and fallbacks, comparing list prices without volume discounts, and optimizing cost at the expense of customer outcomes.

## Verification
Confirm task success, p95 latency, error rate, and cost per successful task against the baseline using representative production traffic.

## Expected output
A model economics comparison with task-specific evidence, recommended routing/selection policy, and quantified savings.

## Stop conditions
Stop if candidate models lack comparable evaluations, licensing terms are unresolved, or quality regressions cannot be measured safely.