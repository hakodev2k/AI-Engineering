#!/usr/bin/env python3
import argparse,json,pathlib,sys
p=argparse.ArgumentParser(); p.add_argument('manifest'); p.add_argument('--policy',required=True); a=p.parse_args()
m=json.load(open(a.manifest,encoding='utf-8')); policy=json.load(open(a.policy,encoding='utf-8')); errors=[]
for k in ['task_id','status','budget','items']:
 if k not in m: errors.append('missing '+k)
b=m.get('budget',{}); estimated=b.get('estimated_tokens',0); limit=b.get('max_input_tokens',0)-b.get('reserve_output_tokens',0)
if estimated>limit: errors.append('estimated tokens exceed usable budget')
for item in m.get('items',[]):
 if item.get('decision') not in ['include','summarize','exclude']: errors.append('invalid decision for '+str(item.get('path')))
 if item.get('estimated_tokens',0)>policy['max_single_artifact_tokens'] and item.get('decision')=='include': errors.append('oversized artifact included: '+item.get('path',''))
if m.get('status')=='blocked': errors.append('manifest status is blocked')
if errors:
 print('\n'.join(errors),file=sys.stderr); sys.exit(1)
print('context manifest verified'); sys.exit(0)
