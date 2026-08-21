# Test Evidence Freshness Rules

## MUST
- Bind every passing build/test/static-analysis result used for completion to the exact `source_revision` and `base_revision` it verified.
- Compute an `input_fingerprint` over relevant lockfiles, build/test configuration, generated inputs, feature flags, and other deterministic inputs used by the verification command.
- Record `observed_at` with timezone and preserve command plus artifact references.
- Re-evaluate freshness after every source edit, rebase, dependency/configuration change, environment change relevant to the test category, or policy change.
- Treat `failed` and `unknown` evidence as non-passing.
- Require a matching environment fingerprint for integration, E2E, and performance evidence when policy requires it.
- Re-run the smallest sufficient verification set when existing evidence becomes stale.
- Require independent review for configured high-risk categories; reviewer must be bound to the current revision and evaluation fingerprint.
- Distinguish `executed` from `verified`: command execution without fresh passing evidence is not verification.
- Stop before any approval-required production, destructive, schema, infrastructure, secret, breaking-contract, force-push, or security-weakening action.

## MUST NOT
- Reuse a green result from an earlier commit after code changes merely because changed files look unrelated.
- Use branch names, timestamps, CI job names, screenshots, or conversational claims as substitutes for exact revision binding.
- Refresh `observed_at` without actually re-running or independently re-verifying the evidence.
- Convert stale evidence to fresh through human approval alone.
- Let the implementing agent be the only high-risk verifier.
- Retry deterministic test failures, validation failures, or stale-input mismatches as transient errors.
- Silently widen tool permissions to obtain missing evidence.

## SHOULD
- Track verification commands close to the repository configuration that defines them.
- Prefer targeted tests when impact analysis is reliable, but record why the selected set is sufficient.
- Preserve failing and stale evidence for diagnosis instead of overwriting it.
- Use immutable artifact references or hashes for important logs/reports.
- Keep policy conservative and customize category freshness windows only with documented rationale.