# Persistent Memory Write Provenance Gate

**Category:** Security

## Problem
Persistent AI memory can outlive the session, credentials, and source context that created it. Current public research shows that attacker-controlled web content can poison assistant memory when summarization or retrieval is allowed to trigger durable writes without a strict provenance boundary.

## Evidence
Current evidence is documented in `evidence/research.md`, including Varonis CoSnitch research disclosed August 18, 2026, NVD CVE-2026-24301, and independent coverage of persistent memory poisoning.

## Existing approach
Common defenses include prompt-injection detection, memory settings, user review, credential/session resets, connector revocation, and human approval.

## Existing limitations
Heuristic scanners can miss semantic attacks; session recovery may not clear durable memory; source provenance can be lost after persistence; users rarely audit individual memory entries; general memory can become an unintended control plane.

## Proposed improvement
Make every persistent-memory write an explicit privileged state transition. A deterministic pre-write gate requires source provenance, quarantines untrusted input, rejects control-language patterns, blocks security-sensitive namespaces, and requires explicit human approval for untrusted writes. Stored records retain source identity so later review and deletion remain possible.

## Architecture
```text
persistent-memory-write-provenance-gate/
├── README.md
├── config/
│   └── memory-policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-memory-write.md
├── rules/
│   └── memory-integrity.md
├── schemas/
│   └── memory-write-event.schema.json
├── scripts/
│   └── memory_write_guard.py
├── skills/
│   └── memory-write-threat-analysis.md
├── subagents/
│   └── memory-security-reviewer.md
├── tests/
│   └── test_memory_write_guard.py
└── workflows/
    └── quarantine-and-approve.md
```

## Installation
Requires Python 3.10+ and only the Python standard library.

## Configuration
Edit `config/memory-policy.json` to define trusted source classes, blocked patterns, maximum value size, protected namespaces, and approval requirements. Do not add a source to `trusted_sources` merely to eliminate review friction.

## Usage
Create an event matching `schemas/memory-write-event.schema.json`, then run:

```bash
python scripts/memory_write_guard.py --event event.json --policy config/memory-policy.json
```

Exit codes: `0` allow, `3` quarantine/block, `2` malformed input/configuration.

## Workflow
Use `workflows/quarantine-and-approve.md`: Observe → Measure baseline → Diagnose → Form hypothesis → Integrate gate → Measure again → Independent verification.

## Metrics
- Provenance coverage of persistent writes
- Untrusted-write quarantine rate
- Attack-fixture block rate
- High-risk namespace block rate
- Approved-untrusted TTL coverage
- Memory deletion/recovery success rate
- False-positive review count

## Verification
Run:

```bash
python -m unittest tests/test_memory_write_guard.py
```

The package's deterministic unit tests cover explicit user preferences, untrusted web-derived writes, injection-like control text, and protected namespaces. The script and tests were executed successfully before publication.

## Safety
Fail closed. Never use general memory as a credential store or authorization mechanism. Never log secrets. Human approval must show the exact source, value, target namespace, and intended lifetime.

## Failure handling
**Detection:** non-zero gate result, missing provenance, protected namespace attempt, or failed deletion test.  
**Evidence:** reason codes, source reference, policy version, sanitized audit record.  
**Retry policy:** maximum 2 implementation revisions; do not repeatedly mutate content to bypass the gate.  
**Fallback:** disable automated persistence for that source and use transient context only.  
**Escalation:** security/memory owner.  
**Stop condition:** missing provenance, secret exposure, inability to remove poisoned memory, or exhausted retries.

## Definition of Done
**Implemented:** guard, schema, policy, hook, rules, and workflow are integrated.  
**Measured:** baseline and post-change provenance/security metrics are captured.  
**Verified:** tests pass, attack fixtures are blocked, protected namespaces remain inaccessible, memory removal succeeds, and an independent reviewer confirms no privileged path depends on untrusted persistent content.

## Customization
Add product-specific source classes, namespaces, TTL controls, and approval UIs while preserving the core invariant: untrusted transient content never silently becomes durable trusted state.
