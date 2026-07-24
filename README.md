# Mobile Tech — Sitio web

Landing one-page para **Mobile Tech**, servicio técnico especializado 100% en Apple (Montevideo, Uruguay).

Sitio estático (HTML/CSS/JS, sin dependencias ni build). Estética estilo Apple en modo oscuro con efectos *liquid glass* y CTAs a WhatsApp.

## Estructura
- `index.html` — marcado de todas las secciones (hero, servicios, cotizador, testimonios, contacto, FAQ…).
- `styles.css` — sistema de diseño, liquid glass, responsive.
- `script.js` — scroll suave, contadores, formulario → WhatsApp, reveals.
- `assets/` — logo, favicon e imágenes optimizadas.

## Desarrollo local
Al ser estático, alcanza con abrir `index.html` o servirlo:

```bash
python -m http.server 8000
# luego abrir http://localhost:8000
```

## Publicación
Desplegado con **GitHub Pages** (rama `main`, raíz del repositorio).
