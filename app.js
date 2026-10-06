/* ==========================================================================
   1. CLASES
   ========================================================================== */

// Cualquier cosa del menú: una bebida, un postre...
class Producto {
    constructor(nombre, precio) {
        this.nombre = nombre;
        this.precio = precio;
        this.cantidad = 1;
        this.detalle = '';
    }

    calcular_importe() {
        return this.precio * this.cantidad;
    }
}

// Una pizza es un producto que además tiene tamaño e ingredientes
class Pizza extends Producto {
    constructor(nombre, tamano, precio) {
        super(nombre + ' (' + tamano + ')', precio);
        this.tamano = tamano;
        this.ingredientes = [];
    }

    agregar_ingrediente(nombre, precio) {
        this.ingredientes.push(nombre);
        this.precio = this.precio + precio;
    }
}

// El pedido guarda todos los productos y hace las cuentas
class Pedido {
    constructor() {
        this.productos = [];
        this.costo_envio = 1.50;
        this.dia = new Date().getDay(); // 0 domingo, 1 lunes, 2 martes, 3 miércoles...
    }

    agregar_producto(producto) {
        // Si ya está en el pedido, solo sumamos uno a la cantidad
        for (const guardado of this.productos) {
            if (guardado.nombre === producto.nombre && guardado.detalle === producto.detalle) {
                guardado.cantidad = guardado.cantidad + 1;
                return;
            }
        }
        this.productos.push(producto);
    }

    quitar_producto(producto) {
        const posicion = this.productos.indexOf(producto);
        if (posicion !== -1) {
            this.productos.splice(posicion, 1);
        }
    }

    // Quita una sola unidad; si era la última, se va el producto entero
    quitar_uno(producto) {
        if (producto.cantidad > 1) {
            producto.cantidad = producto.cantidad - 1;
        } else {
            this.quitar_producto(producto);
        }
    }

    vaciar() {
        this.productos = [];
    }

    contar_productos() {
        let cantidad = 0;
        for (const producto of this.productos) {
            cantidad = cantidad + producto.cantidad;
        }
        return cantidad;
    }

    calcular_subtotal() {
        let subtotal = 0;
        for (const producto of this.productos) {
            subtotal = subtotal + producto.calcular_importe();
        }
        return subtotal;
    }

    calcular_envio() {
        if (this.productos.length === 0) {
            return 0;
        }
        return this.costo_envio;
    }

    // La promoción depende del día de la semana
    nombre_promocion() {
        if (this.dia === 1 || this.dia === 3) {
            return 'Pizzas al 50%';
        }
        if (this.dia === 2) {
            return 'Martes 2x1';
        }
        return '';
    }

    calcular_descuento() {
        let descuento = 0;

        // Lunes y miércoles: todas las pizzas a mitad de precio
        if (this.dia === 1 || this.dia === 3) {
            for (const producto of this.productos) {
                if (producto instanceof Pizza) {
                    descuento = descuento + producto.calcular_importe() / 2;
                }
            }
        }

        // Martes 2x1: de cada dos pizzas del mismo tamaño, la más barata sale gratis
        if (this.dia === 2) {
            // Juntamos el precio de cada pizza, una por una, según su tamaño
            const precios_por_tamano = {};
            for (const producto of this.productos) {
                if (producto instanceof Pizza) {
                    if (precios_por_tamano[producto.tamano] === undefined) {
                        precios_por_tamano[producto.tamano] = [];
                    }
                    for (let i = 0; i < producto.cantidad; i++) {
                        precios_por_tamano[producto.tamano].push(producto.precio);
                    }
                }
            }
            for (const tamano in precios_por_tamano) {
                const precios = precios_por_tamano[tamano];
                // De mayor a menor: se paga la 1ra, gratis la 2da, se paga la 3ra...
                precios.sort(function (a, b) {
                    return b - a;
                });
                for (let i = 1; i < precios.length; i = i + 2) {
                    descuento = descuento + precios[i];
                }
            }
        }

        return descuento;
    }

    calcular_total() {
        return this.calcular_subtotal() - this.calcular_descuento() + this.calcular_envio();
    }
}

const pedido = new Pedido();

/* ==========================================================================
   2. FUNCIONES DE AYUDA
   ========================================================================== */

// "Mediana $18.50" -> 18.5   |   "Fresca" -> 0
function leer_precio(texto) {
    const partes = texto.split('$');
    if (partes.length < 2) {
        return 0;
    }
    return parseFloat(partes[1]);
}

// 18.5 -> "$18.50"
function escribir_precio(numero) {
    return '$' + numero.toFixed(2);
}

/* ==========================================================================
   3. VISTAS (mostrar solo una section a la vez)
   ========================================================================== */

function mostrar_vista(nombre) {
    const vistas = document.querySelectorAll('main > section');
    for (const vista of vistas) {
        vista.classList.add('oculto');
    }
    document.getElementById(nombre).classList.remove('oculto');

    // Marcar en el nav bar la vista en la que estamos
    const enlaces = document.querySelectorAll('nav a');
    for (const enlace of enlaces) {
        enlace.classList.toggle('activo', enlace.dataset.vista === nombre);
    }

    window.scrollTo(0, 0);
}

// Todo lo que tenga data-vista="..." en el HTML cambia de vista al darle click
const botones_vista = document.querySelectorAll('[data-vista]');
for (const boton of botones_vista) {
    boton.addEventListener('click', function (evento) {
        evento.preventDefault();
        mostrar_vista(boton.dataset.vista);
    });
}

/* ==========================================================================
   BANNER (carrusel de videos)
   ========================================================================== */

const videos_banner = document.querySelectorAll('.hero-video');
let video_actual = 0;

function mostrar_video(numero) {
    // Después del último vuelve al primero, y antes del primero va al último
    if (numero >= videos_banner.length) {
        numero = 0;
    }
    if (numero < 0) {
        numero = videos_banner.length - 1;
    }

    for (const video of videos_banner) {
        video.pause();
        video.classList.add('oculto');
    }

    video_actual = numero;
    videos_banner[video_actual].classList.remove('oculto');
    videos_banner[video_actual].currentTime = 0;
    videos_banner[video_actual].play();
}

// Cuando un video termina, pasa solo al siguiente
for (const video of videos_banner) {
    video.addEventListener('ended', function () {
        mostrar_video(video_actual + 1);
    });
}

document.getElementById('boton_video_anterior').addEventListener('click', function () {
    mostrar_video(video_actual - 1);
});

document.getElementById('boton_video_siguiente').addEventListener('click', function () {
    mostrar_video(video_actual + 1);
});

/* ==========================================================================
   4. MENÚ (agregar pizzas, bebidas y postres al pedido)
   ========================================================================== */

// Crea el producto que corresponde a un botón de precio del menú
function leer_del_menu(boton_precio) {
    const tarjeta = boton_precio.closest('.pizza-card');
    const nombre = tarjeta.querySelector('h3').textContent;
    const precio = leer_precio(boton_precio.textContent);
    const tamano = boton_precio.textContent.split('$')[0].trim();

    // Las pizzas tienen tamaño (Mediana, Grande...), las bebidas y postres no
    if (tamano === '') {
        return new Producto(nombre, precio);
    }
    return new Pizza(nombre, tamano, precio);
}

function agregar_del_menu(boton_precio) {
    const producto = leer_del_menu(boton_precio);
    pedido.agregar_producto(producto);
    mostrar_aviso('✓ Agregado: ' + producto.nombre);
    mostrar_factura();
}

// Deja en verde los precios del menú que ya están en el pedido
function marcar_precios() {
    for (const boton of botones_precio) {
        const nombre = leer_del_menu(boton).nombre;
        let escogido = false;
        for (const producto of pedido.productos) {
            if (producto.nombre === nombre) {
                escogido = true;
            }
        }
        boton.classList.toggle('green', escogido);
    }
}

// El mensajito de abajo: aparece y a los 2 segundos se esconde
let reloj_aviso = null;

function mostrar_aviso(texto) {
    const aviso = document.getElementById('aviso');
    aviso.textContent = texto;
    aviso.classList.remove('oculto');

    clearTimeout(reloj_aviso);
    reloj_aviso = setTimeout(function () {
        aviso.classList.add('oculto');
    }, 2000);
}

// Los botones de Pizzas, Bebidas, Postres: el que se toca queda en verde
const botones_filtro = document.querySelectorAll('.filter-btn');
for (const boton of botones_filtro) {
    boton.addEventListener('click', function () {
        for (const otro of botones_filtro) {
            otro.classList.remove('active');
        }
        boton.classList.add('active');
    });
}

const botones_precio = document.querySelectorAll('.pizza-card .price-tag');
for (const boton of botones_precio) {
    boton.addEventListener('click', function () {
        agregar_del_menu(boton);
    });
}

/* ==========================================================================
   5. ARMA TU PIZZA
   ========================================================================== */

// Devuelve la opción marcada de un grupo: tamano, masa, salsa o queso
// Si todavía no se ha escogido nada en ese grupo devuelve null
function leer_opcion(grupo) {
    const marcada = document.querySelector('input[name="' + grupo + '"]:checked');
    if (marcada === null) {
        return null;
    }
    const tarjeta = marcada.parentElement;
    return {
        nombre: tarjeta.querySelector('.option-card-name').textContent,
        precio: leer_precio(tarjeta.querySelector('.option-card-detail').textContent)
    };
}

function armar_pizza() {
    const tamano = leer_opcion('tamano');
    const masa = leer_opcion('masa');
    const salsa = leer_opcion('salsa');
    const queso = leer_opcion('queso');

    // El precio base lo da el tamaño: sin tamaño todavía no hay pizza
    if (tamano === null) {
        return null;
    }

    const pizza = new Pizza('Pizza armada', tamano.nombre, tamano.precio);

    // Masa, salsa y queso se anotan en el detalle si ya se escogieron
    const elegidos = [];
    if (masa !== null) {
        elegidos.push(masa.nombre);
    }
    if (salsa !== null) {
        elegidos.push(salsa.nombre);
    }
    if (queso !== null) {
        elegidos.push(queso.nombre);
        pizza.precio = pizza.precio + queso.precio;
    }

    const seleccionados = document.querySelectorAll('.pill-ingredient--selected');
    for (const boton of seleccionados) {
        const nombre = boton.childNodes[0].textContent.trim();
        const precio = leer_precio(boton.querySelector('span').textContent);
        pizza.agregar_ingrediente(nombre, precio);
    }

    pizza.detalle = elegidos.concat(pizza.ingredientes).join(', ');
    return pizza;
}

// La pizza que se está armando ahora mismo (null si todavía no hay ninguna)
let pizza_en_factura = null;

// Cada vez que se toca una opción, la pizza de la factura se cambia por la nueva
function actualizar_pizza() {
    if (pizza_en_factura !== null) {
        pedido.quitar_producto(pizza_en_factura);
    }
    pizza_en_factura = armar_pizza();

    const seleccionados = document.querySelectorAll('.option-card--selected, .pill-ingredient--selected');
    let mensaje = '';
    if (pizza_en_factura !== null) {
        pedido.productos.push(pizza_en_factura);
    } else if (seleccionados.length > 0) {
        mensaje = 'Elige el tamaño para que tu pizza aparezca en la factura.';
    }
    document.getElementById('mensaje_pizza').textContent = mensaje;

    const ingredientes = document.querySelectorAll('.pill-ingredient--selected');
    document.getElementById('texto_ingredientes').textContent =
        'Elige todos los que quieras. Tienes ' + ingredientes.length + ' seleccionados.';

    mostrar_factura();
}

// Deja "Arma tu pizza" sin nada escogido
function limpiar_pizza() {
    for (const opcion of opciones) {
        opcion.checked = false;
        opcion.parentElement.classList.remove('option-card--selected');
    }
    for (const boton of botones_ingrediente) {
        boton.classList.remove('pill-ingredient--selected');
    }
    pizza_en_factura = null;
    actualizar_pizza();
}

const opciones = document.querySelectorAll('.option-card input');
for (const opcion of opciones) {
    opcion.addEventListener('change', function () {
        // Quitar el borde verde a las del mismo grupo y ponérselo a la elegida
        const grupo = document.querySelectorAll('input[name="' + opcion.name + '"]');
        for (const otra of grupo) {
            otra.parentElement.classList.remove('option-card--selected');
        }
        opcion.parentElement.classList.add('option-card--selected');
        actualizar_pizza();
    });
}

const botones_ingrediente = document.querySelectorAll('.pill-ingredient');
for (const boton of botones_ingrediente) {
    boton.addEventListener('click', function () {
        boton.classList.toggle('pill-ingredient--selected');
        actualizar_pizza();
    });
}

document.getElementById('boton_agregar_pizza').addEventListener('click', function () {
    // La pizza ya está en la factura: se queda ahí y empezamos otra desde cero
    if (pizza_en_factura === null) {
        document.getElementById('mensaje_pizza').textContent =
            'Elige el tamaño para que tu pizza aparezca en la factura.';
        return;
    }
    limpiar_pizza();
});

document.getElementById('boton_vaciar').addEventListener('click', function () {
    pedido.vaciar();
    limpiar_pizza();
});

// La ✕ pequeña de cada fila de la factura
function quitar_de_factura(posicion) {
    const producto = pedido.productos[posicion];
    pedido.quitar_uno(producto);

    // Si era la pizza que se está armando, también se limpian sus opciones
    if (producto === pizza_en_factura) {
        limpiar_pizza();
    } else {
        mostrar_factura();
    }
}

/* ==========================================================================
   6. FACTURA (se escribe en el carrito y en la vista de pago)
   ========================================================================== */

function mostrar_factura() {
    let filas_carrito = '';
    let filas_factura = '';

    for (let posicion = 0; posicion < pedido.productos.length; posicion++) {
        const producto = pedido.productos[posicion];
        let nombre = producto.nombre;
        if (producto.detalle !== '') {
            nombre = nombre + '<br><small>' + producto.detalle + '</small>';
        }
        const importe = escribir_precio(producto.calcular_importe());
        const quitar = '<button type="button" class="boton_quitar" data-posicion="' + posicion +
            '" aria-label="Quitar" title="Quitar uno">✕</button>';

        filas_carrito = filas_carrito +
            '<tr>' +
                '<td>' + producto.cantidad + 'x</td>' +
                '<td>' + nombre + '</td>' +
                '<td class="align-right">' + importe + quitar + '</td>' +
            '</tr>';

        filas_factura = filas_factura +
            '<div class="receipt-item">' +
                '<span>' + producto.cantidad + 'x ' + nombre + '</span>' +
                '<span>' + importe + quitar + '</span>' +
            '</div>';
    }

    if (pedido.productos.length === 0) {
        filas_carrito = '<tr><td colspan="3">Tu pedido está vacío.</td></tr>';
        filas_factura = '<div class="receipt-item"><span>Tu pedido está vacío.</span></div>';
    }

    const subtotal = escribir_precio(pedido.calcular_subtotal());
    const descuento = '-' + escribir_precio(pedido.calcular_descuento());
    const envio = escribir_precio(pedido.calcular_envio());
    const total = escribir_precio(pedido.calcular_total());

    document.getElementById('lista_carrito').innerHTML = filas_carrito;
    document.getElementById('subtotal_carrito').textContent = subtotal;
    document.getElementById('descuento_carrito').textContent = descuento;
    document.getElementById('envio_carrito').textContent = envio;
    document.getElementById('total_carrito').textContent = total;

    document.getElementById('lista_factura').innerHTML = filas_factura;
    document.getElementById('subtotal_factura').textContent = subtotal;
    document.getElementById('descuento_factura').textContent = descuento;
    document.getElementById('envio_factura').textContent = envio;
    document.getElementById('total_factura').textContent = total;

    // Al lado de "Descuento" va el nombre de la promoción de hoy, si hay
    let texto_descuento = 'Descuento';
    if (pedido.nombre_promocion() !== '') {
        texto_descuento = 'Descuento (' + pedido.nombre_promocion() + ')';
    }
    const lugares = document.querySelectorAll('.texto_descuento');
    for (const lugar of lugares) {
        lugar.textContent = texto_descuento;
    }

    // Las ✕ de cada fila se acaban de escribir: hay que darles su click
    const botones_quitar = document.querySelectorAll('.boton_quitar');
    for (const boton of botones_quitar) {
        boton.addEventListener('click', function () {
            quitar_de_factura(Number(boton.dataset.posicion));
        });
    }

    marcar_precios();
    guardar_pedido();

    document.getElementById('contador_carrito').textContent = pedido.contar_productos();
}

// El pedido se guarda en el navegador para que no se pierda al recargar
function guardar_pedido() {
    localStorage.setItem('pedido_ruggeri', JSON.stringify(pedido.productos));
}

function cargar_pedido() {
    const guardado = localStorage.getItem('pedido_ruggeri');
    if (guardado === null) {
        return;
    }
    const datos = JSON.parse(guardado);
    for (const dato of datos) {
        // Lo guardado es solo texto: hay que volver a crear cada objeto con su clase
        let producto;
        if (dato.tamano === undefined) {
            producto = new Producto(dato.nombre, dato.precio);
        } else {
            producto = new Pizza(dato.nombre, dato.tamano, dato.precio);
        }
        Object.assign(producto, dato); // copia nombre, cantidad, detalle...
        pedido.productos.push(producto);
    }
}

function mostrar_fecha() {
    const fecha = new Date().toLocaleString('es-VE', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
    const lugares = document.querySelectorAll('.fecha_pedido');
    for (const lugar of lugares) {
        lugar.textContent = fecha;
    }
}

document.getElementById('boton_imprimir').addEventListener('click', function () {
    window.print();
});

/* ==========================================================================
   7. PAGO (subir la captura del comprobante)
   ========================================================================== */

const archivo_comprobante = document.getElementById('archivo_comprobante');
const foto_comprobante = document.getElementById('foto_comprobante');
const mensaje_pago = document.getElementById('mensaje_pago');

// El input de archivo está escondido: el botón lo abre por él
document.getElementById('boton_seleccionar_archivo').addEventListener('click', function () {
    archivo_comprobante.click();
});

function mostrar_comprobante() {
    const archivo = archivo_comprobante.files[0];
    if (!archivo) {
        return;
    }
    document.getElementById('nombre_archivo').textContent = '✓ ' + archivo.name;
    mensaje_pago.textContent = '';

    // Si es una foto la mostramos; un PDF no se puede ver en un <img>
    if (archivo.type.startsWith('image/')) {
        foto_comprobante.src = URL.createObjectURL(archivo);
        foto_comprobante.classList.remove('oculto');
    } else {
        foto_comprobante.classList.add('oculto');
    }
}

archivo_comprobante.addEventListener('change', mostrar_comprobante);

function confirmar_pago() {
    if (pedido.productos.length === 0) {
        mensaje_pago.textContent = 'Tu pedido está vacío. Agrega algo del menú primero.';
    } else if (archivo_comprobante.files.length === 0) {
        mensaje_pago.textContent = 'Falta subir la captura de tu pago.';
    } else {
        mensaje_pago.textContent = '¡Pago recibido! Tu pedido de ' +
            escribir_precio(pedido.calcular_total()) + ' ya está en el horno. 🍕';
    }
}

document.getElementById('boton_confirmar_pago').addEventListener('click', confirmar_pago);

/* ==========================================================================
   8. PROMOCIONES (descargar la tarjeta del club como imagen)
   ========================================================================== */

function descargar_tarjeta() {
    // Dibujamos la tarjeta en un canvas para poder guardarla como foto
    const lienzo = document.createElement('canvas');
    lienzo.width = 640;
    lienzo.height = 400;
    const dibujo = lienzo.getContext('2d');

    dibujo.fillStyle = '#FFFFFF';
    dibujo.fillRect(0, 0, 640, 400);

    dibujo.fillStyle = '#1A1A1A';
    dibujo.font = '44px Pacifico, cursive';
    dibujo.fillText('Ruggeri', 40, 80);

    dibujo.fillStyle = '#FBBF24';
    dibujo.fillRect(470, 42, 130, 48);
    dibujo.fillStyle = '#1A1A1A';
    dibujo.font = 'bold 24px Inter, sans-serif';
    dibujo.fillText('$5 OFF', 492, 75);

    dibujo.fillStyle = '#6B7280';
    dibujo.font = '22px Inter, sans-serif';
    dibujo.fillText('Club de la pizza', 40, 120);

    // Los 10 sellos vacíos con su número: 5 por fila
    dibujo.strokeStyle = '#683D24';
    dibujo.lineWidth = 3;
    dibujo.fillStyle = '#683D24';
    dibujo.font = 'bold 30px Inter, sans-serif';
    dibujo.textAlign = 'center';
    for (let numero = 1; numero <= 10; numero++) {
        const x = 90 + ((numero - 1) % 5) * 115;
        const y = 205 + Math.floor((numero - 1) / 5) * 115;

        dibujo.beginPath();
        dibujo.arc(x, y, 45, 0, Math.PI * 2);
        dibujo.stroke();
        dibujo.fillText(numero, x, y + 11);
    }

    // Un enlace escondido que descarga la imagen
    const enlace = document.createElement('a');
    enlace.href = lienzo.toDataURL('image/png');
    enlace.download = 'tarjeta-club-ruggeri.png';
    enlace.click();
}

document.getElementById('boton_descargar_tarjeta').addEventListener('click', descargar_tarjeta);

/* ==========================================================================
   9. AL ABRIR LA PÁGINA
   ========================================================================== */

mostrar_vista('menu');
mostrar_fecha();
cargar_pedido();
mostrar_factura();
actualizar_pizza();
