const socket = io();

socket.on('mensajeNuevo', data =>{
    let objDiv = document.getElementById("chat-history");
    let oldScrolltop = objDiv.scrollHeight-objDiv.offsetHeight;
    data = JSON.parse(data);
    document.getElementById('cajaChat').innerHTML = document.getElementById('cajaChat').innerHTML+ `<li>
    <div class="message-data">
    <span class="message-data-name"><i class="fa fa-circle online"></i> ${data.usuario}</span>
    <span class="message-data-time">${data.fecha}</span>
    </div>
    <div class="message my-message">
    ${data.mensaje}
    </div>
    </li>` ;
    if(oldScrolltop<objDiv.scrollTop){
        objDiv.scrollTop = objDiv.scrollHeight;
    }
})

socket.on('errorGrabarProducto', data =>{
    alert('ocurrio un error al tratar de guardar el producto, vuelva a intentarlo')
})

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const enviar = () => {
    if(validateEmail(document.getElementById('usuario').value)){
        if(document.getElementById('mensaje').value && !/^\s*$/.test(document.getElementById('mensaje').value)){
            socket.emit('grabarMensaje', '{ "usuario":"'+document.getElementById('usuario').value+'","mensaje":"'+document.getElementById('mensaje').value.replace(/(\r\n|\n|\r)/gm, "")+'"}');
            document.getElementById('mensaje').value='';
        }else{
            alert('No puede enviar un mensaje vacio.')
        }
    }else{
        alert('Ingrese un email valido.')
    }
}

const borrarProd = (id) => {
    if (confirm(`Esta seguro de borrar el producto ${id} ?`)) {
        fetch("/api/productos/"+id, {method: "DELETE"})
        .then(response => response.text())
        .then(data => {
            const json = JSON.parse(data);
            if(!json.mensajeError){
                alert(`Producto eliminado.`);
                window.location.reload();
            }else{
                console.log(json.mensajeError);
                alert(`no se pudo borrar el producto, consulte la consola para ver el error.`);
            }
        })
      }
}

const agregarCarrito = (id) =>{
    if(!document.getElementById('cantidad_'+id).value || isNaN(document.getElementById('cantidad_'+id).value) || document.getElementById('cantidad_'+id).value<=0){
        alert('La cantidad a agregar no puede ser 0!');
        return null;
    }
    let body = '{ "id":'+id+',"cantidad":'+document.getElementById('cantidad_'+id).value+'}';
    fetch("/api/carrito/"+document.getElementById('carritoId').value+"/productos", {method: "POST",headers: {"Content-Type": "application/json"},body: body})
    .then(response => response.text())
    .then(data => {
        const json = JSON.parse(data);
        if(!json.mensajeError){
            alert(`Producto agregado!`);
        }else{
            console.log(json.mensajeError);
            alert(`no se pudo agregar el producto al carrito, consulte la consola para ver el error`);
        }
    });
}

const borrarProdCarrito = (id) => {
    if (confirm(`Esta seguro de borrar el producto ${id} ?`)) {
            fetch("/api/carrito/"+document.getElementById('carritoId').value+"/productos/"+id, {method: "DELETE"})
            .then(response => response.text())
            .then(data => {
                const json = JSON.parse(data);
                if(!json.mensajeError){
                    alert(`Producto eliminado.`);
                    window.location.reload();
                }else{
                    console.log(json.mensajeError);
                    alert(`no se pudo borrar el producto, consulte la consola para ver el error.`);
                }
            })
      } else {
        console.log('Thing was not saved to the database.');
      }
}

window.onload = function() {
    const formAgregarProductos = document.getElementById('agregarProductos');
    if(formAgregarProductos){
        formAgregarProductos.addEventListener('submit', e =>{
            e.preventDefault();
            if(!document.getElementById('title').value || /^\s*$/.test(document.getElementById('title').value)){
                alert('El campo titulo no puede estar vacio!');
                return null;
            }
            if(!document.getElementById('price').value || isNaN(document.getElementById('price').value)){
                alert('Ingrese un precio valido!');
                return null;
            }
            if(!document.getElementById('thumbnail').value || /^\s*$/.test(document.getElementById('thumbnail').value)){
                alert('El campo thumbnail no puede estar vacio!');
                return null;
            }
            let body = '{ "title":"'+document.getElementById('title').value+'","price":"'+document.getElementById('price').value+'","thumbnail":"'+document.getElementById('thumbnail').value+'"}';
            fetch("/api/productos", {method: "POST",headers: {"Content-Type": "application/json"},body: body})
                .then(response => response.text())
                .then(data => {
                    const json = JSON.parse(data);
                    if(json.itemNuevo){
                        
                        fetch("/api/productos/"+json.itemNuevo, {method: "GET"})
                        .then(response => response.text())
                        .then(data => {
                            const jsonProd = JSON.parse(data);
                            alert(`se creo el producto ${jsonProd.title} con el id ${jsonProd.id}`);
                            window.location.reload();
                        })
                    }else{
                        console.log(json.mensajeError);
                        alert(`no se pudo crear el producto, consulte la consola para ver el error`);
                    }
                });
        })
    }

    const formModificarProd = document.getElementById('modificarProd');
    if(formModificarProd){
        formModificarProd.addEventListener('submit', e =>{
            e.preventDefault();
            if(!document.getElementById('title').value || /^\s*$/.test(document.getElementById('title').value)){
                alert('El campo titulo no puede estar vacio!');
                return null;
            }
            if(!document.getElementById('price').value || isNaN(document.getElementById('price').value)){
                alert('Ingrese un precio valido!');
                return null;
            }
            if(!document.getElementById('thumbnail').value || /^\s*$/.test(document.getElementById('thumbnail').value)){
                alert('El campo thumbnail no puede estar vacio!');
                return null;
            }
            let body = '{ "title":"'+document.getElementById('title').value+'","price":"'+document.getElementById('price').value+'","thumbnail":"'+document.getElementById('thumbnail').value+'"}';
            fetch("/api/productos/"+document.getElementById('id').value, {method: "PUT",headers: {"Content-Type": "application/json"},body: body})
                .then(response => response.text())
                .then(data => {
                    const json = JSON.parse(data);
                    if(!json.mensajeError){
                        alert(`se modifico el producto ${json.title} con el id ${json.id}`);
                        window.location.replace("/");
                    }else{
                        console.log(json.mensajeError);
                        alert(`no se pudo modificar el producto, consulte la consola para ver el error`);
                    }
                });
        })
    }
  };
