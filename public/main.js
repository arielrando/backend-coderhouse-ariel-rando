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
    let body = '{ "id":"'+id+'","cantidad":'+document.getElementById('cantidad_'+id).value+'}';
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
            if(!document.getElementById('codigo').value || /^\s*$/.test(document.getElementById('codigo').value)){
                alert('El campo codigo no puede estar vacio!');
                return null;
            }
            if(!document.getElementById('nombre').value || /^\s*$/.test(document.getElementById('nombre').value)){
                alert('El campo nombre no puede estar vacio!');
                return null;
            }
            if(!document.getElementById('precio').value || isNaN(document.getElementById('precio').value)){
                alert('Ingrese un precio valido!');
                return null;
            }
            if(isNaN(document.getElementById('stock').value)){
                alert('Ingrese un stock valido!');
                return null;
            }
            if(!document.getElementById('foto').value || /^\s*$/.test(document.getElementById('foto').value)){
                alert('El campo foto no puede estar vacio!');
                return null;
            }
            let body = '{ "codigo":"'+document.getElementById('codigo').value+'","nombre":"'+document.getElementById('nombre').value+'","precio":"'+document.getElementById('precio').value+'","foto":"'+document.getElementById('foto').value+'","stock":"'+document.getElementById('stock').value+'"}';
            fetch("/api/productos", {method: "POST",headers: {"Content-Type": "application/json"},body: body})
                .then(response => response.text())
                .then(data => {
                    const json = JSON.parse(data);
                    if(json.itemNuevo){
                        fetch("/api/productos/"+json.itemNuevo, {method: "GET"})
                        .then(response => response.text())
                        .then(data => {
                            const jsonProd = JSON.parse(data);
                            alert(`se creo el producto ${jsonProd.nombre} con el id ${jsonProd.id}`);
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
            if(!document.getElementById('codigo').value || /^\s*$/.test(document.getElementById('codigo').value)){
                alert('El campo codigo no puede estar vacio!');
                return null;
            }
            if(!document.getElementById('nombre').value || /^\s*$/.test(document.getElementById('nombre').value)){
                alert('El campo nombre no puede estar vacio!');
                return null;
            }
            if(!document.getElementById('precio').value || isNaN(document.getElementById('precio').value)){
                alert('Ingrese un precio valido!');
                return null;
            }
            if(isNaN(document.getElementById('stock').value)){
                alert('Ingrese un stock valido!');
                return null;
            }
            if(!document.getElementById('foto').value || /^\s*$/.test(document.getElementById('foto').value)){
                alert('El campo foto no puede estar vacio!');
                return null;
            }

            let body = '{ "codigo":"'+document.getElementById('codigo').value+'","nombre":"'+document.getElementById('nombre').value+'","precio":"'+document.getElementById('precio').value+'","foto":"'+document.getElementById('foto').value+'","stock":"'+document.getElementById('stock').value+'"}';
            fetch("/api/productos/"+document.getElementById('id').value, {method: "PUT",headers: {"Content-Type": "application/json"},body: body})
                .then(response => response.text())
                .then(data => {
                    const json = JSON.parse(data);
                    if(!json.mensajeError){
                        alert(`se modifico el producto ${json.nombre} con el id ${json.id}`);
                        window.location.replace("/");
                    }else{
                        console.log(json.mensajeError);
                        alert(`no se pudo modificar el producto, consulte la consola para ver el error`);
                    }
                });
        })
    }
  };
