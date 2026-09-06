# Memory Poisoning Resistance Rules

## Purpose
Prevent malicious or low-integrity inputs from corrupting persistent memory and future agent behavior.

## Scope
Untrusted inputs, prompt injection, source reputation, write validation, quarantine, and remediation.

## MUST
- Memory ingestion MUST classify source trust and apply stricter validation to untrusted content.
- Suspected prompt-injection or manipulation content MUST be treated as data, not executable policy.
- High-impact memories from untrusted sources MUST require corroboration or explicit approval.
- Poisoned records MUST be revocable and traceable to affected indexes and downstream consumers.

## MUST NOT
- MUST NOT persist instructions from retrieved or user-provided content as privileged system policy.
- MUST NOT allow a single low-trust source to overwrite authoritative memory.
- MUST NOT silently retain known poisoned embeddings or cached retrieval artifacts.

## SHOULD
- Maintain quarantine paths for suspicious records.
- Test adversarial memory-write and retrieval scenarios regularly.

## Exceptions
Exceptions require security rationale, constrained scope, monitoring, and approval.

## Verification
Review adversarial tests, trust metadata, quarantine behavior, revocation tests, and incident evidence.