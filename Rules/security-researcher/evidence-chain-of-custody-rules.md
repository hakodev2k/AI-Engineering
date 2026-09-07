# Evidence and Chain-of-Custody Rules

## Purpose
Preserve the integrity, provenance, confidentiality, and reviewability of security research evidence.

## Scope
Applies to captures, crash dumps, logs, screenshots, binaries, source excerpts, samples, packet traces, exported records, forensic images, test output, and researcher notes.

## MUST
- Evidence MUST record its source, acquisition time, relevant target or environment, collection method, and responsible researcher when those facts affect interpretation.
- Original evidence MUST be preserved separately from transformed, redacted, annotated, or analyzed copies when feasible.
- Integrity-sensitive artifacts MUST use cryptographic hashes or equivalent controls to detect unintended modification.
- Access to sensitive evidence MUST follow least privilege and applicable retention requirements.
- Redactions MUST preserve enough context for reviewers to understand the finding while removing unnecessary secrets, personal data, or customer content.
- Any transformation that can affect interpretation MUST be documented.
- Evidence used for a high-severity conclusion MUST be traceable to the experiment or observation that produced it.
- Transfers to external parties MUST use approved secure channels and comply with disclosure scope.

## MUST NOT
- MUST NOT edit original evidence in place when the modification could affect later validation.
- MUST NOT include credentials, tokens, private keys, or unrelated personal data in reports when a redacted representation is sufficient.
- MUST NOT claim provenance that was not observed or recorded.
- MUST NOT discard contradictory artifacts merely because they weaken the preferred hypothesis.
- MUST NOT store sensitive evidence in public repositories, unrestricted collaboration tools, or personal cloud storage.

## SHOULD
- Evidence collections SHOULD use stable naming, timestamps, manifest files, and hash inventories.
- Research notes SHOULD identify hypotheses, observations, and decisions separately.
- Highly sensitive evidence SHOULD have explicit deletion or retention deadlines.

## Exceptions
When original evidence cannot legally or safely be retained, preserve the minimum approved derivative evidence and document why the original was unavailable, what information was removed, and how confidence was affected.

## Verification
Review artifact hashes, timestamps, manifests, access controls, storage location, redaction quality, and provenance records. Confirm that a reviewer can connect each material claim to preserved evidence without relying on researcher memory.