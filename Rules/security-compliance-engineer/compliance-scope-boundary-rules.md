# Compliance Scope Boundary Rules

## Purpose
Prevent false assurance caused by incomplete, ambiguous, or drifting compliance scope.

## Scope
Applies to systems, accounts, environments, data classes, business processes, vendors, regions, and organizational units subject to compliance requirements.

## MUST
- Scope MUST identify included systems, dependencies, data flows, environments, owners, and explicit exclusions.
- Scope changes MUST be assessed when architecture, data processing, vendors, regions, or business processes change.
- Material exclusions MUST include rationale and approval from accountable risk owners.
- Shared services that can affect in-scope controls MUST be evaluated for inherited or supporting-control obligations.

## MUST NOT
- Production dependencies MUST NOT be excluded merely because they are operated by another team or provider.
- Scope MUST NOT rely on undocumented tribal knowledge.
- A compliance boundary MUST NOT be narrowed solely to reduce audit effort.

## SHOULD
- Maintain diagrams and inventories that can be reconciled with deployed reality.
- Review scope on a defined cadence and before major audits or launches.

## Exceptions
Temporary scope assumptions require an owner, expiry date, risk statement, validation plan, and approval.

## Verification
Compare the declared boundary against asset inventories, cloud accounts, network/data-flow diagrams, vendor records, and production configuration.