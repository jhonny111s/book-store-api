const express = require('express');
const app = express();

/*  
    Por el momento se va a utilizar esta variable global de node
    para simular nuestra base de DOMSettableTokenList.
*/

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

global.user = [];

require('./startup/routes')(app);
require('./startup/db')();

const port = process.env.PORT || 3000;
app.listen(port, () => console.info(`Listening on port ${port}...`));