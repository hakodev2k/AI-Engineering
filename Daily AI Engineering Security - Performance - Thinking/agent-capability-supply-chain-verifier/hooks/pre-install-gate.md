# Hook: Pre-Install Capability Gate

## Trigger
Immediately before any installer, package manager, clone-and-run step, MCP enablement, or Skill activation.

## Preconditions
`candidate.json` contains source URL, owner, immutable ref, artifact path, install command, and approval object when applicable.

## Action
Run:

`python scripts/verify_capability.py candidate.json --policy config/policy.json`

## Expected result
Exit `0` with decision `allow` and recorded SHA-256. Exit `4` means human approval is required. Exit `5` is a hard deny. Exit `2` indicates invalid/unverifiable input.

## Failure behavior
Any non-zero exit MUST block unattended installation. Exit `4` may resume only after a human approval record is generated for the exact digest/ref and the hook is re-run.

## Blocking
Yes. This hook is a security boundary and MUST NOT be bypassed by the discovery or installer agent.