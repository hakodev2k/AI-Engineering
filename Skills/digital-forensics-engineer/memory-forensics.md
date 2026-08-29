# Memory Forensics

## Purpose
Extract volatile evidence from memory captures to investigate processes, code injection, credentials exposure, network activity, and transient attacker behavior.

## When to use
Use when malware may be fileless, process state matters, disk artifacts are insufficient, or active compromise was captured before shutdown.

## Inputs
Memory image, operating-system/build information, acquisition metadata, suspected time window, and investigative questions.

## Context to inspect
Capture tool reliability, symbol/profile compatibility, virtualization, hibernation/page files, EDR activity, and system uptime.

## Core knowledge
Memory is a point-in-time and partially inconsistent view. Process lists, VADs/maps, handles, sockets, modules, kernel structures, command history, and injected regions must be interpreted together rather than independently.

## Procedure
1. Validate capture integrity and identify OS/build.
2. Enumerate processes using multiple structural views.
3. Identify anomalous parentage, paths, sessions, tokens, handles, and modules.
4. Examine executable or writable-executable regions and suspicious mappings.
5. Correlate sockets and connections with processes.
6. Extract command, credential-adjacent, registry/configuration, and kernel artifacts only when authorized.
7. Dump suspicious regions/files for controlled secondary analysis.
8. Correlate findings with disk, logs, and network telemetry.

## Decision points
Prioritize structure-based anomaly analysis over signatures when indicators are unknown. Treat credential material as highly sensitive and minimize extraction.

## Common failure patterns
Using the wrong profile, treating hidden processes as automatically malicious, over-trusting string searches, and ignoring acquisition-induced artifacts.

## Verification
Validate high-impact findings through independent plugins/views or non-memory evidence.

## Expected output
Process/network/memory findings with provenance, confidence, and extracted artifacts where justified.

## Stop conditions
Stop if the capture is materially corrupt, required analysis would expose unrelated secrets without authorization, or tool interpretation is incompatible with the OS build.