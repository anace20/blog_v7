//SOLUCION EJERCICIO modulos

var Sequelize = require("sequelize");

//DEFIFEN LA CONFIGURACION DE LA BASE
//primer argumento es el nombre de la base
var sequelize = new Sequelize("database", "usuario", "password", {
	dialect : "sqlite", //mariadb, mysql, postgres
	//ESTE PARAMETRO ES SOLO PARA sqlite
	storage : __dirname + "/database.db",
	port : 3306, //este puerto sirve tambien para mysql, para postgres
	//5432
	define : {
		timestamps : false,
		freezeTableName : true
	}
});

// COMO SE HACE EN TODOS LOS LENGUAJES
//      var archivoFinal = obtenerARchivo("ruta");

// EN NODE.JS SE HACE:
//            LA SIGUIENTE LINEA SE EJECUTA DE MANERA ASINCRONA
//           fs.obtenerArchivo(function(){});
//        COMO LA CONSULTA DE ARCHIVOS ES ASINCRONA
//             -  puedo controlarlo con CALLBACKS
//             - O CON PROMESAS

module.exports.configurar = function(callback) {
	//AQUI REALMENTE NOS CONECTAMOS
	//CUANDO INVOCAN authenticate (se EJECUTA DE MANERA ASINCRONA), esto nos regresa un objeto de javascript
	//ES UNA PROMESA
	sequelize.authenticate().complete(callback);
	console.log("modelos configurados");
};

//------------ MAPEO DE TABLA A OBJETO ----------

var Articulo = sequelize.define("Articulo", {
	id : {
		// le decimos que esta columna es la llave primaria de la tabla
		primaryKey : true,
		type : Sequelize.INTEGER
	},
	titulo : Sequelize.TEXT,
	contenido : Sequelize.TEXT,
	fecha_creacion : Sequelize.DATE
}, {
	tableName : "articulos"
});

var Usuario = sequelize.define("Usuario", {
	id : {
		type : Sequelize.INTEGER,
		primaryKey : true
	},
	nombre : Sequelize.TEXT,
	email : Sequelize.TEXT,
	password : Sequelize.TEXT
}, {
	tableName : "usuarios"
});

var Categoria = sequelize.define("Categoria", {
	id : {
		type : Sequelize.INTEGER,
		primaryKey : true
	},
	nombre : Sequelize.TEXT
}, {
	tableName : "categorias"
});

var Comentario = sequelize.define("Comentario", {
	id : {
		type : Sequelize.INTEGER,
		primaryKey : true
	},
	comentario : Sequelize.TEXT,
	autor : Sequelize.TEXT,
	fecha_creacion : Sequelize.TEXT
}, {
	tableName : "comentarios"
});

// ========================== MAPEO 1-N =================
//MAPEO 1-N ENTRE usuarios y articulos

//NOTEN QUE  Usuario y Articulo son modelos de Sequelize
Usuario.hasMany(Articulo, {
	// foreignKey es la columna que me permite relacionar
	// cada articulo con su respectivo dueno (un usuario)
	foreignKey : "usuario_id",
	//as me permite acceder a los articulos del usuario
	//haciendo usuario.articulos
	as : "articulos"
});

//============= solucion ejercicio mapeo 1-N===================
//MAPEO 1-N ENTRE ARTICULOS Y COMENTARIOS
Articulo.hasMany(Comentario, {
	foreignKey : "articulo_id",
	as : "comentarios"
});

//====Mapeo N:N=====
Articulo.hasMany(Categoria,{
	foreignKey:"articulo_id",
	as:"categorias",
	//esto es solo para n:n
	through:"categorias_articulos"
});

Categoria.hasMany(Articulo,{
	foreignKey:"categoria_id",
	as:"articulos",
	through:"categorias_articulos"
});

// HACEMOS VISIBLE EL MODELO ASOCIADO A LA TABLA
module.exports.Articulo = Articulo;
module.exports.Usuario = Usuario;
module.exports.Categoria = Categoria;
module.exports.Comentario = Comentario; 