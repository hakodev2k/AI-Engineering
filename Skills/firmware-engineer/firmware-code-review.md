# Firmware Code Review

## Purpose
Review firmware changes for correctness, timing, resource, hardware, security and maintainability risks.

## When to use
Use for pull requests, risky fixes, driver changes, concurrency changes and release-critical code.

## Inputs
Change set, requirements, architecture, tests, target constraints and issue context.

## Context to inspect
Callers, shared state, initialization, failure paths, build variants, hardware assumptions and generated/vendor boundaries.

## Core knowledge
Firmware review must consider behavior the diff does not show: interrupt context, memory placement, timing, power states and hardware lifecycle.

## Procedure
1. Understand intended behavior and risk.
2. Trace affected execution contexts.
3. Check ownership, bounds and lifetimes.
4. Review hardware and timing assumptions.
5. Inspect error and recovery paths.
6. Assess flash/RAM/performance impact.
7. Check security-sensitive boundaries.
8. Evaluate tests against realistic failures.
9. Request evidence for nonobvious claims.
10. Separate blocking correctness issues from optional improvements.

## Decision points
Demand stronger evidence as blast radius, irreversibility or field impact increases.

## Common failure patterns
Diff-only review, style fixation, missing interrupt interactions, accepting unmeasured performance claims, overlooking variant-specific behavior and approving without tests.

## Verification
Confirm requested changes and evidence are present, CI is green and target validation matches risk.

## Expected output
Specific, prioritized review findings grounded in system behavior.

## Stop conditions
Do not approve when critical requirements, target evidence or ownership of a high-risk assumption is unresolved.