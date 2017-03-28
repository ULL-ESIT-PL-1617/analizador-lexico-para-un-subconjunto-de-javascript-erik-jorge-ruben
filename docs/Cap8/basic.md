# Direccionamiento básico

El direccionamiento hace referencia a cómo responde una aplicación a una solicitud en un determinado punto final, que es un URI (o una vía de acceso) y un método de solicitud HTTP específico (GET, POST, etc.).

Cada ruta puede tener una o varias funciones HANDLER, que son ejecutadas cuando la ruta de la solicitud conincide con su PATH.

La definición de ruta tiene la siguiente estructura:

~~~
app.METHOD(PATH, HANDLER)
~~~
Donde:

* app es una instancia de express.
* METHOD es un método de solicitud HTTP.
* PATH es una vía de acceso en el servidor.
* HANDLER es la función que se ejecuta cuando coincide la ruta.

Los siguiens ejemplos muestran la definición de rutas simples .

### Respuesta con Hello World! en la página inicial:
~~~
app.get('/', function (req, res) {
  res.send('Petición GET en el directorio raiz');
});
~~~
### Respuesta a la solicitud POST en la ruta raíz (/), la página de inicio de la aplicación:
~~~
app.post('/', function (req, res) {
  res.send('Petición POST en el directorio raiz');
});
~~~
### Respuesta a una solicitud PUT en la ruta /user:
~~~
app.put('/user', function (req, res) {
  res.send('Petición PUT en /user');
});
~~~
### Respuesta a una solicitud DELETE en la ruta /user:
~~~
app.delete('/user', function (req, res) {
  res.send('Petición DELETE en /user');
});
~~~

Ejemplo de enrutamiento básico:
[https://practica3.herokuapp.com/basic](https://practica3.herokuapp.com/basic)
