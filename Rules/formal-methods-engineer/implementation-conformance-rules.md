# Implementation Conformance Rules

## Purpose
Ensure verified models remain connected to the software, hardware, configuration, and runtime behavior they are intended to justify.

## Scope
Applies to model-to-code correspondence, generated code, verified components, runtime configuration, and deployment assumptions.

## MUST
- Define the correspondence between formal state, operations, and observable implementation behavior.
- Identify implementation behavior not represented in the model, including errors, retries, resource limits, and external effects.
- Validate critical assumptions against actual compiler, runtime, platform, protocol, and configuration semantics.
- Reassess conformance after implementation changes affecting verified behavior.
- Use tests, generated artifacts, refinement proofs, or runtime assertions to connect model claims to code where practical.

## MUST NOT
- Claim implementation correctness from model correctness alone.
- Ignore undefined behavior, integer overflow, memory-model effects, serialization, or runtime failures when they affect the claim.
- Treat generated code as trusted merely because its source model was verified.

## SHOULD
- Minimize manually maintained semantic gaps between specification and implementation.
- Use executable specifications or generated monitors where they improve traceability.

## Exceptions
Unverified implementation gaps require explicit documentation, risk assessment, and approval for claims that depend on them.

## Verification
Use refinement evidence, contract tests, differential execution, runtime assertions, code review, configuration inspection, and trace comparison.