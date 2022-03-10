const supertest = require('supertest');
const { expect } = require('chai');
const { app } = require('../clases/app.js');

let request
let server
let cod_product
let unformatted_data
let old_product

describe('test api rest full productos (IMPORTANTE: configure el .evn con los datos de firebase e inicie el proyecto al menos una vez)', () => {

    before(async function () {
        server = await startServer()
        request = supertest(`http://localhost:${server.address().port}/api/productos`)
    })

    after(function () {
        server.close()
    })

    describe('GET ALL PRODUCTS', () => {
        it('should return a status 200', async () => {
            let response = await request.get('/')
            unformatted_data = response.res.text;
            expect(response.status).to.eql(200)
            
        })
        it('should return an array', async () => {
            let data = JSON.parse(unformatted_data)
            expect(data).to.be.an('array');
            
        })
    })

    describe('SAVE A PRODUCT', () => {
        it('should return a status 200', async () => {
            let body = '{ "codigo":"9999","nombre":"test","precio":"100","foto":"img","stock":"100"}';
            old_product = body;
            const response = await request.post('/').send(JSON.parse(body));
            unformatted_data = response.res.text;
            expect(response.status).to.eql(200)
        })
        it('should save a product', async () => {
            let data = JSON.parse(unformatted_data);
            cod_product = data.itemNuevo;
            expect(data).to.be.an('object');
            expect(cod_product).to.not.be.empty;
        })
    })

    describe('GET A PRODUCT', () => {
        it('should return a status 200', async () => {
            let response = await request.get('/'+cod_product)
            unformatted_data = response.res.text;
            expect(response.status).to.eql(200)
            
        })
        it('should return a product', async () => {
            let data = JSON.parse(unformatted_data)
            expect(data).to.be.an('object').that.include.all.keys('codigo', 'nombre','precio','stock','foto',);
        })
    })

    describe('EDIT A PRODUCT', () => {
        it('should return a status 200', async () => {
            let body = '{ "codigo":"9999","nombre":"testEdit","precio":"150","foto":"imgEdit","stock":"150"}';
            const response = await request.put('/'+cod_product).send(JSON.parse(body));
            unformatted_data = response.res.text;
            expect(response.status).to.eql(200)
        })
        it('should edit a product', async () => {
            let data = JSON.parse(unformatted_data);
            cod_product_edit = data.id;
            expect(data).to.be.an('object');
            expect(cod_product).to.eql(cod_product_edit);
        })
        it('should be different', async () => {
            let data = JSON.parse(unformatted_data);
            let data_old = JSON.parse(old_product);
            expect(data.nombre).to.not.eql(data_old.nombre);
        })
    })

    describe('DELETE A PRODUCT', () => {
        it('should return a status 200', async () => {
            let response = await request.delete('/'+cod_product)
            unformatted_data = response.res.text;
            expect(response.status).to.eql(200)
            
        })
        it('should delete a product', async () => {
            let data = JSON.parse(unformatted_data)
            expect(data).to.be.an('object').that.has.all.keys('mensajeExito');
        })
    })
})

async function startServer() {
    return new Promise((resolve, reject) => {
        const PORT = 8080
        const server = app.listen(PORT, () => {
            console.log(`Server start in Port ${server.address().port}`);
            resolve(server)
        });
        server.on('error', error => {
            console.log(`Error in Server: ${error}`)
            reject(error)
        });
    })
}