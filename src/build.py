import base64,json,re
s=open('src.html').read()
b64=lambda p:'data:image/webp;base64,'+base64.b64encode(open(p,'rb').read()).decode()
N=['pug','bulldog','pig','capybara','sloth','puffer','frog','penguin','mole','dog']
sp={n:b64(f'../sp/{n}.webp') for n in N}; po={n:b64(f'../poses/{n}.webp') for n in N}; po['frog_act']=b64('../poses/frog_act.webp')
import json as J; ac={k:b64(f'../poses/{k}.webp') for k in J.load(open('actmeta.json'))}
fa={f'{n}_{e}':b64(f'../faces/{n}_{e}.webp') for n in N for e in ['smile','angry','cry','surprise']}
out=s.replace('__SPRITES__',json.dumps(sp)).replace('__FACES__',json.dumps(fa)).replace('__POSES__',json.dumps(po)).replace('__ACTS__',json.dumps(ac)).replace('/*__CUE__*/',open('cue.js').read())
open('index.html','w').write(out)
open('/tmp/t.js','w').write(re.search(r'<script>(.*)</script>',out,re.S).group(1))
