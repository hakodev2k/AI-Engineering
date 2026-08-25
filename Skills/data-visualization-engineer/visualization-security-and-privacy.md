# Visualization Security and Privacy

## Purpose
Prevent dashboards and visual analytics from exposing unauthorized, sensitive, or inferable information.

## When to use
When visualizations contain personal, confidential, tenant-scoped, location, financial, health, or operationally sensitive data.

## Inputs
Data classification, authorization model, row/column policies, export requirements, aggregation thresholds, threat model.

## Core knowledge
UI hiding is not authorization. Security must be enforced at trusted data/service boundaries. Aggregates can leak information through small groups, differencing, drill-down, exports, URLs, caches, and tooltips.

## Procedure
1. Classify displayed and derivable data.
2. Identify principals, tenants, roles, and allowed scopes.
3. Verify authorization is enforced before data reaches the client.
4. Review row, column, object, and export permissions.
5. Apply minimum-group, masking, rounding, or suppression rules where inference risk exists.
6. Prevent sensitive values from URLs, logs, telemetry, and client caches.
7. Review drill-through and crossfilter paths for scope escalation.
8. Validate share links and embedded contexts.
9. Test unauthorized and boundary identities.
10. Document residual privacy risk and approvals.

## Decision points
Prefer server-side enforcement over client filtering. Aggregate or suppress when exact detail is unnecessary for the decision.

## Common failure patterns
Client-only row filtering; export bypasses; cached cross-tenant data; sensitive tooltip fields; predictable share URLs; small-cell disclosure.

## Verification
Execute negative authorization tests, inspect network payloads and exports, and test inference-prone small cohorts.

## Expected output
A visualization security assessment plus enforced access and privacy controls with test evidence.

## Stop conditions
Stop and escalate on suspected cross-tenant exposure, policy conflict, or unclear authorization ownership.