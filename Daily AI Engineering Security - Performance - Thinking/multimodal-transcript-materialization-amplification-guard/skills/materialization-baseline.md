# Skill: Materialization Baseline

## Purpose
Measure multimodal transcript amplification before changing a runtime.

## Trigger
Large/slow resume, fork, compaction, render freeze, high RSS, or rapidly growing session storage.

## Inputs
Transcript JSONL and `config/budgets.json`.

## Preconditions
Use read-only access or a copy of production transcripts when possible.

## Required context
File size, runtime version, target operation, peak RSS if available, and whether child agents inherit parent history.

## Allowed tools
Filesystem metadata, read-only parsing, OS memory sampling, `scripts/transcript_profile.py`.

## Constraints
MUST NOT decode/export embedded images. MUST NOT mutate transcripts during baseline collection.

## Procedure
1. Record file size and line count.
2. Measure large base64 volume.
3. Estimate decoded binary bytes.
4. Detect repeated large payloads by digest.
5. Record largest line and image-bearing lines.
6. Estimate materialization with configured multiplier.
7. Measure target resume/fork peak RSS and elapsed time.
8. Classify dominant source: duplicate payload, whole-history materialization, fan-out, rendering/logging, or artifact retention.
9. Form exactly one optimization hypothesis.

## Decision points
Budget violation blocks automatic fan-out/resume on constrained hosts. Unknown structure is inconclusive, not a pass.

## Expected output
Baseline profile plus one evidence-backed hypothesis.

## Metrics
See README.

## Verification
Repeat with the same workload after the change.

## Failure handling
Malformed JSON reports the line and exits 1.

## Stop conditions
At most two optimization iterations.