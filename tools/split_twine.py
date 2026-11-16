#!/usr/bin/env python3
"""
split_twine.py - turn a Twine "Publish to File" export into a clean repo layout.

What it does
  1. Moves every base64-embedded JPEG out of the HTML into assets/images/
     and rewrites the references to relative paths.
  2. Extracts the story's stylesheet, JavaScript and passages into src/
     (Tweego-compatible layout: story.twee + style.css + script.js).

Usage
  python tools/split_twine.py exported_story.html [output_dir]
"""
import base64, html, json, os, re, sys

IMG_RE = re.compile(r'data:image/jpeg;base64,([A-Za-z0-9+/=]+)')


def pick_name(text, pos, used):
    """Choose a readable filename for the image that starts at `pos`."""
    before = text[max(0, pos - 260):pos]
    m = re.findall(r'file:"([^"]+\.jpg)"', before)
    if m and m[-1] not in used:                      # gallery photo
        return m[-1]
    if 'url(' in before[-12:]:                       # CSS background
        return 'space-bg.jpg'
    m = re.findall(r'name:"([^"]+)"', before)        # character avatar
    if m:
        slug = re.sub(r'[^a-z0-9]+', '-', m[-1].lower()).strip('-')
        return f'avatar-{slug}.jpg'
    return f'img-{len(used) + 1:03d}.jpg'


def externalize(text, img_dir):
    os.makedirs(img_dir, exist_ok=True)
    used, out, last = {}, [], 0
    for m in IMG_RE.finditer(text):
        name = pick_name(text, m.start(), used)
        data = base64.b64decode(m.group(1))
        assert data[:2] == b'\xff\xd8', f'{name} is not a valid JPEG'
        used[name] = len(data)
        with open(os.path.join(img_dir, name), 'wb') as f:
            f.write(data)
        out.append(text[last:m.start()])
        out.append(f'assets/images/{name}')
        last = m.end()
    out.append(text[last:])
    return ''.join(out), used


def extract_sources(text, src_dir):
    os.makedirs(src_dir, exist_ok=True)
    sd = re.search(r'<tw-storydata\b([^>]*)>', text)
    attrs = dict(re.findall(r'([\w-]+)="([^"]*)"', sd.group(1)))
    css = re.search(r'<style role="stylesheet" id="twine-user-stylesheet"[^>]*>(.*?)</style>', text, re.S)
    js = re.search(r'<script role="script" id="twine-user-script"[^>]*>(.*?)</script>', text, re.S)
    open(os.path.join(src_dir, 'style.css'), 'w', encoding='utf-8').write(css.group(1).strip() + '\n')
    open(os.path.join(src_dir, 'script.js'), 'w', encoding='utf-8').write(js.group(1).strip() + '\n')

    passages = re.findall(r'<tw-passagedata\b([^>]*)>(.*?)</tw-passagedata>', text, re.S)
    by_pid = {}
    for a, body in passages:
        p = dict(re.findall(r'([\w-]+)="([^"]*)"', a))
        p['text'] = html.unescape(body)
        by_pid[p['pid']] = p
    start = by_pid[attrs['startnode']]['name']

    lines = [':: StoryTitle', html.unescape(attrs['name']), '',
             ':: StoryData',
             json.dumps({'ifid': attrs['ifid'], 'format': attrs['format'],
                         'format-version': attrs['format-version'],
                         'start': start, 'zoom': float(attrs.get('zoom', 1))}, indent=2), '']
    for p in by_pid.values():
        assert not re.search(r'^::', p['text'], re.M), f"passage {p['name']} needs escaping"
        head = f":: {html.unescape(p['name'])}"
        if p.get('tags'):
            head += f" [{p['tags']}]"
        head += ' ' + json.dumps({'position': p['position'], 'size': p['size']}, separators=(',', ':'))
        lines += [head, p['text'].strip('\n'), '']
    open(os.path.join(src_dir, 'story.twee'), 'w', encoding='utf-8').write('\n'.join(lines))
    return len(by_pid)


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    src_html = sys.argv[1]
    out = sys.argv[2] if len(sys.argv) > 2 else '.'
    text = open(src_html, encoding='utf-8').read()
    new_text, imgs = externalize(text, os.path.join(out, 'assets', 'images'))
    open(os.path.join(out, 'index.html'), 'w', encoding='utf-8').write(new_text)
    n_pass = extract_sources(new_text, os.path.join(out, 'src'))
    print(f'{n_pass} passages, {len(imgs)} images, '
          f'{os.path.getsize(src_html) // 1024} KB -> {os.path.getsize(os.path.join(out, "index.html")) // 1024} KB')


if __name__ == '__main__':
    main()
