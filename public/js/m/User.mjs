import {isIntegerOrIntegerString, isNonEmptyString} from "../../lib/util.mjs";
import {NoConstraintViolation, MandatoryValueConstraintViolation,
    RangeConstraintViolation, PatternConstraintViolation, UniquenessConstraintViolation,
    IntervalConstraintViolation, ReferentialIntegrityConstraintViolation}
    from "../../lib/errorTypes.mjs";

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
    const validationResult = checkUserId(userId);
    if(validationResult instanceof NoConstraintViolation){
      this._userId = userId;
    } else{
      throw validationResult;
    }
  }

  static checkUserId(userId){
    if(!userId){
      return new MandatoryValueConstraintViolation("A UserId must be provided");
    } else if(!isIntegerOrIntegerString(userId)){
      return new RangeConstraintViolation("The UserId must be an unsigned Integer");
    } else if(!parseInt(courseId < 1)){
      return new RangeConstraintViolation("The UserId must be an unsigned Integer");
    } else{
      return new NoConstraintViolation();
    }
  }

  static async checkUserIdAsId(userId){
    let validationResult = User.checkUserId(courseId);
    if(validationResult instanceof NoConstraintViolation){
      let userDoc = await db.collection("users").doc(userId.toString()).get();
      if(userDoc.exists){
        validationResult = new UniquenessConstraintViolation("There is already a User with this ID");
      } else {
        validationResult = new NoConstraintViolation();
      }
    }

    return validationResult;
  }

  get username(){
    return this._username;
  }

  set username(username){
    const validationResult = User.checkUserName(username);
    if(validationResult instanceof NoConstraintViolation){
      this._username = username;
    } else {
      throw validationResult;
    }
  }

  static checkUserName(userName){
    if(!userName || !isNonEmptyString(userName)){
      return new MandatoryValueConstraintViolation("A Username must be provided!");
    } else {
      return new NoConstraintViolation();
    }
  }

  get password(){
    return this._password;
  }

  set password(password){
    const validationResult = User.checkPassword();
    if(validationResult instanceof NoConstraintViolation){
      this._password = password;
    } else {
      throw validationResult;
    }
  }

  static checkPassword(password){
    if(!password){
      return new MandatoryValueConstraintViolation("A password must be provided");
    } else if(password.length < 6){
      return new RangeConstraintViolation("The password must at least be 6 letters long");
    } else {
      return new NoConstraintViolation();
    }
  }

  get birthday(){
    return this._birthday;
  }

  set birthday(birthday){
    if(birthday){
      this._birthday = birthday;
    }
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
