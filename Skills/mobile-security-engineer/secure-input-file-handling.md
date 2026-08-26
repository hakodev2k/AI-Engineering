# Secure Input and File Handling

## Purpose
Safely process attacker-controlled text, structured data, files, URIs, media, archives, and documents received by a mobile app.

## When to use
Use for uploads/downloads, document import, share sheets, QR codes, parsers, media processing, or external URIs.

## Inputs
Accepted formats, size limits, parsers, storage destinations, downstream processing, backend contracts.

## Preconditions
Treat all external content as untrusted regardless of originating app or file extension.

## Context to inspect
Parsers, MIME/type checks, URI resolution, temporary files, archive extraction, image/media libraries, filenames, and upload APIs.

## Core knowledge
Validate structure and limits, not merely extensions. Parsing complex formats expands attack surface. Canonicalize paths and constrain resource consumption.

## Procedure
1. Enumerate input channels and formats.
2. Define strict size, count, depth, and type limits.
3. Validate using trusted parsers.
4. Generate safe internal filenames.
5. Prevent traversal and unsafe URI/file access.
6. Isolate temporary files and clean them reliably.
7. Avoid executing active content.
8. Revalidate server-side when uploaded.
9. Fuzz malformed and oversized inputs.

## Decision points
Reject unsupported formats rather than attempting permissive repair. Process risky formats server-side or in stronger isolation when practical.

## Common failure patterns
Extension-only validation, archive traversal, decompression bombs, arbitrary file reads via URI, unsafe temporary paths, and trusting metadata dimensions.

## Verification
Test malformed, oversized, nested, mislabeled, and path-manipulating inputs and monitor memory/CPU behavior.

## Expected output
A bounded input-processing pipeline with explicit validation and resource limits.

## Stop conditions
Escalate when required parsers have unresolved critical vulnerabilities or isolation is insufficient.