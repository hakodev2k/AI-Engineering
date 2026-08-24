# Bug Investigation Rules

## Purpose
Diagnose compiler defects with evidence and minimize risky speculative fixes.

## Scope
Crashes, miscompilations, wrong diagnostics, performance regressions, nondeterminism, and target defects.

## MUST
- Investigations MUST preserve compiler version, target, flags, input, and observed versus expected behavior.
- Miscompilations MUST be reduced to the responsible phase or bounded by evidence before broad corrective changes.
- Candidate fixes MUST explain the violated invariant or incorrect assumption.
- Regression tests MUST fail before the fix and pass after it when reproducible.

## MUST NOT
- MUST NOT classify user code as the cause solely because optimization changes the symptom.
- MUST NOT mask internal compiler errors by catching and ignoring unexpected failures.
- MUST NOT make unrelated transformations more conservative without measuring blast radius.

## SHOULD
- Bisection, phase disabling, IR snapshots, and differential compilers SHOULD be used to narrow defects.
- Reduced reproducers SHOULD preserve semantic trigger conditions.

## Exceptions
When root cause cannot be fully proven, mitigation requires bounded evidence, risk statement, and follow-up owner.

## Verification
Review reproducer, bisect evidence, phase traces, invariant failures, regression test, and post-fix differential results.