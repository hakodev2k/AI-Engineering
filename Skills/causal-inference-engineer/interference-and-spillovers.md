# Interference and Spillovers

## Purpose
Handle settings where one unit's treatment affects another unit's outcome, violating standard no-interference assumptions.

## When to use
Use for networks, marketplaces, social products, epidemics, geographic policies, teams, classrooms, clusters, and shared-resource systems.

## Inputs
- Unit relationships or exposure network
- Treatment assignments
- Outcomes
- Cluster/geography/time metadata
- Candidate exposure mappings

## Context to inspect
Inspect peer connections, market equilibrium, shared infrastructure, treatment diffusion, geographic proximity, and whether treatment changes network structure.

## Core knowledge
SUTVA can fail under interference. Relevant estimands may include direct, indirect, total, and overall effects. Identification often requires cluster randomization, saturation designs, exposure mappings, or partial-interference assumptions.

## Procedure
1. Identify plausible pathways by which one unit affects another.
2. Define the interference structure and exposure mapping.
3. Decide whether partial interference, network interference, or equilibrium effects are plausible.
4. Redefine treatment to include own and neighbor exposure when necessary.
5. Choose design/estimator consistent with assignment mechanism.
6. Assess overlap across exposure states.
7. Estimate direct and spillover effects separately where identified.
8. Cluster or randomization-based inference at the assignment level.
9. Test alternate network/exposure definitions.
10. Evaluate whether interference changes the policy-relevant estimand.
11. Report unsupported exposure states explicitly.

## Decision points
Use cluster randomization when spillovers are mostly within clusters. Use saturation or two-stage randomization when both direct and indirect effects matter.

## Common failure patterns
- Treating connected units as independent
- Ignoring marketplace equilibrium
- Defining neighbors after seeing outcomes
- Wrong clustering level
- Reporting direct effects as total policy effects

## Verification
Verify exposure definitions, assignment probabilities, support, clustering, robustness to alternate network assumptions, and consistency with system-level outcomes.

## Expected output
Interference-aware estimands, exposure mapping, effect estimates, uncertainty, and operational interpretation.

## Stop conditions
Stop when relevant exposure relationships are unobserved or the assumed interference structure is too uncertain to support identification.