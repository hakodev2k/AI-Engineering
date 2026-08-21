# Research Evidence

## Topic
Trusted Plugin Runtime Provenance Gate

## Category
Security

## Problem
Bundled browser/computer-use plugins can be present on disk and appear installed, yet trusted subprocesses reject their own service modules because the effective trusted-code-path state, plugin cache version, sandbox-visible paths, and native-host registration are inconsistent. This breaks legitimate automation and creates pressure to weaken trust checks manually.

## Why it matters now
Multiple Windows reports from August 2026 reproduce the same trusted RPC path failure across fresh tasks and official bundled Browser/Chrome plugins. Some reports show the referenced file exists, hashes match the bundled package, and path-containment checks succeed outside the Codex sandbox, while the trusted worker still rejects the dependency. Separate reports also show native-host registration can be partially missing while plugin state claims installation succeeded.

## Affected users
Developers using bundled browser/computer-use plugins, platform teams packaging trusted plugins, Windows users, and agent-runtime maintainers responsible for sandbox and plugin trust boundaries.

## Current public evidence

### Observed evidence
1. OpenAI Codex issue #39136 reports Browser plugin initialization failing with `Trusted RPC dependency must resolve within a configured trusted code path` for the bundled `browser-service.mjs` on Windows.
2. Issue #39387 reports the bundled Browser service is readable and granted sandbox access, yet trusted worker path validation rejects it; the reporter specifically identifies unsynchronized filesystem allowlists and trusted-code-path state.
3. Issue #39399 reports the same failure with exact configured trust roots; the same `node_repl.exe` succeeds outside the Codex sandbox, suggesting environment propagation or sandbox path visibility divergence. It also finds a native-host manifest without the required registry key.
4. Issue #39486 reproduces the problem across both Chrome and in-app Browser plugins after reinstall/restart attempts.
5. Older issues #23283 and #28950 independently document plugin installation states where native messaging host artifacts are missing even though the plugin/extension appears installed.

### Interpretation
These reports point to a provenance/configuration-consistency failure rather than evidence that the bundled module itself is malicious. The security problem is two-sided: a valid signed/bundled module can become unavailable because trust state drifts, while ad-hoc fixes such as broadening trusted roots or disabling sandboxing would weaken the intended security boundary.

### Proposed solution
Add a reusable preflight gate that validates plugin provenance, expected package version, canonical path containment, sandbox-visible trusted roots, required environment propagation, and native-host registration before launching trusted services. Fail closed with actionable diagnostics; never auto-expand trust roots.

## Existing approaches
- Trusted code-path validation before privileged RPC service loading.
- Sandboxed trusted worker/service processes.
- Plugin cache and bundled marketplace packages.
- Native-host manifest/registry checks for Chrome integration.
- Manual reinstall/restart/reset troubleshooting.

## Remaining limitations
- Trust checks can disagree across parent process, sandbox, and trusted subprocess.
- Installation can be partially successful without atomic post-install validation.
- Error messages usually identify the rejected path but not the effective roots, canonicalization result, package provenance, or missing registration artifact.
- Manual workarounds risk over-broad trust configuration.

## Root-cause analysis
Likely contributors include stale or version-skewed plugin cache metadata, environment variables not propagated into the trusted subprocess, filesystem allowlists not synchronized with logical trusted roots, Windows path canonicalization differences, and non-atomic native-host setup. The gate treats these as hypotheses to verify, not assumptions.

## Improvement opportunity
A deterministic diagnostic/launch gate can compare expected provenance against actual runtime state, block unsafe broadening of trust, and distinguish package-integrity failures from configuration-propagation failures.

## Relevant sources
- https://github.com/openai/codex/issues/39136
- https://github.com/openai/codex/issues/39387
- https://github.com/openai/codex/issues/39399
- https://github.com/openai/codex/issues/39486
- https://github.com/openai/codex/issues/23283
- https://github.com/openai/codex/issues/28950
