# Core Skills

## Skill 1 — Establish Output Completeness Baseline

**Purpose:** determine whether a tool integration can prove what output was produced, retained, omitted, and recoverable before relying on it for reasoning.

**Trigger:** onboarding a tool runner, unexplained missing log evidence, inconsistent reruns, or any result with truncation/elision markers.

**Inputs:** representative tool outputs, runner configuration, model-visible result, persisted transcript, `config/policy.json`.

**Preconditions:** read-only access to sample output; no production mutation required.

**Required context:** capture cap, presentation cap, persistence path, output encoding, whether full bytes remain available.

**Tools:** `scripts/residual_guard.py`, byte counters, SHA-256, existing runner logs.

**Procedure:**
1. Produce or obtain three deterministic fixtures: below limit, just above limit, and far above limit.
2. Record true byte sizes and hashes outside the agent runtime.
3. Pass each fixture through the integration.
4. Compare produced, retained, omitted, model-visible, and durable values.
5. Mark each stage as `complete`, `bounded-with-residual`, `bounded-without-residual`, or `unknown`.
6. If any stage discards bytes without accounting, classify the integration as unsafe for evidence-sensitive conclusions.
7. Capture baseline metrics before changing the integration.

**Decisions:** if omitted bytes cannot be quantified, fail closed; if full output is recoverable, prefer artifact retrieval over command replay.

**Constraints:** do not infer completeness from exit code or successful tool status. Do not load unbounded outputs into model context.

**Expected output:** baseline table with byte accounting, recoverability, and blocking gaps.

**Metrics:** residual coverage %, false-complete count, model-visible bytes/result, artifact verification rate.

**Verification:** fixture truth must match reported accounting and hashes.

**Failure handling:** retry measurement once for I/O/transient runner errors; otherwise preserve evidence and stop integration approval.

**Stop conditions:** baseline is complete or a blocking unknown/discard path is proven.

---

## Skill 2 — Recover Missing Evidence Without Re-execution

**Purpose:** retrieve only the omitted evidence needed to answer a concrete question.

**Trigger:** a truncated result is relevant to a decision, verification claim, diagnosis, security finding, test result, or incident conclusion.

**Inputs:** residual metadata, artifact path/handle, question to verify, policy recovery budget.

**Preconditions:** artifact hash and size verified; recovery handle points to the same captured execution.

**Required context:** head/tail already seen, byte ranges already read, decision that requires additional evidence.

**Tools:** ranged file reads, search tools, deterministic parsers.

**Procedure:**
1. State the missing evidence as an observable question, not a broad request to reread everything.
2. Search the immutable artifact for anchors such as failing test name, exception, final summary, or unique ID.
3. Read bounded ranges around relevant offsets.
4. Track recovered ranges and findings.
5. Stop when the question is answered or the configured recovery-read limit is reached.
6. If unresolved, mark the conclusion `insufficient evidence` and escalate instead of guessing.

**Decisions:** prefer index/search → bounded range; only reread the full artifact when policy explicitly permits and its size is safe.

**Constraints:** never rerun a non-idempotent command solely to recover discarded output when the original artifact exists.

**Expected output:** facts, source offsets, remaining unknowns, verification status.

**Metrics:** recovery reads/task, recovered bytes/task, reruns avoided, unresolved evidence count.

**Verification:** cited ranges must belong to the verified artifact digest.

**Failure handling:** maximum three recovery attempts by default; then escalate.

**Stop conditions:** evidence sufficient, artifact unavailable/corrupt, or retry budget exhausted.

---

## Skill 3 — Evidence-Safe Conclusion Gate

**Purpose:** prevent an agent from converting partial observations into unsupported completion or root-cause claims.

**Trigger:** before final answer, incident conclusion, code-change verification, security finding, or test-status claim.

**Inputs:** evidence ledger, all residual metadata, recovered ranges, task acceptance criteria.

**Preconditions:** every evidence-bearing tool result has a completeness status.

**Procedure:**
1. Separate `Facts`, `Unknowns`, `Truncated evidence`, `Recovered evidence`, `Decision`, and `Verification status`.
2. For every decisive fact, identify its source result and completeness state.
3. Reject any decisive fact supported only by a truncated/unrecoverable region.
4. Recover missing evidence when bounded recovery is possible.
5. If evidence remains incomplete, downgrade the claim and stop further speculative implementation.
6. Require independent verification for high-impact conclusions.

**Expected output:** a decision record containing only evidence-backed claims.

**Metrics:** unsupported-claim rate, verification coverage, rework caused by missing evidence, false completion rate.

**Verification:** verifier independently checks the residual ledger and decisive source ranges.

**Failure handling:** no unlimited investigation loops; after configured recovery budget, escalate with exact missing evidence.

**Stop conditions:** verified decision or explicit insufficient-evidence outcome.
