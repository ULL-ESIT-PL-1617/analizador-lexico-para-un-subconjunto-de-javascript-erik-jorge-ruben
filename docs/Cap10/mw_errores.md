# Middleware de manejo de errores

El middleware de manejo de errores siempre utiliza *cuatro* argumentos. Debe proporcionar cuatro argumentos para identificarlo como una función de middleware de manejo de errores. Aunque no necesite utilizar el objeto next, debe especificarlo para mantener la firma. De lo contrario, el objeto next se interpretará como middleware normal y no podrá manejar errores.

Defina las funciones de middleware de manejo de errores de la misma forma que otras funciones de middleware, excepto con cuatro argumentos en lugar de tres, específicamente con la firma (err, req, res, next):

```
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
```

Para obtener detalles sobre el middleware de manejo de errores, consulte: [Manejo de errores](http://expressjs.com/es/guide/error-handling.html).