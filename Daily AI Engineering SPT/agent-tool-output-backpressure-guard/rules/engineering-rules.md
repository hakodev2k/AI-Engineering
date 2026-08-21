# Engineering Rules

## MUST

- MUST establish a measured output baseline before changing budgets in production.
- MUST maintain explicit per-tool and per-session byte budgets.
- MUST expose whether output is complete, clipped, persisted, or reference-only.
- MUST preserve bounded head and tail previews for clipped text output unless the data type is binary.
- MUST attach a deterministic reason code when capture is limited.
- MUST treat accounting/persistence ambiguity as a blocking condition when `fail_closed_on_accounting_error` is enabled.
- MUST separate full artifact retention from active model/session injection.
- MUST require explicit retrieval of a full oversized artifact when `require_explicit_full_artifact_load` is enabled.
- MUST include byte count and SHA-256 digest for content-addressed artifacts.
- MUST prevent a single tool from exceeding its hard byte budget.
- MUST prevent aggregate session capture from exceeding its hard budget.
- MUST measure output velocity for streaming commands when rate protection is enabled.
- MUST mark verification evidence as incomplete if required portions were omitted and not explicitly retrieved.
- MUST bound recovery/retry attempts after a limit violation.
- MUST re-measure session size, resume latency, and peak memory after optimization before claiming improvement.

## MUST NOT

- MUST NOT silently truncate and then present the result as complete.
- MUST NOT automatically increase hard limits because a tool exceeded them.
- MUST NOT inject a full persisted artifact into context merely because it exists on disk.
- MUST NOT persist the same large payload repeatedly when content-addressed deduplication is enabled.
- MUST NOT retry a runaway command unchanged when the same output signature already triggered a hard limit.
- MUST NOT delete referenced artifacts without reachability/retention checks.
- MUST NOT store secrets in audit reports or previews when the host can redact them before persistence.
- MUST NOT treat OS disk cleanup as the primary runtime backpressure mechanism.
- MUST NOT claim reduced token cost solely from reduced disk size; token usage must be measured separately.
- MUST NOT terminate a producing process from this guard unless process ownership and cancellation policy are explicitly established by the host.

## SHOULD

- SHOULD set soft budgets near measured normal p95 and hard budgets above normal p99 while remaining far below machine-risk thresholds.
- SHOULD classify tools by workload so build/test/web/subagent outputs can use different budgets.
- SHOULD use content-addressed artifact storage and stable references.
- SHOULD retain terminal summaries, error tails, and exit metadata even when the middle of a stream is omitted.
- SHOULD instrument `captured_bytes`, `inline_bytes`, `artifact_bytes`, `duplicate_bytes`, `rate_limit_hits`, and `resume_latency_ms`.
- SHOULD deploy in observe-only mode first when retrofitting a mature agent runtime.
- SHOULD make replay lazy and fetch historic artifacts only on demand.
- SHOULD use deterministic scripts for byte accounting instead of asking the model to estimate output size.
- SHOULD add command-level quiet/filter flags once a recurrent verbose producer is identified, while keeping the host guard as a safety boundary.
- SHOULD use TTL cleanup only after ensuring retained sessions no longer reference candidate artifacts.