# AI Data Exposure Response

## Purpose
Investigate and respond to sensitive-data exposure caused by AI prompts, outputs, retrieval, memory, logs, or tool execution.

## When to use
Use when confidential, personal, regulated, tenant-isolated, or otherwise protected data appears to have reached an unauthorized user, model context, external provider, log, or downstream system.

## Inputs
Exposed data type, affected principals and tenants, request/session history, retrieval sources, model/provider path, logs, tool destinations, retention settings, and access-control evidence.

## Preconditions
Data owners, security responders, and privacy/legal escalation paths are identifiable.

## Context to inspect
Inspect source authorization, retrieval filters, prompt assembly, output filtering, conversation memory, provider retention, telemetry stores, connectors, caches, and user-visible histories.

## Core knowledge
Exposure severity depends on data sensitivity, recipients, duration, persistence, exploitability, and scope. AI systems can duplicate data into multiple downstream stores, so containment must trace propagation rather than only remove the original output.

## Procedure
1. Confirm the data and whether disclosure exceeded authorization.
2. Classify sensitivity and affected subjects or tenants.
3. Identify the earliest exposure path and triggering condition.
4. Trace propagation through model context, logs, caches, tools, and external providers.
5. Stop ongoing disclosure using scoped controls.
6. Preserve required evidence while minimizing additional copies.
7. Remove or restrict retained exposed data where policy permits.
8. Identify all affected sessions and recipients.
9. Coordinate notification obligations with privacy/legal owners.
10. Fix the root authorization or data-flow defect.
11. Run regression tests against the same boundary.

## Decision points
Treat confirmed cross-tenant or regulated-data exposure as high severity. Do not delete evidence subject to legal hold. Provider deletion or retention actions must follow contractual and regulatory requirements.

## Common failure patterns
Deleting the visible response but ignoring logs, underestimating repeated exposure, assuming output filters fix retrieval authorization, and failing to identify affected tenants.

## Verification
Implemented means ongoing exposure is stopped. Verified means the original scenario no longer discloses data, propagation locations are addressed, and affected-scope evidence is documented.

## Expected output
Exposure timeline, data classification, affected scope, containment actions, remediation, notification decisions, and verification evidence.

## Stop conditions
Escalate when regulated or cross-tenant data is involved, required provider actions are unavailable, or notification obligations may apply.