const express = require('express');
const app = express();

/*  
    Por el momento se va a utilizar esta variable global de node
    para simular nuestra base de DOMSettableTokenList.
*/
global.book = [
    {
        title: 'Iliada',
        author: 'Homero',
        description: 'Este poema épico narra la cólera de Aquiles, hijo del rey Peleo y de la nereida Tetis, su causa, su larga duración, sus consecuencias y su posterior cambio de actitud. La ira del pélida Aquiles termina junto con el poema, cuando se reconcilia con Príamo, padre de su enemigo Héctor, momento en que se celebran los funerales de éste',
        price: 50000,
        code: '0001',
        category: 'poema',
        stock: 20
    },
    {
        title: 'It',
        author: 'Stephen King',
        description: 'Cuenta la historia de un grupo de siete niños que son aterrorizados por un malvado monstruo -al que llaman «Eso»- que es capaz de cambiar de forma, alimentándose del terror que produce en sus víctimas',
        price: 100000,
        code: '0002',
        category: 'novela',
        stock: 10
    },
    {
        title: 'El psicoanalista',
        author: 'John Katzenbach',
        description: 'La historia, que pone a prueba la capacidad del protagonista para evitar su suicidio frente a la presión de un desconocido, destaca por el realismo psicológico de sus personajes y la capacidad de establecer una trama intrigante.',
        price: 70000,
        code: '0003',
        category: 'novela',
        stock: 2
    },
];

global.author = [
    {
        fullName: 'Fyodor Mikhailovich Dostoevsky',
        id: '0001',
        birth: '1821-11-11',
        country: 'Rusia'
    },
    {
        fullName: 'John Katzenbach',
        id: '0002',
        birth: '1950-06-23',
        country: 'Estados Unidos'
    },
    {
        fullName: 'Stephen Edwin King',
        id: '0003',
        birth: '1947-09-21',
        country: 'Estados Unidos'
    },
    {
        fullName: 'Homero',
        id: '0004',
        birth: null,
        country: 'Grecia'
    }
];

global.purchase = [

];

require('./startup/routes')(app);

const port = process.env.PORT || 3000;
app.listen(port, () => console.info(`Listening on port ${port}...`));