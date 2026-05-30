
import json
def check_dupes(pairs):
    d = {}
    for k, v in pairs:
        if k in d:
            raise Exception('Duplicate ' + str(k))
        d[k] = v
    return d

schema = []
in_schema = False
for line in open('sections/woc-header.liquid', encoding='utf-8'):
    if '{% schema %}' in line:
        in_schema = True; continue
    if '{% endschema %}' in line:
        in_schema = False; continue
    if in_schema:
        schema.append(line)

try:
    json.loads(''.join(schema), object_pairs_hook=check_dupes)
    print('OK')
except Exception as e:
    print('ERROR:', e)

