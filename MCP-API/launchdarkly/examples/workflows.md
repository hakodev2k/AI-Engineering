# Workflows

`launchdarkly.flag.list` with `{ "projectKey":"web", "environmentKey":"production", "limit":20 }` is READ and needs no approval. Output is `{ok,risk,data}`.

`launchdarkly.flag.create` with projectKey, flagKey, name, at least two variations, and `approved:true` is WRITE; approval is required unless explicitly configured for writes.

`launchdarkly.flag.update` and `launchdarkly.flag.archive` are HIGH_RISK and always require `approved:true`. Use read tools first to inspect current state.
