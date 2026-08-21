# Core Skills

## Skill 1 — Memory Write Boundary
**Purpose:** stop untrusted content from silently becoming durable trusted context.  
**Trigger:** before any long-term memory write or derived-summary write.  
**Inputs:** candidate content, tenant, source identity/type, source trust, writer identity, parent IDs, policy.  
**Preconditions:** tenant and source identity are known; missing provenance is treated as a failure.  
**Required context:** memory schema, trust policy, source classification, parent lineage.  
**Tools:** `scripts/memory_guard.py classify`, store adapter, audit log.

**Procedure:**
1. Build the candidate memory object with immutable provenance.
2. Validate required fields and tenant.
3. Compute content digest.
4. Run deterministic classification.
5. If quarantined, persist only in the quarantine namespace and disable retrieval.
6. If restricted, persist with explicit state and never upgrade trust automatically.
7. If trusted, write with digest and provenance intact.
8. For derived memories, record parent IDs and never assign trust above the least-trusted parent without human approval.
9. Emit reason codes and the final state.

**Decisions:** malformed/missing provenance -> quarantine; severe injection signal -> quarantine; low-trust source -> restricted; explicit human-approved trusted source -> trusted if policy permits.  
**Constraints:** no hidden trust upgrade; no deletion of negative scanner evidence; no cross-tenant parent lineage.  
**Expected output:** persisted object with state, digest, provenance, lineage and reason codes.  
**Metrics:** provenance coverage, quarantine rate, false-positive rate, trust-upgrade count.  
**Verification:** re-read stored item and verify fields/digest/state.  
**Failure handling:** fail closed; preserve candidate and diagnostics outside active retrieval.  
**Stop conditions:** successful persisted classification, explicit rejection, or escalation to human review.

## Skill 2 — Trust-Aware Retrieval
**Purpose:** prevent poisoned, revoked or cross-tenant memories from entering model context.  
**Trigger:** every retrieval batch before context assembly.  
**Inputs:** candidate memory records, tenant, policy, query metadata.  
**Preconditions:** records contain provenance/state or will be rejected.  
**Tools:** `memory_guard.py retrieve`, vector/graph store filters.

**Procedure:** tenant-filter first; exclude quarantined/revoked; recompute deterministic classification; enforce minimum trust; retain provenance labels in the context envelope; rank relevance only after security filtering; log allowed/blocked IDs. Never promote relevance into trust.

**Decisions:** tenant mismatch -> block; state not retrievable -> block; trust below threshold -> block; otherwise allow with source/trust labels.  
**Constraints:** model cannot override the retrieval gate; similarity score cannot bypass trust.  
**Expected output:** allowed IDs plus blocked IDs/reasons.  
**Metrics:** blocked poisoned retrievals, cross-tenant blocks, retrieval precision, user-visible false blocks.  
**Verification:** regression fixtures must show zero quarantined/revoked/cross-tenant leakage.  
**Failure handling:** if policy/store metadata is unavailable, return no durable-memory context and escalate.  
**Stop condition:** secure candidate set produced or retrieval aborted.

## Skill 3 — Poison Incident Revocation
**Purpose:** remove a compromised source and all derived descendants from active memory.  
**Trigger:** confirmed/suspected poisoned source, compromised connector, bad document, tenant-mixing event.  
**Inputs:** source ID/digest, store snapshot, lineage, policy.  
**Tools:** `memory_guard.py revoke`, `audit`.

**Procedure:** preserve evidence -> identify direct entries -> traverse parent lineage -> mark all descendants revoked -> disable retrieval -> rebuild affected summaries/embeddings from clean parents -> audit store -> run representative retrieval probes -> record incident closure evidence.

**Decisions:** uncertain lineage means conservative revocation of the affected namespace, not trust restoration.  
**Constraints:** no destructive purge before evidence capture; no automatic re-trust.  
**Expected output:** revoked ID set, rebuilt clean artifacts, audit report.  
**Metrics:** descendants found, active poisoned descendants remaining, time-to-containment.  
**Verification:** audit clean and probes return zero revoked IDs.  
**Failure handling:** isolate the entire affected memory partition and require human review.  
**Stop condition:** no active descendant remains or partition is isolated.