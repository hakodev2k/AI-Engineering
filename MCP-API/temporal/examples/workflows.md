# Temporal connector workflows

## Discover running workflows

Tool: `temporal.workflow.list`  
Permission: `READ`  
Approval: no

```json
{"query":"ExecutionStatus = 'Running'","pageSize":50,"maxResults":100}
```

## Inspect one workflow

Tool: `temporal.workflow.describe`  
Permission: `READ`  
Approval: no

```json
{"workflowId":"order-1042"}
```

## Signal a workflow

Tool: `temporal.workflow.signal`  
Permission: `HIGH_RISK`  
Approval: required

```json
{"workflowId":"order-1042","signalName":"paymentConfirmed","args":[{"transactionId":"txn-123"}],"approval_token":"<HMAC approval bound to this exact payload>"}
```

## Query workflow state

Tool: `temporal.workflow.query`  
Permission: `READ`  
Approval: no

```json
{"workflowId":"order-1042","queryName":"currentState"}
```

## Terminate a workflow

Tool: `temporal.workflow.terminate`  
Permission: `DESTRUCTIVE`  
Approval: required  
Additional gate: `TEMPORAL_ENABLE_DESTRUCTIVE=true`

```json
{"workflowId":"order-1042","reason":"Operator-approved incident response","approval_token":"<HMAC approval bound to this exact payload>"}
```
