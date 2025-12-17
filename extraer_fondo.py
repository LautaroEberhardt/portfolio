
import re
import urllib.parse
import os

# Rutas de los archivos
css_path = 'style.css'
svg_path = 'topography.svg'

# 1. Leer el archivo CSS
if not os.path.exists(css_path):
    print(f"Error: No se encuentra {css_path}")
    exit()

with open(css_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 2. Buscar la imagen codificada (Data URI)
# Busca el patrón: url("data:image/svg+xml,CONTENIDO")
match = re.search(r'url\("data:image/svg\+xml,(.*?)"\)', content)

if match:
    encoded_svg = match.group(1)
    
    # 3. Decodificar el contenido (de %3C a <, etc.)
    decoded_svg = urllib.parse.unquote(encoded_svg)
    
    # 4. Guardar en un nuevo archivo .svg
    with open(svg_path, 'w', encoding='utf-8') as f:
        f.write(decoded_svg)
    
    print(f"¡Éxito! La imagen se ha guardado en: {os.path.abspath(svg_path)}")
    print("Ahora puedes actualizar tu style.css")
else:
    print("No se encontró ninguna imagen SVG codificada en style.css")