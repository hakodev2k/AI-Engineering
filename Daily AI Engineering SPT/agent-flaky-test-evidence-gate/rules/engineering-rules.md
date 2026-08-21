# Engineering Rules

## MUST
- MUST preserve the first failing run, its command, exit code, repository revision, working-tree state, and raw output before any failure-driven repair.
- MUST attempt unchanged-code reproduction before changing code solely because of a test failure, unless reproduction is unsafe, destructive, impossible, or exceeds an explicit resource limit; the exception must be recorded.
- MUST classify mixed pass/fail outcomes as nondeterministic evidence, never as a clean pass.
- MUST keep retries bounded by `config/policy.json`.
- MUST compare normalized failure fingerprints, not only exit codes.
- MUST distinguish product/test failure evidence from infrastructure/environment evidence when observable markers exist.
- MUST preserve raw logs when normalization/fingerprinting is used.
- MUST treat `UNKNOWN` as a blocking state when the policy says so.
- MUST require post-change verification against the baseline fingerprint for failure-driven fixes.
- MUST require independent verification before declaring a high-impact or ambiguous failure fixed.
- MUST report `Implemented`, `Measured`, and `Verified` as separate states.
- MUST stop when the run budget is exhausted instead of inventing certainty.

## MUST NOT
- MUST NOT edit production code merely to make a single unexplained failure disappear.
- MUST NOT accept one passing rerun as proof that a failure was fixed.
- MUST NOT repeatedly rerun until a pass appears and then discard prior failures.
- MUST NOT quarantine, skip, weaken, or delete a test solely to reach green status without evidence that quarantine is the intended engineering decision.
- MUST NOT convert timeouts, network failures, dependency-resolution failures, or rate limits into product-code defects without causal evidence.
- MUST NOT normalize away meaningful fields such as test identity, assertion type, exception class, or stable source location.
- MUST NOT use unlimited retries or open-ended test-fix loops.
- MUST NOT let the implementing agent be the sole verifier when independent verification is required.
- MUST NOT claim causality merely because tests pass after a code change; baseline comparison is required.

## SHOULD
- SHOULD start with the smallest reproducible test scope and then widen to the relevant suite.
- SHOULD run flaky investigation on the same revision and as similar an environment as practical.
- SHOULD save structured JSONL run records for machine comparison.
- SHOULD record environment variables/configuration relevant to timing, locale, timezone, concurrency, network, dependency versions, and random seeds without recording secrets.
- SHOULD separate known flakes from newly observed nondeterminism.
- SHOULD increase confidence through independent reruns rather than repeated subjective inspection.
- SHOULD use deterministic scripts for fingerprinting and classification instead of asking an LLM to compare long raw logs.
- SHOULD create a dedicated flake-investigation issue when nondeterminism is real but out of scope for the requested change.
