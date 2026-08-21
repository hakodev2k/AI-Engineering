# Hooks

## PreToolResult — Completeness Contract Check

**Trigger:** immediately after a tool runner finishes capturing bytes but before output is stored in transcript or sent to the model.

**Action:** create/validate residual metadata; if output exceeds model budget, externalize full bytes and build bounded head/tail view.

**Command/script:**
`python scripts/residual_guard.py capture --input <captured-output-file> --artifact-dir .agent-output-artifacts --max-model-bytes 40000 --result-file <result.json>`

**Expected result:** JSON contains produced/retained/omitted/truncated/capture_complete/recoverability/artifact_path/sha256 and a bounded `model_view`.

**Failure behavior:** fail closed for evidence-sensitive tools. Return a structured host error rather than passing unaccounted partial output to the model.

---

## PostCapture — Artifact Verification

**Trigger:** after residual result is created and before an evidence-sensitive workflow marks the observation usable.

**Action:** verify accounting, artifact existence, byte size, and SHA-256.

**Command/script:**
`python scripts/residual_guard.py verify --result <result.json>`

**Expected result:** exit `0` and a `status=verified` record.

**Failure behavior:** mark evidence `unverified`; do not retry the underlying original command automatically. Retry verification once only for transient filesystem I/O.

---

## PreConclusion — Truncated Evidence Gate

**Trigger:** before final answer, code-change verification, incident conclusion, test-status claim, or security finding.

**Action:** inspect evidence ledger. If any decisive source has `truncated=true` and required evidence lies outside recovered ranges, block completion and invoke bounded recovery workflow.

**Command/script:** host-specific ledger validator; deterministic rule is defined in `rules/engineering-rules.md`.

**Expected result:** every decisive claim maps to complete evidence or verified recovered ranges.

**Failure behavior:** return `insufficient evidence` and exact recovery requirement. Never substitute speculation.

---

## PreRelease — Residual Regression Test

**Trigger:** tool runner, output buffer, formatter, persistence, or artifact-store changes.

**Action:** run `tests/test_residual_guard.py` and integration fixtures for the changed runner.

**Command/script:**
`python -m unittest tests/test_residual_guard.py`

**Expected result:** below-limit, oversized, and corrupted-artifact cases behave as specified.

**Failure behavior:** block release of the residual integration until fixed. Test thresholds must not be loosened merely to obtain green status.
