# Debugging and Investigation Rules

## Purpose
Ensure WebAssembly failures are investigated with reproducible evidence rather than speculative fixes.

## Scope
Applies to traps, crashes, incorrect output, performance regressions, compatibility failures, and production incidents.

## MUST
- Investigations MUST identify the exact module/component version, runtime version, configuration, and relevant capabilities.
- Reproduction attempts MUST preserve representative inputs while protecting sensitive data.
- Root cause MUST be identified or bounded by evidence before broad corrective changes are made.
- Stack traces, symbols, logs, metrics, traces, and minimized reproducers MUST be retained when they materially support the conclusion.
- Fixes MUST include regression verification at the layer where the failure occurred.

## MUST NOT
- A runtime bug MUST NOT be assumed merely because behavior differs from expectation.
- Optimization flags MUST NOT be changed blindly as a substitute for diagnosis.
- Production artifacts MUST NOT be replaced by debug builds without understanding behavior and security differences.
- Diagnostic collection MUST NOT expose unrelated tenant memory or secrets.

## SHOULD
- Reduce failures to the smallest reproducible module/interface interaction.
- Compare behavior across runtimes when portability is implicated.
- Use binary inspection and disassembly when source-level evidence is insufficient.

## Exceptions
During active incidents, mitigation may precede complete root-cause analysis, but evidence must be preserved and follow-up investigation assigned.

## Verification
Review incident notes or bug reports for environment identity, hypotheses, evidence, reproduction, regression tests, and a causal explanation consistent with observed data.