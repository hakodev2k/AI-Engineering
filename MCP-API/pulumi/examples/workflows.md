# Pulumi connector examples

## Inspect a stack
Tool: `pulumi.stack.get`  
Permission: READ  
Approval: no
```json
{"orgName":"acme","projectName":"platform","stackName":"prod"}
```

## Inspect current resources
Tool: `pulumi.stack.resources.list`  
Permission: READ  
Approval: no
```json
{"orgName":"acme","projectName":"platform","stackName":"prod"}
```
Provider-returned values are marked as untrusted data and token/secret-like response fields are redacted.

## Preview an infrastructure deployment
Tool: `pulumi.deployment.preview`  
Permission: WRITE  
Approval: required
```json
{"orgName":"acme","projectName":"platform","stackName":"prod","inheritSettings":true,"approval_token":"<payload-bound HMAC>"}
```

## Apply an infrastructure update
Tool: `pulumi.deployment.update`  
Permission: HIGH_RISK  
Approval: required
```json
{"orgName":"acme","projectName":"platform","stackName":"prod","inheritSettings":true,"approval_token":"<payload-bound HMAC>"}
```

## Destroy infrastructure
Tool: `pulumi.deployment.destroy`  
Permission: DESTRUCTIVE  
Approval: required  
Additional gate: `PULUMI_ENABLE_DESTRUCTIVE=true`
```json
{"orgName":"acme","projectName":"sandbox","stackName":"ephemeral","inheritSettings":true,"approval_token":"<payload-bound HMAC>"}
```
