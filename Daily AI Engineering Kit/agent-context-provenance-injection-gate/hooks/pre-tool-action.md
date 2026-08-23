# Hook: Pre-Tool Action

**Trigger:** immediately before a tool action whose parameters or necessity were influenced by retrieved context.

**Preconditions:** context record exists and proposed action is explicit.

**Action:** recompute the source digest; confirm it equals the record; confirm status is `allow` or an approved `review`; trace the action to a trusted instruction independent of data-only text.

**Expected result:** unchanged digest and valid authorization chain.

**Failure behavior:** block action; return evidence to workflow owner. Changed content restarts the context workflow. Missing approval cannot be retried automatically.

**Blocking:** yes.