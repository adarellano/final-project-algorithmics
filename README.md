# 🍕 Ruggeri Pizzería - Proyecto Final de Front-End

¡Bienvenidos al repositorio oficial del proyecto final para la pizzería **Ruggeri**! Este es un sitio web interactivo, responsivo y dinámico que permite a los usuarios explorar el menú, armar su propia pizza personalizada, gestionar un carrito de compras con persistencia de datos y subir comprobantes de pago.

🚀 Demo en Vivo

Puedes ver el proyecto desplegado y funcionando en el siguiente enlace:
👉 **[Ver Proyecto en Vercel](https://ruggeri-pizzeria.vercel.app/#premium)** 

---

🛠️ Tecnologías Utilizadas

Este proyecto fue construido utilizando tecnologías web estándar, sin frameworks externos, demostrando un dominio sólido de los fundamentos del desarrollo Front-End:

*   **HTML:** Estructura semántica del sitio (`<header>`, `<main>`, `<section>`, `<footer>`, `<article>`).
*   **CSS:** 
    *   Uso de **Variables CSS** (`:root`) para una paleta de colores coherente.
    *   **Flexbox** y **CSS Grid** para maquetación avanzada y responsiva.
    *   **Media Queries** para adaptabilidad a dispositivos móviles y tablets.
    *   **Animaciones y transiciones** suaves (hover effects, scroll-behavior).
*   **JavaScript:**
    *   **Programación Orientada a Objetos (POO):** Uso de clases (`Producto`, `Pizza`, `Pedido`) para modelar la lógica del negocio.
    *   **Manipulación del DOM:** Interactividad completa (filtros, selección de ingredientes, actualización de precios en tiempo real).
    *   **LocalStorage:** Persistencia del carrito de compras para que no se pierda al recargar la página.
    *   **Canvas API:** Generación dinámica de imágenes (descarga de la tarjeta de fidelidad del "Club Ruggeri").
*   **Herramientas:** Git, GitHub, GitHub Desktop y Vercel (Despliegue).

---

✨ Componentes e Integraciones Principales

El proyecto está dividido en varias secciones interactivas:

1.  **Menú Interactivo (`#menu`):**
    *   Catálogo de pizzas, bebidas y postres.
    *   Filtros de categorías con estado activo.
    *   Tarjetas de productos con precios por tamaño (Mediana, Pequeña, Grande).
2.  **Arma tu Pizza (`#builder`):**
    *   Formulario paso a paso (Tamaño, Masa, Salsa, Queso, Ingredientes).
    *   **Actualización de precio en tiempo real:** El resumen de la factura (ticket) se actualiza automáticamente cada vez que el usuario selecciona una opción.
3.  **Carrito y Factura:**
    *   Lógica de descuentos automáticos según el día de la semana (Lunes/Miércoles 50%, Martes 2x1).
    *   Cálculo de subtotal, costo de envío y total a pagar.
    *   Opción para eliminar productos individualmente.
4.  **Pago (`#payment`):**
    *   Sección para que el usuario suba su comprobante de pago (soporta imágenes y PDF).
    *   Validación de campos antes de confirmar el pedido.
5.  **Promociones (`#promociones`):**
    *   Tarjetas informativas de las promociones vigentes.
    *   Generación y descarga de una tarjeta de fidelidad en formato PNG usando JavaScript puro.

---

📁 Estructura del Proyecto

El código está organizado de la siguiente manera para mantener un código limpio y escalable:

```text
📦 ruggeri-pizzeria
 ┣ 📂 images/               # Carpeta para imágenes locales (ej. logo.png)
 ┣ 📜 index.html            # Estructura principal del sitio
 ┣ 📜 styles.css            # Hoja de estilos (Variables, Grid, Flexbox, Responsive)
 ┣ 📜 script.js             # Lógica de negocio, POO, DOM y LocalStorage
 ┗ 📜 README.md             # Documentación del proyecto
