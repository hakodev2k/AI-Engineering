# Research — Local Inference DNS Rebinding Poisoning Guard

**Category:** Security  
**Research date:** 2026-08-27 (UTC+7)

## Topic
Prevent locally hosted inference APIs from becoming browser/LAN-reachable control planes that can persistently poison models used by AI agents.

## Problem
Local AI runtimes are often assumed safe because they run on a developer machine. Current research on NVIDIA NemoClaw shows how changing Ollama from loopback binding to `0.0.0.0:11434` for container reachability can expose an unauthenticated inference API, enable DNS-rebinding access from a malicious webpage, and allow persistent model-template poisoning.

## Why it matters now
Cyera/Oasis published the NemoClaw research on 2026-08-25 and identifies CVE-2026-65105. The attack crosses browser, network, local inference and agent boundaries, demonstrating that agent sandboxing alone does not preserve model integrity. A separate NVIDIA NemoClaw advisory from April 2026 (CVE-2026-24222) also documented prompt-influenced access-control failures, reinforcing that agent infrastructure boundaries are active security concerns.

## Affected users
Developers running local AI agents, workstation/VDI teams, agent-platform maintainers, organizations using local Ollama-backed inference, and teams granting agents access to source control, CI/CD, internal APIs or MCP tools.

## Current public evidence

### Observed evidence
1. Cyera/Oasis research published 2026-08-25 reports that NemoClaw configured Ollama with `OLLAMA_HOST=0.0.0.0:11434`, making it reachable beyond loopback. Combined with DNS rebinding and missing API authentication, a malicious webpage could access the API and poison the model template persistently.  
   https://www.cyera.com/research/nemoclaw-one-website-visit-to-hijack-your-ai-agent
2. The research explains that template poisoning survives client-supplied system prompts because the model template transforms messages before inference. It also documents LAN exposure, GPU abuse, model deletion and information disclosure as additional consequences.  
   https://www.cyera.com/research/nemoclaw-one-website-visit-to-hijack-your-ai-agent
3. Independent reporting on 2026-08-25/26 corroborated the all-interface binding, DNS rebinding and persistent poisoning mechanics.  
   https://thehackernews.com/2026/08/a-malicious-webpage-could-poison-your.html
4. NVIDIA NemoClaw's GitHub issue tracker has separately recorded unexpected effective network-policy behavior, including issue #6502 (July 2026), where GitHub network capability appeared effective even when not selected by the user. This is not the same vulnerability, but it independently demonstrates the need to verify effective policy rather than infer it from visible configuration.  
   https://github.com/NVIDIA/NemoClaw/issues/6502
5. GitHub Advisory Database entry for CVE-2026-24222 describes an earlier NemoClaw sandbox-initialization access-control issue leading to environment-variable disclosure.  
   https://github.com/advisories/GHSA-mf4x-g8fr-m8pw

### Interpretation
The reusable engineering failure is an inference-control-plane trust error. Container connectivity requirements silently widened the network trust boundary. The model runtime remained unauthenticated, and model-template integrity was not independently attested by the agent client.

## Existing approaches
- Bind local inference to loopback by default.
- Use authenticated reverse proxies or Unix/domain sockets for container-to-host access.
- Apply host firewall rules and network namespaces.
- Use DNS-rebinding/Host/Origin protections.
- Restrict model-management endpoints separately from inference endpoints.
- Sandbox the agent process and constrain outbound tools.

## Remaining limitations
- `0.0.0.0` is frequently introduced as a convenience fix for containers.
- Developers may see a `localhost` URL while the socket actually listens on all interfaces.
- Host/Origin checks can depend on bind mode and proxy topology.
- Agent clients generally do not attest model template/config integrity before every run.
- Sandboxing protects the host but not necessarily repositories, APIs and other resources delegated to the compromised agent.
- Manual firewall checks are easy to drift across OSes and WSL/container setups.

## Root-cause analysis
1. Network reachability was optimized without an explicit trust model.
2. Unauthenticated management and inference operations shared the same listener.
3. Browser-origin threats were omitted from the local-service threat model.
4. Agent correctness assumed the model runtime itself was trustworthy.
5. Effective network policy was not continuously verified against intended policy.

## Improvement opportunity
Create a deterministic preflight and runtime guard that validates bind addresses, requires authentication or a constrained transport for non-loopback access, checks model-template fingerprints, distinguishes inference from model-management permissions, and blocks agent startup when the effective listener/policy is broader than declared.

## Goal
A browser or untrusted LAN peer cannot reach model-management endpoints, and an agent cannot use a model whose trusted template fingerprint changed without approved re-baselining.

## Metrics
- non-loopback unauthenticated listener count
- management-endpoint exposure count
- template fingerprint drift events
- declared-vs-effective network-policy mismatches
- blocked startup rate
- security regression pass rate

## Trigger
Agent startup, local inference configuration change, model creation/update, container-network change, or periodic security verification.

## Inputs
Listener inventory, declared allowed bind addresses, authentication state, model template hash, baseline hash, effective firewall/network policy.

## Outputs
`pass`, `block`, or `rebaseline_required` with reason codes.

## Relevant sources
- https://www.cyera.com/research/nemoclaw-one-website-visit-to-hijack-your-ai-agent
- https://thehackernews.com/2026/08/a-malicious-webpage-could-poison-your.html
- https://github.com/NVIDIA/NemoClaw/issues/6502
- https://github.com/advisories/GHSA-mf4x-g8fr-m8pw
