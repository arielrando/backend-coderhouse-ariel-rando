class Usuario {
    constructor(nombre,apellido,mascotas,libros){
        this.nombre = nombre;
        this.apellido = apellido;
        if(!mascotas){
            this.mascotas = [];
        }else{
            this.mascotas = mascotas;
        }
        if(!libros){
            this.libros = [];
        }else{
            this.libros = libros;
        }
        
    }

    getFullName() {
        console.log(`Su nombre y apellido son ${this.nombre} ${this.apellido}`);
    }

    addMascota(nombreMascota){
        this.mascotas.push(nombreMascota);
    }

    countMascotas(){
        console.log(this.mascotas.length);
    }

    addBook(nombreLibro, autorLibro){
        this.libros.push({nombre:nombreLibro,autor:autorLibro});
    }

    getBooks(){
        let nombresLibros = [];
        this.libros.forEach(function(val){
            nombresLibros.push(val.nombre);
        } )
        console.log(nombresLibros);
    }


}

const usuario = new Usuario('mario','alvarez',['mulato','reboltoso']);

usuario.getFullName();
console.log('--------------------------------');
usuario.addMascota('tepotepo');
usuario.addMascota('mutante');
usuario.countMascotas();
console.log('--------------------------------');
usuario.addBook('El señor de los anillos','J.R.R. Tolkien');
usuario.addBook('100 años de soledad','Gabriel García Márquez');
usuario.getBooks();
