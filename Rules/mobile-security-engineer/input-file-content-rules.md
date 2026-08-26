# Input, File, and Content Handling Rules

## Purpose
Prevent malformed or hostile external content from crossing mobile application trust boundaries unsafely.

## Scope
User input, imported files, shared content, QR codes, clipboard data, push payloads, URIs, media, and parsed documents.

## MUST
- Validate untrusted input at the boundary where its semantic constraints are known.
- Enforce size, type, structure, range, and resource limits before expensive or privileged processing.
- Use safe parsing APIs and handle malformed input without exposing sensitive diagnostics.
- Revalidate server-side any input that affects authoritative state.

## MUST NOT
- Trust file extensions, client MIME labels, QR content, clipboard data, or push payload fields as proof of safety.
- Build commands, queries, or privileged paths through unsafe string concatenation.
- Open externally supplied files with broader access than required.

## SHOULD
- Normalize inputs before policy comparisons where canonicalization ambiguity exists.
- Isolate complex parsers from high-value secrets where feasible.

## Exceptions
Relaxed validation requires protocol justification, bounded limits, abuse analysis, and test evidence.

## Verification
Use boundary tests, malformed inputs, oversized content, ambiguous encodings, unexpected types, and integration tests against authoritative services.