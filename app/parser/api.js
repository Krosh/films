module.exports = function(){
   const Film = require('./films')
   this.film = new Film();

    const User = require('./user')
    this.user = new User();
}
