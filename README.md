# README

### Inicio

- Se comenzó por definir la estructura de nuestro proyecto, con las carpetas y archivos iniciales.
- En el index.js solo se van hacer llamados a archivos externos para así mantener legible y desacoplado el código, además de iniciar el servidor en el puerto indicado.
- En startup/routes.js se definen las rutas que vamos a usar desde nuestro navegador, las cuales van a estar vinculadas a la funcionalidad proporcionada desde el archivo en la carpeta routes.
- En la carpeta routes vamos a tener toda la funcionalidad, esto quiere decir que tendremos nuestro GET, POST, PUT ...
- Como punto de partida tenemos una ruta /api/books con la cual vamos a obtener unos datos (GET) los cuales estan almacenados por el momento en una variable.
- para correr el código usamos node index.js en la terminal y en el navegador vamos a http://127.0.0.1:3000/api/books.
- En routes/books.js vamos a encontrar un api rest funcional la cual iremos mejorando, tratando de usar las mejores practicas.