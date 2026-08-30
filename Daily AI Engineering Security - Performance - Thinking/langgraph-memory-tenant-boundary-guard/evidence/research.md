# Research Evidence

## Topic
LangGraph Memory Tenant Boundary Guard

## Category
Security

## Problem
Agent persistence layers can expose one tenant's memory or checkpoint data to another tenant when application authorization depends on backend-specific query semantics. Recent LangGraph advisories show two separate mechanisms: ambiguous namespace prefix matching and MongoDB operator injection.

## Why it matters now
GitHub's advisory database updated CVE-2026-55253 on August 20, 2026, rating it High (CVSS 7.7). CVE-2026-71433 was published to the GitHub Advisory Database on August 6, 2026 and affects namespace-scoped reads in Postgres/SQLite stores. These are current examples of agent memory becoming an authorization surface rather than just a persistence concern.

## Affected users
- multi-tenant AI agent platforms;
- LangGraph applications storing user/session memory;
- teams using `langgraph-checkpoint-mongodb`, `langgraph-store-mongodb`, `langgraph-checkpoint-postgres`, or `langgraph-checkpoint-sqlite`;
- platform builders exposing memory search/list operations through APIs or agent tools.

## Current public evidence
### Observed evidence 1 — MongoDB operator injection
GitHub-reviewed advisory GHSA-533j-2v4q-mw5h / CVE-2026-55253 states that `MongoDBSaver.list()` / `alist()` and `MongoDBStore.search()` accepted filters whose `$`-prefixed MongoDB query operators were not sufficiently rejected. If filter content is user-controlled in a multi-tenant application, the query can be widened and expose other tenants' data. Affected versions are `langgraph-checkpoint-mongodb < 0.3.0` and `langgraph-store-mongodb < 0.4.0` according to the advisory, with patched versions listed there. The advisory was updated August 20, 2026.

Source: https://github.com/advisories/GHSA-533j-2v4q-mw5h

### Observed evidence 2 — namespace segment boundary failure
GitHub-reviewed advisory GHSA-47pj-3jcm-6whg / CVE-2026-71433 reports that Postgres and SQLite stores flattened hierarchical namespaces into dot-joined strings and performed prefix-style matching. A scoped read for one namespace could match sibling namespaces sharing a prefix; `_` and `%` could also act as pattern metacharacters. The advisory notes that ordinary scoped reads could be sufficient and that applications commonly use namespaces as tenant boundaries. Patched versions are `langgraph-checkpoint-postgres 3.1.1` and `langgraph-checkpoint-sqlite 3.1.1`.

Source: https://github.com/advisories/GHSA-47pj-3jcm-6whg

### Observed evidence 3 — maintainer operational guidance
The CVE-2026-71433 advisory recommends fixed-length namespace labels such as UUIDs and validating user-supplied namespace labels at the boundary. It also states that the fix makes matching segment-aware and escapes pattern metacharacters.

Source: https://github.com/advisories/GHSA-47pj-3jcm-6whg

## Existing approaches
- upgrade to patched package versions;
- sanitize/reject MongoDB query metacharacters in user-controlled filters;
- use fixed-length namespace labels;
- escape wildcard/pattern metacharacters;
- rely on framework-provided scoped search/list APIs.

## Remaining limitations
Package upgrades only fix known implementation bugs. They do not prove the application's own authorization adapter is correct, do not cover custom stores, and do not prevent later code from reintroducing user-controlled query operators. Backend semantics also differ: string prefix matching, SQL wildcard behavior, document query operators, and application-level tenant identifiers can drift independently.

## Root-cause analysis
1. **Authorization by query construction:** tenant isolation is delegated to a storage filter rather than verified on canonical object ownership.
2. **Semantic mismatch:** hierarchical namespace concepts are encoded into backend primitives such as string prefixes or document filters with broader semantics.
3. **Untrusted filter propagation:** user/agent-controlled structures reach query builders without an allowlisted grammar.
4. **Backend divergence:** separate persistence implementations can satisfy the same interface while differing in edge-case authorization behavior.
5. **Insufficient adversarial conformance tests:** happy-path tenant tests do not cover sibling prefixes, wildcard labels, operator keys, or malformed structures.

## Interpretation
The recurring engineering problem is broader than either CVE: agent-memory APIs need a backend-independent tenant-isolation contract and a deterministic conformance suite. Storage scoping should be treated as defense-in-depth, not the sole authorization decision.

## Improvement opportunity
Create a reusable gate that validates query structures, canonicalizes tenant identity, tests adversarial namespace/filter cases across every backend, and verifies every returned object's tenant before use. This is measurable: the attack corpus must return zero unauthorized objects and reject all forbidden operator-bearing filters.

## Relevant sources
- GitHub Advisory GHSA-533j-2v4q-mw5h / CVE-2026-55253: https://github.com/advisories/GHSA-533j-2v4q-mw5h
- GitHub Advisory GHSA-47pj-3jcm-6whg / CVE-2026-71433: https://github.com/advisories/GHSA-47pj-3jcm-6whg
- GitLab advisory mirror for CVE-2026-55253: https://advisories.gitlab.com/pypi/langgraph-checkpoint-mongodb/CVE-2026-55253/
- GitLab advisory mirror for CVE-2026-71433: https://advisories.gitlab.com/pypi/langgraph-checkpoint-sqlite/CVE-2026-71433/
