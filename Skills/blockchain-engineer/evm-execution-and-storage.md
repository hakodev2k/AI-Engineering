# EVM Execution and Storage

## Purpose
Reason precisely about EVM execution, storage layout, call context, gas, revert behavior, and bytecode-level consequences when implementing or debugging contracts.

## When to use
Use for low-level bugs, proxy/storage reviews, gas investigations, delegatecall behavior, and compiler-output analysis.

## Inputs
Solidity source, compiler settings, bytecode, storage layout, transaction trace, failing transaction.

## Preconditions
Target chain is EVM-compatible and relevant compiler metadata is available.

## Context to inspect
Opcodes, call stack, calldata, msg.sender/value, storage slots, memory, return data, proxy implementation, and trace logs.

## Core knowledge
EVM state is slot-based, calls have distinct context semantics, reverts unwind state, delegatecall preserves caller storage context, and storage packing/layout are compiler-sensitive.

## Procedure
1. Reproduce the transaction at the same state when possible.
2. Inspect call trace and identify the exact failing frame.
3. Map source variables to storage slots.
4. Distinguish CALL, STATICCALL, DELEGATECALL, and CREATE behavior.
5. Verify calldata encoding and selector resolution.
6. Inspect revert data rather than only top-level errors.
7. Check gas consumption around dynamic memory/storage operations.
8. Compare compiler-generated layout before upgrades.
9. Validate conclusions with a focused test or trace.

## Decision points
Use source-level debugging for normal logic; drop to trace/opcode analysis when proxy context, assembly, bytecode, or storage behavior is material.

## Common failure patterns
Confusing implementation and proxy storage, assuming internal/external calls have identical context, misreading packed slots, and diagnosing out-of-gas as business-logic failure.

## Verification
Confirm slot values, trace frames, revert reason, and reproduction in a deterministic fork/test.

## Expected output
Root-cause explanation tied to EVM state/call semantics and a verified remediation.

## Stop conditions
Escalate when chain state or compiler artifacts needed for a trustworthy reconstruction are unavailable.