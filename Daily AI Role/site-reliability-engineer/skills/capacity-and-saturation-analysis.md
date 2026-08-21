# Skill: Capacity and Saturation Analysis

## Purpose
Prevent reliability failures caused by exhausted finite resources or untested scaling assumptions.

## Inputs
Traffic history/forecast, concurrency, latency, CPU/memory, DB/queue/storage metrics, quotas, connection pools, autoscaling policy, cost constraints.

## Procedure
1. Identify the resource that limits each critical path.
2. Separate demand, utilization, saturation, and user-visible latency/error symptoms.
3. Determine peak, sustained peak, growth rate, and seasonality.
4. Compute headroom against safe operating limits, not theoretical maximums.
5. Test bottleneck assumptions using load or production evidence.
6. Examine scaling lag, cold start, queue buildup, downstream quotas, and recovery after overload.
7. Recommend immediate guardrails and longer-term capacity changes.
8. Define leading indicators and thresholds tied to action.

## Decision Rules
- High utilization alone is not saturation; prove queuing/degradation.
- Scale the true bottleneck, not the most visible metric.
- Include downstream and shared-resource limits.

## Outputs
Capacity model, bottleneck evidence, headroom, forecast, mitigation plan, monitoring actions.

## Verification
Re-evaluate under representative load and confirm predicted bottleneck behavior.