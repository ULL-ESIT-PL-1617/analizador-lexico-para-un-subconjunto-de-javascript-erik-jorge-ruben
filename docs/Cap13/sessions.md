# Sessions

Debido a que HTTP no tiene estado, para asociar una petición a alguna otra solicitud, es necesaria una forma de almacenar datos de usuarios entre las peticiones HTTP. Las cookies y los parametros URL  son dos formas adecuadas para el transporte de datos entre el cliente y el servidor. Pero ambos son legibles y en el lado del cliente. Las sesiones resuelven  este problema. Se asigna al cliente una identificación y realiza todas las solicitudes adicionales utilizando ese ID. La información asociada con el cliente se almacena en el servidor vinculado a este ID.

Para crear las sesions necesitaremos [express-session](https://ewiggin.gitbooks.io/expressjs-middleware/content/express-session.html)

EN este ejemplo, vamos a utilizar el almacén prederterminado para el almacenamiento de sesiones. es decir MemoryStore. Nunca se debe utilizar esta memoria en entornos de producción. EL middleware sesión se ocupa de todas las cosas para nosotros, es decir, la creación de la sesión, el establecimiento de la cookie de sesión y crear el objeto de sesión en el objeto request.



Siempre que se realiza una petición del mismo cliente, tendremos la información de sesión almacenada con nosotros.

~~~javascript

    var express = require('express');
    var cookieParser = require('cookie-parser');
    var session = require('express-session');

    var app = express();

    app.use(cookieParser());
    app.use(session({secret: "¡Shh, es un secreto!"}));

    app.get('/', function(req, res){
        if(req.session.page_views){
            req.session.page_views++;
            res.send("Has visitado esta página " + req.session.page_views + " veces");
        }
        req.session.page_views = 1;
        res.send("¡Bienvenido a esta página por primera vez!");
    });

    app.listen(8080);
~~~
En este ejemplo se crea un contador de visita de un cliente. Cuando un usuario visita el sitio, se crea una nueva sesión para el usuario y se le asigna una cookie. La próxima vez que el usuario entre, se comprueba la cookie y la variable de sesión page_view se actualiza.
