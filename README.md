# README

## Inicio

- Se comenzó por definir la estructura de nuestro proyecto, con las carpetas y archivos iniciales.
- En el index.js solo se van hacer llamados a archivos externos para así mantener legible y desacoplado el código, además de iniciar el servidor en el puerto indicado.
- En startup/routes.js se definen las rutas que vamos a usar desde nuestro navegador, las cuales van a estar vinculadas a la funcionalidad proporcionada desde el archivo en la carpeta routes.
- En la carpeta routes vamos a tener toda la funcionalidad, esto quiere decir que tendremos nuestro GET, POST, PUT ...
- Como punto de partida tenemos una ruta /api/books con la cual vamos a obtener unos datos (GET) los cuales estan almacenados por el momento en una variable.
- para correr el código usamos node index.js en la terminal y en el navegador vamos a http://127.0.0.1:3000/api/books.
- En routes/books.js vamos a encontrar un api rest funcional la cual iremos mejorando, tratando de usar las mejores practicas.

## Validation

- La validación de los datos que son enviados por el usuario, son un paso muy importante para asi evitar doleres de cabeza, existen dos opciones interesantes utilizando paquetes de npm, el primero es usar [joi](https://www.npmjs.com/package/joi) (muy facil) o utilizar [ajv](https://www.npmjs.com/package/ajv) el cual utiliza [JSON schemas](https://json-schema.org/understanding-json-schema/) para las validaciones y para este caso vamos a usar jsonschemas ya que practicamente se esta convirtiendo en un estandar en la industria gracias a su uso en [openAPI](https://github.com/OAI/OpenAPI-Specification).
- Es esencial entender que todas las librerias que manejemos no deben ser [bloqueantes](https://nodejs.org/en/docs/guides/blocking-vs-non-blocking/), esto quiere decir que debemos tratar de usar funciones asincronas.
- Es importante asegurarnos de hacer validaciones tando en el frontend antes de enviar la información a un API, en el backend cuando recibimos esa información y en el momento de tratarla y enviarla a base de datos u otro lugar, esto puede sonar redundante pero todo debe tratarse como si fueran piezas independietes.
- Para hacer pruebas con nuestra API podemos usar [postman](https://www.getpostman.com/), el cual es un ambiente bastante bueno y flexible o podemos hacerlo desde linea de comandos con [curl](https://gist.github.com/subfuzion/08c5d85437d5d4f00e58), como tip postman nos puede dar el código curl.

## Routes

- Por el momento se agregaron dos nuevas rutas authors y purchases, con los cuales ya tenemos un template para crear una ruta de lo que se nos ocurra con su respectiva validación.
- En el jsonschema de purchase podemos comprobar como anidamos objetos para hacer más poderosa la validación usando definitions o utilizando directamente un archivo externo.
- Creamos nuestro primer middleware para hacer las validaciones, por el momento en cada POST de las rutas que tenemos definidas.
- Ahora los jsonSchemas solo exportan su definición.