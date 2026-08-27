export const CATALOG=Object.freeze({
  "contentful.content_type.list":{upstream:"list_content_types",risk:"READ"},
  "contentful.content_type.get":{upstream:"get_content_type",risk:"READ"},
  "contentful.entry.search":{upstream:"search_entries",risk:"READ"},
  "contentful.entry.get":{upstream:"get_entry",risk:"READ"},
  "contentful.entry.snapshot.get":{upstream:"get_entry_snapshot",risk:"READ"},
  "contentful.entry.reference.resolve":{upstream:"resolve_entry_references",risk:"READ"},
  "contentful.entry.create":{upstream:"create_entry",risk:"WRITE"},
  "contentful.entry.update":{upstream:"update_entry",risk:"WRITE"},
  "contentful.entry.publish":{upstream:"publish_entry",risk:"HIGH_RISK"},
  "contentful.entry.unpublish":{upstream:"unpublish_entry",risk:"HIGH_RISK"},
  "contentful.entry.archive":{upstream:"archive_entry",risk:"HIGH_RISK"},
  "contentful.entry.unarchive":{upstream:"unarchive_entry",risk:"WRITE"},
  "contentful.entry.delete":{upstream:"delete_entry",risk:"DESTRUCTIVE"},
  "contentful.asset.list":{upstream:"list_assets",risk:"READ"},
  "contentful.asset.get":{upstream:"get_asset",risk:"READ"}
});
export function externalDefinitions(upstreamTools){
  const byName=new Map(upstreamTools.map(t=>[t.name,t]));
  return Object.entries(CATALOG).map(([external,meta])=>{
    const upstream=byName.get(meta.upstream);
    if(!upstream) throw new Error(`Required official upstream tool missing: ${meta.upstream}`);
    const schema=structuredClone(upstream.inputSchema||{type:"object",properties:{}});
    schema.type ||= "object";
    schema.properties ||= {};
    if(meta.risk!=="READ"){
      schema.properties.approval_token={type:"string",minLength:64,maxLength:64,pattern:"^[a-f0-9]{64}$",description:"Human approval HMAC bound to this exact tool and payload."};
      schema.required=[...new Set([...(schema.required||[]),"approval_token"])];
    }
    return {name:external,description:`${upstream.description||meta.upstream} Risk: ${meta.risk}. ${meta.risk==="READ"?"No approval required.":"Explicit approval required."}`,inputSchema:schema,annotations:{readOnlyHint:meta.risk==="READ",destructiveHint:meta.risk==="DESTRUCTIVE"||meta.risk==="HIGH_RISK",openWorldHint:false}};
  });
}
export function stripApproval(args={}){const {approval_token:_ignored,...payload}=args;return payload;}
