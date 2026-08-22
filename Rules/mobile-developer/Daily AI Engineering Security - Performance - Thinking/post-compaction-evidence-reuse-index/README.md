# Post-Compaction Evidence Reuse Index

**Category:** Token

## Problem
Long-lived coding agents can repeatedly re-read large files and re-run expensive commands after context compaction because the active context no longer contains reliable proof that the same evidence was already collected. Recreating that evidence refills context, increases cached/input tokens, and can trigger another compaction.

## Evidence
See `evidence/research.md`. The strongest current signal is OpenAI Codex #36664: a 5.9-hour session with 74 compactions, 95% followed within two minutes by a previously observed file read or test run, alongside 9.47M ordinary tokens and 183.9M cached input. Related reports show abnormal compaction/token behavior and loss of working knowledge across compaction.

## Existing approach and limitation
Compaction summaries and memory files preserve prose but not deterministic freshness for every source artifact. Blind re-reading is correct but expensive; blind summary reuse is cheap but can be stale. Prompt caching reduces some compute cost but does not eliminate redundant tool execution or repeated context processing.

## Proposed improvement
Persist a small external evidence index. Files are keyed by normalized path and SHA-256. Command results are keyed by normalized command plus a caller-defined state fingerprint and point to an exact external artifact. After compaction, check freshness first and reuse only a compact reference on an exact match.

## Architecture
```text
post-compaction-evidence-reuse-index/
├── README.md
├── evidence/research.md
├── skills/build-evidence-index.md
├── rules/post-compaction-token-rules.md
├── subagents/reuse-verifier.md
├── workflows/compact-and-reuse.md
├── hooks/post-compaction-reuse.md
├── scripts/evidence_index.py
└── tests/test_evidence_index.py
```

## Installation
Python 3.9+; standard library only.

## Usage
Record and later verify a file:
```bash
python scripts/evidence_index.py add-file --index .ai/evidence-index.json --path src/App.cs
python scripts/evidence_index.py check-file --index .ai/evidence-index.json --path src/App.cs
```

Record an expensive command result after saving its exact output to an artifact:
```bash
python scripts/evidence_index.py add-command \
  --index .ai/evidence-index.json \
  --command "dotnet test" \
  --state-fingerprint "git-head:abc123|tests-hash:def456" \
  --artifact .ai/evidence/dotnet-test-001.txt
```

Check before repeating it:
```bash
python scripts/evidence_index.py check-command \
  --index .ai/evidence-index.json \
  --command "dotnet test" \
  --state-fingerprint "git-head:abc123|tests-hash:def456"
```

Exit `0` with `fresh-reference` permits reference reuse. Exit `2` means refresh is required. Exit `3` means the index/configuration is invalid and the source must be refreshed.

Run tests:
```bash
python -m unittest tests/test_evidence_index.py
```

## Choosing command state fingerprints
A command string alone is never sufficient. Include every material input that can change its result: Git HEAD, dirty-tree hash, dependency lock hash, environment/config version, relevant data snapshot/version, or test binary hash. If a sufficient fingerprint cannot be defined, do not reuse that command result.

## Workflow
Use `workflows/compact-and-reuse.md`: baseline → identify repeat candidate → freshness check → reuse/reference or refresh → measure → independent verification.

## Metrics
Track duplicate file reads, duplicate command runs, tool-result bytes, tokens/task, cached tokens when available, compactions/hour, index hit rate, stale rejection rate, latency, and correctness regression rate.

## Verification
**Implemented** means the index and freshness gates exist. **Measured** means the same representative workload has baseline and post-change telemetry. **Verified** requires fewer repeated reads/runs and lower tokens or latency with no stale evidence reuse and no correctness regression.

## Safety and correctness
- Never reuse when freshness is uncertain.
- Never remove correctness-critical evidence solely to save tokens.
- Avoid storing secrets/sensitive outputs unless protected storage is explicitly configured.
- A corrupt or unknown-schema index fails safe to authoritative refresh.

## Failure handling
Any stale-hit bug disables reuse for that evidence class until the fingerprint design is corrected. Optimization is limited to two measurement cycles before re-evaluating whether the complexity is justified.

## Definition of Done
Baseline captured; index entries generated; file hashes and command fingerprints enforced; duplicate post-compaction reads/runs reduced; before/after token/latency metrics collected; correctness tests pass; independent verifier accepts sampled freshness decisions.

## Customization
Integrate the index with a product-native PostCompact/session-resume hook when available. The script intentionally returns metadata/references rather than automatically injecting full artifacts, allowing the orchestration layer to decide how much context is actually necessary.
