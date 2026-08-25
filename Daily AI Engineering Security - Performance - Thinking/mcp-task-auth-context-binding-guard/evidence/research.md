# Research

## Topic
Authorization-context binding for MCP Tasks

## Category
Security

## Problem
MCP tasks survive the initiating request and expose management/result operations. Without an explicit owner binding, possession of a task ID can accidentally become sufficient authorization.

## Why it matters now
The 2026-07-28 MCP release moved Tasks into `io.modelcontextprotocol/tasks`. SDK and conformance work is actively landing in July–August 2026, so task authorization decisions are being implemented now.

## Affected users
MCP server authors, gateways, multi-tenant agent platforms, SDK maintainers, enterprise security teams, and developers exposing long-running tools.

## Current public evidence
### Observed evidence
1. SEP-2663 states that servers MUST authenticate and authorize each task-related request. It also explains the structural problem created by protocol session removal: authorization-context binding is implementation-defined, and if it cannot be performed, task IDs may be the only defense; `tasks/list` was removed partly to reduce cross-caller leakage. https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/seps/2663-tasks-extension.md
2. The MCP 2026-07-28 GA post confirms Tasks moved to an extension with poll-based `tasks/get` and `tasks/update`, making long-lived task state part of the current protocol surface. https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/blog/content/posts/2026-07-28-spec-ga/index.md
3. Python SDK issue #3226, opened 2026-07-30, documents active client-side implementation of the new extension, including transparent polling and server-directed task creation. https://github.com/modelcontextprotocol/python-sdk/issues/3226
4. TypeScript SDK issue #2598, opened 2026-08-01, shows current v2 servers implementing `tasks/get` and `tasks/cancel`, confirming these management endpoints are live integration surfaces rather than theoretical protocol text. https://github.com/modelcontextprotocol/typescript-sdk/issues/2598

## Interpretation
The protocol correctly mandates auth checks but cannot provide a universal caller scope after session removal. That leaves a reusable host-side enforcement gap: authorization must be carried into durable task state and revalidated on every later task operation.

## Existing approaches
- cryptographically random task IDs;
- normal OAuth/bearer authentication on HTTP requests;
- bespoke per-server task stores and ACLs;
- rate limiting and TTLs;
- omitting unsafe list operations.

## Remaining limitations
- Random task IDs are bearer capabilities if no separate binding exists.
- Request authentication alone proves who is calling now, not whether that caller owns the old task.
- Multi-tenant deployments need tenant/resource scoping in addition to subject identity.
- Persisting raw tokens with tasks creates credential-retention risk.
- Frameworks cannot infer application ownership semantics automatically.

## Root-cause analysis
1. Long-lived task state outlives the initiating RPC.
2. Protocol-level sessions were removed, eliminating a natural but imperfect scope.
3. Ownership semantics belong to the host application and are deliberately not standardized.
4. Capability-style IDs are convenient and can be mistaken for authorization.
5. Auth context is often transient unless explicitly persisted as a safe binding.

## Improvement opportunity
Create a deterministic ownership-binding layer that stores a keyed fingerprint of normalized host authorization context at task creation and checks it before every task operation. Keep task IDs high-entropy, but treat them as identifiers/secrets, not sole authorization.

## Proposed solution
The package supplies a no-dependency reference binding implementation, enforceable policy, pre-access hook, threat-analysis skill, bounded workflow, independent verifier, and tests.

## Goal
Block cross-principal and task-ID-only access without persisting raw credentials.

## Metrics
Missing-binding rate, cross-principal denial tests, unauthorized attempts, protected endpoint coverage, task-ID-only access count.

## Trigger
Task creation or any task get/cancel/update/result access.

## Inputs
Task ID and host-authenticated normalized principal/resource context.

## Outputs
Allow/deny decision and non-secret audit evidence.

## Relevant sources
- https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/seps/2663-tasks-extension.md
- https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/blog/content/posts/2026-07-28-spec-ga/index.md
- https://github.com/modelcontextprotocol/python-sdk/issues/3226
- https://github.com/modelcontextprotocol/typescript-sdk/issues/2598
