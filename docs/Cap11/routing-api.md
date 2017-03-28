# Router

Videotutorial de routing en Express.js

[ExpressJS Tutorial 23: Advance Routing](https://www.youtube.com/watch?v=26wm0IQsDCs)

Un objeto *router* es una instancia aislada de middleware y rutas. Se puede pensar en ella como una "mini-aplicación", capaz sólo de realizar middleware y funciones de enrutamiento. Cada aplicación Express tiene un enrutador de aplicaciones incorporado.

Un enrutador se comporta como el propio middleware, por lo que puede utilizarlo como argumento para app.use () o como argumento para el método use () de otro enrutador.

El objeto express de nivel superior tiene un método Router () que crea un nuevo objeto de enrutador.

Una vez que haya creado un objeto enrutador, puede agregar rutas intermedias y de método HTTP (como get, put, post, etc.) como una aplicación. Por ejemplo:

```javascript
// Se invoca para cualquier petición pasada al router.
router.use(function(req, res, next) {
  // ...
  next();
});

/*
Manejará cualquier petición que se haga en /events.
Dependerá de donde esté el router "use()'d".
*/
router.get('/events', function(req, res, next) {
  // ...
});
```

A continuación, puede utilizar un enrutador para una URL raíz en particular, de esta manera separar sus rutas en archivos o mini-aplicaciones.

```javascript
// Sólo las solicitudes a /calendar/* serán enviadas a nuestro "router"
app.use('/calendar', router);	
```

## Métodos

### router.all(path, [callback, ...] callback)

Este método es igual que los métodos *router.METHOD()*, excepto que coincide con todos los métodos HTTP.

Este método es extremadamente útil para mapear la lógica "global" para prefijos de ruta específicos o coincidencias arbitrarias. Por ejemplo, si colocó la ruta siguiente en la parte superior de todas las demás definiciones de ruta, se requeriría que todas las rutas a partir de ese punto requerirían autenticación y cargarían automáticamente un usuario. Tenga en cuenta que estas devoluciones de llamada no tienen que actuar como puntos finales; *LoadUser* puede realizar una tarea y luego llamar a *next()* para seguir comparando las rutas subsiguientes.

```javascript
router.all('*', requireAuthentication, loadUser);

// Lo equivalente:
router.all('*', requireAuthentication)
router.all('*', loadUser);

// Si sólo queremos restringirnos al directorio /api haríamos...
router.all('/api/*', requireAuthentication);
```

### router.METHOD(path, [callback, ...] callback)

Proporcionan la funcionalidad de enrutamiento en Express, donde METHOD es uno de los métodos HTTP(GET, PUT, POST) y así sucesivamente en minúscula.

Puede proporcionar múltiples devoluciones de llamada, y todos se tratan de forma igual, y se comportan como middleware, excepto que estas devoluciones pueden invocar a continuación ('ruta') para omitir la(s) llamada(s) de ruta restantes. Puede utilizar este mecanismo para realizar las condiciones previas en una ruta y, a continuación, pasar el control a las rutas subsiguientes cuando no haya ninguna razón para proceder con la ruta coincidente.El fragmento siguiente ilustra la definición de ruta más sencilla posible. Express traduce las cadenas de ruta a expresiones regulares, utilizadas internamente para coincidir con las solicitudes entrantes. 

```javascript
router.get('/', function(req, res){
  res.send('hello world');
});	
// Note: el path puede ser una expresión regular.

```

### router.param(name, callback)

Agrega los disparadores de devolución de llamada a los parámetros de ruta, donde nombre es el nombre del parámetro y la devolución de llamada es la función de devolución de llamada. Aunque el nombre es técnicamente opcional, el uso de este método sin que sea obsoleto a partir de Express v4.11.0 (consulte a continuación).

Los parámetros de la función de devolución de llamada son:

- Req, el objeto request.
- Res, el objeto de respuesta.
- Siguiente, indicando la siguiente función de middleware.
- El valor del parámetro name.
- El nombre del parámetro.

Por ejemplo, cuando:
El usuario está presente en una ruta, puede asignar la lógica de carga del usuario para proporcionar automáticamente req.user a la ruta o realizar validaciones en la entrada de parámetros.

```javascript
router.param('user', function(req, res, next, id) {
  User.find(id, function(err, user) {
    if (err) {
      next(err);
    } else if (user) {
      req.user = user;
      next();
    } else {
      next(new Error('failed to load user'));
    }
  });
});
```

Las funciones de devolución de llamada de parámetros son locales al enrutador en el que se definen. No son heredados por aplicaciones montadas o enrutadores. Por lo tanto, las devoluciones de llamada param definidas en el enrutador se activarán sólo por los parámetros de ruta definidos en las rutas del enrutador.

Una devolución de llamada de parámetro se llamará sólo una vez en un ciclo de petición-respuesta, incluso si el parámetro coincide en varias rutas, como se muestra en los siguientes ejemplos.

```javascript
router.param('id', function (req, res, next, id) {
  console.log('CALLED ONLY ONCE');
  next();
});

router.get('/user/:id', function (req, res, next) {
  console.log('although this matches');
  next();
});

router.get('/user/:id', function (req, res) {
  console.log('and this matches too');
  res.end();
});
```

Para `GET /user/42`, sería:

```shell
CALLED ONLY ONCE
although this matches
and this matches too
```

### router.route(path)

Devuelve una instancia de una sola ruta que puede utilizar para manejar verbos HTTP con middleware opcional. Utilice router.route () para evitar la asignación de rutas duplicadas y, por lo tanto, errores de escritura.

Basándose en el ejemplo de router.param () anterior, el siguiente código muestra cómo utilizar router.route () para especificar varios manejadores de métodos HTTP.

```javascript
var router = express.Router();

router.param('user_id', function(req, res, next, id) {
  req.user = {
    id: id,
    name: 'TJ'
  };
  next();
});

router.route('/users/:user_id')
.all(function(req, res, next) {
  next();
})
.get(function(req, res, next) {
  res.json(req.user);
})
.put(function(req, res, next) {
  req.user.name = req.params.name;
  // save user ... etc
  res.json(req.user);
})
.post(function(req, res, next) {
  next(new Error('not implemented'));
})
.delete(function(req, res, next) {
  next(new Error('not implemented'));
});
```

Este enfoque reutiliza la ruta single / users /: user_id y agrega controladores para varios métodos HTTP.

### router.use([path], [function, ...] function)

Utiliza la función o funciones de middleware especificadas, con una ruta de acceso de montaje opcional, que tiene por defecto "/".

Este método es similar a app.use (). A continuación se describe un ejemplo simple y un caso de uso. Consulte app.use () para obtener más información.

El middleware es como un tubo de fontanería: las solicitudes comienzan en la primera función de middleware definida y funcionan de manera "descendente" en el procesamiento de la pila de middleware para cada ruta que coincidan.

```javascript
var express = require('express');
var app = express();
var router = express.Router();

router.use(function(req, res, next) {
  console.log('%s %s %s', req.method, req.url, req.path);
  next();
});

router.use('/bar', function(req, res, next) {
  next();
});

router.use(function(req, res, next) {
  res.send('Hello World');
});

app.use('/foo', router);

app.listen(3000);
```

La ruta de "montaje" se quita y no es visible para la función de middleware. El efecto principal de esta característica es que una función de middleware montada puede operar sin cambios de código independientemente de su ruta de acceso "prefix".

El orden en el que se define middleware con router.use () es muy importante. Se invocan secuencialmente, por lo que el orden define la precedencia de middleware. Por ejemplo, por lo general, un registrador es el primer middleware que utilizaría, de modo que cada solicitud se registra.

```javascript
var logger = require('morgan');

router.use(logger());
router.use(express.static(__dirname + '/public'));
router.use(function(req, res){
  res.send('Hello');
});
```

Ahora suponga que desea ignorar las solicitudes de registro de archivos estáticos, pero para continuar registrando rutas y middleware definidos después de logger (). Simplemente mover la llamada a express.static () a la parte superior, antes de agregar el logger middleware:

```javascript
router.use(express.static(__dirname + '/public'));
router.use(logger());
router.use(function(req, res){
  res.send('Hello');
});
```

Otro ejemplo es el servicio de archivos de varios directorios, dando prioridad a "./public" sobre los demás:

```javascript
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/files'));
app.use(express.static(__dirname + '/uploads'));
```

El método router.use () también admite parámetros con nombre para que los puntos de montaje de otros enrutadores se puedan beneficiar de la precarga mediante parámetros con nombre.

NOTA: Aunque estas funciones de middleware se agregan a través de un enrutador en particular, cuando se ejecutan se define por la ruta a la que están conectados (no el enrutador). Por lo tanto, middleware agregado a través de un enrutador puede correr para otros routers si sus rutas coinciden. Por ejemplo, este código muestra dos routers diferentes montados en la misma ruta:

```javascript
var authRouter = express.Router();
var openRouter = express.Router();

authRouter.use(require('./authenticate').basic(usersdb));

authRouter.get('/:user_id/edit', function(req, res, next) { 
  // ... Edit user UI ...  
});
openRouter.get('/', function(req, res, next) { 
  // ... List users ... 
})
openRouter.get('/:user_id', function(req, res, next) { 
  // ... View user ... 
})

app.use('/users', authRouter);
app.use('/users', openRouter);
```

A pesar de que el middleware de autenticación se ha añadido a través de authRouter se ejecutará en las rutas definidas por el openRouter, así como ambos routers fueron montados en / users. Para evitar este comportamiento, utilice rutas diferentes para cada enrutador.