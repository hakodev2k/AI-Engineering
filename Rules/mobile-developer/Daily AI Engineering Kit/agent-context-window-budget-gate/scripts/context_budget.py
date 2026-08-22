#!/usr/bin/env python3
import argparse, json, math, pathlib, sys

def estimate(text): return max(1, math.ceil(len(text.encode('utf-8'))/4))
def main():
 p=argparse.ArgumentParser(); p.add_argument('--root',default='.'); p.add_argument('--policy',required=True); p.add_argument('--output',required=True); p.add_argument('--task-id',default='context-budget'); p.add_argument('paths',nargs='+'); a=p.parse_args()
 policy=json.load(open(a.policy,encoding='utf-8')); root=pathlib.Path(a.root).resolve(); max_in=policy['max_input_tokens']; usable=max_in-policy['reserve_output_tokens']; items=[]
 for raw in a.paths:
  path=(root/raw).resolve()
  try: path.relative_to(root)
  except ValueError: print('outside root: '+raw,file=sys.stderr); return 2
  if not path.is_file(): print('missing file: '+raw,file=sys.stderr); return 2
  t=estimate(path.read_text(encoding='utf-8',errors='replace')); cat='changed_files' if path.suffix in ['.cs','.ts','.js','.py','.go','.java'] else 'evidence'; pri=policy['priority_order'].index(cat)+1 if cat in policy['priority_order'] else 99
  items.append({'path':raw,'category':cat,'priority':pri,'estimated_tokens':t,'decision':'include','reason':'candidate context','evidence':[]})
 items.sort(key=lambda x:(x['priority'],x['estimated_tokens'])); used=0
 for item in items:
  t=item['estimated_tokens']
  if t>policy['max_single_artifact_tokens']: item['decision']='summarize'; item['reason']='single artifact exceeds cap'; t=min(t,max(1000,policy['max_single_artifact_tokens']//5))
  if used+t>usable: item['decision']='exclude'; item['reason']='would exceed usable context budget'
  else: used+=t
 ratio=used/max_in; status='blocked' if ratio>=policy['block_ratio'] else ('warning' if ratio>=policy['warning_ratio'] else 'ready')
 out={'task_id':a.task_id,'status':status,'budget':{'max_input_tokens':max_in,'estimated_tokens':used,'reserve_output_tokens':policy['reserve_output_tokens']},'items':items}; pathlib.Path(a.output).write_text(json.dumps(out,indent=2),encoding='utf-8'); print(json.dumps({'status':status,'estimated_tokens':used,'usable_tokens':usable})); return 3 if status=='blocked' else 0
if __name__=='__main__': sys.exit(main())
