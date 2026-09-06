# Knowledge Governance and Change Control

## Purpose
Establish accountable governance for changes to knowledge sources, schemas, taxonomies, retrieval behavior, and derived AI assets so the system can evolve without uncontrolled regressions.

## When to use
Use when multiple teams contribute knowledge, when index/schema changes affect production behavior, or when high-impact sources require approval and auditability.

## Inputs
Ownership model, source criticality, change workflows, risk classification, release process, evaluation gates, incident history, and compliance requirements.

## Context to inspect
Inspect current source owners, pull/request workflows, taxonomy changes, connector deployments, index migrations, model or retriever versioning, approval records, and rollback mechanisms.

## Core knowledge
Knowledge operations span content and software. A source edit, parser upgrade, embedding migration, ACL mapping change, or taxonomy rename can all alter AI behavior. Governance should scale with impact: lightweight for low-risk content, stricter for policy, security, or regulated domains.

## Procedure
1. Identify governed assets: source content, metadata schemas, taxonomies, connectors, parsers, chunking, embeddings, indexes, ranking, and evaluation sets.
2. Assign accountable owners and approvers by domain and change type.
3. Classify changes by blast radius, reversibility, security impact, and user consequence.
4. Define required review and evidence for each risk class.
5. Require versioning and migration plans for schema or index changes.
6. Run targeted evaluations before production promotion.
7. Use staged rollout, shadowing, or canaries for high-impact technical changes.
8. Preserve audit records linking changes to evidence and owners.
9. Define rollback criteria and recovery procedures.
10. Review incidents and recurring exceptions to improve governance rules.

## Decision points
Use automated approval for low-risk, well-tested changes; require human approval for permission, retention, policy, or high-impact authority changes. Avoid central approval bottlenecks where domain owners can safely govern their own scoped assets.

## Common failure patterns
Treating content edits as harmless, unversioned taxonomy changes, no rollback for reindexing, approval without evaluation evidence, unclear ownership, and governance so heavy that teams bypass it.

## Verification
Trace sampled production changes to owners, reviews, tests, versions, and rollback plans. Simulate a rejected or rolled-back change and confirm controls behave as designed.

## Expected output
A governance model with asset ownership, risk tiers, change gates, evaluation requirements, rollout strategy, auditability, and rollback rules.

## Stop conditions
Stop when ownership is unassigned for critical assets, required approvals cannot be obtained, or a high-impact change lacks a safe rollback path.