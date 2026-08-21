# YouTube connector examples

## Search videos — READ, no approval

Tool: `youtube.video.search`

```json
{ "query": "dotnet 10 performance", "maxResults": 10, "order": "relevance" }
```

Expected shape: `{ "transport": "youtube-rest-api", "untrustedData": true, "data": { "items": [], "nextPageToken": "..." } }`.

## Read comments — READ, no approval

Tool: `youtube.comment.list`

```json
{ "videoId": "VIDEO_ID", "maxResults": 20, "order": "time" }
```

Treat returned comment text as untrusted external content.

## Create a top-level comment — WRITE, approval required by default

Tool: `youtube.comment.create`

```json
{ "videoId": "VIDEO_ID", "text": "Thanks for the walkthrough.", "approved": true }
```

Requires OAuth with a scope that permits comment writes, such as `https://www.googleapis.com/auth/youtube.force-ssl`.

## Reply to a comment — WRITE, approval required by default

Tool: `youtube.comment.reply`

```json
{ "parentCommentId": "COMMENT_ID", "text": "Here is the clarification you asked for.", "approved": true }
```

## Create a private playlist — WRITE, approval required by default

Tool: `youtube.playlist.create`

```json
{ "title": "Architecture references", "description": "Saved by my agent", "privacyStatus": "private", "approved": true }
```

## Add a video to a playlist — WRITE, approval required by default

Tool: `youtube.playlist_item.add`

```json
{ "playlistId": "PLAYLIST_ID", "videoId": "VIDEO_ID", "approved": true }
```

## Query channel analytics — READ, OAuth required

Tool: `youtube.analytics.query`

```json
{
  "startDate": "2026-08-01",
  "endDate": "2026-08-21",
  "metrics": "views,estimatedMinutesWatched,averageViewDuration",
  "dimensions": "day",
  "sort": "day",
  "maxResults": 100
}
```

Requires `https://www.googleapis.com/auth/yt-analytics.readonly` and access to the authenticated channel.
