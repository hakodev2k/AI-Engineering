# Findings Deduplication and Root Cause Analysis

## Purpose
Consolidate repeated security symptoms into accurate root causes so remediation effort addresses systemic weaknesses without hiding materially distinct risk.

## When to use
Use during triage and report preparation when similar findings appear across endpoints, assets, roles, or scanners.

## Inputs
Validated findings, affected assets, evidence, code/configuration context, ownership, and remediation boundaries.

## Context to inspect
Inspect shared middleware, libraries, policies, deployment templates, identity models, data flows, and whether affected instances have identical exploit prerequisites and fixes.

## Core knowledge
Deduplicate by root cause and remediation unit, not merely vulnerability name. Separate issues when exploitability, ownership, data sensitivity, or remediation differs materially.

## Procedure
1. Normalize candidate findings by security property violated.
2. Compare prerequisites and exploit mechanics.
3. Identify shared code/configuration/control boundaries.
4. Determine whether one remediation would fix all instances.
5. Group true duplicates and retain affected-instance inventory.
6. Split cases with distinct root causes or materially different risk.
7. Identify systemic patterns across otherwise separate findings.
8. Recalculate severity based on aggregate affected scope where justified.
9. Preserve evidence for representative and exceptional instances.
10. Recommend root-cause and preventive improvements.

## Decision points
Combine findings when one control defect and fix applies broadly; split when teams, controls, or attacker prerequisites differ enough to require independent decisions.

## Common failure patterns
One finding per scanner alert, over-grouping unrelated authorization bugs, losing affected asset detail, and recommending endpoint-by-endpoint patches for systemic controls.

## Verification
Grouped instances share a demonstrable root cause and remediation; exceptions remain visible and severity reflects actual aggregate exposure.

## Expected output
A clean finding set with root-cause groupings, affected instances, systemic themes, and actionable remediation boundaries.

## Stop conditions
Do not merge when evidence is insufficient to prove a common cause or when grouping would obscure a critical independently owned risk.