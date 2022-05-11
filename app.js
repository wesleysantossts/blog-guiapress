const express = require("express"), app = express(), connection = require("./database/connection"), session = require("express-session");
const CategoriesController = require("./categories/CategoriesController"), ArticlesController = require("./articles/ArticlesController");
const CategoryModel = require("./categories/CategoryModel"), ArticleModel = require("./articles/ArticleModel"), UsersController = require("./users/UsersController"); 
const Middlewares = require("./middlewares");

app.set("view engine", "ejs");
// express session - usado para salvar dados nas sessões; session({secret: string, cookie: {maxAge: int}}) - secret (chave secreta como o JWT), cookie: {maxAge: int} - indica o tempo em milissegundos que a sessão ficará salva no cookie do usuário 
app.use(express.static("public"), express.urlencoded({extended: false}), express.json(), session({
  secret: "qualquercoisa",
  cookie: {maxAge: 1000 * 60, secure: false},
  resave: true,
  saveUninitialized: false
}));
connection.authenticate()
  .then(()=> console.log("BD conectado com sucesso!"))
  .catch((err)=> console.log("BD não conectado!", err))

// a parte que coloquei um prefixo é algo que vai somar, é um prefixo que vai aparecer antes de todas as rotas do Controller. OBS: pode deixar sem prefixo, basta colocar apenas "/" no lugar.
// app.use("/categoriasprefixo", CategoriesController);
// app.use("/", CategoriesController);
// app.use("/", ArticlesController);
app.use(CategoriesController, ArticlesController, UsersController);

//> Usando o Express Session
// Devo criar uma rota para GERAR e uma para LER os dados da sessão
// app.get("/session", (req, res)=>{
//   // Nele posso criar vários tipos personalizados de requisição e usá-los em qualquer lugar do site acessando a rota de leitura 
//   req.session.user = "Wesley";
//   req.session.idade = 26;

//   res.send("Sessão gerada!")
// });

// app.get("/leitura", (req, res)=>{
//   res.json({
//     usuario: req.session.user,
//     idade: req.session.idade
//   })
// });

app.get("/", (req, res)=>{
  const user = req.session.user;

  ArticleModel.findAll({
    include: [{model: CategoryModel}],
    // order - ordenar por alguma coluna da tabela (nesse caso "id") em ordem crescente ("ASC") ou decrescente ("DESC")
    order: [["id", "DESC"]],
    // limit - limitar o número de resultados/dados que retornarão na consulta
    limit: 4
  })
  .then(articles => {
    res.render("index", {articles, user})
  })

});


app.listen(8080, ()=> console.log("Servidor rodando na porta 8080"));