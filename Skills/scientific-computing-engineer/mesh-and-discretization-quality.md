# Mesh and Discretization Quality

## Purpose
Assess and improve spatial discretizations so numerical solutions are accurate, stable, and computationally efficient.

## When to use
Use for finite element, finite volume, finite difference, or mesh-based simulations; when convergence is poor; or when geometry changes.

## Inputs
Geometry, mesh, governing equations, polynomial/order choices, solution fields, error indicators, and accuracy goals.

## Context to inspect
Element quality, aspect ratios, skewness, boundary resolution, anisotropy, local gradients, singularities, and refinement history.

## Core knowledge
Mesh quality interacts with the discretization and physics. More elements do not guarantee better answers if elements are poorly shaped, critical layers are unresolved, or refinement is applied in irrelevant regions.

## Procedure
1. Identify physical length scales and expected high-gradient regions.
2. Inspect element quality metrics appropriate to the method.
3. Verify boundary and interface representation.
4. Check resolution near singularities, shocks, layers, or sources.
5. Run systematic refinement studies.
6. Compare uniform and targeted/adaptive refinement where supported.
7. Monitor error estimators and conserved quantities.
8. Evaluate compute and memory growth.
9. Document mesh-generation parameters and quality thresholds.
10. Preserve representative meshes for regression testing.

## Decision points
Use adaptive refinement when errors are localized; use higher-order discretization when solution smoothness and geometry quality support it.

## Common failure patterns
Refining without convergence analysis, relying on one generic quality metric, under-resolving boundaries, and comparing meshes with inconsistent physics settings.

## Verification
Demonstrate stable convergence of quantities of interest and confirm mesh changes no longer materially alter accepted outputs.

## Expected output
A mesh/discretization quality report with convergence evidence, thresholds, and recommended refinement strategy.

## Stop conditions
Stop when geometry or boundary-condition fidelity is insufficient to support meaningful convergence.