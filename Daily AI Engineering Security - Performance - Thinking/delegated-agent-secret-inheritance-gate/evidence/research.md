# Research Evidence

## Topic
Delegated Agent Secret Inheritance Gate

## Category
Security

## Problem
Child/subagents may inherit parent-process credentials even when their task does not require them, creating a direct secret-reading and exfiltration path.

## Why it matters now
Delegation and multi-agent workflows are increasingly common, while fresh public reports show that agent isolation can stop at the process/container boundary rather than the credential boundary.

## Affected users
Coding-agent users, platform builders, multi-agent orchestration teams, CI/CD agent operators, sandbox maintainers, and teams exposing cloud/GitHub/API credentials to agents.

## Current public evidence
### Observed evidence
1. NousResearch/hermes-agent issue #99635, opened 2026-08-31, reports that `delegate_task` child agents run in-process and inherit the parent's full `os.environ`, including `.env` credentials. Standalone dispatch can be scrubbed at process creation but in-process delegation has no equivalent boundary.
2. kubernetes-sigs/agent-sandbox issue #1045, opened 2026-06-26, proposes a credential-vault proxy because Kubernetes Secret injection still leaves raw environment credentials readable by the AI agent inside the sandbox.
3. Agenta issue #5703, opened 2026-08-03, distinguishes opaque secret delivery through Daytona Secrets from readable environment-variable delivery and calls for clear disclosure when the agent can read a secret.
4. OpenClaw issue #13683 documented a related boundary failure: sandboxed agents could retrieve resolved secret values from configuration.

### Interpretation
OS/container isolation and secret confidentiality are separate trust boundaries. If a child shares the parent interpreter or receives its environment wholesale, least privilege is violated before model/tool policy can compensate. Redaction cannot prevent arbitrary outbound use.

### Proposed solution
A deterministic delegation admission gate that checks environment-name inheritance before child start, rejects implicit full inheritance, requires explicit variable allowlists, and requires brokered/opaque handling for sensitive credentials unless a narrowly scoped readable exception is approved.

## Existing approaches
Scrubbed process environments; Kubernetes Secrets; environment allowlists; sandboxes; secret managers; output redaction; destination-restricted credential proxies; human approval.

## Remaining limitations
In-process children may have no environment boundary; subprocess scrubbing is too late; allowlists can accidentally include credentials; redaction cannot prevent exfiltration; generic sandboxing does not hide secrets injected inside it.

## Root-cause analysis
1. Delegation reuses parent process state for convenience/performance.
2. Credential delivery is coupled to process startup instead of task capability.
3. Policy is evaluated at tool/subprocess boundaries rather than child creation.
4. Sensitive-name classification is inconsistent.
5. Verification tests task success but not negative credential visibility.

## Improvement opportunity
Make credential visibility a first-class, testable delegation contract: requested names, sensitivity, delivery mode, destination, lifetime, and approval.

## Relevant sources
- https://github.com/NousResearch/hermes-agent/issues/99635
- https://github.com/kubernetes-sigs/agent-sandbox/issues/1045
- https://github.com/Agenta-AI/agenta/issues/5703
- https://github.com/openclaw/openclaw/issues/13683
