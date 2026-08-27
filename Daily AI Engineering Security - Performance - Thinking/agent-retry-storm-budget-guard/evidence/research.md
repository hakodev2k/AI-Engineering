# Research — Agent Retry Storm Budget Guard

**Topic:** Prevent AI agents and developer tools from amplifying dependency outages through unbounded or layered retries.  
**Category:** Performance  
**Research date:** 2026-08-27 (UTC+7)

## Problem
AI agents often wrap model APIs, authentication services, MCP servers, source control, retrieval, and tool endpoints with independent retry logic. During dependency degradation, nested retries can multiply call volume, inflate latency and token/tool cost, and actively delay recovery.

## Why it matters now
GitHub's August 17, 2026 outage provided a direct production signal: delayed responses triggered a latent retry bug in VS Code that amplified traffic to the Copilot Token Service by about 10x and delayed recovery. This makes retry behavior an immediate AI engineering reliability and performance concern rather than a theoretical distributed-systems pattern.

## Affected users
AI-agent platform teams, IDE/tooling developers, MCP orchestrators, engineering productivity teams, and developers running long-lived autonomous workflows.

## Current public evidence

### Observed evidence
1. GitHub's August 20, 2026 post-incident report states that the August 17 outage lasted 7 hours 47 minutes and that errors in Copilot services triggered a client-side retry loop that increased traffic during recovery; GitHub had to mitigate the retry behavior before safely restoring service.  
   https://github.blog/news-insights/company-news/the-august-17-outage-and-the-work-ahead/
2. GitHub Status reports that delayed replies to an internal endpoint triggered a latent retry bug in VS Code that amplified traffic by approximately **10x** and caused delayed recovery for Copilot Token Service; GitHub partially disabled authentication-token retries as mitigation.  
   https://www.githubstatus.com/
3. AWS Well-Architected guidance explicitly identifies unbounded retries, retrying at multiple stack layers, missing jitter, and retries of non-idempotent operations as anti-patterns that can create retry storms and metastable failures.  
   https://docs.aws.amazon.com/wellarchitected/2025-02-25/framework/rel_mitigate_interaction_failure_limit_retries.html
4. Google Cloud's Gemini Enterprise Agent Platform retry guidance, updated August 21, 2026, recommends exponential backoff, jitter, retrying only transient errors, maximum retries, and monitoring; it warns against immediate and indefinite retries.  
   https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/retry-strategy

### Interpretation
Generic backoff alone is insufficient for agent systems because retries can occur independently at orchestration, model SDK, tool connector, auth, and subagent layers. A global task-level retry budget and observable amplification metric are needed to stop local retry policies from composing into a storm.

## Existing approaches
- SDK-provided exponential backoff and jitter.
- Maximum retry counts.
- Circuit breakers.
- Request timeouts.
- Retry-After handling.
- Idempotency keys for side-effecting APIs.

## Remaining limitations
- Per-client retry limits do not control total retries across nested agent layers.
- Retry ownership is frequently ambiguous between SDK and orchestration code.
- Long-running agents may repeatedly re-enter failed workflows after local retry budgets reset.
- Retry behavior is rarely measured as an amplification factor against original user intent.
- Tool calls may be non-idempotent even when the transport failure looks transient.

## Root-cause analysis
1. Retries are implemented independently by multiple layers.
2. No shared task-level retry budget is propagated through tool/model calls.
3. Retry classification is based on HTTP status alone, without idempotency and consequence checks.
4. Jitter/backoff protects timing but not total amplification.
5. Observability often records failures but not original attempts versus retry attempts.
6. Autonomous workflows lack explicit stop conditions for persistent dependency failure.

## Improvement opportunity
Introduce a reusable task-scoped retry budget with a single owner, per-endpoint circuit state, transient-error classification, idempotency requirements, exponential backoff with full jitter, Retry-After support, and deterministic amplification reporting. Block retries that exceed either per-operation or task-wide budgets.

## Goal
Reduce dependency-call amplification and recovery interference while preserving success on genuinely transient failures.

## Metrics
Retry amplification factor, retries/task, recovered-transient-request rate, p95 task latency, circuit-open events, abandoned retries, duplicate-side-effect count.

## Trigger
Any failed model/tool/auth/retrieval/API call inside an AI-agent task.

## Inputs
Operation ID, endpoint, attempt number, task retry count, HTTP/status class, idempotency flag, elapsed time, Retry-After, and configured budgets.

## Outputs
`retry`, `fail_fast`, or `circuit_open`, plus delay and reason codes.

## Relevant sources
- GitHub post-incident report, August 20, 2026: https://github.blog/news-insights/company-news/the-august-17-outage-and-the-work-ahead/
- GitHub Status, August 17, 2026 incident: https://www.githubstatus.com/
- AWS REL05-BP03: https://docs.aws.amazon.com/wellarchitected/2025-02-25/framework/rel_mitigate_interaction_failure_limit_retries.html
- Google Gemini Enterprise Agent Platform retry strategy, updated August 21, 2026: https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/retry-strategy
