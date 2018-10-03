module.exports = {
  getHandle: function(username) {
    let userArray = username.split("@");
    username = userArray[0];
    return username;
  }
};
