# Guardrail Bypass Detection

## Purpose
Detect behavioral probing and circumvention patterns.

## When to use
Use in adversarial/high-volume production and abuse investigations.

## Inputs
Decision events, metadata, identities, rates, attack patterns, tools, privacy constraints.

## Context to inspect
Inspect repeated denials, scores, transformations, account behavior, tool sequences, outcomes.

## Core knowledge
Sequences reveal probing even when individual requests look benign; distinguish legitimate iteration with evidence.

## Procedure
1. Define threat-linked indicators.
2. Correlate permitted signals.
3. Detect boundary probing.
4. Monitor denied-to-allowed transitions.
5. Correlate tool/data attempts.
6. Score bounded sequences.
7. Apply graduated responses.
8. Preserve reasons.
9. Evaluate false positives.
10. Feed confirmed bypasses to red teams.

## Decision points
Increase restrictions proportionally to confidence/impact.

## Common failure patterns
Keyword blocking, permanent penalties, no sequence analysis, excessive tracking, outcome-free alerts.

## Verification
Replay attack and benign sequences.

## Expected output
Signals, thresholds, response ladder.

## Stop conditions
Escalate coordinated sensitive/privileged bypass.