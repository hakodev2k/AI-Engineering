# Research — Refusal Security-Oracle Leakage Guard

## Topic
Refusal Security-Oracle Leakage Guard

## Category
Security

## Problem
Safety refusals and defensive explanations can accidentally disclose internal control details, disabled parameters, hidden endpoint behavior, routing assumptions, or the shape of guardrails. An adaptive attacker can turn repeated refusals into a reconnaissance oracle: each denial narrows the search space until a workable exploit chain is discovered.

## Why it matters now
On August 18, 2026, Varonis published CoSnitch, a Microsoft Copilot vulnerability chain in which iterative questioning caused Copilot to reveal an undocumented URL parameter and historical protection details. The researchers describe this as “meta-hacking”: refusal/explanation behavior itself became a source of exploit intelligence. Separately, July 2026 research on black-box guardrail reconnaissance showed that HTTP, lexical, and timing behavior can distinguish guardrail blocks from model refusals and infer blocked categories with high accuracy. NIST's June 9, 2026 research also argues that no fixed finite set of guardrails can be universally robust against adaptive adversarial prompts, motivating continuous testing and update.

## Affected users
Teams building copilots, AI assistants, agent APIs, safety gateways, customer-facing chat products, internal assistants connected to enterprise data, and security teams operating guardrails.

## Current public evidence
### Observed evidence
1. Varonis CoSnitch, published August 18, 2026: repeated follow-up questions around refusals led Copilot to disclose an undocumented parameter and details of disabled behavior; the resulting vulnerability chain supported automatic prompt execution and data exfiltration. https://www.varonis.com/blog/cosnitch
2. “Behind the Refusal: Determining Guardrail Activation via Behavioral Monitoring,” published July 2026, demonstrates black-box inference of guardrail activation and blocked categories from behavioral signals. https://arxiv.org/abs/2607.02121
3. NIST, June 9, 2026, reports a mathematical result supporting continuous monitor-and-update security because fixed guardrails cannot be universally robust to adaptive prompts. https://www.nist.gov/news-events/news/2026/06/nist-mathematical-proof-supports-transition-continuous-monitor-and-update
4. Varonis' earlier Reprompt and SearchLeak reports in June 2026 show that one-click prompt/parameter chains can become silent exfiltration paths, underscoring why implementation details around blocked parameters and routing are security-sensitive. https://www.varonis.com/blog/reprompt and https://www.varonis.com/blog/searchleak

## Existing approaches
- Generic “do not reveal system prompt” instructions.
- Safety classifiers that decide allow/refuse.
- Static refusal templates.
- API gateways and WAF rules.
- Red-team testing focused mainly on whether prohibited content is produced.

## Remaining limitations
A correct refusal can still leak security-relevant implementation details. Model-only instructions are probabilistic. Static refusal templates may reduce lexical leakage but do not cover timing/status/API differences. Conventional red-team tests often grade only final harmful completion, not information gained across a sequence of denied requests. Security changes can also create new side channels after a model or gateway update.

## Root-cause analysis
- Refusal generation is treated as harmless output instead of a security boundary.
- Internal diagnostic context, endpoint metadata, and policy reasons are over-shared with the model.
- Security-sensitive identifiers are not labeled before reaching response generation.
- Evaluation focuses on single-turn jailbreak success rather than cumulative reconnaissance value.
- Different enforcement layers return distinguishable status, latency, or wording.
- Teams lack a deterministic regression corpus for refusal leakage.

## Improvement opportunity
Treat refusals as externally observable security responses. Minimize sensitive control-plane context available to the model, label sensitive identifiers, scan candidate responses for prohibited disclosure, normalize externally visible denial behavior where practical, and continuously replay adaptive multi-turn probes after model/gateway changes.

## Goal
Reduce actionable security intelligence exposed through refusals while preserving useful user-facing explanations and without hiding legitimate policy information that users need.

## Metrics
- 0 exact matches of configured sensitive identifiers in refusal output.
- 0 prohibited implementation-detail leaks in regression corpus.
- >=95% benign refusal explanations remain understandable under human review.
- Multi-turn reconnaissance score does not increase after releases.
- Denial timing/status variance stays within configured envelope when normalization is applicable.

## Trigger
Pre-release security testing; modification of prompts, policies, routing, tools, endpoint parameters, or guardrail layers; discovery of a new refusal-based reconnaissance technique.

## Inputs
Refusal transcripts, policy configuration, sensitive-term inventory, model/gateway version, response metadata, timing/status observations, and adversarial probe corpus.

## Outputs
Leak findings, severity, evidence locations, sanitized-response recommendations, regression results, and release decision.

## Interpretation
The evidence does not imply that all detailed refusals are vulnerabilities. The risk is specifically that externally visible denials reveal non-public implementation details or produce repeatable signals that materially lower the cost of exploitation.

## Proposed solution
A reusable refusal-oracle audit and release gate combining deterministic sensitive-detail scanning with multi-turn adversarial evaluation. Deterministic checks block known sensitive identifiers; adaptive tests measure whether repeated denials yield increasing exploit-relevant information. Human review remains required for ambiguous findings.