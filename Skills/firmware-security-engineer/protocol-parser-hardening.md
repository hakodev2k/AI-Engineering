# Protocol Parser Hardening

## Purpose
Design and review firmware parsers for network, radio, file, peripheral, and update formats so malformed attacker-controlled input cannot cause memory corruption, state confusion, or denial of service.

## When to use
Use when adding or modifying binary/text protocols, processing packets/files, integrating peripherals, or investigating parser crashes and fuzz findings.

## Inputs
Protocol specification, implementation, framing rules, maximum sizes, state machine, trust boundaries, fuzz corpus, and target resource limits.

## Preconditions
Identify which fields are attacker-controlled and establish explicit maximum lengths, nesting, counts, and processing budgets.

## Context to inspect
Framing, endian conversions, length/count arithmetic, optional fields, TLVs, checksums, decompression, recursion, state transitions, retransmission, timeout logic, and downstream consumers.

## Core knowledge
Parsing is a security boundary. Validate structure before semantic use, avoid trusting self-declared lengths, perform overflow-safe arithmetic, reject ambiguous encodings, and bound CPU/memory consumption. Stateful protocols require transition validation as well as byte validation.

## Procedure
1. Write the accepted grammar/state machine and resource limits.
2. Separate framing, structural validation, semantic validation, and action.
3. Check available bytes before every read and arithmetic operation before allocation/copy.
4. Reject integer overflow, invalid enum values, duplicate forbidden fields, impossible nesting, and trailing ambiguity.
5. Canonicalize only after validating encoding rules.
6. Bound decompression ratios, collection counts, recursion depth, and processing time.
7. Ensure invalid messages do not partially mutate privileged state.
8. Handle fragmentation/reassembly with bounded buffers and timeouts.
9. Fuzz parser entry points using valid seeds plus mutations.
10. Add regression cases for every crash/hang and protocol ambiguity.
11. Measure worst-case target resource usage.

## Decision points
A generated parser can reduce handwritten bugs if the generator and grammar are mature. Zero-copy parsing can save RAM but increases lifetime/alignment complexity; copying validated fields may be safer at trust boundaries.

## Common failure patterns
Length-of-length overflow; parsing before complete frame arrival; unchecked TLV nesting; inconsistent duplicate-field handling; decompression bombs; partial state changes before validation; parser and serializer accepting different canonical forms.

## Verification
Run unit boundary tests, malformed corpus tests, coverage-guided fuzzing on host/emulator, target stress tests, and state-machine transition tests. Confirm no hangs, out-of-bounds accesses, uncontrolled allocation, or unauthorized state changes.

## Expected output
Hardened parser, explicit limits, fuzz/regression corpus, resource measurements, and documented compatibility decisions.

## Stop conditions
Escalate when the protocol specification is ambiguous on security-critical behavior, interoperability requires accepting unsafe forms, or target resource limits cannot safely support worst-case input.