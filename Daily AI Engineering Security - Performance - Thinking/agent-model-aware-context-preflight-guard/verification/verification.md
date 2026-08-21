# Verification Report

## Status vocabulary

- **Implemented:** artifact/code exists in this package.
- **Measured:** backed by public evidence or deterministic metrics produced by the package.
- **Verified:** checked against the package invariants or repository manifest.

## Implemented

- Final-render request admission with explicit target model/context limit.
- Exact-count path with count provenance.
- Conservative fallback path that refuses near-boundary estimated sends.
- Explicit output/reasoning reserves and safety margin.
- Request SHA-256 identity for retry classification.
- Bounded reduction workflow and protected-context rules.
- Estimate-vs-measured telemetry/calibration script.
- Regression suite covering allowed/oversized exact counts, token-dense ASCII, Unicode, near-boundary fallback, request identity, and invalid limits.
- Mixed-model integration rules and example model registry.

## Measured / evidence-backed

Public reports establish the failure mode:

- OpenAI Codex #35093 documents a fixed 4-bytes/token truncation approximation producing context-window failures on token-dense content.
- OpenAI Codex #37135 reports an approximation replacing measured post-compaction usage and shifting decisions.
- OpenAI Codex #36806 reports oversized background transcript processing failing after consuming quota.
- Claude Code #83355 reports a subagent using the coordinator/session context window rather than the smaller target-model window.

The package itself does **not** manufacture performance claims. Adoption metrics are defined in `evidence/research.md` and must be collected in the integrating runtime.

## Verification performed in this run

1. Reviewed rules against the selected Token-category problem and confirmed they address model identity, final request size, count provenance, safety reserves, reduction, and bounded retries.
2. Reviewed `scripts/context_preflight.py` for input validation, deterministic exit codes, request hashing, exact-vs-estimated distinction, conservative fallback, and fail-closed behavior.
3. Reviewed `scripts/token_budget_report.py` for immutable JSONL telemetry, under-count detection, and non-zero summary status when under-counts are present.
4. Reviewed regression tests for token-dense ASCII/JSON-like text, Unicode, exact over-budget rejection, estimated near-boundary rejection, and configuration failure.
5. Attempted to execute the GitHub-saved unit tests by downloading the generated artifacts from `raw.githubusercontent.com`. The current execution container could not resolve that host (`curl: (6) Could not resolve host`), so this report does **not** claim that the GitHub-saved test suite was runtime-executed in this run.
6. Repository existence/manifest is verified separately through the GitHub integration after all files are saved.

## Invariant checklist

- **I1:** admitted exact-count request must satisfy `input + reserves + margin <= limit` — enforced in code.
- **I2:** model identity is mandatory CLI input — enforced by argparse; integration rule fails closed on unresolved model metadata.
- **I3:** fixed byte/char ratio is never labeled exact — enforced by `count_source`.
- **I4:** estimated near-boundary requests are not admitted — enforced by threshold logic.
- **I5:** context-length failures must not retry identical hashes — workflow/hook rule; requires runtime integration to enforce end-to-end.
- **I6:** protected context survives reduction — workflow/rule; requires host runtime component metadata to verify end-to-end.

## Runtime verification required after integration

Run:

`python -m unittest tests/test_context_preflight.py`

Then replay representative non-sensitive production-shaped requests with an authoritative tokenizer/provider count and require:

- 0 locally caused `context_length_exceeded` failures;
- 0 identical oversized retries;
- 100% preflight coverage;
- 100% target-model metadata coverage;
- 0 fallback under-counts beyond configured safety margin in the holdout corpus;
- no removal of protected context IDs during reduction.

## Residual risks

- Provider-side hidden prompt/tool overhead may differ from locally rendered payloads; prefer provider counting when exposed and retain safety margin.
- Model aliases/tokenizers/context limits can change; registry entries require versioned maintenance.
- Multimodal tokens may need provider-specific counting adapters; this generic script treats the serialized request only and must not be claimed exact for unsupported modalities.
- A correct preflight cannot prevent a host application from bypassing the guard on an alternate provider-call path; call-path coverage is an integration requirement.

## Package-generation conclusion

The reusable package implementation and verification procedure are complete. Runtime adoption is considered production-verified only after its target application's authoritative token counter and regression corpus pass the criteria above; this report deliberately distinguishes that future integration evidence from package-generation completeness.
