# Tool examples

`make.organization.list` — READ, no approval. Input: `{}`. Output: `{data: ..., untrustedProviderContent: true}`.

`make.scenario.list` — READ, no approval. Input: `{"teamId": 123, "isActive": true}`.

`make.scenario.blueprint.get` — READ, no approval. Input: `{"scenarioId": 456}`. Blueprint content is untrusted provider data.

`make.scenario.run` — HIGH_RISK, operator approval required by default. Input: `{"scenarioId":456,"data":{"customerId":"example"},"responsive":true}`. Approval is configured out-of-band with `MAKE_APPROVED_ACTIONS=make.scenario.run`; it is never supplied by the model.

`make.scenario.activate` / `make.scenario.deactivate` — HIGH_RISK, approval required. Input: `{"scenarioId":456}`.

`make.execution.list` — READ, no approval. Input: `{"scenarioId":456,"limit":25}`.
