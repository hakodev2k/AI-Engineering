# Research — Observability Log Indirect Injection Gate

## Topic
Observability Log Indirect Injection Gate

## Category
Security

## Problem
AI coding and operations agents increasingly read attacker-influenced logs, alerts, traces, error reports, and observability records, then use privileged tools in the same run. In August 2026, Tenet Security demonstrated the GhostJacking attack class: poisoned observability data can be interpreted as instructions, after which the agent can perform otherwise-authorized infrastructure or workstation actions.

## Why it matters now
The attack was publicly presented at DEF CON 34 on August 9, 2026 and independently reported by SecurityWeek and Infosecurity Magazine on August 10, 2026. The important engineering failure is not simply prompt injection; it is a missing trust boundary between passive evidence and action-authorizing instructions.

## Affected users
- Developers using coding agents connected to Sentry, Datadog, Cloudflare, CI logs, or production telemetry.
- SRE/DevOps teams allowing agents to investigate incidents and remediate infrastructure.
- Platform builders implementing MCP/tool access to observability systems.
- Security teams that assume IAM permissions alone express user intent.

## Current public evidence
### Observed evidence
1. Tenet Security's August 9, 2026 GhostJacking research reports poisoned logs/alerts delivered through Cloudflare, Datadog, and Sentry and describes successful agent takeover, infrastructure modification, credential access, persistence, and a reported 9/10 success rate in one Claude Code setup. Source: https://tenetsecurity.ai/blog/ghostjacking-attacks-agentic-kill-chain/
2. SecurityWeek independently reported on August 10, 2026 that instructions planted in logs or alerts can turn AI agents rogue while the agent uses trusted tools and permissions. Source: https://www.securityweek.com/ghostjacking-attack-uses-poisoned-logs-to-turn-ai-agents-bad/
3. Infosecurity Magazine independently reported on August 10, 2026 that the technique abuses trusted agent access rather than defeating the firewall directly, including persistence in configuration, memory, and tools. Source: https://www.infosecurity-magazine.com/news/ghostjacking-ai-gents-access/

### Interpretation
Observability records must be treated as untrusted evidence, even when fetched through a trusted integration. Existing IAM and tool allowlists can still authorize harmful actions because they answer whether an agent *can* act, not whether attacker-controlled evidence supplied the intent to act.

### Proposed solution
Introduce a deterministic provenance/action gate between observability ingestion and side-effecting tools. The gate records whether an action was derived from untrusted telemetry, classifies the requested capability, requires fresh human approval or a pre-authorized remediation contract for high-impact actions, and fail-closes when provenance is missing.

## Existing approaches
- Deny outbound network access by default.
- Require human approval for command execution.
- Sandboxing and least privilege.
- Prompt instructions telling the model to treat retrieved content as data.
- Existing DLP, EDR, WAF, IAM, and audit logging.

## Remaining limitations
- Prompt-level instructions are probabilistic and run in the same model context as attacker-controlled data.
- IAM/allowlists cannot prove intent provenance.
- Blanket human approval for every read-only action creates excessive friction.
- A sandbox can reduce impact but does not prevent poisoned evidence from steering actions available inside the sandbox.
- Generic prompt-injection detectors may miss new wording and are not sufficient as authorization controls.

## Root-cause analysis
1. Passive observability data and trusted instructions are flattened into one natural-language context.
2. Tool authorization is usually capability-based but not provenance-aware.
3. Agent runtimes often do not preserve a machine-readable lineage from evidence to proposed action.
4. High-impact actions may be approved by standing permissions rather than a fresh intent check.
5. Remediation workflows often lack explicit resource/action scope and expiry.

## Improvement opportunity
Use a fail-closed action gate that evaluates machine-readable provenance and capability metadata. Read-only investigation may continue, but shell execution, external network access, infrastructure mutation, credential access, configuration persistence, and privileged writes derived from observability evidence require either fresh human approval bound to the exact action or a narrowly scoped pre-authorized remediation contract.

## Goal
Prevent attacker-authored observability content from directly authorizing privileged actions while preserving low-risk investigation.

## Metrics
- 100% of high-impact actions have provenance classification.
- 100% of actions derived from untrusted observability evidence are blocked or explicitly approved.
- 0 secrets emitted by test fixtures.
- 0 unauthorized side effects in adversarial tests.
- Read-only investigation false-block rate below the configured target.

## Trigger
Before every side-effecting tool call when any evidence in the active task originated from logs, traces, alerts, incidents, tickets, or external telemetry.

## Inputs
Evidence provenance, source class, requested tool/action, capability set, target resource, environment, approval receipt, remediation contract.

## Outputs
`allow`, `approval_required`, or `deny`, with deterministic reason codes and an audit record.

## Relevant sources
- Tenet Security, 2026-08-09: https://tenetsecurity.ai/blog/ghostjacking-attacks-agentic-kill-chain/
- SecurityWeek, 2026-08-10: https://www.securityweek.com/ghostjacking-attack-uses-poisoned-logs-to-turn-ai-agents-bad/
- Infosecurity Magazine, 2026-08-10: https://www.infosecurity-magazine.com/news/ghostjacking-ai-gents-access/
