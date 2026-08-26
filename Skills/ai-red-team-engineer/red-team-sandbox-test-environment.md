# Red-Team Sandbox and Test Environment

## Purpose
Design isolated environments where adversarial AI testing can exercise realistic capabilities without harming production systems or third parties.

## When to use
Use before testing agents, code execution, messaging, infrastructure, payments, destructive tools, or sensitive-data paths.

## Inputs
System architecture, tool dependencies, network requirements, test data, credentials, side effects, and recovery requirements.

## Context to inspect
Inventory reachable networks, accounts, APIs, storage, queues, callbacks, secrets, billing, and production dependencies.

## Core knowledge
Safe red teaming requires containment, synthetic data, least-privilege test identities, egress controls, quotas, disposable resources, and complete auditability. A staging label alone does not guarantee isolation.

## Procedure
1. Enumerate every possible side effect.
2. Create dedicated test principals and synthetic tenants.
3. Replace external dependencies with sandboxes or controlled mocks where feasible.
4. Restrict network egress and resource scope.
5. Set hard quotas for cost, messages, compute, and retries.
6. Instrument all model, tool, and network actions.
7. Seed non-sensitive canaries for boundary tests.
8. Test emergency shutdown and cleanup.
9. Document allowed and prohibited actions.
10. Validate isolation before adversarial execution.

## Decision points
Use realistic external sandboxes when behavior depends on provider semantics; use mocks when real side effects add no security information.

## Common failure patterns
Staging credentials that access production; unrestricted egress; shared customer datasets; no kill switch; cleanup dependent on the tested agent itself.

## Verification
Demonstrate that test identities cannot reach production assets, quotas terminate runaway behavior, logs capture actions, and cleanup restores the environment.

## Expected output
A documented, reproducible red-team environment with explicit containment guarantees.

## Stop conditions
Do not begin active testing until critical isolation controls are verified; halt immediately on evidence of production reachability.