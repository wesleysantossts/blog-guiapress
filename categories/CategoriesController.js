const {Router} = require("express"), router = Router(), slugify = require("slugify");

const CategoryModel = require("../categories/CategoryModel.js"), ArticleModel = require("../articles/ArticleModel");

router.get("/admin/categories", (req, res)=>{
  const user = req.session.user;
  CategoryModel.findAll()
  .then(categories => {
    res.render("admin/categories/categories", {categories: categories, user})
  })  
});

router.get("/admin/categories/new", (req, res)=>{
  const user = req.session.user;
  res.render("admin/categories/new", {user})
});

router.post("/categories/save", (req, res)=>{
  const {title} = req.body;

  if(title === undefined || title === null){
    res.status(400);
    res.json({error: "Titulo retornou undefined."})
    res.redirect("admin/categories/new");
  } else {
    
    CategoryModel.create({
      title,
      slug: slugify(title)
    })
    .then(()=>{
      console.log("Categoria criada com sucesso!");      
      res.redirect("/admin/categories");
    })
    .catch((error)=> console.log("Erro de criação do Model de Categoria.", error))
  }

});

router.post("/categories/delete", (req, res)=>{
  const {id} = req.body;

  if(id !== undefined){
    if(!isNaN(id)){
      CategoryModel.destroy({
        where: {
          id: id
        }
      })
      .then(()=> res.redirect("/admin/categories"))
    } else {
      res.redirect("/admin/categories")
    }
  } else {
    res.redirect("/admin/categories")
  }
});

router.get("/admin/categories/edit/:id", (req, res)=>{
  const {id} = req.params;
  const user = req.session.user;

  if(isNaN(id)){
    res.redirect("/admin/categories")
  }

  CategoryModel.findByPk(id)
  .then(category => {

    if(category != undefined){
      res.render("admin/categories/edit", {category: category, user})
    } else {
      res.redirect("/admin/categories")
    }
  })
  .catch(err => res.redirect("/admin/categories"))
});

router.post("/categories/update", (req, res)=>{
  const {id, title} = req.body;

  // CategoryModel.update({title: title, slug: slugify(title)}, {where: {id: id}})
  CategoryModel.update({title, slug: slugify(title)}, {where: {id}})
  .then(()=> res.redirect("/admin/categories"))
});

router.get("/category/:slug", (req, res)=>{
  const {slug} = req.params;
  const user = req.session.user;
  CategoryModel.findOne({
    where: {slug: slug},
    include: [{model: ArticleModel}]
  })
    .then(category => {
      if(category !== undefined){
        CategoryModel.findAll()
          .then(categories => {
            res.render("category", {articles: category.articles, categories: categories, category, user});
          })
      } else {
        res.redirect("/");
      }
    })
    .catch((err)=> res.redirect("/"))
});

module.exports = router;