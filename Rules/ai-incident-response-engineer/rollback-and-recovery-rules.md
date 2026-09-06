# Rollback and Recovery Rules

## Purpose
Restore AI services safely to a known acceptable state after containment.

## Scope
Applies to model, prompt, policy, code, retrieval index, configuration, infrastructure, and dependency rollback or recovery.

## MUST
- Recovery MUST define the known-good target state and evidence that it was previously acceptable or newly validated.
- Rollback feasibility MUST be assessed before high-risk production changes whenever practical.
- Recovery MUST verify service health and AI-specific behavior, not only deployment success.
- Data or external side effects created during an incident MUST be reconciled separately from software rollback.
- Recovery steps MUST include stop conditions when harm, regression, or unexpected behavior reappears.
- Production restoration after a high-severity incident MUST have explicit incident-authority approval.

## MUST NOT
- Rollback MUST NOT be assumed to undo irreversible tool actions, data disclosures, or external side effects.
- Responders MUST NOT restore a known-vulnerable or known-unsafe state merely because it is operationally stable.
- Recovery MUST NOT be declared complete based only on green infrastructure status.

## SHOULD
- Use staged restoration and progressive traffic increases for material incidents.
- Keep recovery procedures automated and regularly tested where feasible.

## Exceptions
When rollback is impossible, forward remediation requires equivalent risk analysis, validation, and explicit approval.

## Verification
Inspect deployment history, configuration/version identifiers, recovery test results, behavioral metrics, side-effect reconciliation, and approval records.