# File Upload Security

## Purpose
Handle untrusted files without enabling code execution, stored XSS, parser exploitation, path traversal, or uncontrolled resource consumption.

## When to use
Use for attachments, images, document import, archives, media processing, and user-generated downloads.

## Inputs
Upload requirements, storage design, parsers/processors, allowed formats, size limits, serving behavior, and malware controls.

## Context to inspect
Inspect multipart handling, filenames, temporary storage, archive extraction, content sniffing, transformation workers, object permissions, and download headers.

## Core knowledge
Extensions and client MIME types are untrusted. File safety depends on content validation, isolation, parser exposure, serving context, and lifecycle controls.

## Procedure
1. Define allowed formats, maximum sizes, counts, and business need.
2. Generate server-side storage identifiers; do not trust paths or filenames.
3. Validate file structure with format-aware parsers where feasible.
4. Store uploads outside executable/application roots and with least privilege.
5. Isolate risky transformations and bound CPU, memory, time, and archive expansion.
6. Scan for malware when threat model and operational capability justify it.
7. Serve untrusted content with safe content type/disposition and separate origin when strong isolation is needed.
8. Remove metadata if privacy requirements demand it.
9. Test polyglots, malformed files, traversal names, oversized archives, and active content.

## Decision points
Re-encode media when normalization materially reduces attack surface. Quarantine asynchronous processing when synchronous parsing creates unacceptable risk or latency.

## Common failure patterns
Extension-only checks, trusting MIME, extracting archives unsafely, public writable buckets, and serving HTML/SVG inline on a privileged origin.

## Verification
Confirm malicious fixtures cannot escape storage, execute in serving context, or exhaust processing beyond configured bounds.

## Expected output
A bounded, isolated upload pipeline with adversarial test evidence.

## Stop conditions
Escalate parser vulnerabilities, required support for inherently active formats on trusted origins, or malware findings suggesting active abuse.