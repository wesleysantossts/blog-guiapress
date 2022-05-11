const {Router} = require("express"), router = Router(), bcrypt = require("bcrypt");
const ArticleModel = require("../articles/ArticleModel"), UserModel = require("../users/UserModel");
const Middlewares = require("../middlewares");

router.get("/admin/users", (req, res)=>{
  UserModel.findAll()
  .then(users =>{
    res.render("admin/users", {users})
  })
  .catch(err => res.redirect("/admin/users"))
});

router.get("/admin/users/create", (req, res)=>{
  res.render("admin/users/create");
});

router.post("/users/create", (req, res)=>{
  const {email, password} = req.body;

  UserModel.findOne({where: {email}})
  .then(user => {
    if(user == undefined){
      const salt = bcrypt.genSaltSync(10), hash = bcrypt.hashSync(password, salt);
    
      UserModel.create({
        email,
        password: hash
      })
      .then(()=> res.redirect("/"))
      .catch((err)=> res.redirect("/admin/users/create"))
    } 
    console.log("Usuário já existe!");
    res.redirect("/admin/users/create");
  })
});

router.get("/users/login", (req, res)=>{
  res.render("admin/users/login");
});

router.post("/authenticate", (req,res)=>{
  const {email, password} = req.body;
  
  if(email == undefined || password == undefined) res.redirect("/users/login")
  UserModel.findOne({where: {email}})
    .then(user => {
      if(user == undefined) res.redirect("/users/login");

      const correct = bcrypt.compareSync(password, user.password);

      if(!correct) res.redirect("/users/login");
      
      req.session.user = {
        id: user.id,
        email: user.email
      };
      res.redirect("/admin/articles");
    })
    .catch(err => res.json({error: "Usuário não encontrado."}))
});

router.post("/users/logout", (req, res)=>{
  req.session.user = undefined;
  res.redirect("/users/login")
});

module.exports = router;