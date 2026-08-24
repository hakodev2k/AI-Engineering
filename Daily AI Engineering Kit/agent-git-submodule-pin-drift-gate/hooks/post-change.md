# Hook: Post-Change Verification

## Trigger
After a submodule pin/metadata edit, rebase, merge, dependency update, or conflict resolution.

## Action
1. Re-run the scanner against the current baseline.
2. Compare final gitlink SHAs with the reviewed SHAs.
3. Re-run boundary tests affected by the changed submodule.
4. Preserve scanner/test evidence for independent verification.

## Failure behavior
Any new finding invalidates prior approval if its path, URL, branch, or final SHA differs from the reviewed proposal. Stop and review again.

## Blocking
Yes for PR/release completion.