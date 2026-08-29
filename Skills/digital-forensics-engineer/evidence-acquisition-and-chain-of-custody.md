# Evidence Acquisition and Chain of Custody

## Purpose
Acquire digital evidence defensibly while preserving integrity, provenance, and repeatability.

## When to use
Use when collecting disks, memory, logs, cloud exports, removable media, or other evidence that may support an incident, investigation, or legal process.

## Inputs
Asset identifiers, acquisition target, authorization, collection method, time source, storage destination, and case context.

## Preconditions
Confirm written authority, scope, evidence retention rules, and whether live acquisition is required.

## Context to inspect
System state, encryption, volatility, business criticality, legal holds, available write blockers, and trusted tooling.

## Core knowledge
Evidence integrity depends on minimizing alteration, recording provenance, hashing at appropriate stages, synchronized timestamps, and preserving originals. Live acquisition may change system state but can be necessary for volatile data.

## Procedure
1. Confirm authority and scope.
2. Record asset identity, date/time, operator, and system state.
3. Select live or offline acquisition based on volatility and risk.
4. Use validated tools and write protection where applicable.
5. Acquire the source using a reproducible method.
6. Calculate cryptographic hashes and record tool versions.
7. Seal the original; perform analysis on verified copies.
8. Document every transfer, access, and derived artifact.

## Decision points
Choose live capture when volatile evidence outweighs contamination risk. Prefer full physical acquisition when completeness is required; use targeted collection when constraints are explicit and documented.

## Common failure patterns
Analyzing originals, missing timestamps, undocumented custody transfers, relying on screenshots as primary evidence, and failing to hash evidence.

## Verification
Re-hash working copies against the acquired original and confirm custody records are complete.

## Expected output
Verified evidence package plus acquisition and chain-of-custody record.

## Stop conditions
Stop if authority is unclear, acquisition may materially disrupt critical systems without approval, or integrity cannot be established.