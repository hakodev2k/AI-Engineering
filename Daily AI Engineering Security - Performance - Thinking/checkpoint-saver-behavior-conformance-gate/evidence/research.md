# Research

## Topic
Checkpoint Saver Behavior Conformance Gate

## Category
Thinking

## Problem
Stateful agent frameworks can expose one checkpoint interface while different saver backends preserve, order, filter, or reconstruct state differently. A workflow may therefore reason correctly under in-memory or PostgreSQL storage but resume, route, replay, or debug differently under SQLite or async variants. These divergences are especially dangerous because the agent often treats loaded checkpoint state as authoritative evidence about what happened previously.

## Why it matters now
LangGraph issue #8701, opened 2026-08-24, proposes conformance coverage to ensure user-supplied checkpoint metadata survives write/read round trips across saver implementations. Issue #8550, opened 2026-08-06, reports SQLite delta history skipping parent checkpoints with non-monotonic IDs. Issue #7136, opened 2026-03-12, calls for sync/async saver ordering parity because replay/debug traces can differ purely by transport style. Together these independent signals show an unresolved behavioral-contract problem across persistence backends rather than a single application bug.

## Affected users
Teams using durable or resumable agents, developers switching between memory/SQLite/PostgreSQL savers, platforms running sync and async workers, and engineers relying on checkpoint metadata for routing, tracing, audit, recovery, or human-in-the-loop decisions.

## Current public evidence

### Observed evidence
1. LangGraph #8701: shared conformance tests do not yet fully verify nested user metadata round-trips across saver implementations.
2. LangGraph #8550: SQLite delta history can skip parent checkpoints when checkpoint IDs are non-monotonic; the report references related latest-checkpoint and PostgreSQL pagination behavior.
3. LangGraph #7136: sync and async saver paths can diverge in ordering/cursor behavior, motivating parity tests over equivalent fixtures.
4. LangGraph #7843, opened 2026-05-17, documents storage-model differences between SQLite and PostgreSQL around `new_versions`, reinforcing that backend parity needs explicit verification rather than assumption.

### Interpretation
The reasoning risk appears when an agent infers facts from persisted state: "this metadata survived," "this is the latest checkpoint," "these are the parents," or "sync and async replay are equivalent." If those assumptions are backend-dependent, the workflow can make unsupported decisions after resume even though each saver individually appears functional.

### Proposed solution
Add a reusable backend conformance harness and decision gate that evaluates the behavioral invariants the application actually depends on: metadata round-trip, latest selection, parent/history completeness, ordering/cursor parity, and sync/async equivalence. A backend is eligible for production resume only when the required invariant profile passes on representative fixtures.

## Existing approaches
- Framework-level saver interfaces and implementation-specific tests.
- Unit tests against one default backend.
- Manual migration smoke tests.
- Relying on documented checkpoint APIs and serializer compatibility.

## Remaining limitations
- Interface compatibility does not guarantee behavioral parity.
- A saver can pass basic put/get tests while dropping nested metadata or changing ordering.
- Application tests often cover only one backend.
- Async and sync implementations may have separate code paths.
- Production data can contain non-monotonic IDs, nested metadata, empty mappings, and pagination patterns absent from simple fixtures.

## Root-cause analysis
1. Persistence contracts are implicit and broader than method signatures.
2. Backend-specific query/storage implementations evolve independently.
3. Tests emphasize API shape and happy-path round trips rather than semantic parity.
4. Applications fail to declare which checkpoint invariants their reasoning depends on.
5. Resume logic trusts loaded state without attaching conformance evidence to the active backend/version.

## Improvement opportunity
Define an application-specific invariant profile, generate the same fixture corpus across each saver, normalize observations, compare results, and produce a machine-readable eligibility verdict. Tie resume/deployment to that verdict so a backend/version change cannot silently alter agent reasoning semantics.

## Goal
Make checkpoint-dependent reasoning reproducible across approved saver implementations and prevent resume on an unverified backend/version when required semantics differ.

## Metrics
- Required invariant pass rate, target 100%.
- Metadata round-trip fidelity, target 100% for declared JSON-compatible fields.
- Latest-checkpoint agreement across backends, target 100%.
- Parent/history completeness agreement, target 100%.
- Sync/async ordering agreement, target 100% where both paths exist.
- Backend-change regressions caught before production.

## Trigger
Use when adding/upgrading a saver, changing serializer/query logic, enabling resumable agents, migrating storage, or discovering replay/debug differences across environments.

## Inputs
Invariant profile, backend observations or adapter-produced snapshots, representative checkpoint fixtures, expected ordering/metadata, and backend/version identifiers.

## Outputs
Conformance report, failing invariants, backend eligibility verdict, evidence for remediation, and regression status.

## Relevant sources
- LangGraph issue #8701, 2026-08-24: https://github.com/langchain-ai/langgraph/issues/8701
- LangGraph issue #8550, 2026-08-06: https://github.com/langchain-ai/langgraph/issues/8550
- LangGraph issue #7136, 2026-03-12: https://github.com/langchain-ai/langgraph/issues/7136
- LangGraph issue #7843, 2026-05-17: https://github.com/langchain-ai/langgraph/issues/7843
