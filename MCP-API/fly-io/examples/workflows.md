# Fly.io Connector Workflows

## Inspect an application
Tool: `fly.app.get`
```json
{"app_name":"example-app"}
```
Permission: READ. Approval: no.

## Inspect machines
Tool: `fly.machine.list`
```json
{"app_name":"example-app"}
```
Permission: READ. Approval: no.

## Start a machine
Tool: `fly.machine.start`
```json
{"app_name":"example-app","machine_id":"machine-id","approval_id":"<HMAC approval>"}
```
Permission: HIGH_RISK. Approval: required. Approval is bound to the tool name and exact payload.

## Create a volume
Tool: `fly.volume.create`
```json
{"app_name":"example-app","name":"data","region":"iad","size_gb":10,"approval_id":"<HMAC approval>"}
```
Permission: WRITE. Approval: required by default.

## Delete a volume
Tool: `fly.volume.delete`
```json
{"app_name":"example-app","volume_id":"vol_example","approval_id":"<HMAC approval>"}
```
Permission: DESTRUCTIVE. Approval: always required.

All provider-returned content is wrapped with `untrusted_provider_content: true`.
