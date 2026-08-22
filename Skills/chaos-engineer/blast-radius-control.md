# Blast Radius Control

## Purpose
Constrain fault injection so experiments produce useful evidence without exposing more users, data, or infrastructure than necessary.

## When to use
Use for every experiment, especially in shared or production environments.

## Inputs
Topology, tenancy model, traffic routing, fault mechanism, critical workflows, and rollback capabilities.

## Context to inspect
Identify isolation boundaries, replicas, regions, tenants, deployment rings, data partitions, and dependencies that may amplify impact.

## Core knowledge
Blast radius includes direct and cascading impact. Controls may use canaries, tenant allowlists, traffic percentages, single replicas, namespaces, regions, or bounded durations.

## Procedure
1. Enumerate possible direct and secondary effects.
2. Choose the smallest scope capable of testing the hypothesis.
3. Isolate test subjects where possible.
4. Set hard time and population limits.
5. Define abort thresholds and an independent kill path.
6. Verify dependency amplification cannot exceed intended scope.
7. Expand scope only after evidence from smaller experiments.

## Decision points
Prefer representative scope over large scope. If isolation cannot be guaranteed, move the experiment to a safer environment or redesign the injection method.

## Common failure patterns
Assuming a single instance means small impact, overlooking shared databases, injecting at region level first, relying on manual cleanup only, and failing to account for retries that amplify load.

## Verification
Prove scope controls before injection, monitor affected population during execution, and confirm no unintended resources or tenants were impacted.

## Expected output
Documented scope, safeguards, abort controls, and evidence that impact stayed bounded.

## Stop conditions
Stop when boundaries are uncertain, kill controls fail, or impact propagates outside approved scope.