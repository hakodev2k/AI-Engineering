# Core Skills

## Skill 1 — Measure Tool Output Pressure

### Purpose
Detect when tool output is consuming excessive context/token budget before it destabilizes the agent loop.

### Trigger
After any tool returns text/JSON/log output larger than the configured soft threshold or when rolling tool-output tokens exceed the task budget.

### Inputs
- raw tool output
- tool name and call id
- active model context limit
- current context usage
- `config/policy.json`

### Preconditions
- output is available as bytes/text before insertion into model context
- runtime can write a local/private artifact store

### Required context
- current task goal
- whether the full payload may be needed later
- tool-output sensitivity classification

### Tools
- `scripts/tool_output_guard.py`
- runtime token estimator when available

### Procedure
1. Measure raw bytes, lines, and approximate tokens.
2. Compare model-visible output with `model_visible_token_budget`.
3. Identify high-value evidence lines using deterministic patterns plus head/tail slices.
4. If within budget, pass through unchanged.
5. If above budget, spill the full payload to an artifact file, compute SHA-256, and produce a compact reference envelope.
6. Verify that the reference contains artifact path, hash, byte/line counts, extraction policy, and explicit truncation status.
7. Record before/after size metrics.

### Decisions
- **Pass-through:** output safely fits budget.
- **Spill:** full payload retained externally; bounded slice enters model context.
- **Block:** raw payload exceeds hard size limit or artifact integrity cannot be established.

### Constraints
- never silently discard full output when later correctness may depend on it
- never put binary/base64 payloads directly into model context
- do not claim exact tokens when only approximate counting is available

### Expected output
A compact JSON envelope or bounded text slice plus a durable artifact reference.

### Metrics
- raw bytes/tokens
- visible bytes/tokens
- reduction ratio
- spill count
- rehydrate count
- integrity failures

### Verification
Artifact hash matches, visible payload respects budget, and the original payload can be rehydrated.

### Failure handling
If spill storage or hashing fails, stop insertion and return a structured error rather than forwarding oversized raw content.

### Stop conditions
Complete after either verified pass-through or verified spill/reference creation.

---

## Skill 2 — Evidence-Preserving Extraction

### Purpose
Keep the most operationally useful lines while avoiding arbitrary truncation.

### Trigger
A tool output must be spilled.

### Inputs
- raw text output
- configured priority patterns
- head/tail line counts
- maximum priority matches

### Procedure
1. Preserve the first N lines for setup/context.
2. Preserve the last N lines for final status/summary.
3. Collect bounded lines matching error/failure/warning/timeout/security patterns.
4. Deduplicate overlapping lines while preserving source line numbers.
5. Build an extraction summary containing omitted-line count.
6. Never infer omitted content.

### Expected output
A bounded, line-numbered evidence slice linked to the immutable raw artifact.

### Metrics
- extracted lines
- omitted lines
- duplicate extraction lines removed
- visible/raw ratio

### Verification
Every extracted line can be located at the same source line in the raw artifact.

### Failure handling
If input decoding is invalid, store bytes as artifact and expose metadata only; do not corrupt text through lossy decoding.

### Stop conditions
Stop when the slice is within budget and provenance is complete.

---

## Skill 3 — On-Demand Rehydration

### Purpose
Recover a targeted section of spilled output without replaying the entire payload into context.

### Trigger
The agent/verifier needs details not present in the bounded evidence slice.

### Inputs
- artifact path
- expected SHA-256
- line range or search term
- rehydrate limits

### Procedure
1. Verify artifact path stays under the allowed spill directory.
2. Recompute and compare SHA-256.
3. Select a bounded line range or search-match neighborhood.
4. Enforce maximum line and byte limits.
5. Return source line numbers and hash metadata.
6. If more context is required, repeat with a different bounded range; do not bulk-load by default.

### Expected output
A verified bounded excerpt.

### Metrics
- rehydrate calls/task
- bytes returned
- hash mismatch rate
- full-payload fallback rate

### Verification
Returned lines match the referenced artifact and configured bounds.

### Failure handling
Hash mismatch or path escape fails closed and requires regeneration/review.

### Stop conditions
Stop when requested evidence is obtained or configured rehydrate limit is reached.