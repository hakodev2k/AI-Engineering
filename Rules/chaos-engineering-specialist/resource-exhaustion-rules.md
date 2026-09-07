# Resource Exhaustion Rules

## Purpose
Validate graceful behavior under CPU, memory, disk, connection, thread, queue, and quota pressure.

## Scope
Applies to experiments that intentionally constrain or saturate finite compute and service resources.

## MUST
- Resource experiments MUST define the constrained resource, saturation target, expected protection mechanism, and abort threshold.
- Tests MUST observe both the target and neighboring workloads for contention and noisy-neighbor effects.
- Queue growth, rejection, shedding, timeout, and recovery behavior MUST be measured where relevant.
- Disk-related experiments MUST account for data durability and cleanup risk.

## MUST NOT
- Resource pressure MUST NOT be increased without an upper safety bound.
- Memory or disk exhaustion MUST NOT be executed in production when it can cause uncontrolled corruption or node-wide impact without explicit approval.
- A recovered utilization graph MUST NOT alone prove backlog or state recovery.

## SHOULD
- Experiments SHOULD validate backpressure and load-shedding behavior before catastrophic exhaustion.
- Capacity thresholds SHOULD be derived from observed production characteristics where possible.

## Exceptions
High-saturation production tests require documented necessity, isolated scope, recovery proof, and explicit human approval.

## Verification
Inspect injector limits, saturation metrics, queue and rejection signals, neighboring workload impact, recovery state, and cleanup results.