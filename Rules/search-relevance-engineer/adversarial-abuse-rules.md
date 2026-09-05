# Adversarial and Abuse Resistance Rules

## Purpose
Reduce ranking manipulation, spam amplification, and adversarial degradation of search quality.

## Scope
Applies to spam signals, content manipulation, query abuse, ranking attacks, and feedback gaming.

## MUST
- Search systems MUST define abuse cases relevant to their corpus and ranking signals.
- Signals derived from engagement or content metadata MUST be assessed for manipulation risk.
- High-impact anti-abuse changes MUST be evaluated for false positives against legitimate content.
- Repeated suspicious ranking shifts MUST be investigated with evidence from logs, signal distributions, and content samples.

## MUST NOT
- MUST NOT trust self-reported popularity, freshness, or authority signals without validation where manipulation is practical.
- MUST NOT suppress content solely from unverified anomaly scores when false positives can cause material harm.
- MUST NOT disable anti-abuse controls merely to improve short-term engagement metrics.

## SHOULD
- Use layered detection and bounded penalties rather than one brittle signal where feasible.

## Exceptions
Require documented threat model, evidence, impact, risk, and approval.

## Verification
Review abuse test sets, false-positive analysis, ranking traces, signal anomalies, and incident records.