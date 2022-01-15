const apiTest = new Ruta();
const { fork } = require('child_process')

apiTest.get('/:cant', (req, res) => {
    let cant  = isNaN(req.params.cant)?100000000:req.params.cant;
    const operacionLenta = fork('./tests/operacionLenta.js');
    operacionLenta.on('message', msg => {
        if (msg == 'listo') {
            operacionLenta.send(cant)
        } else {
            res.send(msg);
        }
    })
    
})

apiTest.get('/', (req, res) => {
    res.redirect('/api/randoms/100000000');
})

module.exports = apiTest;