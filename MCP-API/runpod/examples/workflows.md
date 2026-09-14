# Runpod connector examples

All provider content returned by these tools is untrusted data. Secrets stay in the connector environment.

## Discover available compute

Tool: `runpod.gpu.list`

```json
{ "limit": 25 }
```

Permission: `READ`. Approval: no.

Expected output shape: MCP content containing the official Runpod MCP response with GPU catalog entries and pagination metadata when present.

## Inspect running Pods

Tool: `runpod.pod.list`

```json
{ "computeType": "GPU", "limit": 20, "includeMachine": true }
```

Permission: `READ`. Approval: no.

## Prepare and create a Pod

First call `runpod.gpu.list` and `runpod.datacenter.list`. After a human reviews the selected image, GPU type/count, location and expected cost, create an approval token outside the model conversation with the deployment's approval service. Then call:

Tool: `runpod.pod.create`

```json
{
  "name": "inference-test",
  "imageName": "runpod/pytorch:1.0.2-cu1281-torch280-ubuntu2404",
  "gpuTypeIds": ["GPU_TYPE_ID_FROM_DISCOVERY"],
  "gpuCount": 1,
  "containerDiskInGb": 20,
  "approvalId": "64_HEX_CHAR_APPROVAL"
}
```

Permission: `HIGH_RISK`. Approval: required.

## Run an asynchronous Serverless job

Tool: `runpod.endpoint.job.run`

```json
{
  "endpointId": "ENDPOINT_ID",
  "input": { "prompt": "example workload input" },
  "approvalId": "64_HEX_CHAR_APPROVAL"
}
```

Permission: `HIGH_RISK`. Approval: required because the call consumes compute. Use `runpod.job.get` with the returned job ID to inspect status; do not blindly resubmit an uncertain job.

## Read job status

Tool: `runpod.job.get`

```json
{ "endpointId": "ENDPOINT_ID", "jobId": "JOB_ID" }
```

Permission: `READ`. Approval: no.
