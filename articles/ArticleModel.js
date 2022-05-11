const Sequelize = require("sequelize"), connection = require("../database/connection"), CategoryModel = require("../categories/CategoryModel");

const Article = connection.define("articles", {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false
  },
  body: {
    type: Sequelize.TEXT,
    allowNull: false
  }
});

CategoryModel.hasMany(Article); // UMA categoria TEM MUITOS artigos - RELACIONAMENTO: UM PARA MUITOS
Article.belongsTo(CategoryModel); // UM artigo PERTENCE a uma categoria - RELACIONAMENTO: UM PARA UM

// Usado para sincronizar o banco de dados, recriando a tabela toda vez que a aplicação recarrega
// Article.sync({force: true})

Article.sync({force: false});

module.exports = Article;