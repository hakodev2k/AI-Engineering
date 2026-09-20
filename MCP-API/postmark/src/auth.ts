export class PostmarkAuth {
  constructor(private readonly env=process.env){}
  token(){const v=this.env.POSTMARK_SERVER_TOKEN?.trim();if(!v)throw new Error("POSTMARK_AUTH_MISSING");return v;}
  headers(){return {"X-Postmark-Server-Token":this.token(),"Accept":"application/json"};}
}
