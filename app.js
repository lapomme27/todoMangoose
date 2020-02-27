const express = require('express');
const bodyParser = require ('body-parser');

//import du module mongoose
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;





//connexion à la bd Mongo DB
mongoose.connect('mongodb://localhost/local');

//définition du schéma (équivalent de la table SQL) pour les livres
const TodoSchema = new mongoose.Schema(
	{
		_id:mongoose.Types.ObjectId,
		taskName: String,
		done: Boolean,
		categorie: String,
		createdDate: Date
	}
);

//création du modèle à partir du schéma
const TodoModel = new mongoose.model('todos', TodoSchema);

const app = express();






//configuration de l'application
app.set('views', './templates');
app.set('view engine', 'pug');

//Mise à disposition des ressources publiques
app.use(express.static('./public'));

//récupération des données postées
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());




app.get('/todo/AllTodo', (req,res)=>{
	TodoModel.find({}, (err,data)=>{
		console.log(data);
		res.render('AllTodo',{data:data});
	})
})

app.get('/todo', (req,res)=>{
	res.render('todoList');
})

app.post('/todo/insert', (req,res)=>{
	const Todo = new TodoModel(
		{
			_id:null,
			taskName: req.body.todo,
			done: req.body.done,
			categorie: req.body.categorie,
			createdDate: new Date()
		})
		Todo.save((err, result)=>{
			res.redirect('/todo');
		})
})	

app.get('/todo/delete/:id', (req,res)=>{
	let id= req.params.id;
	let search =  { _id: ObjectId(req.params.id) }

	TodoModel.deleteOne(search, function (err,result) {
		if (err){
			console.log('sa mach pa');
		}else{
		console.log(result);
		res.redirect('/todo/AllTodo');
		}
	});

})




app.listen(3000,()=>{
	console.log('server started');
});

function getSearchById(req) {
	let search;
	if (req.params.id.length > 20) {
		search = { _id: ObjectId(req.params.id) };
	}
	else {
		search = { _id: parseInt(req.params.id) };
	}
	return search;
}

