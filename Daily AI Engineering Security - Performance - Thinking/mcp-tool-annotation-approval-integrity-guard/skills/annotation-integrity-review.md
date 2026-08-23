# Skill: Annotation Integrity Review

## Purpose
Diagnose whether MCP tool annotations survive end-to-end into approval policy without unsafe reinterpretation.

## Trigger
Adapter upgrades, MCP SDK upgrades, trust-gate changes, approval regressions, or new server integrations.

## Inputs
Raw tools/list response, SDK-native object, approval context, policy decision log.

## Preconditions
Capture data without executing the tool.

## Procedure
1. Record raw annotations and tool identity.
2. Inspect the SDK-native representation and naming convention.
3. Run `scripts/annotation_guard.py` against a serialized fixture.
4. Compare raw, normalized, cached and approval-context values.
5. Mark dropped, coerced, contradictory and unknown fields.
6. Verify that unknown/malformed input fails closed.
7. Refresh tools/list and compare snapshots for drift.
8. Run regression tests.

## Decision points
A missing field is a transport defect if present upstream and absent downstream. A server-omitted field is unknown, not false. Any risk downgrade requires independent policy evidence.

## Expected output
Evidence table, canonical annotations, risk classification, failing boundary, and verification status.

## Metrics
Preservation rate and risk-downgrade count.

## Failure handling
Stop before tool execution if annotation loss changes approval outcome.

## Stop conditions
Complete when the exact failing boundary is known and tests reproduce it, or after two inspection passes with no divergence.