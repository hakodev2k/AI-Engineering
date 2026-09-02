# Cloud Resource Lifecycle Rules

## Purpose
Prevent abandoned, duplicated, and permanently provisioned cloud resources from creating avoidable cost and environmental impact.

## Scope
Applies to compute, storage, databases, networking, snapshots, development environments, test environments, and managed services.

## MUST
- Persistent cloud resources MUST have an identifiable owner, purpose, environment, and lifecycle state.
- Temporary environments and resources MUST have automated expiry or explicit review controls where platform capabilities permit.
- Resource retirement MUST verify dependencies, data preservation requirements, rollback needs, and security implications.

## MUST NOT
- MUST NOT delete production resources, persistent data, snapshots, or recovery assets without explicit human approval and an approved change procedure.
- MUST NOT terminate resources solely because recent utilization is low when they provide standby, recovery, compliance, or scheduled capacity.
- MUST NOT leave experimental infrastructure indefinitely after its purpose ends.

## SHOULD
- Prefer infrastructure-as-code and inventory controls that make orphan detection deterministic.
- Periodically review unattached volumes, stale snapshots, inactive load balancers, obsolete environments, and unused reserved capacity.

## Exceptions
Exceptions require the resource owner, reason for retention, expected duration, risk, and next review date.

## Verification
Inspect cloud inventory, tags or metadata, billing records, infrastructure definitions, deletion protection, dependency maps, expiry controls, and change approvals.
