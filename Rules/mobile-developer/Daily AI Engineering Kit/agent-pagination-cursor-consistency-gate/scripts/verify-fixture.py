#!/usr/bin/env python3
import argparse,json,sys

def paginate(rows,size):
 rows=sorted(rows,key=lambda x:(x['created_at'],x['id']))
 cursor=None;seen=[];guard=0
 while True:
  page=[r for r in rows if cursor is None or (r['created_at'],r['id'])>cursor][:size]
  if not page: break
  seen += [r['id'] for r in page]; nxt=(page[-1]['created_at'],page[-1]['id'])
  if nxt==cursor: raise RuntimeError('cursor made no progress')
  cursor=nxt;guard+=1
  if guard>len(rows)+1: raise RuntimeError('loop bound exceeded')
 return seen

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--fixture',required=True);a=ap.parse_args();data=json.load(open(a.fixture,encoding='utf-8'));rows=data['rows'];seen=paginate(rows,data.get('page_size',3));expected=[r['id'] for r in sorted(rows,key=lambda x:(x['created_at'],x['id']))];ok=seen==expected and len(seen)==len(set(seen));print(json.dumps({'pass':ok,'seen':seen,'expected':expected}));return 0 if ok else 1
if __name__=='__main__':sys.exit(main())
