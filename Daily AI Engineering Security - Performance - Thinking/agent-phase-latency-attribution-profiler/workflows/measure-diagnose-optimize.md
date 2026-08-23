# Workflow: Measure, Diagnose, Optimize

## Trigger
Latency SLO breach or proposed agent performance optimization.

## Goal
Reduce measured latency in the responsible phase without weakening security or correctness.

## Inputs
Equivalent workload definition, lifecycle phase trace, run metadata.

## Baseline
Prefer three or more runs; record model/runtime version, approval mode, cache/warmth, host, and relevant provider state.

## Stages
1. **Observe** — collect phase traces.
2. **Measure baseline** — validate and profile every run.
3. **Diagnose** — identify dominant phase and gap/variance.
4. **Form hypothesis** — specify mechanism and expected phase effect.
5. **Implement improvement** — change one mechanism.
6. **Measure again** — repeat comparable workload.
7. **Improved?** If no, re-evaluate once; if yes, verify.
8. **Verify** — independent verifier checks traces and guardrails.

## Responsible agent
Performance investigator owns measurement/hypothesis; implementer changes code/config; Performance Verifier independently validates.

## Tools
Profiler, runtime traces, benchmark runner, statistical summary.

## Outputs
Baseline profile, hypothesis, changed mechanism, after profile, verdict.

## Checkpoints
After baseline validation; before implementation; after measurement; before completion.

## Metrics
Wall p50/p95, target-phase p50/p95, gap ratio, retry share, approval wait, tool execution.

## Retry policy
One hypothesis re-evaluation after a failed optimization. Two instrumentation recollections maximum.

## Stop conditions
Invalid traces persist, workloads cannot be made comparable, or required security/correctness would be weakened.

## Failure path
Revert ineffective change where appropriate; retain evidence; classify unknown bottleneck rather than inventing a cause.

## Verification
Independent comparison of raw traces and profiler output.

## Definition of Done
Baseline captured, phase cause supported, change implemented, repeat measurement complete, target metric improves, no unacceptable regression, safety preserved, verification passes.