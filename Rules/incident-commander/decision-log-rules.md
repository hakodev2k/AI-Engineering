# Decision Log Rules

## Purpose
Preserve an auditable record of material incident decisions and their evidence.

## Scope
Applies to mitigation choices, rollbacks, traffic shifts, data operations, security actions, vendor escalations, and severity changes.

## MUST
- Record every material decision with timestamp, decision owner, context, evidence, expected effect, and known risk.
- Record rejected high-impact alternatives when trade-offs materially shaped the response.
- Link decisions to telemetry, logs, traces, change records, or other evidence when available.
- Update the log when assumptions behind a decision are invalidated.

## MUST NOT
- Rewrite history to make earlier decisions appear more certain than they were.
- Treat undocumented verbal approval as sufficient for high-risk irreversible action.

## SHOULD
- Keep entries concise enough to support real-time use.
- Mark reversible and irreversible decisions distinctly.

## Exceptions
Low-impact tactical actions need not be individually logged unless they alter incident direction or risk.

## Verification
Inspect the incident timeline for decision timestamps, accountable owners, evidence references, risks, and later reversals or corrections.