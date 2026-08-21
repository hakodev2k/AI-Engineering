# Workflows

## Secure Memory Ingestion
**Trigger:** any durable memory or derived-summary write. **Goal:** nothing becomes retrievable without provenance and a deterministic trust decision. **Inputs:** content, tenant, source metadata, writer, parent IDs, policy. **Baseline:** provenance coverage, unclassified writes, quarantine rate.

Stages: Observe source/trust domain -> normalize metadata/digest -> run `memory_guard.py classify` -> persist trusted/restricted to active store or quarantined to isolated non-retrievable store -> re-read and verify digest/state/provenance -> audit reason codes.

**Agents:** Evidence Analyst -> Boundary Implementer -> Independent Security Verifier. **Checkpoints:** provenance before classification; quarantine cannot be bypassed; derived content retains parents. **Metrics:** provenance coverage, malicious-fixture quarantine rate, benign false-positive rate. **Retry:** maximum 2 integration-remediation attempts; never weaken rules to retry suspicious content. **Stop:** valid persisted state, quarantine/rejection, or escalation. **Failure:** disable durable write and preserve evidence. **DoD:** no candidate is retrievable before every checkpoint passes.

## Trust-Aware Retrieval Gate
**Trigger:** before long-term-memory results enter model context. **Goal:** stop cross-tenant, quarantined, revoked, and below-threshold entries while preserving useful memory. **Inputs:** candidates, tenant, policy. **Baseline:** candidate count, poisoned-fixture leakage, cross-tenant leakage, useful-memory recall.

Stages: query candidates -> tenant filter -> recompute state/trust -> exclude forbidden records -> semantic relevance/reranking -> wrap allowed memories with source/trust labels -> log allowed/blocked IDs -> run canary after integration changes.

**Checkpoints:** tenant before ranking; security before similarity; model cannot override filter. **Metrics:** poisoned leakage, cross-tenant leakage, recall, added latency. **Retry:** one retry only for transient store-read failure; otherwise return without durable-memory context. **Stop:** secure set or aborted retrieval. **Verification:** forbidden fixtures absent and expected benign fixtures present. **DoD:** zero forbidden entries reach context in regression tests.

## Memory Poison Incident Containment
**Trigger:** suspicious memory, compromised source/connector, cross-tenant merge, or a new rule matching stored data. **Goal:** contain source and descendants without hiding evidence. **Inputs:** source ID/digest, tenant, snapshot, lineage. **Baseline:** active affected entries, descendant count, retrieval probes.

Stages: freeze trust upgrades -> preserve read-only evidence -> enumerate direct entries -> traverse descendants -> human checkpoint for destructive/cross-tenant/high-impact scope -> revoke and disable retrieval -> rebuild derived artifacts from clean parents -> audit and probe -> independent verification -> close or isolate.

**Agents:** Evidence Analyst -> Incident Containment Agent -> Independent Security Verifier. **Metrics:** time to containment, descendants found/revoked, residual active affected entries. **Retry:** maximum 2 rebuild/verification cycles. **Stop:** zero active descendants, full partition isolation, or escalation for ambiguous lineage. **Failure:** isolate affected partition and stop automated mutation. **DoD:** no poisoned descendant is active/retrievable and required approvals exist.

## Policy Change Regression
**Trigger:** scanner, threshold, backend, summarizer, embedding model, or provenance-schema change. **Goal:** avoid either security leakage or destructive false positives.

Measure -> run benign and malicious corpora -> compare quarantine/leakage/recall/latency -> diagnose -> change one hypothesis -> retest. Maximum 2 adjustment cycles. Stop for human review if leakage remains or benign false-positive rate exceeds the team's explicit threshold. Never lower security solely to get a green run.