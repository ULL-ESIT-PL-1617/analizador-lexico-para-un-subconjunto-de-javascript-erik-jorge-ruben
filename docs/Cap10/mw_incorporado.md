# Middleware incorporado

Desde la versión 4.x, Express ya no depende de Connect. Excepto express.static, todas las funciones de middleware que se incluían previamente con Express están ahora en módulos diferentes. Consulte [la lista de funciones de middleware](https://github.com/senchalabs/connect#middleware).

`express.static(root, [options])`

La única función de middleware incorporado en Express es express.static. Esta función se basa en serve-static y es responsable del servicio de activos estáticos de una aplicación Express.

El argumento root especifica el directorio raíz desde el que se realiza el servicio de activos estáticos.

El objeto options opcional puede tener las siguientes propiedades:

| Propiedad    | Descripción                              | Tipo     | Valor predeterminado |
| ------------ | ---------------------------------------- | -------- | -------------------- |
| dotfiles     | Opción para el servicio de dotfiles. Los valores posibles son “allow”, “deny” e “ignore” | Serie    | “ignore”             |
| etag         | Habilitar o inhabilitar la generación de etag | Booleano | true                 |
| extensions   | Establece las reservas de extensiones de archivos. | Matriz   | []                   |
| index        | Envía el archivo de índices de directorios. Establézcalo en false para inhabilitar la indexación de directorios. | Mixto    | “index.html”         |
| lastModified | Establezca la cabecera Last-Modified en la última fecha de modificación del archivo en el sistema operativo. Los valores posibles son true o false. | Booleano | true                 |
| maxAge       | Establezca la propiedad max-age de la cabecera Cache-Control en milisegundos o una serie en formato ms | Número   | 0                    |
| redirect     | Redireccionar a la “/” final cuando el nombre de vía de acceso es un directorio. | Booleano | true                 |
| setHeaders   | Función para establecer las cabeceras HTTP que se sirven con el archivo. | Función  |                      |

A continuación, se muestra un ejemplo de uso de la función de middleware express.staticcon un objeto de opciones elaboradas:

```
var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html'],
  index: false,
  maxAge: '1d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now());
  }
}

app.use(express.static('public', options));
```

Puede tener más de un directorio estático para cada aplicación:

```
app.use(express.static('public'));
app.use(express.static('uploads'));
app.use(express.static('files'));
```

Para obtener más detalles sobre la función serve-static y sus opciones, consulte la documentación de [serve-static](https://github.com/expressjs/serve-static).

