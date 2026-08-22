# Agent Memory Provenance Quarantine Guard

## Topic
Persistent agent-memory poisoning caused by untrusted content being promoted into durable memory and later retrieved as trusted context.

## Category
**Security**

## Problem
Agent memory converts a transient prompt-injection event into a persistence problem. Web pages, documents, tickets, user messages, tool outputs, graph nodes, or derived summaries can be stored and later reintroduced into future sessions. If trust is inferred from “it came from memory,” a poisoned entry gains privilege simply by surviving long enough.

The core engineering failure is a missing memory integrity boundary: writes lack immutable provenance, retrieval ranks relevance before trust, derived memories lose lineage, and incident response cannot reliably revoke descendants.

## Evidence
[`evidence/research.md`](evidence/research.md) documents current public signals from 2026. Key evidence includes Cisco's persistent Claude Code memory compromise disclosure, OWASP ASI06 memory/context poisoning guidance, Microsoft red-team reporting that XPIA and memory poisoning occurred at high frequency, a Neo4j agent-memory cross-user poisoning report, and an NVIDIA garak request for real retrieval-layer sleeper-poisoning probes.

## Existing approach
Typical systems currently use some combination of prompt-injection filters, memory extraction/summarization, vector similarity thresholds, manual memory review, pattern/semantic scanners, or trust based on where an entry is stored.

## Existing limitations
- inference-time defenses can fail before a payload is persisted;
- summarization can preserve malicious semantics while changing surface text;
- vector/graph relevance is not a trust signal;
- shared memory can mix tenants/trust domains;
- manual review happens too late and does not scale;
- derived summaries/embeddings often lose source lineage;
- deleting an original source does not prove all descendants are inactive.

## Proposed improvement
Treat persistent memory as a governed security object rather than plain text.

Each entry carries tenant, source identity/type/trust, writer, timestamp, content digest, state, reason codes and optional parent lineage. The host enforces four states: `trusted`, `restricted`, `quarantined`, and `revoked`.

```text
Untrusted source
   -> provenance envelope
   -> deterministic write classification
      -> trusted/restricted active memory
      -> quarantine (not retrievable)

Retrieval
   -> tenant boundary
   -> state/trust gate
   -> relevance ranking
   -> provenance-labelled model context

Incident
   -> preserve evidence
   -> locate source + descendants
   -> revoke
   -> rebuild clean derivatives
   -> audit + retrieval probes
```

## Architecture
### Write boundary
[`scripts/memory_guard.py`](scripts/memory_guard.py) validates provenance, computes a digest, scans configured patterns and assigns a state/reason codes before active storage.

### Retrieval boundary
The same guard filters tenant, state and trust before semantic ranking reaches model context. Quarantined/revoked records cannot pass the gate.

### Lineage boundary
Derived memories record parent IDs. Trust cannot silently increase through summarization. Lineage enables transitive containment when a parent source is compromised.

### Incident boundary
The revoke command computes descendants, marks them revoked, disables retrieval and writes a new snapshot rather than destroying the source evidence.

### Independent verification
High-risk containment/trust-restoration must not rely solely on the implementation agent. Roles are separated in [`subagents/subagents.md`](subagents/subagents.md).

## Package structure
```text
agent-memory-provenance-quarantine-guard/
├── README.md
├── guide-intergration.md
├── config/
│   └── memory-policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── hooks.md
├── rules/
│   └── engineering-rules.md
├── scripts/
│   └── memory_guard.py
├── skills/
│   └── core-skills.md
├── subagents/
│   └── subagents.md
├── tests/
│   └── test_memory_guard.py
├── verification/
│   └── report.md
└── workflows/
    └── workflows.md
```

## Installation
Requires Python 3.10+ and only the standard library. Copy this package into the agent host/repository that owns memory persistence and retrieval. No secrets or network access are required by the script.

## Configuration
Edit [`config/memory-policy.json`](config/memory-policy.json) to match your source classes, trust scores and organization-specific detection signals.

Important defaults:
- missing provenance fails closed;
- only `trusted`/`restricted` states are eligible for retrieval;
- retrieval minimum trust is explicit;
- retrieved web/tool sources start below the default threshold;
- quarantined/revoked states never become active via the script;
- human approval is expected for configured trust upgrades.

Do not copy the sample trust scores blindly into a different authorization model. Calibrate using observed benign and malicious corpora.

## Usage
### Classify a candidate memory
```bash
python scripts/memory_guard.py classify \
  --entry candidate.json \
  --policy config/memory-policy.json
```
Exit `0`: trusted/restricted decision; exit `2`: quarantined; exit `3`: invalid input/policy.

### Gate retrieved candidates
```bash
python scripts/memory_guard.py retrieve \
  --store candidates.json \
  --tenant tenant-a \
  --policy config/memory-policy.json
```

### Audit a store snapshot
```bash
python scripts/memory_guard.py audit \
  --store memory.json \
  --policy config/memory-policy.json
```

### Revoke a compromised source and descendants
```bash
python scripts/memory_guard.py revoke \
  --store memory.json \
  --source-id compromised-source \
  --policy config/memory-policy.json \
  --output revoked.json
```

See [`guide-intergration.md`](guide-intergration.md) for vector, graph, SQL/document-store integration patterns.

## Workflow
Primary flow: **Observe source -> Envelope provenance -> Classify -> Persist/Quarantine -> Retrieve through tenant/state/trust gate -> Audit -> Independent verification**.

Incident flow: **Freeze trust upgrades -> Preserve evidence -> Find source -> Traverse lineage -> Human checkpoint where required -> Revoke -> Rebuild clean derivatives -> Audit -> Probe -> Independent verify**.

All remediation loops in [`workflows/workflows.md`](workflows/workflows.md) are bounded to at most two cycles.

## Skills
[`skills/core-skills.md`](skills/core-skills.md) provides reusable procedures for:
- memory-write boundary enforcement;
- trust-aware retrieval;
- poisoned-memory incident revocation.

Each skill includes triggers, inputs, constraints, metrics, verification, failure behavior and stop conditions.

## Rules
[`rules/engineering-rules.md`](rules/engineering-rules.md) defines observable MUST/MUST NOT/SHOULD rules. Critical invariants include:
- provenance on every durable memory;
- tenant/security filtering before relevance ranking;
- no quarantined/revoked content in context;
- no trust promotion from similarity/graph proximity;
- lineage preservation for derived memory;
- no automatic trust restoration.

## Hooks
[`hooks/hooks.md`](hooks/hooks.md) defines pre-write, pre-retrieval, post-derivation, incident-revocation and final-verification hooks with commands and fail-closed behavior.

## Metrics
Measure before claiming improvement:
- provenance coverage;
- malicious-fixture quarantine rate;
- benign false-positive rate;
- poisoned/revoked retrieval leakage;
- cross-tenant leakage;
- useful-memory recall/precision;
- guard latency overhead;
- descendants found/revoked;
- time to containment.

A security improvement is not verified merely because more memories are blocked. Quality and useful-memory retention must also be measured.

## Verification
Run:
```bash
python -m unittest tests/test_memory_guard.py
```

The suite covers benign memory, configured prompt injection, low-trust web content, cross-tenant filtering, revoked entries, missing provenance, descendant revocation, digest tampering, unknown parents and unsafe quarantine retrieval flags.

[`verification/report.md`](verification/report.md) separates **Implemented**, **Measured**, and **Verified**, and defines the production verification gate.

## Safety
- The script performs local deterministic inspection only.
- It does not execute memory content or arbitrary commands.
- It does not require secrets.
- Revoke writes a new output snapshot rather than deleting the source store.
- Destructive production purges and high-impact trust restoration require the host's explicit human approval.
- Missing/ambiguous provenance fails closed.
- Security thresholds are never weakened automatically after failure.
- Logs should use IDs/digests/reason codes and avoid raw secrets.

This package complements, rather than replaces, sandboxing, least-privilege tool permissions, connector authorization, prompt-injection defenses and output validation.

## Failure handling
**Policy unavailable:** do not promote new durable memories; return without persistent-memory context.  
**Legacy entries lack provenance:** quarantine/restrict until provenance is reconstructed.  
**False positives:** measure a benign corpus and adjust specific policy signals with review; never disable the boundary globally.  
**Ambiguous incident lineage:** isolate the affected partition and escalate.  
**New attack bypass:** add a fixture, update policy/defense, audit historical entries, revoke affected lineage and reverify.  
**Backend failure:** preserve evidence and stop rather than partially applying containment.

## Definition of Done
An integration is complete only when:
- every durable write path supplies required provenance;
- write classification executes before active retrieval;
- derived memory preserves parent lineage;
- every model-facing persistent retrieval path enforces tenant/state/trust;
- quarantined/revoked and cross-tenant fixtures never reach context;
- the included tests pass;
- a real store audit has no blocking problem;
- benign false-positive impact and latency overhead are measured;
- incident revocation can invalidate descendants in a drill;
- required independent/human approvals are enforced;
- no blocking security issue remains.

## Customization
Extend the policy with organization source identities, signed provenance, stronger semantic scanners, PII rules, per-tenant trust thresholds, time decay, graph/vector adapters, or a dedicated quarantine review UI. Preserve the architectural invariants even if the implementation language changes: **provenance before trust, quarantine before persistence, security before relevance, lineage before revocation, and evidence before declaring containment complete**.