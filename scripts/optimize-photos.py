#!/usr/bin/env python3
"""Gera as versoes WebP da galeria a partir dos originais.

Uso:
    python3 scripts/optimize-photos.py

Le os arquivos listados em PHOTOS (relativos a SOURCE_DIR) e grava em OUTPUT_DIR
duas versoes de cada um: `<slug>-sm.webp` para o mural e `<slug>.webp` para o
lightbox. Imprime no final o trecho de codigo com as proporcoes reais, que deve
ser colado em frontend/src/lib/gallery-photos.ts.
"""

from pathlib import Path

from PIL import Image, ImageOps

# Os originais ficam fora de public/ para nao serem publicados junto com o site.
ROOT = Path(__file__).resolve().parent.parent
SOURCE_DIR = ROOT / "assets" / "photos-originais"
OUTPUT_DIR = ROOT / "frontend" / "public" / "photos" / "historia"

THUMB_WIDTH = 700
FULL_WIDTH = 1400
THUMB_QUALITY = 74
FULL_QUALITY = 82

# (arquivo de origem, slug de saida, texto alternativo)
PHOTOS = [
    ("WhatsApp Image 2026-07-26 at 12.25.34.jpeg", "historia-01", "Thamires e Wendel na formatura"),
    ("WhatsApp Image 2026-07-26 at 12.25.13.jpeg", "historia-02", "Thamires e Wendel em um jantar, com flores na mesa"),
    ("WhatsApp Image 2026-07-26 at 12.25.12-2.jpeg", "historia-03", "Thamires e Wendel em uma saida a noite"),
    ("WhatsApp Image 2026-07-26 at 12.25.12.jpeg", "historia-04", "Thamires e Wendel em um dia de praia"),
    ("WhatsApp Image 2026-07-26 at 12.26.27.jpeg", "historia-05", "Thamires e Wendel em uma festa de rua"),
    ("WhatsApp Image 2026-07-26 at 12.25.13-2.jpeg", "historia-06", "Thamires e Wendel no Cristo Redentor, no Rio de Janeiro"),
    ("gallery-thamires.png", "historia-07", "Thamires estendendo a mao para Wendel em uma biblioteca antiga"),
    ("gallery-rock.jpg", "historia-08", "Wendel carregando Thamires no colo em frente ao letreiro do Rock in Rio"),
    ("WhatsApp Image 2026-07-26 at 12.26.50.jpeg", "historia-09", "Thamires e Wendel em uma festa, ela de vestido azul"),
    ("WhatsApp Image 2026-07-26 at 12.27.09.jpeg", "historia-10", "Thamires e Wendel em um jardim florido"),
    ("WhatsApp Image 2026-07-26 at 12.26.17.jpeg", "historia-11", "Thamires e Wendel abracados sob um pier, na beira do mar"),
    ("historia-12-selfie-noite.png", "historia-12", "Thamires e Wendel em um momento a dois a noite"),
    ("gabinete-portugues-leitura.png", "historia-13", "Thamires e Wendel no Real Gabinete Portugues de Leitura, no Rio de Janeiro"),
]


def resize(img: Image.Image, target_width: int) -> Image.Image:
    if img.width <= target_width:
        return img.copy()
    height = round(img.height * target_width / img.width)
    return img.resize((target_width, height), Image.LANCZOS)


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    entries = []

    for filename, slug, alt in PHOTOS:
        source = SOURCE_DIR / filename
        if not source.exists():
            raise SystemExit(f"Arquivo de origem nao encontrado: {source}")

        with Image.open(source) as raw:
            img = ImageOps.exif_transpose(raw).convert("RGB")

        thumb = resize(img, THUMB_WIDTH)
        thumb.save(OUTPUT_DIR / f"{slug}-sm.webp", "WEBP", quality=THUMB_QUALITY, method=6)

        full = resize(img, FULL_WIDTH)
        full.save(OUTPUT_DIR / f"{slug}.webp", "WEBP", quality=FULL_QUALITY, method=6)

        entries.append((slug, alt, thumb.width, thumb.height))
        thumb_kb = (OUTPUT_DIR / f"{slug}-sm.webp").stat().st_size // 1024
        full_kb = (OUTPUT_DIR / f"{slug}.webp").stat().st_size // 1024
        print(f"{slug}: mural {thumb_kb}KB, ampliada {full_kb}KB")

    print("\n--- cole em frontend/src/lib/gallery-photos.ts ---\n")
    for slug, alt, width, height in entries:
        print(
            f"  {{ slug: '{slug}', width: {width}, height: {height},\n"
            f"    alt: '{alt}' }},"
        )


if __name__ == "__main__":
    main()
