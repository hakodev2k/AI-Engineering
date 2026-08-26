# RAG Release and Change Management

## Purpose
Ship changes to corpus processing, embeddings, indexes, prompts, retrievers, rerankers, and models without uncontrolled regressions.

## When to use
Use for any production RAG change that can alter answers or retrieval behavior.

## Inputs
Candidate configuration, evaluation results, deployment topology, migration plan, rollback path, SLOs.

## Context to inspect
Inspect component versions, compatibility constraints, index aliases, feature flags, traffic routing, observability, and previous release incidents.

## Core knowledge
RAG deployments often change data artifacts and code simultaneously. Reproducible versioning and parallel indexes enable safer rollback. Offline gains do not guarantee production gains.

## Procedure
1. Enumerate changed components and compatibility dependencies.
2. Produce offline retrieval and end-to-end evaluation evidence.
3. Build new immutable artifacts/index versions rather than mutating the only copy.
4. Validate data counts, ACLs, and freshness.
5. Define release gates and rollback triggers.
6. Deploy to shadow, canary, or limited traffic when possible.
7. Compare quality proxies, errors, latency, and cost to baseline.
8. Expand traffic gradually.
9. Retain rollback artifacts for an appropriate window.
10. Record versions and release decision.
11. Add observed regressions to evaluation suites.

## Decision points
Use blue/green index switching for incompatible embedding or chunk changes. Use feature flags for query/ranking changes that can coexist safely.

## Common failure patterns
In-place destructive reindex; prompt and retriever changes bundled without attribution; no rollback; canary based only on uptime; stale caches masking behavior.

## Verification
Verify artifact compatibility, canary metrics, rollback execution, security tests, and evaluation gates.

## Expected output
A traceable release with controlled blast radius and tested rollback.

## Stop conditions
Stop rollout on critical quality, security, freshness, latency, or error regression.