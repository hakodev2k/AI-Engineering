# Persistent Memory Provenance Isolation Guard

**Category:** Security  
**Run date:** 2026-08-20 (UTC+7)

## Problem
Persistent agent memory can turn untrusted, ambiguous, or cross-user content into durable steering context. Current reports show cross-session contamination, cross-user graph-memory association, recall leakage, and unconfirmed text being promoted into persistent policy.

## Evidence
See `evidence/research.md` for current public evidence from Letta, Neo4j agent-memory, Hermes Agent, LangGraph, AutoGen, and memory-security discussions.

## Existing approach
Memory systems commonly use user/session IDs, vector similarity, graph relationships, prompt-injection scanners, general-purpose checkpointers, and manual reset/deletion.

## Existing limitations
These mechanisms do not consistently preserve provenance, authority, tenant isolation, promotion confirmation, or rollback lineage. Retrieval success is often mistaken for trust, and summaries/merges can erase source boundaries.

## Proposed improvement
Wrap every durable memory in a provenance envelope, enforce tenant filtering before retrieval expansion, classify authority explicitly, quarantine instruction-like untrusted content, require confirmation before policy/high-impact preference promotion, preserve lineage, and inject recalled data with trust labels rather than as authoritative instructions.

## Architecture
- `skills/memory-trust-assessment.md` maps write/retrieval trust boundaries.
- `rules/memory-integrity-rules.md` defines tenant, authority, provenance, and rollback invariants.
- `subagents/memory-security-verifier.md` independently verifies isolation and promotion rules.
- `workflows/memory-write-recall-verify.md` provides bounded remediation and rollback verification.
- `hooks/pre-memory-write-check.md` blocks invalid durable writes.
- `schemas/memory-envelope.schema.json` documents the reusable envelope.
- `scripts/validate_memory_record.py` provides dependency-free deterministic validation for the required security subset.
- `tests/test_validate_memory_record.py` verifies authority and lineage constraints.

## Actual package tree
```text
README.md
evidence/research.md
hooks/pre-memory-write-check.md
rules/memory-integrity-rules.md
schemas/memory-envelope.schema.json
scripts/validate_memory_record.py
skills/memory-trust-assessment.md
subagents/memory-security-verifier.md
tests/test_validate_memory_record.py
workflows/memory-write-recall-verify.md
```

## Installation
Requires Python 3.10+; no third-party dependency is required for the validator/tests. Integrate the envelope into the host memory adapter before durable writes and preserve the fields through retrieval, summarization, and graph/vector transformations.

## Configuration
Define the host's authenticated tenant/profile identifier, authority-promotion mechanism, quarantine destination, and rollback/backup mechanism. If a memory backend has its own metadata fields, map the envelope without dropping `tenant_id`, `source_type`, `source_id`, `authority`, `validation_status`, or `lineage_id`.

## Usage
Validate a candidate memory:
```bash
python scripts/validate_memory_record.py pending-memory.json --expected-tenant tenant-a
```

Run unit tests:
```bash
python -m unittest tests/test_validate_memory_record.py
```

## Workflow
Observe → baseline cross-tenant/promotion/provenance fixtures → diagnose write/retrieval/promotion failure → implement minimal boundary → measure again → rollback test → independent verification. Maximum two remediation cycles.

## Metrics
Provenance completeness, cross-tenant canary retrieval count, unauthorized policy-promotion count, poisoned-memory retrieval count, quarantine count, and rollback success rate.

## Verification
Use isolated synthetic tenants with colliding entity names and semantically similar records. Verify zero cross-tenant canaries, zero unconfirmed policy promotions, valid provenance for all accepted durable writes, preserved trust labels during recall, and successful rollback of poisoned descendants without deleting unrelated memory.

## Implemented / Measured / Verified
**Implemented** means envelope, tenant checks, promotion gates, and lineage handling are integrated. **Measured** means before/after fixture metrics exist. **Verified** means an independent agent/reviewer reproduces zero cross-tenant recall and zero unauthorized promotions and confirms rollback integrity.

## Safety
Do not run adversarial tests with real cross-user private data. Do not mass-delete or migrate production memory without an approved backup and rollback path. Unknown provenance must be treated as untrusted rather than reconstructed optimistically.

## Failure handling
Detection includes validator failure, cross-tenant canary recall, unauthorized promotion, or rollback inconsistency. Preserve sanitized evidence. Retry at most twice only when addressing a distinct diagnosed cause. Quarantine affected writes/retrieval paths and escalate when tenant ownership is unknown or a destructive fix lacks verified rollback.

## Definition of Done
Evidence documented; baseline captured; every accepted test memory has valid provenance; tenant scope is enforced before recall/merge; ambiguous or untrusted content cannot become policy without confirmation; cross-tenant fixtures return zero leaks; rollback removes poisoned lineage safely; tests pass; independent verifier returns PASS; no destructive unapproved action occurs.

## Customization
Extend the schema with retention, sensitivity, confidence, cryptographic provenance, or source signatures. Adapt quarantine and promotion workflows to the host platform while preserving the core invariants: tenant scope, source provenance, explicit authority, confirmation for promotion, and reversible lineage.