# Product Lifecycle and Deprecation

## Purpose
Manage mature, declining, replaced, or harmful product capabilities through investment changes, migration, deprecation, and retirement with controlled customer impact.

## When to use
Use for legacy features, old APIs, duplicated products, unsupported platforms, expensive low-value capabilities, and strategic portfolio simplification.

## Inputs
Usage, revenue, support burden, maintenance cost, dependencies, customer contracts, replacement options, security risk, and migration complexity.

## Context to inspect
Inspect high-value customers, hidden integrations, data export needs, compatibility, contractual notice, support processes, and operational ownership.

## Core knowledge
Usage alone does not equal value, and low usage does not make retirement safe. Lifecycle decisions should include opportunity cost, risk, customer dependency, and migration feasibility.

## Procedure
1. Establish why lifecycle change is being considered.
2. Measure usage, value, cost, risk, and dependency by segment.
3. Identify critical workflows and contractual constraints.
4. Evaluate maintain, invest, merge, replace, deprecate, or retire options.
5. Define migration paths and customer incentives.
6. Set notice periods, milestones, and support policy.
7. Instrument migration progress and blockers.
8. Communicate repeatedly through appropriate channels.
9. Enforce deprecation stages while handling justified exceptions explicitly.
10. Verify data, access, and operational cleanup after retirement.

## Decision points
Extend support when migration blockers create disproportionate customer harm; do not extend indefinitely without explicit cost and owner decisions.

## Common failure patterns
Retiring on aggregate usage only, surprise shutdowns, no migration tooling, permanent exceptions, and leaving backend cost after UI removal.

## Verification
Dependencies are inventoried, migration completion is measurable, contractual obligations are met, and retired assets are actually removed.

## Expected output
Lifecycle decision, migration and communication plan, milestones, exceptions, and retirement verification.

## Stop conditions
Escalate when contractual, regulatory, data-retention, or critical-customer obligations conflict with the proposed timeline.