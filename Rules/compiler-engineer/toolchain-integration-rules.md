# Toolchain Integration Rules

## Purpose
Integrate assemblers, linkers, runtimes, SDKs, and build systems through explicit contracts.

## Scope
External tool invocation, object formats, linker interfaces, runtime libraries, environment discovery, and exit handling.

## MUST
- External tool arguments MUST be constructed without shell-injection ambiguity.
- Tool version and capability assumptions MUST be validated or documented.
- Nonzero exits and malformed outputs MUST propagate as compilation failures with diagnostic context.
- Temporary files MUST have safe lifecycle and collision behavior.

## MUST NOT
- MUST NOT assume tools found first on PATH are compatible when an explicit toolchain is configured.
- MUST NOT swallow linker or assembler errors.
- MUST NOT expose secrets through command lines or diagnostic dumps.

## SHOULD
- Integrations SHOULD support hermetic tool selection where build systems require it.
- Invocation logging SHOULD be reproducible with sensitive values redacted.

## Exceptions
Platform-specific discovery requires documented precedence and tests.

## Verification
Use integration tests with compatible/incompatible tools, failure injection, path edge cases, quoting tests, and artifact validation.