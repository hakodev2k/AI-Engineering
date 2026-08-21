# Research — Agent Egress Policy Runtime Attestation

## Problem
AI coding-agent sandboxes increasingly expose domain allowlists and managed proxies, but the policy shown in config/UI can diverge from the policy actually enforced by the running task. A stale or bypassed egress policy can either block required dependencies or, more seriously, permit outbound connections that operators believe are denied.

## Category
Security

## Why it matters now
Recent 2026 reports across Claude Code and Codex show multiple forms of configuration/enforcement drift: non-allowlisted domains reachable while an allowlist is displayed, project allowlist changes ignored by active tasks, and proxy allowlists systematically missing real tool destinations. These are runtime control-plane/data-plane consistency problems, not merely documentation errors.

## Current public signals

### Signal 1 — Claude Code sandbox displays an allowlist while non-listed domains remain reachable
Claude Code issue #84833 (opened 2026-08-07) reports that with `sandbox.network.allowedDomains` configured and sandbox auto-allow enabled, `/sandbox` shows the expected allowed-domain list, yet non-listed domains are reachable without prompt or block.

Source: https://github.com/anthropics/claude-code/issues/84833

### Signal 2 — Codex project network allowlist changes ignored by a running task
Codex issue #35243 (opened 2026-07-24) reports a valid project-scoped `network_proxy` configuration change that was parsed successfully but not applied to the managed proxy of an already-running task.

Source: https://github.com/openai/codex/issues/35243

### Signal 3 — Claude Code web allowlist out of sync with actual tooling destinations
Claude Code issue #71629 (opened 2026-06-26) reports trusted egress allowlists that are systematically out of sync with the domains development tooling actually contacts, causing recurring failures and manual exceptions.

Source: https://github.com/anthropics/claude-code/issues/71629

### Signal 4 — Platform APIs model network policy explicitly
OpenAI's container API exposes a concrete `network_policy` object with `disabled` or `allowlist` modes and `allowed_domains`. This reinforces that network policy is a first-class runtime security boundary and can be checked independently of model behavior.

Source: https://developers.openai.com/api/reference/cli/resources/containers/methods/create

Anthropic documents corporate proxy routing and network allowlisting requirements, likewise treating outbound routing as an infrastructure control rather than a prompt instruction.

Source: https://docs.anthropic.com/en/docs/claude-code/corporate-proxy

## Existing approaches

### Trust configuration/UI state
Operators inspect config files, sandbox status pages, or task settings and assume the effective network policy matches.

Limitation: the 2026 reports above show that displayed/parsed policy can be stale or not equivalent to runtime enforcement.

### Reactive network debugging
Developers discover missing/extra access only when commands fail or unexpected traffic is noticed.

Limitation: this detects policy drift late and does not prove denied destinations are actually blocked.

### Broad allowlists
Teams expand allowlists to reduce failures.

Limitation: this increases attack surface and can mask stale-policy bugs. It is not a substitute for verifying least privilege.

## Root-cause hypotheses
1. Policy is captured at task/session creation and not refreshed after configuration changes.
2. UI/config reflects desired state while proxy/sandbox enforces cached effective state.
3. Different execution paths bypass or ignore the same proxy configuration.
4. Tooling uses transitive/CDN/auth domains not represented in static allowlists.
5. Runtime lacks a deterministic attestation step comparing expected allow/deny behavior with live probes.

## Proposed engineering solution
Create a reusable runtime attestation layer that takes an explicit policy manifest and performs bounded, non-destructive TCP/TLS/HTTP probes against:
- destinations that MUST be reachable;
- destinations that MUST be denied;
- optional control endpoints.

The result is a machine-readable verdict. An agent may proceed with network-dependent work only when the measured effective policy matches the declared policy. Policy changes invalidate previous attestation.

## Improvement target
- 100% of required-allow probes succeed within configured timeout.
- 100% of required-deny probes fail to establish the configured connection mode.
- No wildcard expansion of policy during attestation.
- Policy hash changes force re-attestation.
- Probe count and timeout are bounded.
- No credentials or sensitive request payloads are used.
- Any mismatch is classified as `over-permissive`, `over-restrictive`, or `indeterminate`.

## Security note
A denied probe should target operator-owned or explicitly approved harmless endpoints where possible. Do not probe arbitrary third-party hosts at scale. The script defaults to HEAD/GET without credentials and caps timeouts.

## Sources
1. Anthropic Claude Code issue #84833 — 2026-08-07 — https://github.com/anthropics/claude-code/issues/84833
2. OpenAI Codex issue #35243 — 2026-07-24 — https://github.com/openai/codex/issues/35243
3. Anthropic Claude Code issue #71629 — 2026-06-26 — https://github.com/anthropics/claude-code/issues/71629
4. OpenAI container network policy API — https://developers.openai.com/api/reference/cli/resources/containers/methods/create
5. Anthropic corporate proxy configuration — https://docs.anthropic.com/en/docs/claude-code/corporate-proxy
