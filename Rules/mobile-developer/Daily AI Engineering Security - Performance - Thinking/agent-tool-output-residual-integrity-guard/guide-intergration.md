# Integration Guide

## Integration point
Insert the Output Residual Contract after the runtime has captured the real tool byte stream and before any layer truncates content for model context, transcript storage, UI rendering, or telemetry. The guard must see the complete observed stream or explicitly mark capture incomplete.

## Reference flow

```text
tool/process/API
  -> capture stream
  -> immutable/content-addressed artifact
  -> produced byte count + SHA-256
  -> bounded head/tail model view
  -> residual metadata
  -> model/transcript
                  \
                   -> targeted artifact search/range reads when needed
```

## Minimal adapter contract
A host adapter should produce an object equivalent to:

```json
{
  "residual": {
    "produced_bytes": 123456,
    "retained_bytes": 40000,
    "omitted_bytes": 83456,
    "truncated": true,
    "capture_complete": true,
    "recoverability": "full-artifact",
    "artifact_path": ".agent-output-artifacts/sha256-...bin",
    "sha256": "...",
    "head_bytes": 20000,
    "tail_bytes": 20000,
    "encoding": "utf-8"
  },
  "model_view": "[OUTPUT RESIDUAL: TRUNCATED ...]\n..."
}
```

## Install
Requires Python 3.10+ and only the standard library.

```bash
python scripts/residual_guard.py --help
python -m unittest tests/test_residual_guard.py
```

## Capture an already-produced output file

```bash
python scripts/residual_guard.py capture \
  --input ./tmp/test-output.log \
  --artifact-dir ./.agent-output-artifacts \
  --max-model-bytes 40000 \
  --result-file ./tmp/test-output.residual.json
```

For a streaming host, pipe the captured stream to stdin (`--input -`) only after ensuring the guard is the durable capture boundary; do not put another silent cap before it.

## Verify

```bash
python scripts/residual_guard.py verify --result ./tmp/test-output.residual.json
```

The verifier checks byte accounting, truncation state, artifact existence, size, and SHA-256. It exits non-zero on mismatch.

## Host integration checklist
- Capture stdout/stderr or tool payload before model truncation.
- Preserve stream completion/EOF status separately from command exit status.
- Store full bytes outside prompt context using restricted application-owned storage.
- Emit residual header before retained content.
- Make artifact reads read-only for agents where practical.
- Add bounded search/range-read tools rather than a generic “load entire artifact” path.
- Retain artifacts until all dependent verification is complete.
- Apply normal secret/data-classification controls to artifacts; this package does not replace them.

## Integrating shell/build/test tools
Prefer runner-native redirection to a temporary captured file, then pass that file to the guard. Do not rerun a build/test command solely because the UI result was truncated.

For CI, retain the full log as an artifact and surface the residual metadata in the agent result. For local agents, use an application-owned artifact directory excluded from source control.

## Integrating HTTP/MCP/API results
Serialize the exact received payload deterministically before truncation. If the protocol already exposes pagination/cursors, set `recoverability` to a ranged/paginated source only if the cursor remains stable for the relevant workflow; otherwise capture an immutable artifact.

## Security and privacy
- Artifact paths may contain sensitive output. Keep the artifact directory out of Git.
- Use OS permissions appropriate to the host identity.
- Never put authentication tokens into metadata or filenames.
- Do not upload artifacts externally as part of verification unless policy explicitly allows it.
- Hashes prove byte identity, not safety or truthfulness of content.

## Adoption sequence
1. Run baseline fixtures against current runner.
2. Integrate ORC on one high-volume read-only tool.
3. Compare model-visible bytes and recovery behavior.
4. Run regression tests.
5. Expand to build/test/log/API tools.
6. Add PreConclusion gate after residual coverage is reliable.

## Customization
Tune `model_view_max_bytes`, `head_fraction`, recovery-read count, and target range size in `config/policy.json`. Keep `fail_closed_on_unknown_omission=true` for evidence-sensitive workflows unless a documented risk decision says otherwise.
