# Cloud Incident Response Rules

## Purpose
Investigate and contain cloud incidents with awareness of ephemeral resources, control planes, and identity-driven access.

## Scope
Cloud accounts, subscriptions, projects, workloads, storage, IAM, APIs, serverless services, and control-plane activity.

## MUST
- Investigations MUST capture control-plane logs, identity context, affected resources, regions, and relevant configuration state.
- Ephemeral resources MUST be preserved or snapshotted when their state is material to the investigation.
- Containment MUST consider access keys, roles, federation, automation identities, and cross-account trust.
- High-impact cloud changes MUST use approved emergency procedures and preserve rollback information.

## MUST NOT
- MUST NOT delete resources solely to stop suspicious activity when isolation or permission restriction provides safer containment.
- MUST NOT assume workload compromise is limited to one instance when shared identity or control-plane credentials are exposed.

## SHOULD
- Response SHOULD correlate cloud-native telemetry with endpoint and identity evidence.

## Exceptions
Destructive actions require documented urgency, impact analysis, and accountable approval unless explicitly pre-authorized.

## Verification
Review audit logs, snapshots, IAM changes, network controls, containment validation, and recovery evidence.