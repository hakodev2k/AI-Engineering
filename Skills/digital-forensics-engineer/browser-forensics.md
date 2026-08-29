# Browser Forensics

## Purpose
Reconstruct web activity, downloads, sessions, extensions, and browser-mediated credential or data access.

## When to use
Use for phishing, malware delivery, suspicious downloads, cloud-app activity, credential theft, or user-activity questions.

## Inputs
Browser profiles, history databases, cache, cookies, downloads, extensions, sync artifacts, time window, and relevant users.

## Context to inspect
Browser/version, profile layout, private-mode limitations, synchronization, enterprise policies, timezone handling, and OS-level download artifacts.

## Core knowledge
History databases are incomplete representations of user behavior. Cache, cookies, downloads, session restore, autofill, extension data, and OS artifacts provide complementary evidence.

## Procedure
1. Preserve the complete profile and record browser/version.
2. Parse history, visits, searches, downloads, cookies, and session state.
3. Inventory extensions and identify install/update provenance.
4. Correlate downloaded files with hashes, filesystem metadata, quarantine/Mark-of-the-Web, and execution evidence.
5. Review cloud-app and authentication artifacts within scope.
6. Normalize timestamps according to source format.
7. Distinguish typed navigation, redirects, background requests, and sync-generated records where possible.

## Decision points
Do not equate a cached object or cookie with deliberate user access. Use network/provider logs for stronger attribution when available.

## Common failure patterns
Ignoring multiple profiles, assuming deleted history means no activity, misreading timestamp epochs, and treating private mode as artifact-free.

## Verification
Corroborate significant visits/downloads with filesystem, DNS/proxy, email, or endpoint evidence.

## Expected output
Browser activity timeline, download/extension findings, and confidence-qualified interpretation.

## Stop conditions
Stop when decrypting protected browser secrets is outside scope or artifact semantics cannot support the requested claim.