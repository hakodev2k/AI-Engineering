# Workflows

## Workflow A — Integrate the Output Residual Contract

**Trigger:** a tool may emit more data than the model/persistence budget.

**Goal:** keep model context bounded while proving what was produced, omitted, and recoverable.

**Inputs:** tool runner, output limits, `config/policy.json`, representative fixtures.

**Baseline:** measure produced bytes, model-visible bytes, persisted bytes, omitted accounting, and recovery behavior before changes.

**Context:** output capture, formatting, persistence, artifact storage, model-result serialization.

### Stages
1. **Observe** — Residual Auditor maps every truncation/cap stage.
2. **Baseline** — run below/near/far-over-limit fixtures; record truth and current behavior.
3. **Cause** — identify where byte accounting or recoverability is lost.
4. **Hypothesis** — select minimal insertion point for content-addressed artifact + residual metadata.
5. **Implement** — Integration Implementer adds contract and bounded head/tail view.
6. **Measure** — repeat identical fixtures and compare metrics.
7. **Better?** — if any false-complete/unknown omission remains, re-evaluate once; maximum two implementation iterations.
8. **Verify** — Independent Verifier runs clean and adversarial fixtures.

**Tools:** `scripts/residual_guard.py`, test runner, hashing, byte counters.

**Outputs:** residual contract, artifacts, fixture results, before/after metrics.

**Checkpoints:** after baseline; before mutation; after implementation; before final approval.

**Metrics:** residual coverage, false-complete count, model bytes/result, artifact verification rate, recovery reads.

**Retry policy:** maximum two implementation iterations. I/O-only failures may be retried once without counting as a design iteration.

**Stop conditions:** verified pass; unrecoverable architectural limitation; or retry budget exhausted.

**Failure path:** preserve baseline and failed evidence, revert unsafe change if needed, report exact missing contract field/boundary.

**Verification:** all policy invariants and tests pass independently.

**Definition of Done:** baseline captured; limitation documented; ORC implemented; hashes/sizes verified; bounded model view demonstrated; truncated fixtures recoverable; no false completion; risks documented.

---

## Workflow B — Reason From a Truncated Tool Result

**Trigger:** the agent receives `truncated=true` or an unknown completeness state.

**Goal:** answer the task using sufficient evidence without loading/re-running unbounded output.

**Inputs:** residual metadata, retained head/tail, artifact handle, decision question.

**Baseline:** record exactly what evidence is currently visible and which region is omitted.

### Stages
1. **Classify decision sensitivity** — determine whether omitted content could change the decision.
2. **Validate residual** — verify produced/retained/omitted accounting and artifact digest.
3. **Form observable query** — identify exact evidence needed: error name, failing test, summary, ID, final count, etc.
4. **Search artifact deterministically** — locate anchors without model-wide ingestion.
5. **Read bounded ranges** — retrieve only relevant neighborhoods.
6. **Update evidence ledger** — Facts / Unknowns / Recovered evidence / Risks.
7. **Decision gate** — conclude only if decisive claims have complete or recovered support.

**Responsible agents:** main agent + Independent Verifier for high-impact decisions.

**Tools:** bounded search/range reader supplied by host; verified artifact.

**Outputs:** decision plus verification status and evidence offsets.

**Checkpoints:** before first recovery read and before final conclusion.

**Metrics:** recovery read count, bytes recovered, unresolved unknowns, reruns avoided.

**Retry policy:** maximum three targeted recovery reads by default.

**Stop conditions:** sufficient evidence; corrupt/unavailable artifact; or read budget exhausted.

**Failure path:** return `insufficient evidence` with exact missing region/question. Never fabricate the omitted content.

**Verification:** verifier checks source artifact hash and claimed ranges.

**Definition of Done:** all decisive facts are supported; uncertainty is explicit; no truncated-unrecovered evidence is represented as verified.

---

## Workflow C — Regression Gate for Tool Runners

**Trigger:** release, runner upgrade, truncation-policy change, storage refactor.

**Goal:** prevent regression to silent output loss.

**Inputs:** test fixtures and previous accepted metrics.

**Stages:** generate deterministic fixtures → capture → verify residual → corrupt artifact and expect failure → compare model-view budget → compare produced counts across different-size oversized fixtures.

**Retry policy:** test infrastructure failure may retry once; assertion failure is not retried without diagnosis.

**Stop condition:** all tests pass or release is blocked.

**Definition of Done:** zero false-complete cases, 100% expected artifact verification, budget respected, and failure fixtures fail closed.
