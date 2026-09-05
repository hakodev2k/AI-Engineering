# Research

## Topic
Stateful Agent Repeatability Regression Gate

## Category
Thinking

## Problem
Agents that can complete a stateful workflow once are often inconsistent across repeated attempts, and clean termination or successful-looking tool calls are weak proxies for correct terminal state.

## Why it matters now
In August 2026, Microsoft released ThinkingBox and ThinkingBox-Bench with 507 policy-conditioned stateful workflows. The strongest evaluated model achieved 65.36% pass@1 but only 25.25% pass^20, exposing a large reliability gap. Recent production and browser-agent reports independently show that tool/action success and user-visible progress do not guarantee end-to-end task completion.

## Affected users
Teams deploying business-process agents, browser agents, support/operations agents, MCP tool agents, autonomous coding/release agents, and platform teams selecting models or orchestration strategies.

## Current public evidence

### Observed evidence
1. Microsoft ThinkingBox paper (submitted 2026-08-20) reports 507 stateful workflows evaluated against executable terminal backend state. The strongest model achieved 65.36% pass@1 but 25.25% pass^20. The paper notes many failed trials terminated cleanly and performed valid state-changing actions, so response/tool-call signals were not reliable proxies for end-to-end completion. Source: https://arxiv.org/abs/2608.19741
2. Microsoft released the open-source ThinkingBox framework for isolated MCP-compatible tool sessions, execution traces, state reset, and executable task evaluation. Source: https://github.com/microsoft/thinkingbox
3. Aident published production measurements on 2026-08-19 covering 4,187 unique agent action executions: 78.3% reached terminal action success, but the authors explicitly caution that this does not measure whether the agent chose the correct action, satisfied the full user task, or produced a correct final answer. Source: https://aident.ai/blog/ai-agent-tool-reliability-4187-production-calls
4. A browser-agent study reported in early September 2026 evaluated 45 agents across 10 capabilities; transaction handling was especially weak, with agents often reaching but failing to complete purchases. Source: https://www.techradar.com/pro/research-finds-ai-agents-havent-quite-mastered-real-world-browsing-tasks-despite-claiming-they-can
5. ThinkingBox builds on the earlier reliability concept of `pass^k` from tau-bench, where repeated success across trials is treated as a separate property from succeeding at least once. Reference: https://arxiv.org/abs/2406.12045

### Interpretation
Agent reliability is a distribution over repeated stateful executions, not a binary property demonstrated by one good trajectory. Teams need a deterministic release criterion that combines repeated trials, terminal-state checks, collateral-effect detection, and explicit failure evidence.

### Proposed solution
Use a bounded repeated-trial matrix from clean initial state. Score each run with executable task assertions, retain all failures, calculate run-level and task-level repeatability metrics, and compare candidate versus baseline under identical conditions. Block release when thresholds regress or when collateral effects occur.

## Existing approaches
- pass@1/pass@k benchmarks
- pass^k repeated-reliability metrics
- executable backend-state assertions
- sandbox reset between attempts
- tool/action terminal-status monitoring
- manual replay of failed traces

## Remaining limitations
- many product evals still emphasize single-run success
- successful tool calls can produce wrong, missing, or extra state changes
- aggregate run success can hide task-specific flakiness
- retrying until success inflates apparent reliability
- failed trials may be silently excluded due to harness/provider errors
- workflows often lack explicit stop/release criteria tied to repeated evidence

## Root-cause analysis
1. Capability and reliability are conflated.
2. Evaluation often observes final text rather than persistent task state.
3. Repeated trials are expensive, so teams under-sample variance.
4. Harness errors and agent errors are not separated consistently.
5. Recovery policies may mask root causes by adding retries rather than improving decision quality.
6. No deterministic regression gate preserves the complete failure corpus.

## Improvement opportunity
A reusable repeatability gate can be applied to any stateful agent where a task can be reset and scored. It does not require model internals. The output is measurable, auditable, and suitable for CI/release policy.

## Relevant sources
- https://arxiv.org/abs/2608.19741
- https://github.com/microsoft/thinkingbox
- https://aident.ai/blog/ai-agent-tool-reliability-4187-production-calls
- https://www.techradar.com/pro/research-finds-ai-agents-havent-quite-mastered-real-world-browsing-tasks-despite-claiming-they-can
- https://arxiv.org/abs/2406.12045
