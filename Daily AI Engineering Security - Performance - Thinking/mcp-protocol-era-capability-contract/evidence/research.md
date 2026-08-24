# Research

## Topic
MCP protocol-era capability mismatch in agent planning

## Category
Thinking

## Problem
Agents and orchestration layers can plan against configured or expected MCP features before knowing which protocol era and methods are actually available on the connected session.

## Why it matters now
The TypeScript SDK is actively migrating to v2 around the 2026-07-28 MCP revision while retaining legacy support. Negotiation, fallback and per-era codecs make effective capability a runtime fact rather than a static configuration assumption.

## Affected users
Agent-runtime authors, MCP client developers, platform teams supporting mixed-version servers, and users running long-lived workflows across legacy and modern MCP endpoints.

## Current public evidence

### Observed evidence
1. `modelcontextprotocol/typescript-sdk` issue #2619, opened 2026-08-06, reports that `versionNegotiation` can fail on a 2xx `server/discover` response with an empty/unparseable body instead of falling back to legacy `initialize`. https://github.com/modelcontextprotocol/typescript-sdk/issues/2619
2. Official v2 migration guidance documents `versionNegotiation: { mode: 'auto' }`, modern probing followed by legacy fallback, and the fact that pinning/configuration changes fallback behavior. https://github.com/modelcontextprotocol/typescript-sdk/blob/main/docs/migration/upgrade-to-v2.md
3. Official 2026-07-28 support documentation states that the wire layer uses distinct 2025-era and 2026-era codecs selected by the negotiated protocol version, which is connection state on the client/server instance. https://github.com/modelcontextprotocol/typescript-sdk/blob/main/docs/migration/support-2026-07-28.md
4. Current SDK issue #2657, opened 2026-08-13, reports loss/relocation of standard error-cause information in network error classification, making negotiation diagnostics harder to reason about reliably. https://github.com/modelcontextprotocol/typescript-sdk/issues/2657

## Existing approaches
- Configure `auto`, pinned or legacy negotiation modes.
- Inspect negotiated version/era after connection.
- Catch runtime method-not-supported or negotiation errors.
- Add ad-hoc fallback logic in clients.

## Remaining limitations
A configured mode does not prove the effective session era. Planning may occur before connection. Failure causes can be confused with evidence of fallback. A method error arrives after the planner has already spent model/tool work on an invalid path. Mixed transport types also have different probing costs and failure behavior.

## Root-cause analysis
1. Desired protocol mode and observed negotiated state are conflated.
2. Capability-dependent plan steps are not declared explicitly.
3. Connection/fallback evidence is not materialized into a stable planner input.
4. Runtime errors are used as capability discovery after execution has begun.
5. Recovery loops replan without a bounded, updated capability contract.

## Improvement opportunity
Introduce a post-connect capability contract: record effective protocol version/era and explicitly supported planner capabilities, then deterministically compare the planned requirements before any dependent tool call. Replan once from observed facts, not assumptions.

## Interpretation
The problem is planning reliability, not hidden reasoning. A small observable evidence contract can prevent unsupported conclusions and reduce rework while preserving the SDK's normal negotiation behavior.

## Proposed solution
Schema-backed session snapshots, enforceable evidence rules, an independent verifier, a bounded negotiate→plan→gate→replan workflow, and a dependency-free checker.

## Relevant sources
- https://github.com/modelcontextprotocol/typescript-sdk/issues/2619
- https://github.com/modelcontextprotocol/typescript-sdk/issues/2657
- https://github.com/modelcontextprotocol/typescript-sdk/blob/main/docs/migration/upgrade-to-v2.md
- https://github.com/modelcontextprotocol/typescript-sdk/blob/main/docs/migration/support-2026-07-28.md
