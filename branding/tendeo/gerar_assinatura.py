"""Gera a assinatura horizontal da Tendeo (símbolo + nome) em SVG, com o texto convertido em curvas.

Uso: python3 gerar_assinatura.py
Requer: fonttools. Fonte: fonte/Manrope[wght].ttf (SIL Open Font License).
"""
from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

OUT = Path(__file__).parent
FONT = OUT / "fonte" / "Manrope[wght].ttf"

TEXT = "Tendeo"
WEIGHT = 800
ICON = 256.0  # lado do ícone; o nome usa corpo igual ao lado do ícone (1em)
GAP = 0.32 * ICON
TRACKING = -0.04  # em
PAD = 0.0  # a área de respiro é aplicada por quem usa o arquivo

INDIGO = "#4A3AC7"
INK = "#1A1830"
WHITE = "#FFFFFF"
BLACK = "#000000"

# Símbolo no quadro de 1024 (mesmas medidas de gerar_arquivos.py).
BAR = (215, 266, 594, 154)
STEM = (435, 492, 154, 266)
RADIUS = 77
FRAME_RADIUS = 0.225 * 1024


def pair_kerning(font, left, right):
    """Soma o ajuste horizontal (XAdvance do primeiro glifo) do recurso 'kern' para um par."""
    if "GPOS" not in font:
        return 0
    gpos = font["GPOS"].table
    lookups = set()
    for rec in gpos.FeatureList.FeatureRecord:
        if rec.FeatureTag == "kern":
            lookups.update(rec.Feature.LookupListIndex)
    total = 0
    for idx in sorted(lookups):
        lookup = gpos.LookupList.Lookup[idx]
        for sub in lookup.SubTable:
            if sub.LookupType == 9:  # extensão
                sub = sub.ExtSubTable
            if sub.LookupType != 2:
                continue
            cov = sub.Coverage.glyphs
            if left not in cov:
                continue
            value = None
            if sub.Format == 1:
                for rec in sub.PairSet[cov.index(left)].PairValueRecord:
                    if rec.SecondGlyph == right:
                        value = rec.Value1
                        break
            else:
                c1 = sub.ClassDef1.classDefs.get(left, 0)
                c2 = sub.ClassDef2.classDefs.get(right, 0)
                value = sub.Class1Record[c1].Class2Record[c2].Value1
            if value is not None:
                total += getattr(value, "XAdvance", 0) or 0
                break  # o primeiro subtable que cobre o par vence
    return total


def rounded_rect(x, y, w, h, r):
    return (
        f"M{x + r:.2f} {y:.2f}H{x + w - r:.2f}A{r:.2f} {r:.2f} 0 0 1 {x + w:.2f} {y + r:.2f}"
        f"V{y + h - r:.2f}A{r:.2f} {r:.2f} 0 0 1 {x + w - r:.2f} {y + h:.2f}"
        f"H{x + r:.2f}A{r:.2f} {r:.2f} 0 0 1 {x:.2f} {y + h - r:.2f}"
        f"V{y + r:.2f}A{r:.2f} {r:.2f} 0 0 1 {x + r:.2f} {y:.2f}Z"
    )


def icon_paths():
    k = ICON / 1024
    frame = rounded_rect(0, 0, ICON, ICON, FRAME_RADIUS * k)
    symbol = "".join(rounded_rect(x * k, y * k, w * k, h * k, RADIUS * k) for x, y, w, h in (BAR, STEM))
    return frame, symbol


def wordmark(font):
    glyphs = font.getGlyphSet()
    cmap = font.getBestCmap()
    upm = font["head"].unitsPerEm
    scale = ICON / upm
    names = [cmap[ord(c)] for c in TEXT]

    cap = getattr(font["OS/2"], "sCapHeight", 0) or 0
    if not cap:
        bp = BoundsPen(glyphs)
        glyphs[cmap[ord("T")]].draw(bp)
        cap = bp.bounds[3]
    baseline = ICON / 2 + cap * scale / 2  # altura das maiúsculas centrada no ícone

    x = ICON + GAP
    # Encosta a primeira letra exatamente no fim do respiro.
    bp = BoundsPen(glyphs)
    glyphs[names[0]].draw(bp)
    x -= bp.bounds[0] * scale

    parts, kerns = [], []
    right_edge = x
    for i, name in enumerate(names):
        pen = SVGPathPen(glyphs, ntos=lambda v: f"{v:.2f}")
        glyphs[name].draw(TransformPen(pen, (scale, 0, 0, -scale, x, baseline)))
        parts.append(pen.getCommands())
        bp = BoundsPen(glyphs)
        glyphs[name].draw(bp)
        right_edge = x + bp.bounds[2] * scale
        adv = glyphs[name].width
        if i + 1 < len(names):
            kern = pair_kerning(font, name, names[i + 1])
            kerns.append((name, names[i + 1], kern))
            adv += kern + TRACKING * upm
        x += adv * scale
    return "".join(parts), right_edge, kerns


def write(name, width, body):
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width:.2f} {ICON:.0f}" '
        f'width="{width:.2f}" height="{ICON:.0f}" role="img" aria-label="Tendeo">\n'
        f"  <title>Tendeo</title>\n{body}</svg>\n"
    )
    (OUT / name).write_text(svg, encoding="utf-8")


def main():
    font = instantiateVariableFont(TTFont(FONT), {"wght": WEIGHT})
    frame, symbol = icon_paths()
    text, right_edge, kerns = wordmark(font)
    width = right_edge + PAD

    def colour(frame_fill, symbol_fill, text_fill):
        return (
            f'  <path d="{frame}" fill="{frame_fill}"/>\n'
            f'  <path d="{symbol}" fill="{symbol_fill}"/>\n'
            f'  <path d="{text}" fill="{text_fill}"/>\n'
        )

    def mono(fill):
        # Uma cor só: o símbolo é vazado no quadro.
        return (
            f'  <path d="{frame}{symbol}" fill="{fill}" fill-rule="evenodd"/>\n'
            f'  <path d="{text}" fill="{fill}"/>\n'
        )

    write("tendeo-assinatura.svg", width, colour(INDIGO, WHITE, INK))
    write("tendeo-assinatura-negativa.svg", width, colour(INDIGO, WHITE, WHITE))
    write("tendeo-assinatura-mono-preta.svg", width, mono(BLACK))
    write("tendeo-assinatura-mono-branca.svg", width, mono(WHITE))

    print(f"largura={width:.2f} altura={ICON:.0f} proporcao={width / ICON:.3f}")
    for a, b, k in kerns:
        print(f"kern {a}-{b}: {k}")


if __name__ == "__main__":
    main()
