# Workflow: Optimization Validation

## Trigger
Proposed performance optimization.

## Goal
Prove useful improvement without unacceptable regression elsewhere.

## Stages
1. Define target metric, baseline, expected mechanism, guardrails, and workload.
2. Reject changes without a measurable hypothesis when optimization cost/risk is non-trivial.
3. Capture baseline under fixed protocol.
4. Apply candidate in isolated environment.
5. Execute repeated benchmark.
6. Compare latency distributions, throughput, errors, CPU, memory, I/O, and cost-relevant resource use.
7. Verification Agent repeats or audits the result.
8. Approve, revise, or reject with evidence.

## Human approval
Required if optimization changes correctness semantics, durability, security, safety controls, or production resource policy.

## Definition of done
Effect is reproducible, target improvement is met or rejected, guardrails pass, and residual trade-offs are documented.