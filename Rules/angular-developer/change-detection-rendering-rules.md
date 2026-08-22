# Change Detection and Rendering Rules

## Purpose
Keep Angular rendering predictable and efficient by controlling state changes and template work.

## Scope
Change detection, OnPush-style behavior, signals, template expressions, lists, and DOM updates.

## MUST
- Keep template expressions free of expensive or side-effecting work.
- Preserve stable identity for repeated collections when DOM reuse matters.
- Measure rendering bottlenecks before introducing complex manual change-detection controls.
- Ensure state mutations are visible to the chosen reactive/change-detection model.

## MUST NOT
- Trigger network calls, state mutation, or nondeterministic behavior from template-evaluated functions.
- Use manual change detection as a blanket workaround for unclear state ownership.
- Claim rendering improvements without profiler or benchmark evidence for material changes.

## SHOULD
- Prefer immutable updates and fine-grained reactive derivation where they simplify rendering correctness.

## Exceptions
Manual detection control is acceptable for measured hotspots when lifecycle behavior and tests are documented.

## Verification
Use Angular/browser profiling, render-count diagnostics where appropriate, performance tests, and code review of template work.