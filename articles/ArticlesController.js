const {Router} = require("express"), router = Router(), slugify = require("slugify");
const CategoryModel = require("../categories/CategoryModel"), ArticleModel = require("./ArticleModel");
const Middlewares = require("../middlewares");

router.get("/admin/articles", (req, res)=>{
  const user = req.session.user;
  ArticleModel.findAll({
    include: [{model: CategoryModel}]
  }).then((articles)=>{
    res.render("admin/articles/index", {articles, user})
  })

});

router.get("/admin/articles/new", (req, res)=>{
  const user = req.session.user;
  CategoryModel.findAll()
  .then(categories => {
    res.render("admin/articles/new", {categories, user})
  })

});

router.post("/articles/save", (req, res)=>{
  const {title, body, category} = req.body;

  ArticleModel.create({
    title,
    slug: slugify(title),
    body,
    categoryId: category
  })
  .then(()=>{
    res.redirect("/admin/articles")
  })
});

router.post("/articles/delete", (req, res)=>{
  const {id} = req.body;

  if(id != undefined){
    if(!isNaN(id)){
      ArticleModel.destroy({
        where: { id: id }
      })
      .then(()=> res.redirect("/admin/articles"))
    } else {
      res.redirect("/admin/articles")
    }
  } else {
    res.redirect("/admin/articles")
  }
});

router.get("/:slug", Middlewares.adminAuth, (req, res)=>{
  const {slug} = req.params;
  const user = req.session.user;

  ArticleModel.findOne({where: {slug}, include: [{model: CategoryModel}]})
    .then(article => {
      if(article !== undefined){
        res.render("article", {article, user})
      } else {
        res.redirect("/")
      }
    })
    .catch(err => res.redirect("/"))
  
  

});

router.get("/admin/articles/edit/:id", (req, res)=>{
  const {id} = req.params;
  const user = req.session.user;
  ArticleModel.findByPk(id)
    .then(article =>{
      if(article != undefined){
        CategoryModel.findAll().then(categories => {
          res.render("admin/articles/edit", {article: article, categories: categories, user})
        })
      } else {
        res.redirect("/");
      }
    })
    .catch(err => {
      res.redirect("/");
    })
  
});

router.post("/article/update", (req, res)=>{
  const {id, title, body, category} = req.body;

  if(!!id && !!title && !!body && !!category){
    ArticleModel.update({
      title,
      body,
      categoryId: category,
      slug: slugify(title)
    }, {
      where: {id: id}
    })
      .then(()=>{
        res.redirect("/admin/articles")
      })
      .catch(()=>{
        res.redirect("/")
      })
  }
  res.redirect("/")
});


//> Endpoint para fazer a paginação
router.get("/articles/:page", (req, res)=>{
  let {page} = req.params;
  let limit = 4, offset = 0;
  const user = req.session.user;
  
  if(isNaN(page) || page == 1){
    offset = 0;
  } else {
    offset = (parseInt(page) - 1) * limit;
  }

  ArticleModel.findAndCountAll({
    // limit - limita a quantidade de buscas/linhas da tabela que aparecerão
    limit,
    // offset - indica a quantidade de instâncias/linhas da tabela que pulará
    offset,
    order: [["id", "DESC"]],
    include: [{model: CategoryModel}]
  })
    .then(articles =>{
      let next;
      if(offset + 4 >= articles.count){
        next = false;
      } else {
        next = true;
      }

      let result = {
        page,
        next,
        articles: articles
      }
      
      // res.json(result);
      res.render("admin/articles/page", {result: result, articles: result.articles.rows, user})
    })
});

module.exports = router;