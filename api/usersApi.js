const apiUsers = new Ruta();

apiUsers.get('/logout', (req, res) => {
    if (req.user) {
        let usuario = req.user;
        req.logout();
        res.render('logout.hbs',{usuario: usuario});
    }else{
        res.redirect(`/productos`);
    }
})

apiUsers.get('/registro', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect(`/productos`);
    } else {
    res.render('registro_form.hbs');
    }
})

apiUsers.get('/falloLogin', (req, res) => {
    res.render('falloLogin.hbs');
    
})

apiUsers.get('/falloRegistro', (req, res) => {
    res.render('falloRegistro.hbs');
})


apiUsers.get('/exitoRegistro', (req, res) => {
    res.render('exitoRegistro.hbs');
})

apiUsers.get('/falloLogin',(req,res)=>{
    console.log('falloLogin');
})

apiUsers.get('/falloRegistro',(req,res)=>{
    console.log('falloRegistro');
})

module.exports = apiUsers;