# Windows Artifact Analysis

## Purpose
Reconstruct Windows user, process, persistence, file, device, and authentication activity from native forensic artifacts.

## When to use
Use for compromised Windows endpoints, lateral movement, suspicious execution, persistence, data access, or user-attribution questions.

## Inputs
Disk image or collected artifacts, Windows version/build, relevant users, time window, and incident indicators.

## Context to inspect
Registry hives, event logs, Prefetch, Amcache, Shimcache, SRUM, LNK files, Jump Lists, scheduled tasks, services, PowerShell artifacts, browser data, and EDR telemetry.

## Core knowledge
No single Windows artifact proves execution or user intent in every version. Artifact semantics, retention, enablement, and update behavior must be version-aware.

## Procedure
1. Identify OS version, user profiles, and timezone configuration.
2. Parse registry hives and event logs with validated tooling.
3. Build execution evidence from multiple sources.
4. Examine persistence mechanisms, services, tasks, autoruns, WMI, and startup paths.
5. Review logon, RDP, PowerShell, device, and network-related artifacts.
6. Correlate LNK, Jump Lists, shell items, and file metadata with user activity.
7. Compare host evidence with identity, EDR, and network telemetry.
8. Record artifact-specific confidence and retention gaps.

## Decision points
Use execution artifacts collectively; distinguish program presence from execution. Escalate to memory analysis when injection or in-memory-only behavior is suspected.

## Common failure patterns
Treating Shimcache as definitive execution proof, ignoring cleared logs, confusing system and user context, and missing timezone or clock drift.

## Verification
Require corroboration for consequential claims such as execution, persistence, or interactive user action.

## Expected output
Windows activity reconstruction with evidence references, confidence, and gaps.

## Stop conditions
Stop if artifact version semantics are unknown and would materially affect conclusions, or collected artifacts are incomplete for the question.