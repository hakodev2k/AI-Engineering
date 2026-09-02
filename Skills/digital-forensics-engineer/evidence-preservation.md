# Evidence Preservation

## Purpose
Preserve potentially relevant digital evidence without altering its meaning, provenance, or admissibility. This skill establishes defensible handling before analysis begins.

## When to use
Use at the start of incident response, internal investigations, litigation support, insider-risk cases, compromise assessments, and post-breach analysis. Do not perform destructive remediation on evidence sources before preservation requirements are understood.

## Inputs
Incident description, asset inventory, legal or policy constraints, system ownership, access level, retention requirements, and suspected evidence sources.

## Preconditions
Confirm authority to collect data, scope of investigation, and whether legal hold or privacy restrictions apply.

## Context to inspect
System state, volatile data risk, encryption state, cloud retention, log rotation, EDR telemetry, backup availability, and clock configuration.

## Core knowledge
Preservation prioritizes integrity, provenance, minimal alteration, repeatability, and documented handling. Volatile evidence may disappear before persistent evidence, but acquisition itself can change state. Hashes prove byte consistency, not authenticity or completeness.

## Procedure
1. Identify evidence sources and rank by volatility and business impact.
2. Record date, time, operator, system identity, and collection authority.
3. Capture volatile evidence first when justified.
4. Prevent avoidable log rotation, autoscaling deletion, or disk reuse.
5. Acquire data using validated methods appropriate to the source.
6. Calculate cryptographic hashes where applicable.
7. Record tooling versions and acquisition commands.
8. Store originals read-only or access-restricted.
9. Analyze verified working copies rather than originals.
10. Maintain a complete evidence handling record.

## Decision points
Choose live acquisition when shutdown would destroy critical volatile data; prefer offline imaging when minimizing source changes is more important. Escalate before actions that may materially affect production or legal obligations.

## Common failure patterns
Analyzing originals, undocumented collection, missing timestamps, using unvalidated tools, incomplete acquisition, accidental remediation, and assuming a matching hash proves correct provenance.

## Verification
Recompute hashes, verify evidence opens correctly, compare recorded identifiers with source inventory, and confirm custody records contain no unexplained gaps.

## Expected output
Preserved evidence, integrity hashes, acquisition metadata, custody records, and documented limitations.

## Stop conditions
Stop when authority is unclear, evidence destruction is likely, privacy or legal constraints are unresolved, or the acquisition method could cause unacceptable production impact.