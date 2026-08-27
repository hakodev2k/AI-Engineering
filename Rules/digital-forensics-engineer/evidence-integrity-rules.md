# Evidence Integrity Rules

## Purpose
Preserve the authenticity, completeness, and defensibility of digital evidence throughout forensic work.

## Scope
Applies to acquired media, files, memory, logs, exports, forensic images, derived artifacts, and analysis outputs.

## MUST
- Evidence MUST be uniquely identified before analysis.
- Original evidence MUST be preserved in its acquired state; analysis MUST use verified working copies where feasible.
- Cryptographic hashes MUST be recorded at acquisition and revalidated after transfer or duplication.
- Every transformation that can alter bytes or metadata MUST be documented.
- Evidence provenance MUST remain traceable from source through every derived artifact.
- Integrity failures MUST be treated as material findings and escalated before conclusions rely on affected evidence.

## MUST NOT
- MUST NOT modify original evidence merely to simplify analysis.
- MUST NOT represent an unverified copy as identical to its source.
- MUST NOT discard conflicting integrity results.
- MUST NOT claim evidentiary authenticity from tool output alone.

## SHOULD
- Use write-blocking or equivalent controls for mutable media.
- Prefer reproducible extraction procedures and widely supported hash algorithms.
- Separate evidentiary artifacts from analyst notes and temporary files.

## Exceptions
An exception requires documented necessity, affected evidence, expected mutation, alternatives considered, risk, verification method, and approval when evidentiary value may be impaired.

## Verification
Review acquisition records, hash manifests, copy logs, write-protection evidence, provenance records, and independent re-hashing of representative artifacts.