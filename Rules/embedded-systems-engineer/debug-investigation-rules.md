# Debugging and Investigation Rules

## Purpose
Drive embedded failures to evidence-based root causes without introducing unsafe diagnostic changes.

## Scope
Intermittent faults, crashes, timing issues, hardware interactions, field failures, and regressions.

## MUST
- Establish reproduction conditions or bound the failure with collected evidence before broad corrective changes.
- Correlate firmware state with hardware signals, reset/fault records, timing, and environmental conditions when relevant.
- Preserve the original failure evidence before modifying the system materially.

## MUST NOT
- Declare root cause from correlation or intuition alone when contradictory evidence remains.
- Leave invasive debug instrumentation enabled in production without resource/security review.

## SHOULD
- Form falsifiable hypotheses and change one causal dimension at a time.

## Exceptions
Urgent mitigations may precede root cause when risk is documented and investigation continues.

## Verification
Require reproduction logs/traces, hypothesis results, regression test, and evidence that the fix addresses the identified failure mechanism.