# Linux Artifact Analysis

## Purpose
Reconstruct Linux system and user activity from logs, shell history, authentication records, package state, services, filesystems, and runtime artifacts.

## When to use
Use for compromised Linux servers, credential misuse, persistence, unauthorized tooling, container hosts, or suspicious administrative actions.

## Inputs
Disk image or collected artifacts, distribution/version, relevant users, incident window, and known indicators.

## Context to inspect
systemd journal, auth logs, auditd, shell histories, cron/systemd timers, SSH configuration and keys, package manager logs, process accounting, containers, and application logs.

## Core knowledge
Linux forensic coverage varies heavily by distribution and configured logging. Shell history is incomplete and user-controlled; authentication and service artifacts need correlation.

## Procedure
1. Identify distribution, kernel, timezone, and logging configuration.
2. Enumerate users, groups, sudoers, SSH trust, and recent authentication.
3. Review services, timers, cron, init scripts, loaders, and persistence locations.
4. Examine package installs, binaries, capabilities, setuid files, and recent changes.
5. Correlate shell history with audit, journal, process, and file metadata.
6. Review network configuration, firewall, containers, and remote-access artifacts.
7. Build a timeline and identify unexplained privilege or execution events.

## Decision points
Treat command history as supporting evidence, not authoritative truth. Use memory/runtime acquisition when ephemeral processes or deleted executables are suspected.

## Common failure patterns
Assuming all distributions log identically, missing rotated/compressed logs, overlooking systemd user services, and relying solely on bash history.

## Verification
Corroborate major actions across independent logs, filesystem metadata, or external telemetry.

## Expected output
Linux activity timeline, persistence and access findings, confidence levels, and evidence gaps.

## Stop conditions
Stop when logging gaps prevent a defensible conclusion or privileged collection requires approval not in scope.