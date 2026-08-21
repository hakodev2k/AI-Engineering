# Workflow: Profile, Optimize, Verify Prompt Cache

## Trigger
Cached-token ratio is unexpectedly low or a prompt/tool/file/provider change may affect cache reuse.

## Goal
Increase reusable-prefix/cache efficiency while preserving correctness-required context and output quality.

## Inputs
Sanitized ordered request manifests, provider/model/adapter identity, usage metrics, latency/cost if available, policy, and fixed quality evaluation cases.

## Baseline
Capture at least `minimum_comparable_requests` for each request class. Record input tokens, cached tokens, cached-token ratio, latency, cost if known, output tokens, and quality score/regression.

## Context
Profile the effective request structure sent toward the provider. If an adapter hides the final payload, record that boundary explicitly.

## Stages
1. **Observe** — collect comparable request manifests and usage.
2. **Measure baseline** — calculate cache ratios and stable-prefix length.
3. **Diagnose** — run `scripts/cache_prefix_profiler.py` to identify first changed blocks and early volatility.
4. **Form hypothesis** — choose one change: stabilize deterministic instructions/tool schemas, move legally reorderable volatile blocks later, use stable references for repeated large payloads, or place an explicit cache breakpoint after the stable required prefix.
5. **Implement** — make one structural change at a time.
6. **Measure again** — rerun the same benchmark corpus and request classes.
7. **Improved?** — require measurable improvement in cached-token ratio, input cost, or latency. If no, revert and try one alternative hypothesis only.
8. **Quality verification** — run fixed quality cases and output-size checks.
9. **Independent review** — `subagents/cache-verifier.md` validates metrics and correctness.

## Responsible agent
Context/token optimizer implements; Cache Optimization Verifier independently approves.

## Tools
`cache_prefix_profiler.py`, provider usage logs, benchmark harness, model/API client, and quality evaluator.

## Outputs
Before/after manifests, profiler report, benchmark metrics, chosen breakpoint/structure, quality results, and verifier status.

## Checkpoints
- Baseline exists before optimization.
- First divergent block is identified or observability gap is documented.
- Proposed breakpoint contains no known volatile block before its boundary unless required by semantics.
- Required context remains present.
- Post-change metrics and fixed quality results are captured.

## Metrics
Cached-token ratio, stable-prefix bytes, input tokens/task, output tokens/task, latency/task, cost/task, and quality regression rate.

## Retry policy
At most two structural hypotheses per run. Re-diagnose after both fail; never continue tuning indefinitely.

## Stop conditions
Verified improvement; two failed hypotheses; missing cache usage observability; or any correctness regression above policy.

## Failure path
Revert the structural change, preserve the baseline and failed-hypothesis evidence, then either test the second bounded hypothesis or stop for re-diagnosis.

## Verification
The same request classes and quality corpus must be used before and after. Any claimed cache improvement must be based on actual usage fields.

## Definition of Done
Implemented: profiler integrated and chosen structural/breakpoint change applied. Measured: before/after metrics captured. Verified: independent verifier confirms improvement and quality regression within policy.
