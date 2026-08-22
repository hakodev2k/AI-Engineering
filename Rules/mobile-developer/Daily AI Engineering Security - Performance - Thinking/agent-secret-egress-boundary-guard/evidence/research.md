# Research Evidence

## Topic
Agent Secret Egress Boundary Guard

## Category
Security

## Problem
AI agents can directly read runtime credentials from environment variables, config files, subprocess environments, terminal snapshots, and tool outputs, then leak them into provider-bound context, stored transcripts, logs, or network requests. Prompt-only redaction rules and format-specific regexes are insufficient because secret shapes vary and some leaks occur before model output is produced.

## Why it matters now
Current 2026 reports show the same failure class across multiple agent projects and execution layers: model-visible tool output, subprocess inheritance, multiplexed profile isolation, and credential injection into sandboxes.

## Affected users
Coding-agent users, platform builders, multi-user agent gateways, CI/CD agent runners, sandbox operators, and teams that provide API keys or service credentials to autonomous tools.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #34233 (opened 2026-07-19) reports live credentials from config files being printed into stored conversation/tool output despite explicit AGENTS.md redaction instructions.
2. Kubernetes SIG agent-sandbox issue #1045 (opened 2026-06-26) states credentials injected through Kubernetes Secrets remain directly readable by the agent process and can be exfiltrated through prompts, tool calls, or outbound requests; it proposes a credential-vault proxy to keep raw values out of the agent.
3. Hermes Agent issue #20785 reports recurring credential leakage in chat/reasoning output and argues that prompt hardening is insufficient; the issue recommends pipeline redaction and ultimately opaque credential references.
4. Hermes Agent issue #27303 reports execute-code subprocesses receiving secret-like environment variables missed by a substring blocklist and identifies inconsistent approval enforcement at the terminal boundary.
5. Hermes Agent issue #82936 (opened 2026-08-10) reports cross-profile secret leakage where secondary profiles could inherit default-profile credentials through terminal and worker subprocess environments.

### Interpretation
The recurring root problem is architectural: secret values are made available too broadly and controls are scattered across prompts, regexes, individual tools, and subprocess setup. Once raw credentials enter model-visible context or a generic child environment, downstream redaction becomes best-effort rather than a dependable security boundary.

## Existing approaches
- Prompt instructions telling the model not to print secrets.
- Regex/prefix redaction of known credential formats.
- Environment-variable name blocklists or safe-prefix lists.
- Kubernetes Secret injection into agent containers.
- Tool-specific environment scrubbing.
- Per-profile secret scopes in some runtimes.

## Remaining limitations
- Prompt rules do not prevent the model from reproducing values it has already seen.
- Shape-based regexes miss opaque tokens, URLs containing credentials, and provider formats not yet known to the scanner.
- Injecting secrets into the agent process still grants the agent read access.
- Tool-specific filters create inconsistent boundaries and bypass paths.
- Subprocess inheritance can cross tenant/profile boundaries.
- Post-hoc output scrubbing does not protect logs, shell snapshots, network requests, or internal tool-to-tool payloads.

## Root-cause analysis
1. Raw secret values are admitted into model-visible or general-purpose process scope.
2. Secret access is capability-wide instead of scoped to a concrete outbound action.
3. Egress sinks are not centrally mediated.
4. Detection often relies on guessed secret shapes instead of exact-value taint/fingerprint knowledge.
5. Profile/tenant identity is not consistently bound to credential resolution.
6. Verification focuses on one output surface rather than all sinks.

## Improvement opportunity
Build a reusable egress boundary that keeps credentials opaque by default, resolves them only at an approved execution sink, tracks exact registered values as tainted data, sanitizes tool output before model/context persistence, strips unapproved child-process variables, verifies tenant/profile scope, and blocks any provider/log/network egress containing a registered secret.

## Relevant sources
- https://github.com/openai/codex/issues/34233
- https://github.com/kubernetes-sigs/agent-sandbox/issues/1045
- https://github.com/NousResearch/hermes-agent/issues/20785
- https://github.com/NousResearch/hermes-agent/issues/27303
- https://github.com/NousResearch/hermes-agent/issues/82936
- https://github.com/NousResearch/hermes-agent/issues/48441
