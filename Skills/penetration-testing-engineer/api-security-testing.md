# API Security Testing

## Purpose
Evaluate REST, GraphQL, RPC, and other application APIs for authorization, validation, abuse, data exposure, and protocol-level security weaknesses.

## When to use
Use when APIs are in scope, including APIs consumed by web/mobile clients and partner integrations.

## Inputs
API endpoints, schemas/contracts, test identities, roles, sample traffic, rate policies, and business rules.

## Context to inspect
Inspect resources, operations, identifiers, scopes, pagination, filters, bulk actions, callbacks, uploads, error behavior, and asynchronous workflows.

## Core knowledge
API risk frequently centers on object/function authorization, excessive data exposure, unsafe mass assignment, resource consumption, and business-flow abuse. Client restrictions do not replace server controls.

## Procedure
1. Inventory operations and authentication requirements.
2. Build a role-to-operation/resource matrix.
3. Establish valid baseline requests.
4. Vary object identifiers and tenant boundaries.
5. Test function-level permissions and privileged fields.
6. Test schema/type/size validation and unexpected properties.
7. Evaluate rate, pagination, filtering, and resource-consumption controls safely.
8. Review webhook/callback trust where applicable.
9. Validate error and metadata exposure.
10. Reproduce findings with minimal data access and document server-side remediation.

## Decision points
Use contract-driven coverage when schemas are reliable; supplement with observed traffic when documentation is incomplete. Avoid high-volume rate testing unless specifically authorized.

## Common failure patterns
Testing only documented endpoints, relying on UI restrictions, missing tenant isolation, sending dangerous volume, assuming HTTP status alone proves authorization, and ignoring async side effects.

## Verification
Confirm each issue across controlled identities, demonstrate the exact violated boundary, and ensure the proof does not depend on accidental test state.

## Expected output
Validated API findings with operation, identity context, affected boundary, evidence, impact, and remediation guidance.

## Stop conditions
Stop when requests could create uncontrolled cost, destructive state, excessive load, or unauthorized third-party effects.