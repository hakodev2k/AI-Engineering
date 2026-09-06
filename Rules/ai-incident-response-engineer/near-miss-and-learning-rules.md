# Near-Miss and Learning Rules

## Purpose
Treat credible AI near misses as evidence about system risk before they become harmful incidents.

## Scope
Applies to prevented harmful outputs, blocked unsafe actions, caught data exposure, failed attack attempts, and latent reliability failures discovered before impact.

## MUST
- Near misses with credible severe potential MUST be recorded with the same factual discipline as incidents.
- Analysis MUST identify which control prevented impact and whether that control is reliable under broader conditions.
- Repeated near misses MUST be evaluated for systemic risk and control fatigue.
- High-value near-miss examples MUST be converted into tests, evaluations, detection logic, or runbook improvements when feasible.
- Lessons MUST distinguish demonstrated vulnerability from hypothetical possibility.
- Corrective work MUST be prioritized according to plausible impact and exploitability, not absence of realized harm.

## MUST NOT
- A successful last-line defense MUST NOT be treated as proof that upstream failures are acceptable.
- Near misses MUST NOT be suppressed to improve incident statistics.
- Harmful test artifacts MUST NOT be distributed beyond those who need them.

## SHOULD
- Trend near misses alongside incidents to identify weak controls earlier.
- Share sanitized cross-team lessons for common AI architecture patterns.

## Exceptions
Trivial events without credible impact may be handled through ordinary defect tracking, with rationale when classification is ambiguous.

## Verification
Review near-miss records, control analysis, resulting tests, detection changes, and recurrence trends.