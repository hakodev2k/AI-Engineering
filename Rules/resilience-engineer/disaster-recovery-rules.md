# Disaster Recovery Rules

## Purpose
Ensure the organization can restore critical services after site, region, control-plane, or widespread dependency loss.

## Scope
Applies to disaster recovery architecture, alternate environments, restoration sequencing, recovery objectives, and exercises.

## MUST
- Critical services MUST have documented RTO and RPO targets with accountable business and technical ownership.
- Disaster recovery plans MUST identify dependencies, restoration order, credentials, data sources, network requirements, and decision authority.
- Recovery environments MUST be kept sufficiently compatible to execute the plan.
- DR exercises MUST validate actual restoration and critical transactions, not only procedural walkthroughs.
- Gaps against recovery objectives MUST be tracked as explicit risk.

## MUST NOT
- MUST NOT assume normal deployment automation remains available during a control-plane or identity disaster.
- MUST NOT depend on documentation, credentials, or tooling stored only inside the failed environment.
- MUST NOT claim an RTO/RPO that has no credible test or engineering evidence.

## SHOULD
- Exercises SHOULD include loss of a dependency normally assumed available.
- Plans SHOULD minimize manual steps that are difficult to execute under pressure.

## Exceptions
Lower-tier systems may use simplified recovery plans when business impact is documented and accepted.

## Verification
Inspect recovery plans, dependency inventories, access paths, exercise results, measured RTO/RPO, unresolved gaps, and evidence that responders can reach required tooling during simulated primary-environment loss.