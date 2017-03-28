# Middleware de nivel de aplicación

Enlace el middleware de nivel de aplicación a una instancia del objeto de aplicación utilizando las funciones app.use() y app.METHOD(), donde METHOD es el método HTTP de la solicitud que maneja la función de middleware (por ejemplo, GET, PUT o POST) en minúsculas.

Este ejemplo muestra una función de middleware sin ninguna vía de acceso de montaje. La función se ejecuta cada vez que la aplicación recibe una solicitud.

```
var app = express();

app.use(function (req, res, next) {
  console.log('Time:', Date.now());
  next();
});
```

Este ejemplo muestra una función de middleware montada en la vía de acceso /user/:id. La función se ejecuta para cualquier tipo de solicitud HTTP en la vía de acceso /user/:id.

```
app.use('/user/:id', function (req, res, next) {
  console.log('Request Type:', req.method);
  next();
});
```

Este ejemplo muestra una ruta y su función de manejador (sistema de middleware). La función maneja las solicitudes GET a la vía de acceso /user/:id.

```
app.get('/user/:id', function (req, res, next) {
  res.send('USER');
});
```

A continuación, se muestra un ejemplo de carga de una serie de funciones de middleware en un punto de montaje, con una vía de acceso de montaje. Ilustra una subpila de middleware que imprime información de solicitud para cualquier tipo de solicitud HTTP en la vía de acceso /user/:id.

```
app.use('/user/:id', function(req, res, next) {
  console.log('Request URL:', req.originalUrl);
  next();
}, function (req, res, next) {
  console.log('Request Type:', req.method);
  next();
});
```

Los manejadores de rutas permiten definir varias rutas para una vía de acceso. El ejemplo siguiente define dos rutas para las solicitudes GET a la vía de acceso /user/:id. La segunda ruta no dará ningún problema, pero nunca se invocará, ya que la primera ruta finaliza el ciclo de solicitud/respuestas.

Este ejemplo muestra una subpila de middleware que maneja solicitudes GET a la vía de acceso /user/:id.

```
app.get('/user/:id', function (req, res, next) {
  console.log('ID:', req.params.id);
  next();
}, function (req, res, next) {
  res.send('User Info');
});

// handler for the /user/:id path, which prints the user ID
app.get('/user/:id', function (req, res, next) {
  res.end(req.params.id);
});
```

Para omitir el resto de las funciones de middleware de una pila de middleware de direccionador, invoque next('route') para pasar el control a la siguiente ruta. **NOTA**: next('route') sólo funcionará en las funciones de middleware que se hayan cargado utilizando las funciones app.METHOD() o router.METHOD().

Este ejemplo muestra una subpila de middleware que maneja solicitudes GET a la vía de acceso /user/:id.

```
app.get('/user/:id', function (req, res, next) {
  // if the user ID is 0, skip to the next route
  if (req.params.id == 0) next('route');
  // otherwise pass the control to the next middleware function in this stack
  else next(); //
}, function (req, res, next) {
  // render a regular page
  res.render('regular');
});

// handler for the /user/:id path, which renders a special page
app.get('/user/:id', function (req, res, next) {
  res.render('special');
});
```

