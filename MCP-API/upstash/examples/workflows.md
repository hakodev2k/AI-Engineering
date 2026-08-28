# Upstash connector workflows

## Read cached data

Tool: `upstash.key.get`  
Permission: `READ`  
Approval: no

```json
{ "key": "cache:product:42" }
```

## Discover keys incrementally

Tool: `upstash.key.scan`  
Permission: `READ`  
Approval: no

```json
{ "cursor": "0", "match": "session:*", "count": 100 }
```

Use the returned cursor for the next call. Do not assume one scan returns all keys.

## Set a cache entry

Tool: `upstash.key.set`  
Permission: `WRITE`  
Approval: required

```json
{
  "key": "cache:product:42",
  "value": "{\"id\":42,\"name\":\"Keyboard\"}",
  "ttlSeconds": 300,
  "approval_token": "<HMAC-SHA256 approval for this exact payload>"
}
```

## Increment a counter

Tool: `upstash.counter.increment`  
Permission: `WRITE`  
Approval: required

```json
{ "key": "metrics:checkout", "amount": 1, "approval_token": "<payload-bound HMAC>" }
```

## Delete stale keys

Tool: `upstash.key.delete`  
Permission: `DESTRUCTIVE`  
Approval: required  
Additional gate: `UPSTASH_REDIS_ENABLE_DESTRUCTIVE=true`

```json
{ "keys": ["cache:old:1", "cache:old:2"], "approval_token": "<payload-bound HMAC>" }
```
