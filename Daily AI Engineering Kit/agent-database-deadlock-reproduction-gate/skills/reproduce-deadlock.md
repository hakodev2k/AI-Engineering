# Skill: Reproduce Database Deadlock

## Purpose
Turn an intermittent deadlock report into repeatable wait-for-cycle evidence.

## When to use
After a deadlock incident or before changing transaction/lock behavior.

## Inputs
Incident logs, transaction entry points, database diagnostics, normalized capture contract.

## Preconditions
Use an approved non-production environment unless production diagnostics are explicitly authorized.

## Allowed tools
Read-only repository search, logs, database diagnostic output, test harnesses, `scripts/deadlock_gate.py`.

## Process
1. Identify the two or more transaction entry points implicated by evidence.
2. Trace transaction boundaries, statement order, explicit locks, ORM-generated queries, and retry behavior.
3. Capture the exact resources each transaction waits for or owns.
4. Normalize each reproduction attempt into the capture schema.
5. Run the gate and confirm at least one directed wait-for cycle.
6. Repeat only enough to establish a stable reproduction; do not increase concurrency indefinitely.
7. Record facts, hypotheses, evidence, and unknowns separately.
8. Hand the cycle and code paths to the Fix Planner.

## Expected output
Reproduction steps, normalized baseline capture, detected cycle, resource sequence, affected code paths, confidence, unresolved questions.

## Verification
A deadlock is reproduced only when the gate detects a cycle or equivalent database-native deadlock evidence is mapped into the same cycle.

## Failure handling
Transient harness failures retry at most twice. If the deadlock cannot be reproduced, report `not_reproduced`; do not claim a fix.

## Stop conditions
Production risk, missing permissions, destructive setup requirement, or insufficient evidence to map transactions.
