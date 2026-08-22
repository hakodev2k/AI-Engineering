# Optimization Decision Rules
## Purpose
Prioritize optimizations by measured impact, risk, and total cost.
## Scope
Code, architecture, database, infrastructure, and configuration optimizations.
## MUST
- Quantify the bottleneck and expected benefit before material optimization.
- Compare alternatives for impact, complexity, maintainability, cost, and operational risk.
- Re-measure after implementation using comparable conditions.
## MUST NOT
- Claim success without before/after evidence.
- Accept major complexity for negligible measured benefit without explicit rationale.
## SHOULD
- Prefer the simplest change that meets the target with acceptable risk.
## Exceptions
Preventive design may rely on capacity models when direct measurement is not yet possible.
## Verification
Inspect decision records, baseline, alternatives, implementation diff, and post-change measurements.