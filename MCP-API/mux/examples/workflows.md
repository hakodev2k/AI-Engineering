# Mux connector examples

## Browse assets
Tool: `mux.asset.list`  
Permission: READ  
Approval: no
```json
{"limit":25}
```

## Inspect asset and source metadata
Tools: `mux.asset.get`, `mux.asset.input_info.get`  
Permission: READ  
Approval: no
```json
{"assetId":"ASSET_ID"}
```

## Ingest a video
Tool: `mux.asset.create`  
Permission: WRITE  
Approval: required
```json
{"inputs":[{"url":"https://media.example.com/video.mp4","language_code":"en","name":"English"}],"playback_policies":["signed"],"video_quality":"basic","approval_token":"<payload-bound HMAC>"}
```

## Add subtitles
Tool: `mux.asset.track.create`  
Permission: WRITE  
Approval: required
```json
{"assetId":"ASSET_ID","url":"https://media.example.com/en.vtt","type":"text","text_type":"subtitles","language_code":"en-US","name":"English","approval_token":"<payload-bound HMAC>"}
```

## Publish or secure playback
Tool: `mux.asset.playback_id.create`  
Permission: HIGH_RISK  
Approval: required
```json
{"assetId":"ASSET_ID","policy":"signed","approval_token":"<payload-bound HMAC>"}
```

## Inspect a live stream safely
Tool: `mux.live_stream.get`  
Permission: READ  
Approval: no
```json
{"liveStreamId":"LIVE_STREAM_ID"}
```
The connector redacts `stream_key` if Mux includes it in the response.
