# Routine Rush : Ma journée en français 🧹🌅

Juego educativo web, gratuito y sin conexión a servidores, para practicar el
vocabulario francés (nivel A1 avanzado) de la rutina diaria y las tareas
domésticas: despertarse, ducharse, barrer, trapear, sacar la basura, lavar
los platos, ordenar la habitación, hacer la cama, etc.

Esta guía está escrita para una persona **sin experiencia técnica**. Todos los
pasos están numerados.

---

## 1. ¿Qué es este juego?

- Un juego de navegador (HTML + CSS + JavaScript) con 5 niveles y más de 45
  expresiones en francés.
- Las instrucciones del juego están en francés sencillo, con un botón "🌐 ES"
  para ver la traducción al español de cada instrucción.
- No requiere cuenta, ni contraseña, ni conexión a internet una vez
  descargado.
- El progreso (estrellas, puntos, palabras dominadas) se guarda **solo en el
  navegador del estudiante** (`localStorage`), nunca en un servidor.

## 2. Cómo abrir el juego en tu computador (forma más simple)

1. Descarga o copia la carpeta completa `routine-rush` (o el nombre que le
   hayas dado) a tu computador.
2. Abre esa carpeta.
3. Haz doble clic en el archivo `index.html`.
4. El juego se abrirá en tu navegador (Chrome, Edge, Firefox...).

> Nota: algunos navegadores limitan ciertas funciones cuando el archivo se
> abre directamente con doble clic (protocolo `file://`). Si el juego no
> reproduce bien la voz en francés o algo se ve extraño, usa el método del
> punto 3 (servidor local) o simplemente publícalo en GitHub Pages
> (punto 8), que es la forma recomendada de usarlo con tus estudiantes.

## 3. Cómo ejecutarlo con un servidor local (opcional, recomendado)

Esto no es obligatorio, pero evita pequeñas limitaciones del navegador.
No necesitas instalar nada complicado: casi todos los computadores ya tienen
Python instalado.

1. Abre una terminal (en Windows: busca "PowerShell" en el menú de inicio).
2. Escribe `cd` seguido de la ruta de la carpeta del juego, por ejemplo:
   ```bash
   cd "C:\Users\TuUsuario\Documents\routine-rush"
   ```
3. Ejecuta:
   ```bash
   py -m http.server 8000
   ```
   (En Mac/Linux puede ser `python3 -m http.server 8000`).
4. Abre tu navegador y visita: `http://localhost:8000`.
5. Para detener el servidor, vuelve a la terminal y presiona `Ctrl + C`.

## 4. Cómo probarlo

1. Haz clic en **▶️ Jouer**.
2. Elige el **Niveau 1 — Le matin**.
3. Responde algunas preguntas (correctas e incorrectas, para ver la
   retroalimentación).
4. Usa el botón **💡 Indice** para ver las pistas progresivas.
5. Termina el nivel y revisa la pantalla de resultados (estrellas,
   precisión, palabras a practicar).
6. Cierra el navegador y vuelve a abrirlo: tu progreso debe seguir ahí.

## 5. Cómo editar el vocabulario

Todo el vocabulario está en un único archivo, separado de la lógica del
juego:

```text
data/vocabulary.js
```

Ábrelo con cualquier editor de texto (Bloc de notas, VS Code, etc.). Cada
palabra es un bloque como este:

```javascript
{
  id: "balayer",
  infinitive: "balayer",
  firstPerson: "je balaie",
  translation: "barrer",
  category: "menage",
  level: 4,
  icon: "🧹",
  example: "Je balaie le sol.",
  acceptedAnswers: ["balayer", "je balaie"],
  distractors: ["lire", "dormir", "déjeuner"]
}
```

Para **modificar** una palabra, cambia el texto entre comillas (por ejemplo,
`translation` o `example`). Para **añadir** una palabra nueva, copia un bloque
completo, pégalo antes del `];` final de su nivel, ponle un `id` único (sin
espacios ni acentos) y complétalo. Guarda el archivo y recarga la página.

- `category` puede ser: `matin`, `journee`, `maison`, `menage` u `objet`.
- `level` debe ser un número del 1 al 5.
- `icon` es un emoji (no se necesitan imágenes ni sonidos externos).
- `distractors` son las respuestas incorrectas que aparecerán como opciones.

## 6. Cómo cambiar el número de preguntas o el contenido de una sesión

Usa el **🎓 Mode professeur** desde la pantalla de inicio. Ahí puedes, sin
tocar código:

- Elegir qué niveles y categorías practicar.
- Practicar solo tareas domésticas o solo verbos pronominales
  (`se lever`, `se laver`, `se coucher`...).
- Activar o desactivar el cronómetro de bonificación.
- Elegir el número de preguntas (entre 8 y 12).
- Consultar las palabras dominadas y los errores frecuentes.
- Reiniciar el progreso.

Esta configuración se guarda también en el navegador (no se envía a
internet).

## 7. Cómo borrar el progreso

1. En la pantalla de inicio (o en el modo profesor), pulsa
   **🗑️ Effacer la progression**.
2. Confirma en el cuadro de diálogo que aparece.
3. Todo el progreso guardado en ese navegador (estrellas, puntos, niveles
   desbloqueados, vocabulario dominado) se borra de forma permanente.

## 8. Cómo subirlo a GitHub

1. Crea una cuenta gratuita en [github.com](https://github.com) si no tienes
   una.
2. Crea un repositorio nuevo, público, llamado `routine-rush` (sin marcar
   "Add a README", ya que este proyecto ya trae uno).
3. Desde la terminal, dentro de la carpeta del proyecto:
   ```bash
   git init
   git add .
   git commit -m "Version inicial de Routine Rush"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/routine-rush.git
   git push -u origin main
   ```
4. Si nunca has usado Git, la [aplicación de escritorio de GitHub](https://desktop.github.com/)
   permite hacer lo mismo con clics en vez de comandos.

## 9. Cómo activar GitHub Pages

1. Entra a tu repositorio en GitHub.
2. Ve a **Settings** → **Pages**.
3. En "Build and deployment", elige **Deploy from a branch**.
4. En "Branch", selecciona **main** y la carpeta **/(root)**.
5. Guarda. En unos minutos, tu juego estará disponible en:
   ```text
   https://TU-USUARIO.github.io/routine-rush/
   ```

## 10. Cómo actualizar el juego

1. Edita los archivos que necesites (por ejemplo `data/vocabulary.js`).
2. Guarda los cambios.
3. Desde la terminal, dentro de la carpeta del proyecto:
   ```bash
   git add .
   git commit -m "Actualizo vocabulario"
   git push
   ```
4. GitHub Pages actualizará el sitio automáticamente en uno o dos minutos.

## 11. Cómo compartir el enlace con tus estudiantes

Simplemente envíales la dirección de GitHub Pages, por ejemplo:

```text
https://TU-USUARIO.github.io/routine-rush/
```

No necesitan instalar nada, ni crear una cuenta, ni iniciar sesión. Funciona
en computador y en tableta, desde cualquier navegador moderno.

## 12. ¿Qué datos se guardan? (privacidad)

Este juego **no recopila ningún dato personal**. No hay formularios de
registro, ni nombres, ni correos, ni identificadores de estudiante, ni
conexión a servidores externos ni servicios de analítica.

Todo lo que se guarda vive únicamente en el navegador del dispositivo, en
`localStorage`, y son datos de progreso genéricos:

- Niveles desbloqueados y estrellas obtenidas.
- Mejor puntuación por nivel.
- Estado de dominio de cada palabra (nueva, en aprendizaje, a practicar,
  dominada).
- Número de aciertos y errores.
- Preferencias de sonido e idioma de las instrucciones.
- Configuración del modo profesor.

## 13. Limitaciones de `localStorage`

- El progreso queda guardado **solo en ese navegador y ese dispositivo**. Si
  el estudiante juega en el computador de la escuela y luego en una tableta
  en casa, tendrá progresos distintos e independientes (no se sincronizan).
- Si el estudiante borra el historial/datos de navegación de su navegador,
  o usa el modo incógnito/privado, el progreso se pierde.
- Cambiar de navegador (por ejemplo, de Chrome a Firefox) también genera un
  progreso independiente.
- El almacenamiento es local, por lo que el profesor no puede ver
  automáticamente el progreso de sus estudiantes desde otro dispositivo;
  puede pedirles una captura de pantalla de su pantalla de resultados o del
  modo profesor si quiere hacer seguimiento manual.

## 14. Estructura del proyecto

```text
routine-rush/
├── index.html            → Página principal (ábrela para jugar)
├── css/
│   └── styles.css        → Todos los estilos visuales
├── js/
│   ├── app.js             → Arranque de la aplicación
│   ├── game.js             → Reglas del juego, niveles, puntuación
│   ├── storage.js          → Guardado local (localStorage)
│   ├── audio.js             → Sonido y voz en francés
│   └── ui.js                 → Pantallas e interacción
├── data/
│   └── vocabulary.js     → Todo el vocabulario (editable)
├── assets/                → Reservado para imágenes/iconos futuros
├── README.md              → Esta guía
├── LICENSE                 → Licencia MIT
└── .gitignore
```

## 15. Créditos

- Diseño, contenido pedagógico y desarrollo: creado con ayuda de Claude
  (Anthropic) a partir de las especificaciones del proyecto.
- Todos los iconos son emojis estándar Unicode (no requieren licencia
  adicional).
- La voz en francés utiliza la API nativa del navegador
  (`window.speechSynthesis`); no se incluye ni distribuye ningún archivo de
  audio con derechos de autor.
- Sin librerías externas, sin frameworks, sin dependencias de compilación.

## 16. Licencia

Este proyecto se distribuye bajo la licencia MIT. Consulta el archivo
[`LICENSE`](./LICENSE) para más detalles. Eres libre de usarlo, copiarlo y
adaptarlo, incluso en contextos educativos comerciales, mencionando la
licencia original.
