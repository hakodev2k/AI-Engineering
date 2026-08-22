# Hook: Pre-child High-risk Call

## Trigger
Before a descendant executes write, shell, network, credential-sensitive, deployment, or repository-mutation tools.

## Preconditions
The event has a trustworthy actor mapping supplied by the orchestrator/wrapper and the expected root policy hash is known.

## Action
Validate `actor_id`, ancestry, and policy hash using `scripts/verify_lineage.py`.

## Command
`python3 scripts/verify_lineage.py lineage.json --expected-policy-sha256 <hash>`

## Expected result
Exit 0 with complete lineage and matching policy hashes.

## Failure behavior
Exit non-zero blocks the high-risk tool call. Missing identity is never converted to allow. One child relaunch is permitted by the workflow.

## Blocking
Yes.