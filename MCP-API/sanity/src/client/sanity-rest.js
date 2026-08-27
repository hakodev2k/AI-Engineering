import { createClient } from '@sanity/client';
export class SanityRestFallback {
  constructor(config, client=null){ this.client=client||createClient({projectId:config.projectId,dataset:config.dataset,apiVersion:config.apiVersion,token:config.token,useCdn:false,perspective:'raw'}); }
  async query({query,params={},perspective='raw'}){ return this.client.fetch(query,params,{perspective}); }
  async getDocument({documentId}){ return this.client.getDocument(documentId); }
}
