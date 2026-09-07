# Coordination and Escalation Rules

## Purpose
Ensure material security findings reach the right owners promptly and that research activity escalates when evidence indicates immediate operational, legal, privacy, or safety risk.

## Scope
Applies to coordination with engineering, security operations, incident response, product owners, legal/privacy stakeholders, vendors, and external researchers.

## MUST
- Critical or time-sensitive findings MUST be routed to an accountable owner using the established security or incident channel rather than left only in research notes.
- Evidence of active exploitation, credential compromise, uncontrolled data access, destructive behavior, or broad exposure MUST trigger prompt escalation under applicable incident procedures.
- Escalation MUST state what is observed, what remains uncertain, affected scope, immediate risks, and recommended containment without overstating confidence.
- The researcher MUST identify decision ownership when remediation, disclosure, production testing, or risk acceptance exceeds research authority.
- Material disagreements about severity or exploitability MUST preserve both the evidence and the disputed assumptions until resolved.
- Coordination involving third parties MUST respect disclosure agreements and authorized communication channels.
- Requests for additional risky testing MUST be evaluated against necessity, expected evidence value, blast radius, and approval requirements.
- Handoffs MUST include enough context that the receiving owner can act without reconstructing the entire investigation.

## MUST NOT
- MUST NOT delay escalation solely to obtain a more elegant proof when existing evidence indicates urgent risk.
- MUST NOT independently make legal, public-disclosure, production-change, or business risk-acceptance decisions outside assigned authority.
- MUST NOT conceal contradictory evidence from stakeholders deciding remediation priority.
- MUST NOT broadcast sensitive findings to audiences without a need to know.
- MUST NOT treat an automated alert or AI recommendation as authorization for a dangerous action.

## SHOULD
- Use explicit owners, deadlines, and next evidence required for unresolved high-risk findings.
- Keep coordination concise while linking to restricted technical evidence where necessary.
- Re-escalate when scope, exploitability, or active-threat evidence materially worsens.

## Exceptions
Normal routing may be bypassed during an urgent incident only according to approved emergency procedures and delegated authority; the alternate path and rationale must be documented afterward.

## Verification
Review timelines, escalation records, recipients, ownership decisions, incident links, and follow-up actions. Confirm urgent evidence was surfaced promptly and decisions outside the researcher's authority were made by an appropriate human owner.