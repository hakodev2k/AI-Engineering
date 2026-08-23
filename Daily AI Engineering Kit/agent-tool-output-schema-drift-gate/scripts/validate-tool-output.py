#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

def load(path):
    try:
        return json.loads(Path(path).read_text(encoding='utf-8'))
    except Exception as exc:
        print(f'ERROR: cannot read JSON {path}: {exc}', file=sys.stderr); sys.exit(2)

def validate(value, schema, path='$'):
    errors=[]
    t=schema.get('type')
    if t=='object':
        if not isinstance(value,dict): return [f'{path}: expected object']
        for k in schema.get('required',[]):
            if k not in value: errors.append(f'{path}.{k}: required field missing')
        props=schema.get('properties',{})
        if schema.get('additionalProperties') is False:
            for k in value:
                if k not in props: errors.append(f'{path}.{k}: unexpected field')
        for k,s in props.items():
            if k in value: errors += validate(value[k],s,f'{path}.{k}')
    elif t=='array':
        if not isinstance(value,list): return [f'{path}: expected array']
        for i,item in enumerate(value): errors += validate(item,schema.get('items',{}),f'{path}[{i}]')
    elif t=='string' and not isinstance(value,str): errors.append(f'{path}: expected string')
    elif t=='integer' and (not isinstance(value,int) or isinstance(value,bool)): errors.append(f'{path}: expected integer')
    elif t=='number' and (not isinstance(value,(int,float)) or isinstance(value,bool)): errors.append(f'{path}: expected number')
    elif t=='boolean' and not isinstance(value,bool): errors.append(f'{path}: expected boolean')
    elif t=='null' and value is not None: errors.append(f'{path}: expected null')
    if 'enum' in schema and value not in schema['enum']: errors.append(f'{path}: value not in enum {schema["enum"]}')
    return errors

def main():
    p=argparse.ArgumentParser(); p.add_argument('--input',required=True); p.add_argument('--schema',required=True); a=p.parse_args()
    errors=validate(load(a.input),load(a.schema))
    if errors:
        print('\n'.join(errors),file=sys.stderr); return 1
    print(f'VALID: {a.input}'); return 0
if __name__=='__main__': sys.exit(main())
