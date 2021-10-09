const productos = require('./clases/Productos.js');

const prod = new productos();

(async() => {
    let todos = await prod.getAll();
    if(todos){
        console.log(todos);
    }else{
        console.log('no hay productos')
    }
    console.log('----------------------------------------------------------------------------------------');
    let nuevo = await prod.save({title:'producto nuevo',price:1000,thumbnail:'https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg'});
    console.log('nuevo registro guardado con el id',nuevo);
    console.log('----------------------------------------------------------------------------------------');
    let buscado = await prod.getById(2);
    console.log(buscado);
    console.log('----------------------------------------------------------------------------------------');
    await prod.deleteById(4);
    console.log('----------------------------------------------------------------------------------------');
    if(todos.length>10){
        await prod.deleteAll();
    }
  })();