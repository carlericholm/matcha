var con = require('../config/database');
var hash = require('password-hash');


con.query('USE `matcha`', function (err) { if (err) throw err });

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function makefirstname() {
  var text = "";
  var consonne = "bcdfghjklmnpqrstvwxz";
  var voyelle = "aeiouy";

  for (var i = 0; i < 8; i++)
  {
  	if (i == 0)
    {
      text += consonne.charAt(Math.floor(Math.random() * consonne.length));
      text = text.toUpperCase();
    }
    else if (i % 2 == 1)
    	text += voyelle.charAt(Math.floor(Math.random() * voyelle.length));
    else
      text += consonne.charAt(Math.floor(Math.random() * consonne.length));
  }
  return text;
}

function makename() {
  var text = "";
  var consonne = "bcdfghjklmnpqrstvwxz";
  var voyelle = "aeiouy";

  for (var i = 0; i < 8; i++)
  {
  	if (i == 0)
    {
      text += consonne.charAt(Math.floor(Math.random() * consonne.length));
      text = text.toUpperCase();
    }
    else if (i % 2 == 0)
    	text += voyelle.charAt(Math.floor(Math.random() * voyelle.length));
    else
      text += consonne.charAt(Math.floor(Math.random() * consonne.length));
  }
  return text;
}

function maketag() {
  var tagPanel = ['Sport', 'Party', 'Sexe', 'Vacances', 'Code',
  'Bouillant', 'Amour', 'Animaux', 'Musique', 'Pythagore',
  'Voiture', 'Canard', 'Bateau', 'Peinture', 'Antoine', 'Boat', 'RoofTop', 'SwimmingPool'];

  var tag = tagPanel[Math.floor(Math.random() * tagPanel.length)];
  return tag;
}

con.query('SELECT login FROM users where login = ?', ['FakeUser42'], function (err, result) { if (err) throw err
  if (result.length == 0) {

    var i = 1;
    while (i < 600) {
      var login = 'FakeUser' + i;
      name = makename();
      firstname = makefirstname();
      email = 'fakeuser' + i + '@gmail.com';
      password = 'fakemdp';
      cle = 'Valid' + i;
      active = 1;
      age = getRandomInt(60) + 18;
      quelSexe = getRandomInt(2);
      quelleOrientation = getRandomInt(3);
      bio = "J'aime le Sport, le Sexe, les Vacances, les Party et le Code" + i;
      latitude = getRandomInt(90);
      longitude = getRandomInt(90);
          // trueLocation = 'La true location du FakeUser' + i;
          // fakeLocation = 'La fake location du FakeUser' + i;
          // showFakeLocation = 0;
      		// score = 5 * getRandomInt(200);


         if (quelSexe == 0)
          sexe = 'Masculin';
        else
          sexe = 'Feminin';


        if (quelleOrientation == 0)
         orientation = 'Héterosexuel';
       else if (quelleOrientation == 1)
         orientation = 'Bisexuel';
       else
         orientation = 'Homosexuel';

       if (i % 2 == 0){
        var img0 = 'seed/img0' + (getRandomInt(8) + 1) + '.png';
        img1 = 'seed/img0' + (getRandomInt(8) + 1) + '.png';
        img2 = 'seed/img0' + (getRandomInt(8) + 1) + '.png';
        img3 = 'seed/img0' + (getRandomInt(8) + 1) + '.png';
        img4 = 'seed/img0' + (getRandomInt(8) + 1) + '.png';
      }
      else {
        var img0 = 'seed/img' + (getRandomInt(9) + 10) + '.png';
        img1 = 'seed/img' + (getRandomInt(9) + 10) + '.png';
        img2 = 'seed/img' + (getRandomInt(9) + 10) + '.png';
        img3 = 'seed/img' + (getRandomInt(9) + 10) + '.png';
        img4 = 'seed/img' + (getRandomInt(9) + 10) + '.png';
      }



      sql = 'INSERT INTO `users` (`login`, `name`, `firstname`, `email`, `password`, `cle`, `active`, `age`, `sexe`, `orientation`, `bio`, `latitude`, `longitude`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      con.query(sql, [login, name, firstname, email, hash.generate(password), cle, active, age, sexe, orientation, bio, latitude, longitude], function (err, result) { if (err) throw err });

      sql = 'INSERT INTO `pics` (login, img0, img1, img2, img3, img4) VALUES (?,?,?,?,?,?)';
      con.query(sql, [login, img0, img1, img2, img3, img4], function (err, result) { if (err) throw err });


      for (var compt = 0; compt < 3; compt++){
        sql = 'INSERT INTO `tags` (login, tag) VALUES (?,?)'
        con.query(sql, [login, maketag()], function (err, result) { if (err) throw err });
      }
      i++;
    }
  }
  sql = 'INSERT INTO `users` (`login`, `name`, `firstname`, `email`, `password`, `cle`, `active`, `age`, `sexe`, `orientation`, `bio`, `latitude`, `longitude`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  con.query(sql, ["admin", "admin", "admin", "admin@admin.com", hash.generate("admin"), 1, 1, 25, "", "", "", 0, 0], function (err, result) { if (err) throw err });
});
