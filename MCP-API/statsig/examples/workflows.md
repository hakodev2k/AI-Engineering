# Statsig connector workflows

## Inspect stale gates
Tool: `statsig.gate.list`
Input: `{ "type": "STALE", "limit": 10, "page": 1 }`
Expected output: provider response wrapped as `{ "source": "untrusted_provider_data", "data": ... }`.
Permission: READ. Approval: no.

## Inspect experiment
Tool: `statsig.experiment.get`
Input: `{ "experimentId": "checkout_experiment" }`
Expected output: experiment metadata and configuration from the Console API.
Permission: READ. Approval: no.

## Create a guarded gate
Tool: `statsig.gate.create`
Input: `{ "name": "new_checkout", "description": "Guard new checkout", "isEnabled": true, "approvalToken": "<human-approved-token>" }`
Expected output: created gate object.
Permission: WRITE. Approval: yes.

## Update dynamic configuration
Tool: `statsig.dynamic_config.update`
Input: `{ "configId": "ranking_config", "description": "Updated ranking configuration", "approvalToken": "<human-approved-token>" }`
Expected output: updated dynamic config object.
Permission: WRITE. Approval: yes.

## Read metric values
Tool: `statsig.metric_value.list`
Input: `{ "date": "2026-09-07", "metricName": "conversion_rate", "limit": 20, "page": 1 }`
Expected output: paginated metric values.
Permission: READ. Approval: no.
