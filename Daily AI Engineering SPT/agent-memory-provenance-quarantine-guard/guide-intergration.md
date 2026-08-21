# Integration Guide

## 1. Identify memory boundaries
Inventory every place that writes or reads durable agent memory: conversation summaries, user preferences, RAG/vector memories, graph entities, tool-result memories, project notes, cross-session checkpoints, and derived summaries. The guard must sit at the host/store boundary, not only inside an agent prompt.

## 2. Adopt the memory envelope
At minimum store: `id`, `tenant`, `content`, `source_type`, `source_id`, `source_trust`, `writer`, `created_at`, `state`, `content_sha256`, optional `parents`, `reason_codes`, and `policy_version`.

Do not let a summarizer drop tenant/provenance/parents. If a backend separates metadata from text, treat both as one security object.

## 3. Integrate write-path classification
Before committing a new memory to the active retrieval namespace:

```bash
python scripts/memory_guard.py classify \
  --entry candidate.json \
  --policy config/memory-policy.json
```

Exit 2 means quarantine. Store it outside active retrieval or reject it; do not ask the model to decide whether to ignore the warning.

For production, call the same deterministic functions from your store adapter or port their invariants to the host language. Preserve reason codes and digest.

## 4. Preserve lineage for derived memory
When creating summary `B` from entries `A1/A2`, record `parents: [A1, A2]`. A derived memory must not get higher trust than the least-trusted parent unless a human-approved process explicitly validates the new claim. Maintain lineage through compaction/migration so incident revocation remains possible.

## 5. Integrate retrieval gate
Apply security filtering before similarity/relevance ranking reaches context assembly:

```bash
python scripts/memory_guard.py retrieve \
  --store candidates.json \
  --tenant tenant-a \
  --policy config/memory-policy.json
```

Recommended order:
1. tenant/authorization boundary;
2. state and provenance checks;
3. minimum trust;
4. semantic relevance/rerank;
5. model context.

Label retrieved material as data with provenance/trust. Do not concatenate durable memory into system/developer instructions merely because it is persistent.

## 6. Backend patterns
### Vector store
Store tenant/state/trust as filterable metadata. Request only the target tenant and allowed states server-side when possible, then recheck client-side before context assembly.

### Graph memory
Tenant-scope graph traversal. Preserve source/parent edges separately from semantic entity edges. Entity-name equality or neighborhood proximity must not imply trust equality.

### SQL/document store
Use tenant in the primary query predicate and state/trust in the retrieval predicate. Put quarantine in a separate table/collection or require an explicit administrative query path.

## 7. Incident containment
For a compromised source:

```bash
python scripts/memory_guard.py revoke \
  --store memory.json \
  --source-id compromised-source \
  --policy config/memory-policy.json \
  --output revoked.json
```

The script computes transitive descendants via `parents`, marks them revoked, disables retrieval and preserves the original input snapshot. Before applying a destructive production mutation, require the authorization appropriate to your environment.

Rebuild summaries/embeddings from known-clean parents, then audit and probe representative queries.

## 8. Audit

```bash
python scripts/memory_guard.py audit \
  --store memory.json \
  --policy config/memory-policy.json
```

The audit detects missing provenance, duplicate IDs, digest mismatch, unknown parents, invalid states and unsafe retrieval flags on quarantined/revoked entries.

## 9. Tests

```bash
python -m unittest tests/test_memory_guard.py
```

Extend fixtures with your actual source classes, tenant rules, summarizers and backend adapters. Keep at least: benign memory, direct injection, low-trust retrieved content, cross-tenant record, revoked record, missing provenance, derived poison, digest tampering.

## 10. Rollout
Start in observe-only mode to measure benign quarantine rate, but never expose explicitly quarantined/revoked entries. Establish baseline useful-memory recall and latency. Then enforce write classification and retrieval filtering. A production rollout is verified only when poisoned-fixture leakage and cross-tenant leakage are zero in the tested paths and false-positive impact is documented.

## Failure/recovery
- Policy unavailable: disable durable-memory ingestion/retrieval rather than treating everything trusted.
- Store metadata migration incomplete: quarantine legacy entries or place them behind a legacy restricted path until provenance is reconstructed.
- Excessive false positives: review patterns/source classification with measured corpus evidence; do not globally disable quarantine.
- Ambiguous incident lineage: isolate the affected partition and escalate.
- Scanner misses a semantic attack: add the new fixture/policy signal, audit historical entries, and revoke affected lineage.