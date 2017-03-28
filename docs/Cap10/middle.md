# Utilización de middleware

Express es una infraestructura web de direccionamiento y middleware que tiene una funcionalidad mínima propia: una aplicación Express es fundamentalmente una serie de llamadas a funciones de middleware.

Las funciones de *middleware* son funciones que tienen acceso al objeto de solicitud(req), al objeto de respuesta (res) y a la siguiente función de middleware en el ciclo de solicitud/respuestas de la aplicación. La siguiente función de middleware se denota normalmente con una variable denominada next.

Las funciones de middleware pueden realizar las siguientes tareas:

* Ejecutar cualquier código.
* Realizar cambios en la solicitud y los objetos de respuesta.
* Finalizar el ciclo de solicitud/respuestas.
* Invocar la siguiente función de middleware en la pila.

Si la función de middleware actual no finaliza el ciclo de solicitud/respuestas, debe invocar next() para pasar el control a la siguiente función de middleware. De lo contrario, la solicitud quedará colgada.

Una aplicación Express puede utilizar los siguientes tipos de middleware:

* [Middleware de nivel de aplicación](mw_aplicacion.md)
* [Middleware de nivel de direccionador](mw_direccionador.md)
* [Middleware de manejo de errores](mw_errores.md)
* [Middleware incorporado](mw_incorporado.md)
* [Middleware de terceros](mw_terceros.md)

Puede cargar middleware de nivel de aplicación y de nivel de direccionador con una vía de acceso de montaje opcional. También puede cargar una serie de funciones de middleware a la vez, lo que crea una subpila del sistema de middleware en un punto de montaje.
