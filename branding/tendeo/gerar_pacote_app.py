"""Gera o pacote de arquivos da marca Tendeo para o app (Expo iOS/Android) e o painel Chatwoot.

Uso: python3 gerar_pacote_app.py
Requer: Pillow. Ao final imprime a conferência de cada arquivo (dimensão, modo, alfa, enquadramento).
"""
import math
from pathlib import Path

from PIL import Image, ImageCms, ImageDraw

OUT = Path(__file__).parent
SRGB = ImageCms.ImageCmsProfile(ImageCms.createProfile("sRGB")).tobytes()

INDIGO = (0x4A, 0x3A, 0xC7)
INDIGO_LIGHT = (0x9D, 0x94, 0xFA)
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
# Degradê do ícone iOS: alto, meio (cor principal) e base.
IOS_GRADIENT = ((0x7B, 0x6B, 0xF2), INDIGO, (0x2A, 0x1E, 0x88))

# Símbolo no quadro de 1024, centrado em (512, 512): (x, y, largura, altura).
BAR = (215, 266, 594, 154)
STEM = (435, 492, 154, 266)
RADIUS = 77
SYMBOL_W = 594
TILE_RADIUS = 0.225  # fração do lado, usada no ícone com cantos arredondados

# Maior distância do centro a um ponto do símbolo (ponta redonda da barra), em unidades do quadro 1024.
SYMBOL_REACH = math.hypot(512 - (BAR[0] + RADIUS), 512 - (BAR[1] + RADIUS)) + RADIUS

# Zona segura real do ícone adaptativo do Android: círculo de 66 dp num quadro de 108 dp.
ANDROID_SAFE = 66 / 108


def symbol(scale, cx, cy, fill):
    out = []
    for x, y, w, h in (BAR, STEM):
        out.append((cx + (x - 512) * scale, cy + (y - 512) * scale, w * scale, h * scale, RADIUS * scale, fill))
    return out


def by_width(canvas_w, fraction):
    """Escala para o símbolo ocupar `fraction` da largura do quadro."""
    return canvas_w * fraction / SYMBOL_W


def by_circle(canvas_w, diameter_fraction):
    """Escala para o símbolo inteiro caber num círculo central com esse diâmetro (fração do lado)."""
    return canvas_w * diameter_fraction / 2 / SYMBOL_REACH


def render(name, size, shapes, bg=None, alpha=False, edge=WHITE):
    """bg=None + alpha=True => fundo transparente. `edge` é a cor das bordas suavizadas sobre o transparente."""
    w, h = size
    ss = max(4, math.ceil(2048 / max(w, h)))
    if alpha:
        img = Image.new("RGBA", (w * ss, h * ss), (*edge, 0))
    else:
        img = Image.new("RGB", (w * ss, h * ss), bg)
    draw = ImageDraw.Draw(img)
    for x, y, sw, sh, r, fill in shapes:
        colour = (*fill, 255) if alpha else fill
        draw.rounded_rectangle([x * ss, y * ss, (x + sw) * ss - 1, (y + sh) * ss - 1], radius=r * ss, fill=colour)
    img = img.resize((w, h), Image.LANCZOS)
    img.save(OUT / name, optimize=True, icc_profile=SRGB)


def render_gradient(name, size, shapes, stops):
    """Fundo em degradê vertical (alto, meio, base), sem alfa. Usado só no ícone do app iOS."""
    w, h = size
    top, mid, bottom = stops
    column = Image.new("RGB", (1, h))
    for y in range(h):
        t = y / (h - 1)
        a, b, k = (top, mid, t / 0.5) if t < 0.5 else (mid, bottom, (t - 0.5) / 0.5)
        column.putpixel((0, y), tuple(round(a[i] + (b[i] - a[i]) * k) for i in range(3)))
    img = column.resize((w, h), Image.NEAREST)
    ss = max(4, math.ceil(2048 / max(w, h)))
    mask = Image.new("L", (w * ss, h * ss), 0)
    draw = ImageDraw.Draw(mask)
    for x, y, sw, sh, r, _ in shapes:
        draw.rounded_rectangle([x * ss, y * ss, (x + sw) * ss - 1, (y + sh) * ss - 1], radius=r * ss, fill=255)
    img.paste(Image.new("RGB", (w, h), shapes[0][5]), (0, 0), mask.resize((w, h), Image.LANCZOS))
    img.save(OUT / name, optimize=True, icc_profile=SRGB)


def tile(size, symbol_fraction=0.58, radius=None):
    """Ladrilho índigo de cantos arredondados com símbolo branco."""
    r = size * TILE_RADIUS if radius is None else radius
    return [(0, 0, size, size, r, INDIGO)] + symbol(by_width(size, symbol_fraction), size / 2, size / 2, WHITE)


def svg(name, size, shapes):
    body = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" width="{size}" height="{size}" role="img" aria-label="Tendeo">']
    body.append("  <title>Tendeo</title>")
    for x, y, w, h, r, fill in shapes:
        hexa = "#%02X%02X%02X" % fill
        body.append(f'  <rect x="{x:.2f}" y="{y:.2f}" width="{w:.2f}" height="{h:.2f}" rx="{r:.2f}" fill="{hexa}"/>')
    body.append("</svg>")
    (OUT / name).write_text("\n".join(body) + "\n", encoding="utf-8")


def main():
    c = 512
    icon = symbol(by_width(1024, 0.58), c, c, WHITE)

    # 1. iOS
    # Único arquivo com degradê (decisão de 2026-09-29); todo o resto da marca é chapado.
    render_gradient("ios-icon-1024.png", (1024, 1024), icon, IOS_GRADIENT)
    render("ios-icon-dark-1024.png", (1024, 1024), symbol(by_width(1024, 0.58), c, c, INDIGO_LIGHT), alpha=True, edge=INDIGO_LIGHT)
    render("ios-icon-tinted-1024.png", (1024, 1024), icon, bg=BLACK)

    # 2. Android
    safe = by_circle(1024, ANDROID_SAFE) * 0.995  # folga de meio por cento para o suavizado das bordas
    render("android-adaptive-foreground-1024.png", (1024, 1024), symbol(safe, c, c, WHITE), alpha=True, edge=WHITE)
    render("android-adaptive-monochrome-1024.png", (1024, 1024), symbol(safe, c, c, BLACK), alpha=True, edge=BLACK)
    render("android-notification-96.png", (96, 96), symbol(by_width(96, 0.83), 48, 48, WHITE), alpha=True, edge=WHITE)

    # 3. Splash e login
    render("splash-1284x2778.png", (1284, 2778), symbol(300 / SYMBOL_W, 642, 1389, WHITE), bg=INDIGO)
    render("splash-symbol-512.png", (512, 512), symbol(by_circle(512, ANDROID_SAFE) * 0.995, 256, 256, WHITE), alpha=True, edge=WHITE)
    for n, side in (("login-logo-144.png", 144), ("login-logo-288.png", 288), ("login-logo-432.png", 432)):
        render(n, (side, side), tile(side, radius=32 * side / 144), alpha=True, edge=INDIGO)

    # 4. Painel Chatwoot e widget
    svg("tendeo-simbolo.svg", 1024, tile(1024))
    svg("tendeo-simbolo-indigo.svg", 1024, symbol(by_width(1024, 0.58), c, c, INDIGO))
    svg("tendeo-simbolo-branco.svg", 1024, icon)
    render("favicon-32.png", (32, 32), tile(32, symbol_fraction=0.62), alpha=True, edge=INDIGO)
    render("favicon-16.png", (16, 16), tile(16, symbol_fraction=0.66), alpha=True, edge=INDIGO)
    render("apple-touch-icon-180.png", (180, 180), symbol(by_width(180, 0.58), 90, 90, WHITE), bg=INDIGO)

    report()


def report():
    print(f"{'arquivo':40} {'dimensão':>11} {'modo':>5} {'alfa':>5} {'sRGB':>5}  enquadramento")
    for path in sorted(OUT.glob("*.png")):
        im = Image.open(path)
        has_alpha = im.mode in ("RGBA", "LA") or "transparency" in im.info
        note = ""
        if has_alpha:
            a = im.getchannel("A")
            box = a.getbbox()
            cx, cy = im.size[0] / 2, im.size[1] / 2
            px = a.load()
            reach = 0.0
            for y in range(box[1], box[3]):
                for x in range(box[0], box[2]):
                    if px[x, y] > 8:
                        reach = max(reach, math.hypot(x + 0.5 - cx, y + 0.5 - cy))
            note = (
                f"largura {(box[2] - box[0]) / im.size[0]:.1%}, cabe em círculo de {2 * reach / im.size[0]:.1%} "
                f"({2 * reach:.0f} px), canto alfa={px[0, 0]}"
            )
        else:
            note = f"canto={im.getpixel((0, 0))}"
        bits = 8 if im.mode in ("RGB", "RGBA") else "?"
        print(f"{path.name:40} {im.size[0]:>5}×{im.size[1]:<5} {im.mode:>5} {'sim' if has_alpha else 'não':>5} {'sim' if im.info.get('icc_profile') else 'não':>5}  {bits} bits; {note}")


if __name__ == "__main__":
    main()
