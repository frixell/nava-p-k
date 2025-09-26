const path = require('path');
const compression = require('compression');
const express = require('express');
var secure = require('ssl-express-www');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var cors = require('cors');
var cloudinary = require('cloudinary');
const fs = require('fs');



var admin = require("firebase-admin");



const app = express();

//app.use(secure);




app.use(function forceHTTPS(req, res, next) {
  var local = req.url;
  var schema = (req.headers['x-forwarded-proto'] || '').toLowerCase();
  var www = req.headers.host;
  console.log(local);
  console.log(schema);
  console.log(www);

  // if (schema !== 'https' || www.indexOf('www') < 0) {
  //   return res.redirect('https://www.navapersovkainer.com' + local);
  // }

  return next();

});


var allowedOrigins = ['http://localhost:8080/',
                      'https://www.navapersovkainer.com',
                      'http://nava-p-k.herokuapp.com',
                      'https://nava-p-k.herokuapp.com'];
app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));


// prerender.io

var prerender = require('prerender-node').set('prerenderToken', process.env.PRERENDER_TOKEN);
prerender.crawlerUserAgents = [];
prerender.crawlerUserAgents.push('googlebot');
prerender.crawlerUserAgents.push('bingbot');
prerender.crawlerUserAgents.push('yandex');
app.use(prerender);




const publicPath = path.join(__dirname, '../', 'public');

const port = process.env.PORT || 3000;


// robots.txt

app.get('/robots.txt', function (req, res) {
    res.type('text/plain');
    res.send("User-agent: *\nDisallow: /login\nAllow: /");
});



// init bd connection

// admin.initializeApp({
//   credential: admin.credential.cert({
//     projectId: process.env.FIREBASE_PROJECT_ID,
//     clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//     privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
//   }),
//   databaseURL: process.env.FIREBASE_DATABASE_URL
// });

admin.initializeApp({
  credential: admin.credential.cert({
    // projectId: process.env.FIREBASE_PROJECT_ID,
    projectId: 'navapk-af5b9',
    // clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    clientEmail: 'firebase-adminsdk-7fjih@navapk-af5b9.iam.gserviceaccount.com',
    // privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDU9GUkYCYYAeDW\n35uyynYFy/o3hMnOWTETQRLGmGNEHggATuE3HXWopyn7K5padlcaWywHB/RlSHG+\nc9W0ZQrdzDKbWG2PuL77XrWf+T4MPQcc0jmNIQZP1hOW/bxc6wkXHeKaPUqC6pvE\nC4c5o/U7PXPXgljbRczZOwF5P2c2EtvD4PeAA+GYtDsj053iEVbSPQvI3CJapicj\nYSgEYnacdlB9auWUjhPLU7d0GxxAyrOa+r+05bZrLTbITuNZeb7cUjCxjOBJgnVy\n3U/jVrAhM6TrBZAh5nMiFjiqvm5TzzUOqBQcfe5Jb/VUPyIiodf9QuJvTNU78ZHW\ne3779b4lAgMBAAECggEACCMjl0F+SyYNOaC3Qhx26I9MCyGNlY82bxoqNcD+cAym\nuR5KgFDlnVFv6vtWTVUezHDF7Kna5qDfScwC0z8WLHYATAvTue1xDMlobsm3G4Ac\nfLcywEgOBfBz9K3S7AkGIqY/ca3cYkbFN3dKTkNL3Fzjh41hSFWxN27IBmJMFxaN\nC6q8UcEG/OgT3wbdpsMeADQ7Xf9jcP7Ao4Tl6dIg4kPC4dhK0HiIgM9pLXnza6D5\nvpXV1tWR4XGFqaoJWrrh9lzeldFhM2JCLijIznxmVhxbSviIrmHh5n4q0fEIknXs\nO+t60eIZkDR6Urt8AxfHuQMVTffZdjeH7tTFKLmnmQKBgQDqLlgm4d4kKaKJbjBk\nweQwk9aHbGhnr/A9wQiv7lpOkSMJ8t3Q5z+c7l5WuzhsaZ9Zn3lFmz7/udz8z74p\n+d37FKfsAl2T7twMyoBFKySxbXP1HgmWN2xYyHWDmYkiNLbFilmHzyvGN74geY0i\nWtp6dWe583TScQdhe713zAFiqQKBgQDoy8Mi6TJ3zIxc4GurqDZFkZ1HBwqfDVbN\nUiOS7HJzZVigngHiLQc3HZMDCx0EecVRL0z906/KMOBHI5uVcHOYg16gT5tZdpZn\nY2PRXlfJInCmcGkc3DxHPXurXsMBzblR3JvBZaInbLKEw5yiahWJQO5RmViKvyjW\nlqBH/8ypHQKBgQCYSCTIvA4RZAWu6rmLe84gjLJvg95stqs57SHyDcQp3RV07bqy\nkv351cQBEGQDk7estxhMXETeVIXQ3GKjtzlTgb4kqfEiNqxfoPtCf2iv/CXwmmTP\niyDopwpL1naniLHlyS6pMt4bWrpHMePGGGCES351HEy2YAvVp3qwwTeRaQKBgQDE\noqCQU4PSl0+Uf+fSlgJJnybHQRZipMTGJ3Ru/RPrjxZejTiwEDLBBlUQRAndpvHZ\nkmepG26oDcLTtCsN/m9VytlZ9gQVfEqsx9Ifnl3uQg3/OIJA43JzBmb4qNF1K402\nrW5O3IcsX+8mn4gl1A+e4N6sxCd7At7+6zo1tsbrrQKBgQDmZBk1/6XEAQC6iN1M\nePI4L8kdPNt/mSZ4Rldn+ud+KjjN7Hs/D2BtNAzwX2qOyRU5GDvANqmjg+s2HyiJ\n/+C8Ju6XxMXV9EwGFhc5aAaOBq612JgoepHANJ4vN+QzyIS6KmTC6wCvBb1ws6qi\nFXXPf0pOs55wkcDJMiuR/G87VA==\n-----END PRIVATE KEY-----\n',
  }),
  // databaseURL: process.env.FIREBASE_DATABASE_URL
  databaseURL: 'https://navapk-af5b9.firebaseio.com'
});


// sitemap.xml

app.get('/sitemap.xml', function(req, res) {
    let urls = [];
    var root_path = 'https://nava-p-k.herokuapp.com/';
    var db = admin.database();
    var refCategories = db.ref('eventsCategories/');
    var refSubcategories = db.ref('eventsSubcategories/');
    var refEvents = db.ref('eventsItems/');
    refCategories.once("value", function(snapshotCategories) {
        if(snapshotCategories.val() !== null) {
          const categories = snapshotCategories.val();
          refSubcategories.once("value", function(snapshotSubcategories) {
            if(snapshotSubcategories.val() !== null) {
                const subcategories = snapshotSubcategories.val();
                refEvents.once("value", function(snapshotEvents) {
                if(snapshotEvents.val() !== null) {
                    const events = snapshotEvents.val();
                    for (var i in categories) {
                      let categoryId = categories[i].id;
                      let strCategory = categories[i].name;
                      while (strCategory.indexOf(' ') > -1) {
                          strCategory = strCategory.replace(' ' ,'_');
                      }
                      urls.push(strCategory);
                      for (var j in subcategories) {
                        if(subcategories[j].categories && subcategories[j].categories[categoryId]){
                          let subcategoryId = subcategories[j].id;
                          let strSubcategory = subcategories[j].name;
                          while (strSubcategory.indexOf(' ') > -1) {
                              strSubcategory = strSubcategory.replace(' ' ,'_');
                          }
                          urls.push(strCategory + '/' + strSubcategory);
                          for (var k in events) {
                            if(events[k].categories && events[k].categories[categoryId] && events[k].subcategories && events[k].subcategories[subcategoryId]){
                              let event = events[k].name;
                              while (event.indexOf(' ') > -1) {
                                  event = event.replace(' ' ,'_');
                              }
                              urls.push(strCategory + '/' + strSubcategory + '/' + event);
                            }
                            k++;
                          }
                        }
                        j++;
                      }
                      i++;
                    }
                  var priority = 0.5;
                  var freq = 'monthly';
                  var xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
                  for (var i in urls) {
                      xml += '<url>';
                      xml += '<loc>'+ root_path + urls[i] + '</loc>';
                      xml += '<changefreq>'+ freq +'</changefreq>';
                      xml += '<priority>'+ priority +'</priority>';
                      xml += '</url>';
                      i++;
                  }
                  xml += '</urlset>';
                  res.header('Content-Type', 'text/xml');
                  res.send(xml);
                }
              });
            }
          });
        }
    });   
})



//*** server side rendering -- SEO ***//

// app.get('/:category?/:subCategory?/:event?/:toomuch?', function(request, response, next) {
//     if (request.params.toomuch) {
//       next();
//     } else {
//       const filePath = path.resolve(__dirname, '../public', 'index.html');
//       let categoryOk = false;
//       if(request.params.category && request.params.category.indexOf('.') === -1 && request.params.category.indexOf('#') === -1 && request.params.category.indexOf('$') === -1 && request.params.category.indexOf('[') === -1 && request.params.category.indexOf(']') === -1){
//         categoryOk = true;
//       }
//       let subCategoryOk = false;
//       if(request.params.subCategory && request.params.subCategory.indexOf('.') === -1 && request.params.subCategory.indexOf('#') === -1 && request.params.subCategory.indexOf('$') === -1 && request.params.subCategory.indexOf('[') === -1 && request.params.subCategory.indexOf(']') === -1){
//         subCategoryOk = true;
//       }
//       let eventOk = false;
//       if(request.params.event && request.params.event.indexOf('.') === -1 && request.params.event.indexOf('#') === -1 && request.params.event.indexOf('$') === -1 && request.params.event.indexOf('[') === -1 && request.params.event.indexOf(']') === -1){
//         eventOk = true;
//       }
      

//       // console.log("cat check");
//       // console.log(categoryOk);
//       // console.log(subCategoryOk);
//       // console.log(eventOk);

//       //if (categoryOk && subCategoryOk && eventOk) {
//           let dbString = 'serverSeo/';
//           if(!request.params.category && !request.params.subCategory && !request.params.event) {
//               dbString = dbString;
//               var db = admin.database();
//                 var ref = db.ref(dbString);
//                 ref.once("value", function(snapshot) {
//                     let seo = {
//                       title: 'נאוה קיינר-פרסוב - עין הוד',
//                       description: 'נאוה קיינר-פרסוב - עין הוד',
//                       keyWords: 'נאוה קיינר-פרסוב - עין הוד'
//                     };
//                     if(snapshot.val() !== null) {
//                       seo = snapshot.val().seo;
//                     }

//                     //console.log(seo);

//                     fs.readFile(filePath, 'utf8', function (err,data) {
//                       if (err) {
//                         return console.log(err);
//                       }
//                       data = data.replace(/\$OG_TITLE/g, seo.title);
//                       data = data.replace(/\$OG_DESCRIPTION/g, seo.description);
//                       data = data.replace(/\$OG_KEYWORDS/g, seo.keyWords);
//                       data = data.replace(/\$OG_IMAGE/g, 'https://nava-p-k.herokuapp.com/images/og_image.jpg');
//                       response.send(data);
//                     }, function (errorObject) {
//                       console.log("The read failed: " + errorObject.code);
//                     });
//                 });
//           } else if (request.params.category && !request.params.subCategory && !request.params.event) {
//               if (categoryOk && !subCategoryOk && !eventOk) {
//                 dbString = dbString + String(request.params.category);
//                 var db = admin.database();
//                 var ref = db.ref(dbString);
//                 ref.once("value", function(snapshot) {
//                     let seo = {
//                       title: 'נאוה קיינר-פרסוב - עין הוד',
//                       description: 'נאוה קיינר-פרסוב - עין הוד',
//                       keyWords: 'נאוה קיינר-פרסוב - עין הוד'
//                     };
//                     if(snapshot.val() !== null) {
//                       seo = snapshot.val().seo;
//                     }

//                     //console.log(seo);

//                     fs.readFile(filePath, 'utf8', function (err,data) {
//                       if (err) {
//                         return console.log(err);
//                       }
//                       data = data.replace(/\$OG_TITLE/g, seo.title);
//                       data = data.replace(/\$OG_DESCRIPTION/g, seo.description);
//                       data = data.replace(/\$OG_KEYWORDS/g, seo.keyWords);
//                       data = data.replace(/\$OG_IMAGE/g, '/images/og_image.jpg');
//                       response.send(data);
//                     }, function (errorObject) {
//                       console.log("The read failed: " + errorObject.code);
//                     });
//                 });
//               } else {
//                 next();
//               }
//           } else if (request.params.category && request.params.subCategory && !request.params.event) {
//               if (categoryOk && subCategoryOk && !eventOk) {
//                 dbString = dbString + 'subcategories/' + String(request.params.category);
//                 var db = admin.database();
//                 var ref = db.ref(dbString);
//                 ref.once("value", function(snapshot) {
//                     let seo = {
//                       title: 'נאוה קיינר-פרסוב - עין הוד',
//                       description: 'נאוה קיינר-פרסוב - עין הוד',
//                       keyWords: 'נאוה קיינר-פרסוב - עין הוד'
//                     };
//                     if(snapshot.val() !== null) {
//                       seo = snapshot.val().seo;
//                     }

//                     //console.log(seo);

//                     fs.readFile(filePath, 'utf8', function (err,data) {
//                       if (err) {
//                         return console.log(err);
//                       }
//                       data = data.replace(/\$OG_TITLE/g, seo.title);
//                       data = data.replace(/\$OG_DESCRIPTION/g, seo.description);
//                       data = data.replace(/\$OG_KEYWORDS/g, seo.keyWords);
//                       data = data.replace(/\$OG_IMAGE/g, '/images/og_image.jpg');
//                       response.send(data);
//                     }, function (errorObject) {
//                       console.log("The read failed: " + errorObject.code);
//                     });
//                 });
//               } else {
//                 next();
//               }
//           } else {
//               if (categoryOk && subCategoryOk && eventOk) {
//                 dbString = dbString + 'events/' + String(request.params.category);
//                 var db = admin.database();
//                 var ref = db.ref(dbString);
//                 ref.once("value", function(snapshot) {
//                     let seo = {
//                       title: 'נאוה קיינר-פרסוב - עין הוד',
//                       description: 'נאוה קיינר-פרסוב - עין הוד',
//                       keyWords: 'נאוה קיינר-פרסוב - עין הוד'
//                     };
//                     if(snapshot.val() !== null) {
//                       seo = snapshot.val().seo;
//                     }

//                     //console.log(seo);

//                     fs.readFile(filePath, 'utf8', function (err,data) {
//                       if (err) {
//                         return console.log(err);
//                       }
//                       data = data.replace(/\$OG_TITLE/g, seo.title);
//                       data = data.replace(/\$OG_DESCRIPTION/g, seo.description);
//                       data = data.replace(/\$OG_KEYWORDS/g, seo.keyWords);
//                       data = data.replace(/\$OG_IMAGE/g, '/images/og_image.jpg');
//                       response.send(data);
//                     }, function (errorObject) {
//                       console.log("The read failed: " + errorObject.code);
//                     });
//                 });
//               } else {
//                 next();
//               }
//           }
          
//       //} else {
//       //    next();
//       //}
//     }
// });

//******    end ssr --- SEO     ******//




app.get('*.js', function (request, response, next) {
  if(request.headers['user-agent'].toLowerCase().indexOf('firefox') === -1) {
    request.url = request.url + '.gz';
    response.set('Content-Encoding', 'gzip');
  }
    next();
});


app.get('*.css', function (request, response, next) {
  if(request.headers['user-agent'].toLowerCase().indexOf('firefox') === -1) {
    request.url = request.url + '.gz';
    response.set('Content-Encoding', 'gzip');
    response.set('Content-Type', 'text/css');
  }
    next();
});

app.use(compression());

app.use(express.static(publicPath));


app.post("/deleteImage", bodyParser.urlencoded({ extended: true }), function(request, response) {
    if(request.body.publicid){
        cloudinary.config({ 
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
          api_key: process.env.CLOUDINARY_API_KEY, 
          api_secret: process.env.CLOUDINARY_API_SECRET
        });
        cloudinary.v2.uploader.destroy(request.body.publicid, function(error, result){console.log(result, error)});
    }
    return 'hia';
});

let transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD
    }
});

app.post("/sendEmail", bodyParser.urlencoded({ extended: true }), function(request, response) {
    if(request.body.name){
        mailOptions = {
          from: 'message@frixell.net',
          to: 'nava-p-k@gmail.com',
          subject: request.body.email,
          text: request.body.name + '\r\n' + request.body.email + '\r\n' + request.body.message
        };
        transporter.sendMail (mailOptions, function(error, info){
          if(error){
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
    }
    return 'hia';
});


app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(port, () => {
    console.log('Server is up!');
})