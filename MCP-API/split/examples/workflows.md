# Split connector examples

- `split.feature_flag.list` — input `{"workspaceId":"PROJECT_ID","offset":0,"limit":20}`; output: Split list payload; READ; no approval.
- `split.feature_flag.get` — input `{"workspaceId":"PROJECT_ID","name":"checkout_v2"}`; output: feature-flag metadata; READ; no approval.
- `split.feature_flag.definition.get` — input `{"workspaceId":"PROJECT_ID","name":"checkout_v2","environment":"Production"}`; output: environment definition; READ; no approval.
- `split.feature_flag.create` — input includes project, traffic type and name; WRITE; requires `SPLIT_ALLOW_WRITES=true`.
- `split.feature_flag.definition.update` — restricted JSON Patch paths only; HIGH_RISK; requires writes enabled and `approved:true`.
