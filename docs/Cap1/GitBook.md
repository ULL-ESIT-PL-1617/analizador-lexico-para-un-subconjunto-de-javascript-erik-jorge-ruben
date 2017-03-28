# GitBook

## ¿Qué es GitBook?

GitBook es una herramienta para crear libros digitales. Funciona muy bien para documentar proyectos de software libre.

Lo que me gusta de esta solución son los documentos escritos en markdown y guardados en el repositorio del proyecto. Pueden publicarse fácilmente con un solo script npm. Todo el mundo puede contribuir con una simple solicitud.

## Instalar GitBook

### **Requisitos**

Instalar GitBook es fácil y directo. Su sistema sólo necesita cumplir con estos dos requisitos:
Se recomienda NodeJS (v4.0.0 y superior)
Windows, Linux, Unix o Mac OS X

### **Instalar con NPM**

La mejor manera de instalar GitBook es a través de NPM. En el terminal, simplemente ejecute el siguiente comando para instalar GitBook:

```shell
$ npm install gitbook-cli -g
```

Gitbook-cli es una utilidad para instalar y usar múltiples versiones de GitBook en el mismo sistema. Instalará automáticamente la versión requerida de GitBook para construir un libro.

**Crear un libro:**GitBook puede configurar un libro de texto:

```shell
$ gitbook init
```

Si desea crear el libro en un nuevo directorio, puede hacerlo ejecutando gitbook init ./directory
**Previsualice y sirva su libro usando:**

```shell
$ gitbook build
```

```shell
$ gitbook serve
```



## ¿Cómo incluir GitBook a nuestro proyecto GitHub?

### Preparar el libro

El README.md principal del repositorio será la introducción del libro.

Cree un book.json en la raíz del proyecto. Esto es utilizado por Gitbook para sus configuraciones. En nuestro caso, queremos la tabla de contenido del libro en docs / SUMMARY.md:

```
{ 
  "gitbook": "2.5.2",
  "structure": { 
    "summary": "docs/SUMMARY.md" 
  } 
}
```

Ahora cree un SUMMARY.md simple y colóquelo en el directorio docs. Aquí es donde se escribe el árbol del libro. Por ejemplo, utilice este contenido:

```
# Table of content 
* [Getting Started](docs/getting-started.md)
* [API Reference](docs/api-reference.md)
```

Ahora cree los dos archivos get-started.md y api-reference.md, ponga un poco de contenido y guárdelos en el directorio docs.

¡Ya puedes empezar a escribir el Gitbook! Tenga en cuenta:

- el proyecto README.md es la introducción del libro

- docs / SUMMARY.md contiene la tabla de contenido (ToC) - hay que añadir allí los capítulos y artículos del libro

- guardar todos los ficheros de reducción marcados desde el ToC en el directorio / docs o sus subdirectorios


### Visualizar nuestro libro

Tenemos que instalar la herramienta *gitbook-cli* y añadirla a las dependencias de desarrollo.

```shell
$ npm install gitbook-cli --save-dev
```

Añadimos el siguiente script al *package.json*:

```json
"scripts": {
   "docs:prepare": "gitbook install",
   "docs:watch": "npm run docs:prepare && gitbook serve"
}
```

Docs: instala las dependencias de gitbook (como dependencias, plugins, etc.) y * docs: watch * iniciará un servidor mostrando el libro.

Ahora, ejecute la tarea de vigilancia:

```
npm run docs:watch
```

y abrimos [localhost:4000](http://localhost:4000/):

![img](https://cdn-images-1.medium.com/max/800/1*xTMSiHj12YL0_XF366rDBg.png)

Aquí tienes, el Gitbook! A medida que cambia el contenido del libro, el navegador lo vuelve a cargar automáticamente.

### Publicar el libro en Github Pages

Si todavía no lo ha hecho, cree manualmente la sección gh-pages siguiendo esta guía en github.com. El contenido empujado en esta rama se publicará en http: // [nombre de usuario] .github.io / [repo].

Cambie de nuevo a la rama maestra y, a continuación, agregue otro script a package.json:

```
"scripts": {
  "docs:build": "npm run docs:prepare && rm -rf _book && gitbook build"
}
```

Ejecutar npm docs: build * creará un directorio de libro con el sitio web de Gitbook que queremos publicar: de hecho, si abre * _book / index.html verá el sitio web estático generado por Gitbook. (Recuerde agregar _book a su .gitignore)

Queremos crear ahora un script npm que publica el contenido de _book * en la rama * gh-pages. Esta parte es un poco más compleja, ya que tenemos que init un nuevo repositorio y empujarlo a la sucursal. De todos modos, la secuencia de los comandos a ejecutar es la siguiente:

```
$ npm run docs:build
$ cd _book
$ git init
$ git commit --allow-empty -m 'Update docs'
$ git checkout -b gh-pages
$ git add .
$ git commit -am 'Update docs'
$ git push git@github.com:<username>/<repo> gh-pages --force
```

Coloque todo en una línea, agregue los siguientes documentos: publicar guión a la sección * scripts package.json *:

```
"docs:publish": "npm run docs:build && cd _book && git init && git commit --allow-empty -m 'Update docs' && git checkout -b gh-pages && git add . && git commit -am 'Update docs' && git push git@github.com:<username>/<repo> gh-pages --force"
```

Recuerde cambiar ** y * * con su nombre de usuario de Github y el nombre del repo!
Ahora para publicar el libro en la página github, sólo tienes que entrar:

```
npm run docs:publish
```

Espere unos minutos y visite http: // [nombre de usuario] .github.io / [repo]. Si todo se ha ido bien, deberías ver los libros publicados allí.

Ahora, con Gitbook y Github Pages, la documentación de su proyecto de código abierto es muy divertido! Simplemente cambie el markdown y ejecute npm run docs: publish.

PD. Puede ver los archivos fuente descritos anteriormente en este repo gitbook-demo.

### Algunos tips

- Gitbook soporta una gran variedad de plugins. He encontrado útil reemplazar el plugin de resaltado de código original con otro basado en Prism. El archivo book.json debe desactivar el complemento de realce:

```
"plugins": ["prism", "-highlight"]
```

- Puede ajustar el CSS de Gitbook con el suyo propio. Cree un nuevo archivo .css y añada una referencia a él en book.json, por ejemplo:

```
"styles": {
  "website": "docs/styles/website.css"
}
```
