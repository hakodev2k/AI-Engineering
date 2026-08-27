# Research — Context Overflow Retry Circuit Breaker

**Category:** Token  
**Research date:** 2026-08-27 (UTC+7)

## Topic
Stop unrecoverable context-overflow retry loops and trigger bounded compaction or fail-fast recovery.

## Problem
Agent runtimes can misclassify context-limit failures as generic retryable provider errors. They then resend effectively unchanged oversized prompts, sometimes after ineffective compaction attempts, consuming tokens, latency, and API quota without creating a path to success.

## Why it matters now
Multiple 2026 agent projects independently report infinite or very large retry loops caused by context-limit detection gaps, including OpenCode, Kilo Code, and Pi/OpenRouter integrations.

## Affected users
Coding-agent users, multi-agent orchestrators, platform teams routing across model providers, and developers supporting heterogeneous context windows.

## Current public evidence

### Observed evidence
1. OpenCode issue #34209, opened 2026-06-27, reports a sub-agent task that exceeds model context entering an infinite loop of error → compaction → task → error because the input remains unrecoverable.  
   https://github.com/anomalyco/opencode/issues/34209
2. Kilo Code issue #9500, opened 2026-04-25, reports an infinite retry loop when a request slightly exceeds the context limit despite auto-compress being enabled; the same oversized request is repeatedly retried.  
   https://github.com/Kilo-Org/kilocode/issues/9500
3. Pi issue #4943, opened 2026-05-24, reports an OpenRouter/Poolside overflow string not recognized by `isContextOverflow()`, falling through to retryable-error logic and causing up to 100 retries without compaction.  
   https://github.com/earendil-works/pi/issues/4943
4. OpenCode issue #31757, opened 2026-06-10, reports a context-limit condition returning zero output with no finish reason and triggering immediate indefinite retry.  
   https://github.com/anomalyco/opencode/issues/31757

### Interpretation
The shared root failure is not merely large context; it is an error-classification and progress-detection problem. Retry logic treats deterministic capacity failures as transient, while compaction loops do not prove that the next request is smaller enough to fit.

## Existing approaches
- Provider-specific overflow string matching.
- Automatic history compaction/summarization.
- Generic exponential-backoff retries.
- Static model context-window configuration.
- Manual session reset or model switching.

## Remaining limitations
- Provider error formats vary and may omit explicit `context_length_exceeded` codes.
- Generic retry classifiers can override overflow handling.
- Compaction may fail to reduce immutable system/tool/schema context enough.
- Retrying without measuring prompt-size delta provides no proof of progress.
- Different models/providers expose different reserved-output and context semantics.

## Root-cause analysis
1. Overflow detection relies too heavily on provider-specific text patterns.
2. Retryability is decided before classifying deterministic capacity failures.
3. The runtime does not compare estimated input + reserved output against the model limit before request dispatch.
4. Compaction loops lack a minimum required reduction and bounded attempts.
5. Immutable prompt components are not budgeted separately from evictable history/tool output.

## Improvement opportunity
Add a provider-agnostic circuit breaker combining preflight token-budget checks, normalized overflow classification, progress-aware compaction, a maximum compaction/retry budget, and a deterministic fail-fast result when immutable context alone cannot fit. Measure tokens/task, retry count, overflow recovery rate, latency, and quality regression.

## Relevant sources
- OpenCode #34209: https://github.com/anomalyco/opencode/issues/34209
- Kilo Code #9500: https://github.com/Kilo-Org/kilocode/issues/9500
- Pi #4943: https://github.com/earendil-works/pi/issues/4943
- OpenCode #31757: https://github.com/anomalyco/opencode/issues/31757
