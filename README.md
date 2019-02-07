# README

### initial

- Se comenzó por definir la estructura de nuestro proyecto, con las carpetas y archivos iniciales.
- En el index.js solo se van hacer llamados a archivos externos para así mantener legible y desacoplado el código, además de iniciar el servidor en el puerto indicado.
- En startup/routes.js se definen las rutas que vamos a usar desde nuestro navegador, las cuales van a estar vinculadas a la funcionalidad proporcionada desde el archivo en la carpeta routes.
- En la carpeta routes vamos a tener toda la funcionalidad, esto quiere decir que tendremos nuestro GET, POST, PUT ...
- Como punto de partida tenemos una ruta /api/books con la cual vamos a obtener unos datos (GET) los cuales estan almacenados por el momento en una variable.
- para correr el código usamos node index.js en la terminal y en el navegador vamos a http://127.0.0.1:3000/api/books.
- En routes/books.js vamos a encontrar un api rest funcional la cual iremos mejorando, tratando de usar las mejores practicas.

## Validation

- La validación de los datos que son enviados por el usuario, son un paso muy importante para así evitar dolores de cabeza, existen dos opciones interesantes utilizando paquetes de npm, el primero es usar [joi](https://www.npmjs.com/package/joi) (muy facil) o utilizar [ajv](https://www.npmjs.com/package/ajv) el cual utiliza [JSON schemas](https://json-schema.org/understanding-json-schema/) para las validaciones y para este caso vamos a usar jsonschemas ya que practicamente se esta convirtiendo en un estándar en la industria gracias a su uso en [openAPI](https://github.com/OAI/OpenAPI-Specification).
- Es esencial entender que todas las librerías que manejemos no deben ser [bloqueantes](https://nodejs.org/en/docs/guides/blocking-vs-non-blocking/), esto quiere decir que debemos tratar de usar funciones asíncronas.
- Es importante asegurarnos de hacer validaciones tanto en el frontend antes de enviar la información a un API, en el backend cuando recibimos esa información y en el momento de tratarla y enviarla a base de datos u otro lugar, esto puede sonar redundante pero todo debe tratarse como si fueran piezas independientes.
- Para hacer pruebas con nuestra API podemos usar [postman](https://www.getpostman.com/), el cual es un ambiente bastante bueno y flexible o podemos hacerlo desde linea de comandos con [curl](https://gist.github.com/subfuzion/08c5d85437d5d4f00e58), como tip postman nos puede dar el código curl.

## Routes

- Por el momento se agregaron dos nuevas rutas authors y purchases, con los cuales ya tenemos un template para crear una ruta de lo que se nos ocurra con su respectiva validación.
- En el jsonschema de purchase podemos comprobar como anidamos objetos para hacer más poderosa la validación usando definitions o utilizando directamente un archivo externo.
- Creamos nuestro primer middleware para hacer las validaciones, por el momento en cada POST de las rutas que tenemos definidas.
- Ahora los jsonSchemas solo exportan su definición.

## auth

- Se crea la ruta users donde podemos crear los usuarios y posteriormente autenticarnos.
- Se usa el paquete [bcrypt](https://www.npmjs.com/package/bcrypt) para encriptar la contraseña, ya que es una buena practica de seguridad.
- Se usa el paquete uuid para generar un identificador unico para el usuario.
- Una vez nos autenticamos se genera un token con [JWT](https://jwt.io/), el cual contendrá el identificador y los permisos de usuario todo codificado y así el cliente podrá usar este token para hace peticiones.
- En users creamos tres rutas POST: una para crear un usuario, otra para loguearse y otra para obtener la información del usuario a partir de su token.
- Vamos a comenzar a usar el paquete [lodash](https://lodash.com/) el cual nos provee multiples utilidades, una de ellas que usamos el pick la cual se le pasa un objeto y un array de cadenas, las cuales nos van a filtrar el objeto que queremos retornar.

## mongo

- Es hora de guardar nuestros datos en una base de datos y en este caso vamos a usar una base de datos nosql llamada [mongodb](https://docs.mongodb.com/manual/tutorial/getting-started/), para interactuar con la base de datos necesitamos de un driver o controlador y para esto vamos a usar un wrapper del driver para node conocido como [mongoose](https://mongoosejs.com/docs/index.html).
- La instalación de mongo y como correrlo en su maquina local, se encuentra en la documentación del mismo y por el momento vamos a asumir su correcto funcionamiento.
- Se implementaron los metodos para encontrar, guardar y actualizar que nos proporciona mongoose, estos los usamos en todas las rutas, ahora permitiendonos guardar en base de datos. si bien los datos aun no son muy consistentes este es un buen inicio, para refactorizar y mejorar nuestro código.

## refactorization

- Se mejoraron los códigos de respuesta http, para queesténn acorde a losestándaress de la comunidad.
- se manejan referencias directas (ObjectId) en el caso de los autores de un libro o el usuario que creo una compra, por esto se hace una agregación para poder obtener la información al consultar un libro.
- En la actualización cuando se hace un patch se agrego la funcionalidad de $set y $unset de mongo las cuales permiten modificar y remover items respectivamente de un documento.
