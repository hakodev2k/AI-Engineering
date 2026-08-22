# Engineering Rules

## MUST
1. MUST measure tool-output size before adding it to model context.
2. MUST enforce a per-call model-visible output budget.
3. MUST preserve oversized raw output externally when later correctness may depend on it.
4. MUST compute and store SHA-256 for spilled artifacts.
5. MUST expose explicit truncation/spill metadata to the model; never pretend a slice is complete.
6. MUST include source line numbers for extracted text when line structure exists.
7. MUST verify artifact integrity before rehydration.
8. MUST bound each rehydration request by bytes and lines.
9. MUST keep spill paths inside an approved artifact directory.
10. MUST record raw size, visible size, reduction ratio, spill count, and rehydrate count.
11. MUST keep binary/base64 payloads out of normal model context unless explicitly required and budgeted.
12. MUST fail closed when the artifact cannot be persisted or verified and the raw payload exceeds the hard context policy.
13. MUST preserve security/privacy controls for spilled data equal to or stronger than transcript storage.
14. MUST distinguish approximate token estimates from tokenizer-measured values.
15. MUST use bounded retries for artifact I/O; default maximum is one retry.

## MUST NOT
1. MUST NOT silently truncate output needed for verification.
2. MUST NOT drop errors solely because they occur outside a head/tail slice.
3. MUST NOT automatically replay the full artifact after compaction/resume.
4. MUST NOT treat a generated summary as the source of truth when raw evidence exists.
5. MUST NOT rehydrate an artifact after hash mismatch.
6. MUST NOT allow `../` or absolute-path escape from the approved spill root.
7. MUST NOT use unlimited search/rehydration loops.
8. MUST NOT claim token savings caused quality improvement without evaluation.
9. MUST NOT persist secrets in a less protected spill store than the originating tool boundary permits.
10. MUST NOT remove provenance metadata from extracted evidence.

## SHOULD
1. SHOULD prefer structured extraction for JSON/tabular outputs before generic line slicing.
2. SHOULD preserve error, warning, timeout, exception, assertion, authorization, and failure lines.
3. SHOULD preserve both beginning and ending context around logs.
4. SHOULD delete expired spill artifacts according to retention policy after the task no longer needs them.
5. SHOULD use platform-native artifact/resource-link primitives when available.
6. SHOULD track p50/p95 raw and visible tool-output tokens.
7. SHOULD test answer quality against a full-context baseline on representative tasks.
8. SHOULD tune budgets per tool class rather than one global threshold when production data justifies it.
9. SHOULD pre-compress repetitive logs before LLM summarization when deterministic reduction is safe.
10. SHOULD externalize raw build/test/trace outputs even before the hard limit when repeated use would cause context churn.

## Observable enforcement
| Rule | Check |
|---|---|
| pre-context measurement | guard metrics contain raw byte/line count |
| bounded visibility | output envelope approx tokens <= configured budget |
| lossless spill | artifact exists and SHA-256 matches |
| explicit omission | envelope includes omitted line/byte count |
| safe rehydrate | path-root + hash checks pass |
| bounded rehydrate | excerpt respects max lines/bytes |
| no silent loss | spilled=true + artifact reference present |