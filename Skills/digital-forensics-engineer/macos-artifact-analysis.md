# macOS Artifact Analysis

## Purpose
Investigate macOS execution, persistence, user activity, file access, and security-relevant events using native artifacts.

## When to use
Use for suspicious macOS endpoints, malware, persistence, user attribution, unauthorized applications, or data-access investigations.

## Inputs
Forensic image or collected artifacts, macOS version, users, incident window, and indicators.

## Context to inspect
Unified Logs, FSEvents, APFS snapshots, quarantine data, LaunchAgents/LaunchDaemons, TCC, plist files, shell history, browser data, Spotlight metadata, and endpoint telemetry.

## Core knowledge
macOS artifact availability and formats change across releases. APFS snapshots, Unified Logs, quarantine metadata, and privacy controls can materially affect conclusions.

## Procedure
1. Identify macOS version, filesystem layout, timezone, and user profiles.
2. Review Unified Logs and relevant security/application subsystems.
3. Examine launchd persistence, login items, extensions, profiles, and scheduled mechanisms.
4. Correlate FSEvents, file metadata, quarantine, downloads, and browser activity.
5. Review TCC and privacy-relevant changes when material.
6. Analyze shell, SSH, remote-management, and application artifacts.
7. Build a normalized timeline with artifact provenance.

## Decision points
Prefer APFS snapshots and native metadata when they preserve historical state. Escalate to memory or EDR telemetry for ephemeral execution.

## Common failure patterns
Ignoring version-specific artifact changes, treating quarantine as proof of execution, overlooking per-user persistence, and misreading Unified Log retention.

## Verification
Corroborate consequential findings using at least two independent sources where available.

## Expected output
macOS forensic timeline, persistence/execution findings, and explicit confidence/gaps.

## Stop conditions
Stop when artifact semantics are uncertain enough to alter conclusions or protected data requires authorization beyond scope.