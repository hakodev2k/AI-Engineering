# Migration and Governance Rules

## Purpose
Guide staged Zero Trust adoption so security gains are measurable, legacy risk is explicit, and migration does not create uncontrolled operational or access failures.

## Scope
Applies to Zero Trust transformation programs, legacy-system onboarding, control replacement, policy migration, identity modernization, segmentation rollout, and exception governance.

## MUST
- Migration planning MUST begin with an inventory of protected resources, identities, data flows, administrative paths, dependencies, existing controls, and known trust assumptions relevant to the scope.
- Each migration phase MUST define target controls, measurable acceptance criteria, affected users and systems, rollback or containment options, and accountable owners.
- Legacy systems that cannot meet target controls MUST have documented risk, compensating controls, migration disposition, and review date.
- High-impact control changes MUST be introduced through staged or otherwise bounded rollout when practical, with evidence from policy outcomes, availability, support impact, and security telemetry.
- Exceptions MUST be recorded with exact scope, rationale, risk, compensating controls, owner, approver, and expiration or mandatory review date.
- Migration decisions MUST distinguish architectural target state from temporary transitional controls.
- Governance MUST define who can approve access expansion, control weakening, production enforcement changes, and retirement of legacy protections.
- Completion claims MUST be supported by evidence that intended enforcement is active rather than by documentation or product deployment alone.

## MUST NOT
- A high-risk Zero Trust migration MUST NOT use an irreversible broad cutover without a tested recovery or rollback strategy when a staged alternative is feasible.
- Legacy trust assumptions MUST NOT remain undocumented merely because remediation is deferred.
- Temporary bypasses MUST NOT become permanent through missing ownership or expiration.
- Project milestones MUST NOT be measured only by technology deployment counts when effective access behavior can be measured.

## SHOULD
- Migration sequencing SHOULD prioritize high-value assets and trust relationships with high blast-radius or exposure.
- Baseline access, denial, latency, support, and incident metrics SHOULD be captured before material control changes so outcomes can be compared.
- Governance forums SHOULD review exception age, control coverage, policy drift, incidents, and unresolved architectural risk.
- Transitional architectures SHOULD minimize duplicate control paths that produce ambiguous authorization ownership.

## Exceptions
Exceptions require documented business need, alternatives considered, evidence, security and operational risk, compensating controls, accountable owner, review or expiry date, and approval proportional to impact.

## Verification
Review migration inventories, architecture decisions, rollout plans, acceptance evidence, exception registers, control-health dashboards, access outcomes, rollback tests, and governance records. Confirm completed phases enforce their stated target controls and that unresolved legacy gaps remain explicitly owned.