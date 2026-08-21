# Workflow — Capture, Compact, Recover

## Trigger
A tool produces output that exceeds the inline budget or exact evidence must survive compaction/resume.

## Goal
Keep model context bounded without losing the ability to recover exact tool evidence.

## Inputs
Raw tool result, completion metadata, inline preview budget, artifact directory, current evidence requirements.

## Baseline
Record current oversized-output count, rerun count, post-compaction reread bytes, recovery latency, and unsupported completion corrections.

## Stages
1. **Observe** — capture complete output and completion metadata.
2. **Persist** — run `scripts/residualize_output.py capture` before model-facing truncation.
3. **Checkpoint** — place only the residual plus bounded preview in compactable context.
4. **Compact/resume** — retain residual identity and unresolved evidence requirements.
5. **Recover** — Evidence Recovery Agent validates hash and retrieves minimum required range.
6. **Decide** — use recovered evidence only with explicit completion status.
7. **Verify** — compare the decision against the artifact and record evidence status.

## Responsible agent
Host/wrapper handles persistence; Evidence Recovery Agent handles post-compaction retrieval; parent agent owns the final decision.

## Tools
Python script, filesystem, hashing, bounded reads/search.

## Outputs
Durable artifact, residual JSON, recovery report, before/after metrics.

## Checkpoints
- artifact persistence succeeded;
- residual validates;
- hash matches before recovery;
- completion status is known;
- required evidence is recovered before conclusion.

## Metrics
Inline tokens avoided, bytes reread, reruns avoided, recovery latency, hash failures, invalid completion claims caught.

## Retry policy
One retry for persistence; at most two bounded recovery attempts. No automatic rerun of side-effecting tools.

## Stop conditions
Complete when required evidence is verified. Stop with escalation when artifact is missing/corrupt, persistence fails twice, or required evidence cannot be bounded.

## Failure path
Preserve the original full result if possible, block destructive compaction, and request human/operator recovery. Never substitute a fabricated summary.

## Verification
Run unit tests, then generate a large output, capture it, discard inline content, recover a selected range, and confirm hash/bytes match.

## Definition of Done
Residual exists, artifact is durable, recovery is bounded, completion state is explicit, exact evidence survives context loss, and metrics are recorded.