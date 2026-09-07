# Testing and Regression Rules

## Purpose
Prevent media regressions that ordinary API tests cannot detect.

## Scope
Unit, integration, end-to-end, golden-media, player, interoperability, impairment, and failure testing.

## MUST
- Critical media transformations MUST have regression inputs covering representative codecs, resolutions, frame rates, audio layouts, timestamps, and malformed cases.
- Output validation MUST inspect media semantics, not only process exit status or HTTP success.
- Production-critical changes MUST include end-to-end playback testing through realistic packaging and delivery paths.
- Non-deterministic tests MUST be investigated and bounded; flaky tests MUST NOT be treated as reliable evidence.

## MUST NOT
- MUST NOT replace compatibility testing with a single synthetic asset.
- MUST NOT update golden expectations merely to make an unexplained regression pass.
- MUST NOT skip failure-path testing for reconnects, timeouts, corrupt media, and partial dependency failure.

## SHOULD
- Network impairment and long-duration tests SHOULD represent real operational conditions.
- Regression corpora SHOULD include previously observed production failures.

## Exceptions
Reduced coverage requires documented risk, alternative evidence, and reviewer approval for critical paths.

## Verification
Inspect CI evidence, golden comparisons, media validators, player E2E results, impairment tests, and regression history.