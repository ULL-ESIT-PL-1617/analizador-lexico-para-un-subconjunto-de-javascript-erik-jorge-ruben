# Session Authentication

La autenticación es el proceso de verificar si un usuario es quien está declarando que es. La autorización es el proceso de determinar si el usuario tiene los privilegios para acceder a los recursos que solicitó.

El siguiente fragmento de código node.js muestra un ejemplo muy simple de proceso de autenticación y autorización usando las sessiones de express. Hay un  punto final de inicio de sesión, un punto final de cierre de sesión y una página de publicación. Para ver la página de entrada, hay que iniciar sesión primero, y la identidad será verificada y guardada en la sesión. Cuando se pulse el punto final de cierre de sesión, se revocará el acceso eliminando la identidad de la sesión.



FIchero auth.js

```
var express = require('express'),
    app = express(),
    session = require('express-session');
app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));
```

 En esta parte se importan los módulos de exprees y express-session y crea una aplicación express y añade una sesión para la aplicación express como un middleware.

```
// Authentication and Authorization Middleware
var auth = function(req, res, next) {
  if (req.session && req.session.user === "amy" && req.session.admin)
    return next();
  else
    return res.sendStatus(401);
};
```

Función de middleware de autenticación y autorización.  Accede al siguiente paso si el usuario es "amy" y tiene acceso de administrador.



````
// Login endpoint
app.get('/login', function (req, res) {
  if (!req.query.username || !req.query.password) {
    res.send('login failed');    
  } else if(req.query.username === "amy" || req.query.password === "amyspassword") {
    req.session.user = "amy";
    req.session.admin = true;
    res.send("login success!");
  }
});
````

**localhost:3000/login?username=amy&password=amyspassword**, la url de inicio de sesión para registrar al usuairo y el nivel de acceso de usuario en la sesion. La sesion será diferente para cada usuario, y también será única para el mismo usuario utilizando diferentes navegadores.

````
// Logout endpoint
app.get('/logout', function (req, res) {
  req.session.destroy();
  res.send("logout success!");
});
````

**localhost:3000/logout** , cierra sesión destruyendo la sesión creada. 



````
// Get content endpoint
app.get('/content', auth, function (req, res) {
    res.send("You can only see this after you've logged in.");
});
````

**localhost:3000/content**, obtiene el contenido protegido. La función de autenticación anterior se pasa como segundo parámetro del middleware antes de proceder a servir el contenido al usuario. SI la funcion de autenticación determinó que el usuario no era válido, no pasará a la función para servir el contenido



````
app.listen(3000);
console.log("app running at http://localhost:3000");
````

Se inicia la aplicación escuchando en el puerto 3000