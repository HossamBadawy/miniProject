var express = require('express'),
	multer = require('multer'),
	app		= express(),
	bodyParser = require('body-parser');	
	var mongoose = require('mongoose'),
	Schema= mongoose.Schema;
	var mongojs = require('mongojs');
	var db = mongojs('students',['student']);
	var db2= mongojs('links',['link']);
	var db3 = mongojs('potfolio',['porto']);
	var path = require('path');




	

	//user = require('User');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
	
	var fs= require('fs');
	
	var emailTemp;


	var photosNo=1


	app.use(function(req,res,next){
		res.locals.linksAll=null;
		next();
	});

//database esmaha porto
//database esmaha links w collection esmo link , email w link

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended:false}))
	app.use(express.static(__dirname));
	app.use(express.static(__dirname + '/View/css'));
	app.use(express.static(__dirname + '/View/css-porto'));
	app.use(express.static(__dirname + '/View/fonts'));
	app.use(express.static(__dirname + '/View/images'));
	app.use(express.static(__dirname + '/View/images2'));
	app.use(express.static(__dirname + '/View/js'));
	app.use(express.static(__dirname + '/View/node_modules'));

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './Uploads');
  },
  filename: function (req, file, callback) {
    callback(null, emailTemp );
  }
});
var storage2 =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './Uploads');
  },
  filename: function (req, file, callback) {
    callback(null, emailTemp + "-" + photosNo);
  }
});



// 	var upload = multer({
//   dest: '../Uploads'
// });

	app.get('/',function(req,res) {
		res.sendfile('index.html');

	}); 


	app.post('/register', function(req,res){
	

		
	var newStudent = {
		email : req.body.email,
		password : req.body.password,
		first_name : req.body.fname,
		last_name : req.body.lname,
		portfolio : false
		}

		var email=req.body.email;
		
		db.student.findOne({email:email },function(err,students){											

		
			if(students){
				res.redirect('register_wrong.html');
			}
			else{
				db.student.insert(newStudent, function(err, res){
					
			}
			);
				res.redirect('index_success.html');
			}
		});
			
		});



	



	app.post('/post_porto', function(req,res){
	

		
	var newPorto = {
		 fname:req.body.fname,
		 lname:req.body.lname, 
		email : emailTemp,
		link : req.body.link,
		about : req.body.about,
		quote : req.body.quote
		}

		var fname=req.body.fname;
		var lname=req.body.lname;
		var quote=req.body.quote;

		//var upload = multer({ storage : storage}).single('filee');


		db2.link.insert({"email":emailTemp, "link":newPorto.link});
		db.student.update({"email":emailTemp}, {$set:{'portfolio':true}})
		
		db3.porto.insert( newPorto , function(err,students){											
		db2.link.find({"email":emailTemp},function (err,docs){
				
				
				res.render('porto_success.html', {first_name: fname, last_name:lname, links:docs , about:newPorto.about, quote:newPorto.quote});
				
			});		
			});		
			
			
		});


	app.post('/login', function(req,res){
	

		
	var email2 = req.body.email;
	var password = req.body.password;
		emailTemp=req.body.email;
		

		db.student.findOne({email:email2 , password:password},function(err,students){

		

			if(students){
				if(students.portfolio==false){
				res.render('data_entry');


			}else {
				
				db2.link.find({"email":emailTemp},function (err,docs){
				db3.porto.findOne({"email":email2},function(err,stud){
						res.render('porto',{first_name: stud.fname, last_name:stud.lname, links:docs , about:stud.about, quote:stud.quote});	
						
				});
				});
			}
			}
			else{
				res.redirect('login_wrong.html');
			}
			
		})});
		
	app.post('/post_link',function(req,res){
		var link = {
			email:emailTemp,
			link:req.body.link
		}

		db2.link.insert(link);
			db2.link.find({"email":emailTemp},function (err,docs){
			db3.porto.findOne({"email":emailTemp},function(err,stud){
					res.render('porto',{first_name: stud.fname, last_name:stud.lname, links:docs , about:stud.about, quote:stud.quote});
				});
		});
		
	})


	app.listen(3000,function(){
		console.log('I\'m listening...');
	
	});

	app.post('/upload',function(req,res){
		var upload = multer({ storage : storage}).single('file');
    upload(req,res,function(err) {
        if(err) {
        	console.log(err);
            return res.end("Error uploading file.");
        } 
        db2.link.find({"email":emailTemp},function (err,docs){
        db3.porto.findOne({"email":emailTemp},function(err,stud){
					res.render('porto',{first_name: stud.fname, last_name:stud.lname, links:docs , about:stud.about, quote:stud.quote});
    });
         });
});

});

	app.post('/upload1',function(req,res){
		var upload = multer({ storage : storage2}).single('file1');
    
if(photosNo<=8){
    upload(req,res,function(err) {
        if(err) {
        	console.log(err);
            return res.end("Error uploading file.");
        }
        photosNo=photosNo+1;
        db2.link.find({"email":emailTemp},function (err,docs){
        db3.porto.findOne({"email":emailTemp},function(err,stud){
					res.render('porto',{first_name: stud.fname, last_name:stud.lname, link:docs , about:stud.about, quote:stud.quote});
    });
          });
});
}
else {
	photosNo=0;
	pload(req,res,function(err) {
        if(err) {
        	console.log(err);
            return res.end("Error uploading file.");
        }
        db2.link.find({"email":emailTemp},function (err,docs){
        db3.porto.findOne({"email":emailTemp},function(err,stud){
					res.render('porto',{first_name: stud.fname, last_name:stud.lname, links:docs , about:stud.about, quote:stud.quote});
    });
        });
});
}

});


    app.get('/image.png', function (err, res) {
   			
				var stats = fs.stat(path.resolve('./Uploads/' + emailTemp ), function(err,stat){
   			if (stat) {
      		res.sendFile(path.resolve('./Uploads/' + emailTemp ));
      }
      else {
				res.sendFile(path.resolve('./Uploads/avatar.png'));

			} });
   });



    app.get('/image1.png', function (err, res) {
   			
				var stats = fs.stat(path.resolve('./Uploads/' + emailTemp + "-" + 1 ), function(err,stat){
   			if (stat) {
      		res.sendFile(path.resolve('./Uploads/' + emailTemp + "-" + 1 ));
      }
      else {
				res.sendFile(path.resolve('./Uploads/ss.png'));


			} });
   });

     app.get('/image2.png', function (err, res) {
   			
				var stats = fs.stat(path.resolve('./Uploads/' + emailTemp + "-" + 2 ), function(err,stat){
   			if (stat) {
      		res.sendFile(path.resolve('./Uploads/' + emailTemp + "-" + 2 ));
      }
      else {
				res.sendFile(path.resolve('./Uploads/ss.png'));


			} });
   });

      app.get('/image3.png', function (err, res) {
   			
				var stats = fs.stat(path.resolve('./Uploads/' + emailTemp + "-" + 3 ), function(err,stat){
   			if (stat) {
      		res.sendFile(path.resolve('./Uploads/' + emailTemp + "-" + 3 ));
      }
      else {
				res.sendFile(path.resolve('./Uploads/ss.png'));


			} });
   });

       app.get('/image4.png', function (err, res) {
   			
				var stats = fs.stat(path.resolve('./Uploads/' + emailTemp + "-" + 4 ), function(err,stat){
   			if (stat) {
      		res.sendFile(path.resolve('./Uploads/' + emailTemp + "-" + 4 ));
      }
      else {
				res.sendFile(path.resolve('./Uploads/ss.png'));

			} });
   });

        app.get('/image5.png', function (err, res) {
   			
				var stats = fs.stat(path.resolve('./Uploads/' + emailTemp + "-" + 5 ), function(err,stat){
   			if (stat) {
      		res.sendFile(path.resolve('./Uploads/' + emailTemp + "-" + 5 ));
      }
      else {
				res.sendFile(path.resolve('./Uploads/ss.png'));

			} });
   });

         app.get('/image6.png', function (err, res) {
   			
				var stats = fs.stat(path.resolve('./Uploads/' + emailTemp + "-" + 6 ), function(err,stat){
   			if (stat) {
      		res.sendFile(path.resolve('./Uploads/' + emailTemp + "-" + 6 ));
      }
      else {
				res.sendFile(path.resolve('./Uploads/ss.png'));


			} });
   });

          app.get('/image7.png', function (err, res) {
   			
				var stats = fs.stat(path.resolve('./Uploads/' + emailTemp + "-" + 7 ), function(err,stat){
   			if (stat) {
      		res.sendFile(path.resolve('./Uploads/' + emailTemp + "-" + 7 ));
      }
      else {
				res.sendFile(path.resolve('./Uploads/ss.png'));

			} });
   });

		 app.get('/image8.png', function (err, res) {
		   			
						var stats = fs.stat(path.resolve('./Uploads/' + emailTemp + "-" + 8 ), function(err,stat){
		   			if (stat) {
		      		res.sendFile(path.resolve('./Uploads/' + emailTemp + "-" + 8 ));
		      }
		      else {
						res.sendFile(path.resolve('./Uploads/ss.png'));


					} });
		   });