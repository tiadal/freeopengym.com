class User{
  constructor({userid, username, password, dateOfBirth, bio/*, user_type, myCourses, joinedClasses, iFollow, followers*/}){
    this.userId = userId;
    this.username = username;
    this.password = password;
    this.birthday = dateOfBirth;
    this.bio = bio;
  }

  get userId(){
    return this._userId;
  }

  set userId(userId){
    this._userId = userId;
  }

  get username(){
    return this._username;
  }

  set username(username){
    this._username = username;
  }

  get password(){
    return this._password;
  }

  set password(password){
    this._password = password;
  }

  get birthday(){
    return this._birthday;
  }

  set birthday(birthday){
    this._birthday = birthday;
  }
}

User.add = async function(slots){

}

User.destroy = async function(userId){

}

User.update = async function({userid, username, password, dateOfBirth, bio/*, user_type, myCourses, joinedClasses, iFollow, followers*/}){

}

User.retrieveAll = async function(){
  
}
