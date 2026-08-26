# Data Poisoning Investigation

## Purpose
Investigate suspected poisoning or integrity failures in ML training data without destroying evidence or prematurely retraining over the problem.

## When to use
Use after unexplained targeted errors, backdoor-like behavior, suspicious dataset mutations, provenance alerts, or compromised data suppliers.

## Inputs
Affected model versions, training snapshots, lineage, audit logs, sample metadata, prior baselines, and incident timeline.

## Preconditions
Preserve relevant artifacts and restrict further mutation. Coordinate with incident response for active compromise.

## Context to inspect
Inspect source changes, labeling activity, ingestion jobs, transformations, privileged identities, model diffs, and timing of behavioral regressions.

## Core knowledge
Poisoning may target availability, broad accuracy, a subgroup, or a trigger-conditioned behavior. Investigation requires correlation between suspicious samples, provenance, model behavior, and access evidence; anomalous data alone is not proof.

## Procedure
1. Freeze affected model and dataset versions.
2. Preserve logs, manifests, hashes, and suspect samples.
3. Define the observed behavior and earliest known affected model.
4. Diff training inputs against the last known-good snapshot.
5. Trace changed samples to sources and actors.
6. Analyze label, feature, duplicate, trigger, and distribution anomalies.
7. Train controlled comparisons excluding suspicious subsets when safe and feasible.
8. Test whether behavior tracks the suspected subset.
9. Determine compromise scope across derived datasets and models.
10. Remove or quarantine confirmed contamination through controlled lineage operations.
11. Rebuild from trusted inputs and rerun security/quality evaluations.
12. Add provenance and detection controls that address the root cause.

## Decision points
Prefer evidence preservation over immediate cleanup during an active investigation. Retrain only when the trusted reconstruction boundary is known. Treat unexplained correlation as a hypothesis, not attribution.

## Common failure patterns
Deleting suspect records before preservation; retraining from another contaminated derivative; focusing only on aggregate accuracy; assuming poisoning when pipeline bugs explain the regression; failing to identify all downstream models.

## Verification
Confirm trusted reconstruction hashes and lineage, reproduce the suspicious behavior on the affected model, demonstrate its removal on rebuilt models, and verify the unauthorized mutation path is closed.

## Expected output
An evidence-backed root-cause assessment, contamination scope, trusted recovery plan, and preventive controls.

## Stop conditions
Escalate when evidence suggests active unauthorized access, chain-of-custody requirements apply, trusted baseline data cannot be established, or remediation could affect regulated evidence.