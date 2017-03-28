# Express-Validator

## Instalación

```shell
$ npm install express-validator
```

## ¿Cómo se usa?

En primar lugar debemos iniciar express-validator en un objeto JS.

```javascript
var util = require('util'),
bodyParser = require('body-parser'),
express = require('express'),
expressValidator = require('express-validator'),
app = express();
```

A continuación debemos añadir que vamos a utilizar el bodyParser.

```javascript
app.use(bodyParser.json());
// Esta línea va inmediatamente después de cada middleware de bodyParser.
app.use(expressValidator([options]));
```

Ahora vamos a ver cómo se realiza la validación de una petición.

- checkBody sólo comprueba req.body; Ninguno de los otros parámetros req.
- Similarmente, checkParams sólo comprueba en req.params (parámetros de URL).
- checkQuery sólo comprueba req.query (GET params).

```javascript
app.post('/:urlparam', function(req, res) {
  req.checkBody('postparam', 'Invalid postparam').notEmpty().isInt();
  req.checkParams('urlparam', 'Invalid urlparam').isAlpha();
  req.checkQuery('getparam', 'Invalid getparam').isInt();
  // ... más abajo 
}
```

También podemos encontrar el parámetro relevante para todas las áreas.

```javascript
	// ...	
	req.sanitize('postparam').toBoolean();
	// ...
```

Acabemos mostrando el resultado de la validación.

```javascript
  req.getValidationResult().then(function(result) {
      if (!result.isEmpty()) {
        res.send('There have been validation errors: ' + util.inspect(result.array()), 400);
        return;
      }
      res.json({
        urlparam: req.params.urlparam,
        getparam: req.params.getparam,
        postparam: req.params.postparam
      });
    });
}
```

Veamos ahora lo que ocurriría si ejecutamos unas peticiones:

```shell
$ curl -d 'postparam=1' http://localhost:8888/test?getparam=1
{"urlparam":"test","getparam":"1","postparam":true}
 
$ curl -d 'postparam=1' http://localhost:8888/t1est?getparam=1
There have been validation errors: [
  { param: 'urlparam', msg: 'Invalid urlparam', value: 't1est' } ]
 
$ curl -d 'postparam=1' http://localhost:8888/t1est?getparam=1ab
There have been validation errors: [
  { param: 'getparam', msg: 'Invalid getparam', value: '1ab' },
  { param: 'urlparam', msg: 'Invalid urlparam', value: 't1est' } ]
 
$ curl http://localhost:8888/test?getparam=1&postparam=1
There have been validation errors: [
  { param: 'postparam', msg: 'Invalid postparam', value: undefined} ]
```

## Middleware (opciones)

1. **errorFormatter**

   ```javascript
   app.use(expressValidator({
     errorFormatter: function(param, msg, value) {
         var namespace = param.split('.')
         , root    = namespace.shift()
         , formParam = root;
    
       while(namespace.length) {
         formParam += '[' + namespace.shift() + ']';
       }
       return {
         param : formParam,
         msg   : msg,
         value : value
       };
     }
   }));
   ```

2. **customValidators**

   ```javascript
   app.use(expressValidator({
    customValidators: {
       isArray: function(value) {
           return Array.isArray(value);
       },
       gte: function(param, num) {
           return param >= num;
       }
    }
   }));

   req.checkBody('users', 'Users must be an array').isArray();
   req.checkQuery('time', 'Time must be an integer great than or equal to 5').isInt().gte(5)
   ```

3. **customSanitizers**

   ```javascript
   app.use(expressValidator({
    customSanitizers: {
       toSanitizeSomehow: function(value) {
           var newValue = value;//some operations 
           return newValue;
       },
    }
   }));

   req.sanitize('address').toSanitizeSomehow();
   ```

## Validación

- #### req.check();

  ```javascript
  req.check('testparam', 'Error Message').notEmpty().isInt();
  req.check('testparam.child', 'Error Message').isInt(); // find nested params 
  req.check(['testparam', 'child'], 'Error Message').isInt(); // find nested params 
  ```

- #### req.assert(); 

  Alias de req.check();

- #### req.validate();

  Alias de req.check();

- #### req.checkBody();

  Alias de req.check(); pero solo en req.body.

- #### req.checkQuery();

  Alias de req.check(); pero solo en req.query.

- #### req.checkParams();

  Alias de req.check(); pero solo en req.params.

- #### req.checkHeaders();

  Alias de req.check(); pero solo en req.headers.

- #### req.checkCookies();

  Alias de req.check(); pero solo en req.cookies.

### Validación mediante un Schema

Alternativamente, puede definir todas sus validaciones a la vez utilizando un esquema simple. La validación de esquema se utilizará si pasa un objeto a cualquiera de los métodos de validación.

Puede pasar mensajes de error por validador con la clave errorMessage. Las opciones de validador se pueden pasar a través de la clave de opciones como una matriz cuando se necesitan varios valores, o como un solo valor no nulo de lo contrario.

```javascript
req.checkBody({
 'email': {
    optional: {
      options: { checkFalsy: true } // or: [{ checkFalsy: true }] 
    },
    isEmail: {
      errorMessage: 'Invalid Email'
    }
  },
  'password': {
    notEmpty: true,
    matches: {
      options: ['example', 'i'] // pass options to the validator with the options property as an array 
      // options: [/example/i] // matches also accepts the full expression in the first parameter 
    },
    errorMessage: 'Invalid Password' // Error message for the parameter 
  },
  'name.first': { // 
    optional: true, // won't validate if field is empty 
    isLength: {
      options: [{ min: 2, max: 10 }],
      errorMessage: 'Must be between 2 and 10 chars long' // Error message for the validator, takes precedent over parameter message 
    },
    errorMessage: 'Invalid First Name'
  }
});
```

Recuerde que el atributo in siempre tendrá la prioridad más alta. Esto significa que si utiliza en: 'query', entonces checkQuery () se llamará dentro incluso si hace checkParams () o checkBody (). Por ejemplo, todas estas llamadas comprobarán los parámetros de consulta para el parámetro de correo electrónico:

```javascript
var schema = {
 'email': {
    in: 'query',
    notEmpty: true,
    isEmail: {
      errorMessage: 'Invalid Email'
    }
  },
  'password': {
    notEmpty: true,
    matches: {
      options: ['example', 'i'] // pass options to the validator with the options property as an array 
      // options: [/example/i] // matches also accepts the full expression in the first parameter 
    },
    errorMessage: 'Invalid Password' // Error message for the parameter 
  }
};
 
req.check(schema);        // will check 'password' no matter where it is but 'email' in query params 
req.checkQuery(schema);   // will check 'password' and 'email' in query params 
req.checkBody(schema);    // will check 'password' in body but 'email' in query params 
req.checkParams(schema);  // will check 'password' in path params but 'email' in query params 
req.checkHeaders(schema);  // will check 'password' in headers but 'email' in query params 
```

### Validación del resultado

```javascript
req.assert('email', 'required').notEmpty();
req.assert('email', 'valid email required').isEmail();
req.assert('password', '6 to 20 characters required').len(6, 20);
 
req.getValidationResult().then(function(result) {
  // do something with the validation result 
});
```

Para ver todos los métodos que podemos utilizar ver la documentación del paquete [aquí](https://www.npmjs.com/package/express-validator#reqassert).

# Express-session

## Instalación

```shell
$ npm install express-sessions
```

## Ejemplo de uso

```javascript
var mongoose = require('mongoose');
 
mongoose.connect();
 
app.use(express.session({
    secret: 'a4f8071f-c873-4447-8ee2',
    cookie: { maxAge: 2628000000 },
    store: new (require('express-sessions'))({
        storage: 'mongodb',
        instance: mongoose, // optional 
        host: 'localhost', // optional 
        port: 27017, // optional 
        db: 'test', // optional 
        collection: 'sessions', // optional 
        expire: 86400 // optional 
    })
}));
```

ó

```javascript
var redis = require('redis');
var client = redis.createClient(6379, 'localhost');
 
app.use(express.session({
    secret: 'a4f8071f-c873-4447-8ee2',
    cookie: { maxAge: 2628000000 },
    store: new (require('express-sessions'))({
        storage: 'redis',
        instance: client, // optional 
        host: 'localhost', // optional 
        port: 6379, // optional 
        collection: 'sessions', // optional 
        expire: 86400 // optional 
    })
}));
```

