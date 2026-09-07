# Memory Safety Research Rules

## Purpose
Require rigorous validation of memory corruption findings and prevent unsupported exploitability claims.

## Scope
Applies to out-of-bounds access, use-after-free, double free, uninitialized memory, integer-driven memory errors, race-related corruption, and related native-code defects.

## MUST
- Memory-safety findings MUST preserve the crashing or triggering input and exact affected build information.
- Root-cause analysis MUST distinguish the first invalid operation from later secondary corruption when evidence permits.
- Sanitizer, debugger, crash-dump, or equivalent runtime evidence MUST support confirmed memory-corruption claims.
- The researcher MUST evaluate whether attacker-controlled data reaches the corrupted object or control-relevant state before asserting exploitability.
- Build flags, allocator behavior, architecture, mitigations, and optimization level MUST be recorded when they materially affect reproduction.
- Integer conversions, lifetime boundaries, ownership assumptions, and concurrency interactions MUST be considered when tracing root cause.
- Fix validation MUST confirm both the original trigger and representative neighboring cases.

## MUST NOT
- MUST NOT label every crash as code execution.
- MUST NOT assume a sanitizer-only manifestation is non-security-relevant.
- MUST NOT disable mitigations and then report the resulting capability as representative of a protected deployment without qualification.
- MUST NOT publish weaponized exploitation detail when minimal corruption evidence is sufficient for remediation.

## SHOULD
- Use multiple instrumentation modes when optimization or allocator differences may hide the root cause.
- Reduce triggering inputs to the smallest form that preserves the defect without removing required state.
- Review structurally similar code for variant defects after root cause is established.

## Exceptions
When runtime instrumentation changes timing or behavior enough to prevent reproduction, alternative evidence may be used if the limitation, instrumentation effect, and corroborating evidence are documented.

## Verification
Review minimized inputs, build metadata, sanitizer/debugger output, root-cause trace, mitigation assumptions, and fix regression tests. Confirm exploitability language matches observed attacker control and not merely crash severity.