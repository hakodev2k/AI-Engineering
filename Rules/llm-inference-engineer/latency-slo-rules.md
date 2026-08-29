# Latency SLO Rules

## Purpose
Protect user-facing responsiveness with explicit, measurable latency objectives.

## Scope
Applies to time to first token, inter-token latency, end-to-end latency, queue delay, and percentile-based service objectives.

## MUST
- Production services MUST define latency SLOs for relevant request classes.
- Time to first token and token-generation latency MUST be measured separately when both affect experience.
- SLO evaluation MUST use percentiles and representative workloads, not averages alone.
- Latency regressions MUST be attributed to queueing, preprocessing, model execution, networking, or downstream dependencies where possible.
- Changes affecting latency MUST include before-and-after measurements under comparable conditions.

## MUST NOT
- MUST NOT claim latency improvement using incomparable prompt lengths, generation lengths, batch policies, or hardware.
- MUST NOT hide SLO violations through metric aggregation.
- MUST NOT trade severe tail-latency degradation for median improvement without explicit review.

## SHOULD
- Latency budgets SHOULD be allocated across major serving stages.
- Alerts SHOULD focus on sustained user-impacting violations rather than noisy single-sample spikes.

## Exceptions
Temporary SLO exceptions require scope, duration, user impact, mitigation, and approval.

## Verification
Review dashboards, benchmark methodology, production traces, percentile distributions, and alert configuration.