# Secret Memory Handling Rules

## Purpose
Minimize accidental exposure of sensitive cryptographic material in process memory and diagnostics.

## Scope
Keys, seeds, passwords, plaintext secrets, intermediate values, and cryptographic buffers.

## MUST
- Minimize secret lifetime, copies, serialization, and exposure across process boundaries.
- Use platform-supported protected or non-exportable representations when the threat model warrants them.
- Exclude secret values from logs, traces, crash metadata, telemetry, and error messages.

## MUST NOT
- Depend on manual zeroization where the language/runtime provides no reliable guarantee and then claim the memory is erased.
- Convert secrets into immutable or widely copied forms unnecessarily.

## SHOULD
- Isolate sensitive operations and document runtime limitations honestly.

## Exceptions
Required diagnostic capture needs explicit authorization, secure handling, retention limits, and deletion verification.

## Verification
Review data flow, logging, dumps, serialization, runtime behavior, and secret-scanning tests.