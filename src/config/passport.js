const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');

passport.use(new LocalStrategy({

  usernameField: 'email',
  passwordField: 'password'

}, async (email, password, done) => {

  //Match Email's user
  const user = await User.findOne({email: email});
  if (!user) {
    return done(null, false, { message: 'Not User Found.' });
  } else {
    //Math Password User
    const match = await user.matchPassword(password);
    if(match){
      return done(null, user);
    }else{
      return done(null, false, { message: 'Incorrect Password.' });
    }
  }
}));

//Cuando el usuario sea registrado, vamos a guardarlo en la sesion de nuestro servidor

passport.serializeUser((user, done ) => {
  done(null, user.id);
});

//Cuando el usuario empieze a navegar y este registrado passport
//hace una consulta a la bd y ver si ese id tiene autorizacion
//si es econtrado tiene los datos relacionados con el usuario

passport.deserializeUser( (id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});