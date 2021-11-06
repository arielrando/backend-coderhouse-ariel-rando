const socket = io();

socket.on('mi mensaje', data =>{
console.log(data);
    socket.emit('notificacion', 'Mensaje recibido exitosamente')
})

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

socket.on('productoNuevo', data =>{
    let tableId = document.getElementById('tablaProductos');
    let tBody = tableId.getElementsByTagName('tbody')[0];
    data = JSON.parse(data);
    tBody.innerHTML = tBody.innerHTML+ `<tr>
        <td>${data.id}</td>
        <td>${data.title}</td>
        <td>${data.price}</td>
        <td><img src="${data.thumbnail}" alt="${data.title}" height="50"></td>
        <th scope="row"><a href="/eliminar/${data.id}">X</a></th>
    </tr>` ;
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

window.onload = function() {
    const formAgregarProductos = document.getElementById('agregarProductos');
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
        socket.emit('grabarProducto', '{ "title":"'+document.getElementById('title').value+'","price":"'+document.getElementById('price').value+'","thumbnail":"'+document.getElementById('thumbnail').value+'"}');
    })
  };
