import { Pinecone } from '@pinecone-database/pinecone';
import type { Config } from './config.js';

export class PineconeClient {
  readonly pc: Pinecone;
  constructor(private readonly config: Config) {
    this.pc = new Pinecone({ apiKey: config.apiKey });
  }
  index(name: string) { return this.pc.index(name) as any; }
  async withTimeout<T>(work: Promise<T>): Promise<T> {
    let timer: NodeJS.Timeout | undefined;
    try {
      return await Promise.race([
        work,
        new Promise<T>((_, reject) => { timer = setTimeout(() => reject(new Error(`Pinecone operation timed out after ${this.config.timeoutMs}ms`)), this.config.timeoutMs); })
      ]);
    } finally { if (timer) clearTimeout(timer); }
  }
}
