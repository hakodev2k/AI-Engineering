# BPF LSM Security Programs

## Purpose
Design eBPF LSM enforcement and audit logic with conservative security semantics.

## When to use
Use when kernel security hooks are required for process, file, credential, or other LSM-mediated decisions.

## Inputs
Threat model, policy, kernel LSM/BTF support, workload identity, audit requirements, failure policy.

## Context to inspect
Inspect active LSM configuration, hook semantics, return conventions, policy distribution, privilege boundaries, and coexistence with other security controls.

## Core knowledge
Security enforcement requires deterministic decisions, bounded policy state, auditable denials, and explicit interaction with existing LSMs. Missing context must not be silently interpreted.

## Procedure
1. Translate threat model into specific enforceable hooks.
2. Confirm BPF LSM support on target kernels.
3. Define identity and policy map contracts.
4. Implement minimum logic needed at each hook.
5. Specify deny/allow precedence and unknown-state behavior.
6. Rate-limit or aggregate audit telemetry safely.
7. Test policy updates atomically.
8. Exercise bypass attempts and workload churn.
9. Document recovery if the policy agent fails.

## Decision points
Use enforcement only where kernel context is sufficient. Prefer audit-only rollout before blocking for new policies. Choose fail-closed only when availability impact is explicitly accepted.

## Common failure patterns
Unclear return semantics, accidental global enforcement, stale identities, excessive audit storms, and assuming BPF LSM replaces all MAC controls.

## Verification
Positive/negative security tests, restart/failure injection, policy race tests, and audit correlation are required.

## Expected output
A narrowly scoped, testable enforcement mechanism with documented failure behavior.

## Stop conditions
Stop when policy ambiguity, unsupported hooks, or unacceptable availability risk prevents safe enforcement.