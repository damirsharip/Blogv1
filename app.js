var bodyParser = require("body-parser")
	mongoose   = require("mongoose")
	express    = require("express")
	app		   = express()
	methodOverride = require("method-override")
	expressSanitizer = require("express-sanitizer")

mongoose.connect('mongodb://localhost:27017/restful_blog_app', { useNewUrlParser: true, useUnifiedTopology: true}); 
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))
app.use(methodOverride("_method"))
app.use(expressSanitizer())

var BlogSchema = new mongoose.Schema({
		name: String,
		image: String,
		body: String,
		created: {
			type: Date,
			default: Date.now
		}
	});

var Blog = mongoose.model("Blog", BlogSchema)

// Blog.create({
// 	name: "Damke 1 saurus",
// 	image: "https://lh3.googleusercontent.com/proxy/eK4JStaf2NfyHhscJs2PYJySGIYpCkF_iEwXl0u5lIUqByFJnLQcz9cSjKbeWRgnT3hSZQ7yC1a3Hjw8lzMssS2s5uV2fPB8yb16tlv5aU3uASaDnG_Uk7dxqt5dq8JpIZ6FVDWdv4bN",
// 	body: "Hello this is body",
// })

app.get("/", function(req,res){
		res.redirect("/blogs")
})
// index route
app.get("/blogs", function(req,res){
	Blog.find({}, function(err,blogs){
		if(err){
			console.log(err)
		}
			else {
				res.render("index", {blogs: blogs})
			}
	})
})
// new ROUTE
app.get("/blogs/new", function(req,res){
	res.render("new")
})
// Create route
app.post("/blogs", function(req,res){
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render("new")
		} else {
				res.redirect("/blogs")
			}
	});
});			

// SHOW ROUTE 
app.get("/blogs/:id", function(req,res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("show", {blog: foundBlog})
			}
	});
})

// EDIT ROUTE
app.get("/blogs/:id/edit", function(req,res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("edit", {blog: foundBlog})
		}
	})
})

// update route 
app.put("/blogs/:id", function(req,res){
	req.body.blog.body = req.sanitize(req.body.blog.body)
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, UpdateBlog){
		if(err){
			res.redirect("/blogs")
		} else {
			res.redirect("/blogs/" + req.params.id)
		}
	})
})

// delete route
app.delete("/blogs/:id", function(req,res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs")
		} else {
			res.redirect("/blogs")
		}
	})
})

app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("The YelpCamp server has started!!!");
})