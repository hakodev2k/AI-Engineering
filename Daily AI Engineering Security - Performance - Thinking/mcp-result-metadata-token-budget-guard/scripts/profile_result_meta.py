#!/usr/bin/env python3
import json,sys
KEY='io.modelcontextprotocol/serverInfo'
def compact_bytes(x): return len(json.dumps(x,separators=(',',':'),ensure_ascii=False).encode())
def analyze(rows):
 total=meta=server=0; calls=0; fingerprints={}
 for row in rows:
  calls+=1; total+=compact_bytes(row)
  result=row.get('result',row) if isinstance(row,dict) else {}
  m=result.get('_meta',{}) if isinstance(result,dict) else {}
  meta+=compact_bytes(m) if m else 0
  s=m.get(KEY) if isinstance(m,dict) else None
  if s is not None:
   b=compact_bytes(s);server+=b
   fp=json.dumps(s,separators=(',',':'),sort_keys=True,ensure_ascii=False)
   fingerprints[fp]=fingerprints.get(fp,0)+1
 repeated=sum(compact_bytes(json.loads(k))*(n-1) for k,n in fingerprints.items() if n>1)
 est=lambda b: round(b/4,1)
 return {'calls':calls,'total_bytes':total,'meta_bytes':meta,'server_info_bytes':server,'repeated_server_info_bytes':repeated,'estimated_meta_tokens':est(meta),'estimated_repeated_server_info_tokens':est(repeated),'meta_ratio':round(meta/total,4) if total else 0}
def main():
 if len(sys.argv)!=2: print('usage: profile_result_meta.py results.jsonl',file=sys.stderr);return 2
 rows=[]
 try:
  with open(sys.argv[1],encoding='utf-8') as f:
   for i,line in enumerate(f,1):
    if line.strip(): rows.append(json.loads(line))
 except (OSError,json.JSONDecodeError) as e: print(f'error: {e}',file=sys.stderr);return 2
 print(json.dumps(analyze(rows),indent=2,sort_keys=True));return 0
if __name__=='__main__': raise SystemExit(main())