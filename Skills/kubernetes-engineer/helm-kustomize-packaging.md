# Helm and Kustomize Packaging

## Purpose
Package and customize Kubernetes resources while keeping rendered configuration understandable, testable, and maintainable.

## When to use
Reusable deployments, multi-environment configuration, chart maintenance, or manifest duplication.

## Inputs
Base resources, variability, release lifecycle, consumers, and configuration constraints.

## Context to inspect
Charts, values, overlays, generated manifests, CRDs, hooks, dependencies, and upgrade history.

## Core knowledge
Abstraction should expose intentional variation, not every field. The rendered Kubernetes objects are the operational truth.

## Procedure
1. Identify stable resources and legitimate variation.
2. Choose Helm for packaging/templating or Kustomize for declarative overlays based on needs.
3. Keep defaults safe and minimal.
4. Validate schemas and required values.
5. Render manifests in CI.
6. Run API/policy validation on rendered output.
7. Test install, upgrade, rollback, and uninstall behavior.
8. Version breaking configuration changes explicitly.

## Decision points
Avoid combining tools unless each solves a distinct problem. Prefer simpler overlays when templating logic would obscure behavior.

## Common failure patterns
Values exposing every field, template programming, hidden hooks, mutable chart dependencies, and reviewing templates without rendered output.

## Verification
Golden/render tests and real upgrade tests produce expected resources without unintended diffs.

## Expected output
Reusable package with documented inputs and predictable rendered state.

## Stop conditions
Stop if abstraction requirements are unclear enough to create speculative configuration knobs.