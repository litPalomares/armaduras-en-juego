# Armaduras en juego

Aplicación en español para practicar las 15 armaduras musicales y sus tonalidades mayores y menores y el modo frigio. Incluye rondas aleatorias de 10 preguntas, pentagrama, corrección explicada, puntuación, rachas y tabla de ayuda. Adaptada a móvil y escritorio.

## Requisitos y dependencias

Node.js 24 y npm. La aplicación usa HTML, CSS y JavaScript estándar y no necesita paquetes externos, base de datos, cuentas de usuario ni variables de entorno. Los scripts de compilación y servidor local usan módulos integrados en Node.js. Se incluye `package-lock.json` para instalar con `npm ci`.

## Ejecutar en local

Desde esta carpeta:

```sh
npm ci
npm run dev
```

Abrir http://localhost:3000. Detener con Ctrl+C. El servidor local escucha únicamente en este equipo. Se puede cambiar el puerto con la variable `PORT`.

## Compilar y revisar la salida

```sh
npm run build
npm run preview
```

La compilación comprueba la sintaxis JavaScript y genera `dist/` a partir de `src/`. `npm start` sirve también la salida compilada.

## Publicar en Vercel desde Git

1. Descomprimir el ZIP y subir el contenido de `armaduras-vercel/` a un repositorio Git propio.
2. En Vercel, crear un proyecto e importar el repositorio.
3. Elegir como raíz la carpeta que contiene `package.json` y `vercel.json`. Si se ha subido la carpeta exterior al repositorio, elegir `armaduras-vercel` como Root Directory.
4. Usar el preset **Other**, Node.js **24.x**, instalación `npm ci`, compilación `npm run build` y salida `dist`. `vercel.json` incluye la configuración de instalación, compilación y salida.
5. Pulsar **Deploy**. No hace falta configurar variables de entorno.

## Alternativa: Vercel CLI

Desde la carpeta del proyecto, con una cuenta de Vercel:

```sh
npx vercel
```

Seguir el inicio de sesión y la vinculación de proyecto. Para publicar en producción:

```sh
npx vercel --prod
```

La CLI se descarga al ejecutar `npx`; no es una dependencia de la aplicación. Revisar los ajustes de protección del proyecto si se desea que otras personas puedan acceder al enlace.

## Archivos

- `src/index.html`: estructura, metadatos y favicon integrado.
- `src/styles.css`: estilos y adaptación a móvil.
- `src/app.js`: armaduras, preguntas, corrección y puntuación.
- `scripts/build.mjs`: compilación sin dependencias externas.
- `scripts/serve.mjs`: servidor para desarrollo y previsualización.
- `vercel.json`: configuración de despliegue.
- `dist/`: copia compilada lista para servir, incluida en el ZIP.

Las rondas se mantienen en memoria y se reinician al recargar. La integración opcional con `document.modelContext` se activa solo en navegadores compatibles; no se necesita para jugar. La cuenta y el acceso privado de la versión alojada previamente no forman parte de este código.

Documentación: https://vercel.com/docs/project-configuration y https://vercel.com/docs/deployments

## Actualización: modo frigio y notación

Activa «Practicar también el modo frigio» para responder las tres opciones. Cambiar el modo inicia una nueva ronda; con el modo desactivado, se conservan las preguntas de mayor y menor. El frigio usa el tercer grado de la escala mayor con las mismas alteraciones (Do mayor → Mi frigio). La tabla de ayuda incluye los 15 modos frigios, incluido Mi♯ frigio para siete sostenidos.

Los símbolos de la armadura ahora se dibujan como vectores anclados a cada nota en clave de sol. Las alturas se calculan por pasos diatónicos de medio espacio entre líneas, sin depender de la fuente instalada en el dispositivo.

Ejecuta `npm test` para comprobar posiciones, escalas frigias, puntuación de ambos modos y cambios de ronda.
