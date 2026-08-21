# Technical Lead Quality Scorecard

Use trends for system improvement, never as a simplistic individual ranking.

| Dimension | Signal | Desired direction |
|---|---|---|
| Flow | lead time | down without quality loss |
| Flow | review wait time | down |
| Quality | escaped defects | down |
| Release | failed deployment rate | down |
| Reliability | incident recurrence | down |
| Coordination | blocked dependency age | down |
| Rework | author-review loops | stable/low |
| Automation | manual recurring verification | down |

## Review cadence
Weekly for flow bottlenecks; after major incident/release for causal learning.

## Guardrail
Never optimize one metric by degrading verification, safety, or maintainability.