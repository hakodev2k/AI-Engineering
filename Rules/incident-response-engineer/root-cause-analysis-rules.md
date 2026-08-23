# Root Cause Analysis Rules

## Purpose
Explain why an incident occurred and why defenses failed without reducing complex failures to unsupported narratives.

## Scope
Post-incident technical and socio-technical analysis.

## MUST
- Distinguish triggering events, contributing conditions, failed or missing controls, detection gaps, and impact amplifiers.
- Support causal claims with evidence and state uncertainty where evidence is incomplete.
- Ask why the system permitted the failure, not only which person or component acted last.
- Identify recurrence paths beyond the exact observed sequence.

## MUST NOT
- Stop analysis at human error, a single bad deploy, or the first visible component failure when enabling conditions remain unexplained.
- Claim a root cause merely because removing one factor would have prevented this instance.

## SHOULD
- Use causal graphs, fault trees, change analysis, or equivalent structured techniques for complex incidents.

## Exceptions
For low-impact incidents, analysis depth may be proportional to recurrence and risk, but material causal claims still require evidence.

## Verification
Review whether each causal statement maps to evidence and whether proposed actions address contributing mechanisms rather than symptoms alone.