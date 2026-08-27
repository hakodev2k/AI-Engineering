# Root-Cause Debugging

## Purpose
Resolve firmware defects from evidence rather than speculative changes.

## Scope
Crashes, hangs, corruption, timing defects, hardware interactions, and intermittent failures.

## MUST
- Investigation MUST preserve available evidence before destructive reset or reflash when practical.
- Reproduction conditions, firmware identity, hardware revision, and relevant configuration MUST be recorded.
- Hypotheses MUST be tested against observations rather than treated as conclusions.
- Broad corrective changes MUST be preceded by a bounded root-cause hypothesis supported by evidence.
- Fixes for severe defects MUST include regression verification and assessment of related failure modes.

## MUST NOT
- Debug instrumentation MUST NOT be assumed behavior-neutral on timing-sensitive defects.
- A disappearing symptom after unrelated changes MUST NOT be claimed as root-cause resolution without evidence.

## SHOULD
- Minimal reproductions and binary-search isolation SHOULD be used when effective.

## Exceptions
Emergency mitigation may precede full root cause when risk demands it, but follow-up investigation MUST be tracked.

## Verification
Review traces, dumps, logic-analyzer captures, reproductions, hypotheses, fix diff, and regression results.