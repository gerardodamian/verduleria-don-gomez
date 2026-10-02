# Don Gomez · Frutas & Verduras

App web para tomar pedidos de la verdulería **Don Gomez**, con delivery a La Falda y
Valle Hermoso. Es una PWA (se puede instalar en el celular) hecha en HTML, CSS y
JavaScript puro, sin frameworks ni build tools, pensada para subir a GitHub Pages.

- App para clientes: `index.html`
- Panel del dueño (agregar productos, cambiar precios, envíos y horarios): `admin.html`
- Teléfono del local: 3548 43-3620 · Av. España 580, La Falda

## Estructura del proyecto

```
index.html              App que ve el cliente (catálogo, carrito, WhatsApp)
admin.html               Panel del dueño, protegido por PIN
base.css                 Estilos compartidos entre index.html y admin.html
firebase-config.js       Datos de conexión a Firebase (compartido por ambos archivos)
sw.js                    Service worker (hace que la app funcione offline y se instale)
manifest.webmanifest     Metadatos de instalación (nombre, ícono, colores)
qrcode.js                Librería para generar el código QR desde el botón 📲
banner.webp              Imagen del encabezado
icon-192.png / icon-512.png   Íconos de la app instalada
img/                      Fotos de los productos (ver img/LEEME.txt)
```

## Cómo funciona la sincronización

Los productos, precios, envíos y horarios **no están escritos a mano en el código**:
viven en una base de datos Firebase (Firestore), proyecto `verduleria-don-gomez`.

- `admin.html` lee y escribe ahí.
- `index.html` escucha esos mismos datos en tiempo real: cualquier cambio que haga el
  dueño desde el panel se ve al instante en todos los celulares que tengan la app
  abierta o instalada, sin que nadie tenga que actualizar nada.
- Si por algún motivo no hay conexión a Firebase, `index.html` muestra un catálogo de
  ejemplo (hardcodeado) para que la página nunca quede vacía.

Las fotos de los productos **no se suben a Firebase**: el dueño escribe desde el panel
el nombre que va a tener el archivo (por ejemplo `tomate.jpg`), y el archivo real se
agrega a mano en la carpeta `img/` del proyecto (ver `img/LEEME.txt`) y se sube junto
con el resto del sitio. Así se evita depender de Firebase Storage, que pide una cuenta
de facturación (plan Blaze).

## Primera configuración (una sola vez)

1. **Crear el proyecto de Firebase**: [console.firebase.google.com](https://console.firebase.google.com) → crear proyecto (gratis).
2. **Activar Firestore Database**: Compilación → Firestore Database → Crear base de
   datos → modo producción → elegir ubicación (por ejemplo `southamerica-east1`).
3. **Reglas de Firestore** (pestaña "Reglas" de Firestore, reemplazar y publicar):
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} { allow read, write: if true; }
     }
   }
   ```
   Son reglas abiertas (cualquiera que sepa la URL de la base puede leer/escribir).
   Alcanza para arrancar; si más adelante se quiere más seguridad, se puede sumar
   autenticación.
4. **Conseguir los datos de conexión**: Configuración del proyecto (⚙️) → General →
   "Tus apps" → ícono `</>` (Web) → crear la app → copiar el bloque `firebaseConfig`.
5. **Pegarlos en `firebase-config.js`**, reemplazando los 6 valores dentro de
   `const firebaseConfig = { ... }`. No tocar el resto del archivo.
6. **Cargar el catálogo inicial**: abrir `admin.html`, entrar con el PIN (`1234` por
   defecto) y tocar **"Cargar catálogo de ejemplo"** (solo aparece si no hay productos
   todavía). Después, editar cada producto con los precios y fotos reales.

No hace falta Firebase Storage ni plan Blaze para nada de esto.

## Publicar en GitHub Pages

```bash
git add index.html admin.html base.css firebase-config.js sw.js manifest.webmanifest qrcode.js banner.webp icon-192.png icon-512.png img/
git commit -m "Actualizo app Don Gomez"
git push
```

GitHub Pages sirve el sitio por HTTPS automáticamente, que es necesario para que la
app se pueda instalar y para que funcione el service worker.

## Agregar o cambiar una foto de producto

1. En `admin.html`, al crear o editar un producto, escribir el nombre del archivo en
   el campo de la foto (ej: `palta.jpg`).
2. Guardar una copia de esa foto, recortada cuadrada si se puede, dentro de la
   carpeta `img/` del proyecto, con **exactamente** ese nombre.
3. `git add img/palta.jpg`, commit y push.
4. La foto aparece sola en la app, sin tocar nada más. Mientras el archivo no exista,
   se muestra el emoji del producto sin romper nada.

## Cada vez que se cambia el código (no los datos)

Si se edita `index.html`, `admin.html` o `sw.js`, hay que subir la versión del
service worker en `sw.js`:

```js
const V='dongomez-v5', FILES=[...]
```

Cambiarla (v6, v7, …) hace que los celulares que ya tienen la app instalada bajen la
versión nueva solos, en vez de seguir mostrando la copia guardada en caché. Si el
dueño no ve un cambio después de subirlo, primero confirmar que se subió esta línea
cambiada, y como último recurso pedirle que cierre la app del todo y la vuelva a
abrir.

## Panel del dueño — qué se puede hacer

- **Productos**: agregar, editar, ocultar (sin borrar) o eliminar. Cada uno puede
  tener varias presentaciones (ej. Kilo / Docena / Maple x30), cada una con su propio
  precio y si es por kilo o por unidad.
- **Oferta de la semana**: tildar el casillero en un producto para que aparezca en la
  tira destacada debajo del encabezado. Usa el precio de la primera presentación;
  opcionalmente se puede cargar un "precio anterior" que se muestra tachado.
- **Envíos**: nombre, descripción y precio de cada forma de entrega (retiro, La
  Falda, Valle Hermoso).
- **Horarios de atención**: lista editable de renglones (día/horario).
- **Aviso de corte de pedidos**: hora límite y texto que se muestra en la app, en el
  carrito y se agrega al mensaje de WhatsApp (ej. "antes de las 11 hs se entrega al
  mediodía, después se entrega por la tarde").
- **PIN de acceso**: se puede cambiar desde la sección "Seguridad" del propio panel.

## Qué pasa si algo no anda

- **Los productos no aparecen en la app pero sí en el panel**: revisar la consola del
  navegador (F12 → Console) buscando errores en rojo; probablemente los datos de
  Firebase en `firebase-config.js` no son los reales, o la versión subida está
  desactualizada.
- **El panel no puede guardar cambios**: confirmar que Firestore esté activado y que
  las reglas digan `if true` (paso 3 de la configuración).
- **Las fotos no se ven**: confirmar que el nombre de archivo cargado en el panel
  coincide exactamente (mayúsculas incluidas) con el archivo dentro de `img/`, y que
  ese archivo ya se subió a GitHub.
