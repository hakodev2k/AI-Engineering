# Research — Subagent Result Instruction Quarantine Guard

## Topic
Quarantine and provenance-gate subagent results before a parent agent can treat them as instructions.

## Category
Security

## Problem
A read-only or research subagent can consume untrusted material and return a polished text result that contains injected or fabricated action guidance. The parent often sees only the final subagent text, not the evidence trail or intermediate reads, so the result can cross from untrusted research data into high-trust parent context and influence file writes, shell commands, hooks, credentials, or deployment actions.

## Why it matters now
The risk is current and observable in production-like coding-agent workflows. On 2026-08-20, Claude Code issue #88134 reported a background documentation subagent whose final result was flagged by the harness as instruction poisoning; the fabricated example attempted to steer the parent toward a SessionStart hook that read `.env` data. A July 2026 Claude Code documentation issue separately called out indirect prompt injection from subagent-read content and noted that the parent receives only the subagent's final text result. These are independent signals that delegation boundaries require explicit provenance and action separation.

## Affected users
Developers using research/documentation subagents; multi-agent orchestrators; coding-agent platforms; security teams reviewing delegated automation; teams allowing parent agents to mutate repositories or invoke external tools.

## Current public evidence

### Observed evidence
1. Anthropic Claude Code issue #88134, opened 2026-08-20: a `claude-code-guide` subagent returned a plausible citation-formatted result that the safety layer flagged as instruction poisoning. The report states the payload tried to induce a `.env`-reading SessionStart hook and was discarded before execution. https://github.com/anthropics/claude-code/issues/88134
2. Anthropic Claude Code issue #77644, opened 2026-07-15: documentation gap explicitly describes indirect prompt injection through content read by an Agent-tool subagent and emphasizes that the parent receives only the final text result rather than intermediate tool calls/outputs. https://github.com/anthropics/claude-code/issues/77644
3. OWASP's LLM Prompt Injection Prevention guidance treats remote/indirect prompt injection as a core agentic risk and recommends separating instructions from untrusted external data, least privilege, validation, and human approval for high-risk operations. https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html

## Existing approaches
Provider-side classifiers; prompt-injection detectors; sandboxing and permission prompts; separate subagent context windows; least-privilege tool assignment; manual review of suspicious results.

## Remaining limitations
A classifier may catch known or obvious patterns but does not provide provenance for every factual/action claim. Separate contexts contain exposure but the final child result still enters the parent. Permission prompts operate late, after poisoned guidance has influenced planning. Manual review is inconsistent and difficult to automate.

## Root-cause analysis
1. Delegation output is represented as undifferentiated natural language.
2. Parent agents lack structured provenance for claims and proposed actions.
3. Research tasks can return executable recommendations even when no action was requested.
4. The child may have read adversarial content unavailable to the parent for verification.
5. Hosts often use a single trust level for the whole subagent result instead of distinguishing observations, citations, interpretation, and instructions.

## Improvement opportunity
Introduce a deterministic admission contract for child results: require a structured envelope, classify unsolicited action directives, verify source provenance, quarantine suspicious text, and prevent a research result from directly authorizing mutation. High-risk action guidance must be independently re-derived by the parent or a verifier from trusted evidence.

## Proposed solution
This package supplies an envelope validator, enforceable trust rules, a security-review subagent contract, a parent-admission workflow, a blocking pre-consumption hook, and tests for env-secret exfiltration and benign research outputs.

## Trigger
Every subagent completion whose result will be injected into another agent's context.

## Inputs
Structured child-result JSON containing task type, observations, citations, proposed actions, source trust labels, and raw text.

## Outputs
`allow`, `quarantine`, or `review` decision plus machine-readable findings.

## Metrics
Quarantine rate; unsupported-action rate; provenance coverage; false-positive rate; number of privileged actions initiated directly from unverified child text; security-test pass rate.

## Verification
The package is verified when known injected action patterns are blocked, benign cited research passes, missing provenance cannot silently pass, and the parent cannot treat a quarantined result as authorization.
