# Tool Output Residual Recovery

**Category:** Thinking

## Problem
Large tool outputs are often truncated to fit model context and may later disappear from useful context after compaction. Exact evidence can still exist elsewhere, but without a durable residual the continuation may rerun work, lose facts, or treat partial output as a completed result.

## Evidence
See `evidence/research.md`. Current evidence includes Codex issues #37121, #35528, #14206, #16839, and #35355.

## Existing approach
Inline truncation, compaction summaries, session logs, manual output redirection, or rerunning tools.

## Existing limitations
Those approaches do not consistently preserve a compact contract describing exact artifact identity, omitted content, integrity, and operation completion status.

## Proposed improvement
Persist exact output once as a content-addressed artifact. Keep only a compact residual and preview in agent context. Recover bounded ranges after compaction/resume and verify SHA-256 before using recovered evidence.

## Architecture
```text
tool execution
  -> capture full bytes + completion status
  -> residualize_output.py capture
  -> immutable artifact + residual JSON
  -> bounded preview enters model context
  -> compaction/resume
  -> Evidence Recovery Agent
  -> hash verify -> bounded read -> verified evidence
```

## Package tree
```text
tool-output-residual-recovery/
├── README.md
├── evidence/research.md
├── skills/residualize-tool-output.md
├── rules/durable-evidence-rules.md
├── subagents/evidence-recovery-agent.md
├── workflows/capture-compact-recover.md
├── hooks/pre-compaction.md
├── scripts/residualize_output.py
└── tests/test_residualize_output.py
```

## Installation
Requires Python 3.10+. Copy this directory into the agent/tool-host repository. Wrap high-volume tool calls so complete bytes are captured before the host applies model-facing truncation.

## Configuration
Choose a protected artifact directory such as `.agent-state/tool-artifacts/` and a residual directory such as `.agent-state/residuals/`. Apply project retention and secret-handling policy to both.

## Usage
Capture exact output already written to a file:
```bash
python scripts/residualize_output.py capture \
  --input /tmp/tool-output.txt \
  --artifact-dir .agent-state/tool-artifacts \
  --residual .agent-state/residuals/call-42.json \
  --tool shell --invocation-id call-42 \
  --inline-budget 4096 --completed --exit-code 0
```

Verify later:
```bash
python scripts/residualize_output.py verify --residual .agent-state/residuals/call-42.json
```

Recover only needed bytes:
```bash
python scripts/residualize_output.py read-range --residual .agent-state/residuals/call-42.json --start 0 --end 2048
```

## Workflow
Follow `workflows/capture-compact-recover.md`. The pre-compaction hook blocks context destruction when unfinished work depends on exact output that is not yet durable.

## Metrics
Track residual coverage, reruns avoided, recovery bytes/tokens, recovery latency, integrity failures, and completion-claim corrections.

## Verification
Run:
```bash
python -m unittest tests/test_residualize_output.py
```
Then perform an integration test where a large result is captured, inline output is discarded, and an exact range is recovered after simulated compaction.

## Safety
The artifact may contain sensitive tool output. Protect the directory, do not commit it by default, and apply retention/deletion policy. A failed/interrupted operation remains failed even if its artifact contains useful partial output.

## Failure handling
Persistence gets one retry. Recovery gets two bounded reads. Hash mismatch, missing artifact, or unknown completion state blocks verified conclusions based on that evidence.

## Definition of Done
- exact oversized output persisted before truncation/compaction;
- residual schema and hash validate;
- completion state remains explicit;
- required evidence can be recovered with bounded reads;
- unit and integration tests pass;
- before/after rerun and reread metrics are captured;
- no conclusion relies on an unverified preview.

## Customization
Add structured JSON/CSV range selectors, encrypted artifact storage, retention cleanup, remote object storage, or host-specific residual adapters without changing the core evidence contract.