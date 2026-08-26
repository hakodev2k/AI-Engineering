# Quality Threshold Rules
## Purpose
Make pass/fail criteria risk-based, explicit, and defensible.
## Scope
Error budgets, tolerances, severity bands, and acceptance gates.
## MUST
- Thresholds MUST derive from consumer impact, historical evidence, or contractual requirements.
- Critical thresholds MUST define action on breach and accountable owner.
- Threshold changes MUST be versioned and justified.
## MUST NOT
- MUST NOT loosen thresholds solely to make failing pipelines appear healthy.
- MUST NOT use one universal tolerance across materially different quality dimensions.
## SHOULD
- Thresholds SHOULD distinguish warning from release-blocking conditions.
## Exceptions
Emergency temporary thresholds require expiry, risk acceptance, and follow-up verification.
## Verification
Inspect threshold history, supporting evidence, breach behavior, and approvals.