# ML Security Incident Response

## Purpose
Contain, investigate, eradicate, and recover from security incidents involving datasets, model artifacts, training infrastructure, registries, or inference services.

## When to use
Use for suspected poisoning, artifact tampering, credential compromise, model theft, unauthorized deployment, sensitive-output leakage, or compromised ML infrastructure.

## Inputs
Incident report, timelines, model/data versions, logs, IAM events, registry state, deployment metadata, backups, and threat model.

## Preconditions
Establish incident command, preserve evidence, and understand authorization for production changes.

## Context to inspect
Inspect identities, datasets, pipeline runs, artifacts, registry mutations, deployments, inference activity, external dependencies, and affected downstream consumers.

## Core knowledge
ML incidents can persist after infrastructure cleanup because contaminated data or artifacts may be reused. Recovery requires establishing a trusted reconstruction boundary across data, code, dependencies, model, and configuration.

## Procedure
1. Confirm incident scope and severity without over-attributing cause.
2. Preserve logs, artifacts, hashes, and snapshots.
3. Contain compromised identities and exposed endpoints while preserving essential evidence.
4. Identify earliest known-good data, code, and model states.
5. Trace lineage forward from suspected compromised inputs.
6. Determine affected models, deployments, and downstream decisions.
7. Eradicate unauthorized access and contaminated artifacts.
8. Rebuild from verified trusted inputs rather than merely restarting workloads.
9. Rotate relevant credentials and signing material.
10. Re-evaluate recovered models for security and quality.
11. Monitor for recurrence and attacker persistence.
12. Document root cause, control gaps, and follow-up owners.

## Decision points
Rollback quickly when known-good artifacts exist and business impact is high. Preserve forensic evidence before destructive cleanup. Notify privacy/legal stakeholders when data exposure may trigger obligations.

## Common failure patterns
Retraining from contaminated snapshots; deleting evidence; rotating only one credential in a shared trust chain; declaring recovery because service is available; overlooking cached models and edge deployments; no lineage-based blast-radius analysis.

## Verification
Confirm compromised access is revoked, deployed artifacts match trusted digests, affected derivatives are identified, security evaluations pass, and enhanced monitoring shows no recurrence.

## Expected output
A contained incident, evidence-backed scope, trusted recovery state, root-cause record, and remediation plan.

## Stop conditions
Escalate when legal/forensic preservation applies, active attacker access persists, trusted reconstruction is impossible, or production changes exceed incident authority.