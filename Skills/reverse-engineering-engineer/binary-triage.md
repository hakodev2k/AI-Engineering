# Binary Triage

## Purpose
Rapidly characterize an unknown executable or library, identify likely risk and analysis paths, and avoid wasting time on low-value techniques.

## When to use
Use at the start of authorized reverse engineering, incident analysis, interoperability research, or vulnerability investigation. Do not execute unknown binaries on production or an unisolated workstation.

## Inputs
Binary/sample, provenance, target platform, investigation goal, hashes, available symbols, execution constraints.

## Preconditions
Confirm authorization, preserve the original artifact, work from a copy, and use an isolated analysis environment when execution may occur.

## Context to inspect
File format, architecture, compiler/runtime clues, imports/exports, sections, strings, signatures, entropy, timestamps, debug metadata, resources, and neighboring artifacts.

## Core knowledge
Static metadata can strongly narrow hypotheses but is not proof of behavior. Packers, obfuscators, stripped symbols, forged timestamps, and embedded payloads can mislead. Preserve evidence and distinguish observation from inference.

## Procedure
1. Record cryptographic hashes and provenance.
2. Identify format, architecture, endianness, ABI, and runtime.
3. Inspect headers, sections/segments, permissions, overlays, and entropy anomalies.
4. Enumerate imports, exports, symbols, strings, resources, and embedded files.
5. Identify compiler, linker, framework, packing, or obfuscation indicators.
6. Map likely entry points and high-value capabilities from dependencies and strings.
7. Compare against known-good or related versions when available.
8. Rank hypotheses and select the least invasive next analysis technique.
9. Document uncertainties and evidence references.

## Decision points
Prefer static analysis when behavior can be inferred safely. Escalate to controlled dynamic analysis when runtime resolution, unpacking, generated code, or environment-dependent behavior prevents reliable conclusions.

## Common failure patterns
Executing too early; trusting strings as behavior; treating signatures as proof of safety; overlooking architecture mismatches; modifying evidence; confusing packed data with encryption; failing to record hashes.

## Verification
Re-run identification with an independent tool where practical, validate architecture and entry point against headers, and ensure conclusions cite observable evidence.

## Expected output
A reproducible triage record containing identity, platform, notable structure, likely capabilities, confidence levels, and prioritized next steps.

## Stop conditions
Stop if authorization is unclear, isolation is inadequate, evidence integrity cannot be preserved, or execution would create unacceptable operational risk.