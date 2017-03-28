# Middleware de terceros

Utilice el middleware de terceros para añadir funcionalidad a las aplicaciones Express.

Instale el módulo Node.js para la funcionalidad necesaria y cárguelo en la aplicación a nivel de aplicación o a nivel de direccionador.

El siguiente ejemplo ilustra la instalación y carga de la función de middleware de análisis de cookies cookie-parser.

```
$ npm install cookie-parser
```

```
var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');

// load the cookie-parsing middleware
app.use(cookieParser());
```

Para ver una lista parcial de las funciones de middleware de terceros que más se utilizan con Express, consulte: [Middleware de terceros](http://expressjs.com/es/resources/middleware.html). 