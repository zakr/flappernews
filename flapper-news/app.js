
/**
 * Module dependencies.
 */

 // Mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/news');
require('./models/Posts');
require('./models/Comments');

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// ROUTES
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

app.get('/posts', function(req, res, next){
	Post.find(function(err, posts){
		if(err){
			return next(err);
		}
		res.json(posts);
	});
});

app.post('/posts', function(req, res, next){
	var post = new Post(req.body);
	post.save(function(err, post){
		if(err){
			return next(err);
		}
		res.json(post);
	});
});

app.param('post', function(req, res, next, id){
	var query = Post.findById(id);
	query.exec(function(err, post){
		if(err){
			return next(err);
		}
		if(!post){
			return next(new Error("Can't Find Post"));
		}
		req.post = post;
		return next();
	})
});

app.get('/posts/:post', function(req, res){
	req.post.populate('comments', function(err, post){
		res.json(req.post);
	});
});

app.put('/posts/:post/upvote', function(req, res, next){
	req.post.upvote(function(err, post){
		if(err){
			return next(err);
		}
		res.json(post);
	});
});

app.put('/posts/:post/downvote', function(req, res, next){
	req.post.downvote(function(err, post){
		if(err){
			return next(err);
		}
		res.json(post);
	});
});

app.get('/posts/:post/comments', function(req, res, next){
	Comment.find(function(err, comments){
		if(err){
			return next(err);
		}
		res.json(comments);
	});
});

app.post('/posts/:post/comments', function(req, res, next){
	var comment = new Comment(req.body);
	comment.post = req.post;
	comment.save(function(err, comment){
		if(err){
			return next(err);
		}
		req.post.comments.push(comment);
		req.post.save(function(err, post){
			if(err){
				return next(err);
			}
			res.json(comment);
		});
	});
});

app.param('comment', function(req, res, next, id){
	var query = Comment.findById(id);
	query.exec(function(err, comment){
		if(err){
			return next(err);
		}
		if(!comment){
			return next(new Error("Can't Find Comment"));
		}
		req.comment = comment;
		return next();
	})
});

app.get('/posts/:post/comments/:comment', function(req, res){
	res.json(req.comment);
});

app.put('/posts/:post/comments/:comment/upvote', function(req, res, next){
	req.comment.upvote(function(err, comment){
		if(err){
			return next(err);
		}
		res.json(comment);
	});
});

app.put('/posts/:post/comments/:comment/downvote', function(req, res, next){
	req.comment.downvote(function(err, comment){
		if(err){
			return next(err);
		}
		res.json(comment);
	});
});