# Memory Forensics Rules

## Purpose
Derive reliable runtime findings from memory while controlling profile, parser, and interpretation errors.

## Scope
Applies to RAM images, crash dumps, process memory, kernel structures, and memory-derived artifacts.

## MUST
- Memory images MUST be integrity-checked before substantive analysis.
- OS/kernel/build assumptions used by parsers MUST be validated against evidence.
- Critical findings MUST preserve offsets, process context, parser/module version, and extraction method.
- Hidden-process or injection claims MUST use corroborating structures or behavioral evidence.
- Credential or secret material recovered from memory MUST receive restricted handling.

## MUST NOT
- MUST NOT treat parser failure as proof that an artifact is absent.
- MUST NOT expose recovered credentials in ordinary reports or logs.
- MUST NOT infer maliciousness solely from anomalous memory structures.

## SHOULD
- Cross-check high-impact findings with multiple plugins, raw bytes, disk artifacts, or telemetry.
- Preserve symbol/profile inputs needed for reproduction.

## Exceptions
Tool-specific interpretation may be used when alternatives do not support the platform, with explicit limitation and independent corroboration where possible.

## Verification
Re-run critical plugins, inspect raw offsets, validate symbols/profiles, compare process and module views, and correlate with disk/network evidence.