export class SanityTransportRouter {
  constructor(config,mcp,rest){this.config=config;this.mcp=mcp;this.rest=rest;}
  scope(payload){return {projectId:this.config.projectId,dataset:this.config.dataset,...payload};}
  async read(mcpTool,payload,fallback){
    if(this.config.mcpEnabled){try{return await this.mcp.call(mcpTool,this.scope(payload));}catch(error){if(!fallback)throw error;}}
    if(!fallback)throw new Error(`${mcpTool} requires the official Sanity MCP transport`);
    return fallback();
  }
  query(payload){return this.read('query_documents',payload,()=>this.rest.query(payload));}
  getDocument(payload){return this.read('get_document',payload,()=>this.rest.getDocument(payload));}
  schemaGet(payload){return this.read('get_schema',payload,null);}
  schemaList(payload){return this.read('list_workspace_schemas',payload,null);}
  releaseList(payload){return this.read('list_releases',payload,null);}
  write(mcpTool,payload){if(!this.config.mcpEnabled)throw new Error(`${mcpTool} requires SANITY_MCP_ENABLED=true`);return this.mcp.call(mcpTool,this.scope(payload));}
}
