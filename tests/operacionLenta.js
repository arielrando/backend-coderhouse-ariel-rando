process.on('message', cant =>{
    let numeros = {};
    for(let i=0; i<cant; i++) {
        let random = Math.floor(Math.random() * (1000 - 1 + 1) + 1);
        if(numeros[random]){
            numeros[random]++
        }else{
            numeros[random]=1
        }
    }
process.send(JSON.stringify(numeros));
process.exit();
})

process.send('listo')

