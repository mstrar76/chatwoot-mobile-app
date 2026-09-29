"""Render the Tendeo app assets from the brand geometry (see branding/tendeo/README.md).

The symbol is two white pills on indigo #4A3AC7, taken from tendeo-icone.svg (1024 grid):
bar x215 y266 594x154 r77, stem x435 y492 154x266 r77.
"""
from pathlib import Path
from PIL import Image, ImageDraw

INDIGO = (0x4A, 0x3A, 0xC7, 255)
WHITE = (255, 255, 255, 255)
ROOT = Path(__file__).resolve().parents[2]
SS = 4  # supersampling for smooth edges

# Symbol pills on the 1024 grid, and its bounding box (215..809 x 266..758).
PILLS = [(215, 266, 594, 154), (435, 492, 154, 266)]
BOX = (215, 266, 809, 758)


def draw_symbol(size, canvas_w, canvas_h, symbol_width, color, bg):
    """Draw the symbol centred, `symbol_width` px wide, on a canvas."""
    w, h = canvas_w * SS, canvas_h * SS
    img = Image.new('RGBA', (w, h), bg)
    d = ImageDraw.Draw(img)
    scale = symbol_width * SS / (BOX[2] - BOX[0])
    box_w = (BOX[2] - BOX[0]) * scale
    box_h = (BOX[3] - BOX[1]) * scale
    ox = (w - box_w) / 2 - BOX[0] * scale
    oy = (h - box_h) / 2 - BOX[1] * scale
    for x, y, pw, ph in PILLS:
        r = min(pw, ph) / 2 * scale
        d.rounded_rectangle(
            [ox + x * scale, oy + y * scale, ox + (x + pw) * scale, oy + (y + ph) * scale],
            radius=r, fill=color)
    return img.resize((canvas_w, canvas_h), Image.LANCZOS)


def main():
    # iOS icon: full-bleed indigo, no transparency, symbol at 58% (as the SVG).
    draw_symbol(0, 1024, 1024, 594, WHITE, INDIGO).convert('RGB').save(ROOT / 'assets/icon.png')
    # Android adaptive foreground: transparent; kept inside the 66% safe zone.
    draw_symbol(0, 1024, 1024, 450, WHITE, (0, 0, 0, 0)).save(ROOT / 'assets/adaptive-icon.png')
    # Splash 1284x2778, indigo, bar 300 px wide.
    draw_symbol(0, 1284, 2778, 300, WHITE, INDIGO).convert('RGB').save(ROOT / 'assets/splash.png')
    # Login screen logo (144 px, shown at 40 pt): rounded indigo tile.
    tile = draw_symbol(0, 144, 144, 84, WHITE, INDIGO)
    mask = Image.new('L', (144 * SS, 144 * SS), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, 144 * SS, 144 * SS], radius=32 * SS, fill=255)
    tile.putalpha(mask.resize((144, 144), Image.LANCZOS))
    tile.save(ROOT / 'src/assets/images/logo.png')


if __name__ == '__main__':
    main()
