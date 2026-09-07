# Severity and Risk Assessment Rules

## Purpose
Produce defensible vulnerability severity and risk conclusions based on evidence, context, and explicit assumptions.

## Scope
Applies to vulnerability triage, scoring, prioritization, remediation urgency, and communication of technical and business risk.

## MUST
- Severity MUST be based on demonstrated or well-bounded impact, required preconditions, attacker capability, reachable assets, and affected security properties.
- Standard scoring methods MUST use their defined semantics consistently when a formal score is reported.
- Environmental or business modifiers MUST be identified separately from base technical severity.
- Unverified assumptions that materially affect severity MUST be stated.
- The assessment MUST consider realistic exploit chains when each required link is evidenced or clearly identified as hypothetical.
- Active exploitation, exposed attack surface, weak compensating controls, and high-value affected data MUST be surfaced as prioritization factors when known.
- Severity changes after new evidence or remediation MUST be traceable to that evidence.

## MUST NOT
- MUST NOT inflate severity to increase attention or reduce it to simplify remediation.
- MUST NOT equate proof-of-concept availability with guaranteed exploitability in every environment.
- MUST NOT treat theoretical maximum impact as observed impact.
- MUST NOT hide uncertainty behind a precise numeric score.
- MUST NOT copy a third-party rating without checking whether its assumptions apply.

## SHOULD
- Use both technical severity and operational priority where one score would obscure important context.
- Document credible worst-case and likely-case outcomes for consequential findings.
- Compare risk against existing controls and actual deployment patterns.

## Exceptions
When evidence is incomplete, a provisional severity may be issued if clearly labeled, supported by known facts, and accompanied by the evidence needed to finalize it.

## Verification
Review scoring inputs, reproduction evidence, asset exposure, controls, assumptions, and affected data. A second reviewer should be able to derive a materially similar result from the documented facts.