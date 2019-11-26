# Obfuscates id and class in output js and
# css to save a few extra bytes

from re import findall

js=open('./dist/unlock.js').read()
css=open('./dist/unlock.css').read()

re='ul-[a-z\-]+'
letters='abcdefghijklmnopqrstuvwxyz'
names=['ul-'+l1+l2 for l1 in letters for l2 in letters]

c1=set(findall(re, js))
c2=set(findall(re, css))
classes=sorted(list(c1.union(c2)), key=len)[::-1]

for i, c in enumerate(classes):
    name=names[i]
    js=js.replace(c, name)
    css=css.replace(c, name)

open('./dist/unlock.js', 'w').write(js)
open('./dist/unlock.css', 'w').write(css)
