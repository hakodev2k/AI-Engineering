# Governance Requirements Traceability Rules

## Purpose
Make every material AI governance obligation traceable from source requirement to implemented control and verification evidence.

## Scope
Applies to policies, standards, contractual commitments, regulatory obligations, architecture requirements, risk treatments, and approval conditions.

## MUST
- Material governance requirements MUST be recorded in a traceable form with a source, owner, applicability rationale, control implementation, and verification method.
- High-risk system approvals MUST link approval conditions to specific implementation or operational controls.
- Requirement changes MUST trigger impact review for affected systems and controls.
- Conflicting requirements MUST be escalated and resolved explicitly; teams MUST NOT silently choose the easiest interpretation.
- Traceability MUST preserve version history so reviewers can determine which requirements applied at a given release.
- Control evidence MUST be attributable to the requirement it is intended to satisfy.

## MUST NOT
- MUST NOT rely on undocumented verbal interpretations for material obligations.
- MUST NOT mark a requirement satisfied merely because a policy exists; implementation and evidence MUST be inspected.
- MUST NOT reuse evidence across systems when the operating context makes that evidence non-equivalent.

## SHOULD
- Traceability SHOULD be automated where configuration, tests, or inventory metadata can prove compliance deterministically.
- Requirements SHOULD be written in observable terms rather than vague aspirational language.
- Shared controls SHOULD identify the systems and versions they cover.

## Exceptions
Exceptions MUST identify the requirement, authoritative owner, interpretation, residual risk, compensating controls, review date, and approval. Regulatory or contractual obligations MUST NOT be waived by engineering preference.

## Verification
Sample requirements end-to-end from source through control implementation and evidence. Inspect change history, approval conditions, test results, configuration, and operational records for gaps or stale mappings.