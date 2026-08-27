# Persistent Storage and Flash Wear

## Purpose
Store configuration and state reliably within nonvolatile-memory endurance and atomicity constraints.

## When to use
Use for settings, counters, calibration, logs or persistent state.

## Inputs
Data model, write frequency, retention needs, storage technology, endurance and failure semantics.

## Context to inspect
Erase/write granularity, existing format, checksums, versioning, wear strategy and reset behavior.

## Core knowledge
Nonvolatile writes may be asymmetric, granular and interruptible. Formats need versioning, validation and recovery rules.

## Procedure
1. Classify data by criticality and write rate.
2. Define format and version.
3. Define validity markers and recovery.
4. Minimize erase/write amplification.
5. Apply wear distribution when needed.
6. Handle interrupted writes.
7. Define migration across firmware versions.
8. Test endurance assumptions and corrupted states.

## Decision points
Use simple redundant records for small critical state; use log-structured approaches for higher write rates or larger datasets.

## Common failure patterns
Writing on every event, no version field, assuming atomic multiword writes, unrecoverable corruption and silent wear exhaustion.

## Verification
Fault-test interrupted writes, validate migration and calculate endurance from measured write rates.

## Expected output
A versioned storage scheme with quantified endurance and recovery behavior.

## Stop conditions
Stop when storage endurance or atomic-write guarantees are unknown for critical persistent data.