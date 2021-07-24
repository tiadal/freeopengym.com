import {isIntegerOrIntegerString, isNonEmptyString} from "../../lib/util.mjs";
import {NoConstraintViolation, MandatoryValueConstraintViolation,
    RangeConstraintViolation, PatternConstraintViolation, UniquenessConstraintViolation,
    IntervalConstraintViolation, ReferentialIntegrityConstraintViolation}
    from "../../lib/errorTypes.mjs";

const usertype = {
  USER: "User",
  TEACHER: "Teacher"
};

class User{
  constructor({userid, username, password, dateOfBirth, bio, user_type/*, myCourses, joinedClasses, iFollow, followers*/}){
    this.userId = userId;
    this.username = username;
    this.password = password;
    this.birthday = dateOfBirth;
    this.bio = bio;
    this.user_type = user_type;
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
    } else if(!parseInt(userId < 1)){
      return new RangeConstraintViolation("The UserId must be an unsigned Integer");
    } else{
      return new NoConstraintViolation();
    }
  }

  static async checkUserIdAsId(userId){
    let validationResult = User.checkUserId(userId);
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

  get user_type(){
    return this._user_type;
  }

  set user_type(type){
    const validationResult = User.checkUserType(type);
    if(validationResult instanceof NoConstraintViolation){
      this._user_type = type;
    } else {
      throw validationResult;
    }
  }

  static checkUserType(type){
    if(!type){
      return new MandatoryValueConstraintViolation("A Usertype must be selected");
    } else if(!(type == usertype.USER || type == usertype.TEACHER)){
      return new RangeConstraintViolation("Invalid Usertype provided");
    } else{
      return new NoConstraintViolation();
    }
  }
}

User.convert = function(user){
  let slots = {
    userId: user.userId,
    username: user.username,
    password: user.password,
    birthday: user.dateOfBirth,
    bio: user.bio,
    user_type: user.user_type
  }
  if(user.birthday){
    slots.birthday = user.birthday;
  }

  return slots
}

User.add = async function(slots){
  const userCollRef = db.collection("users"),
        userDocRef = userCollRef.doc( slots.userId.toString());
  try {
      let c = new User(slots);
      let validationResult = await User.checkUserIdAsId( c.userId);
      if(!validationResult instanceof NoConstraintViolation) throw validationResult;
      validationResult = await User.checkUserIdAsIdRef( c.userId);
      if (!validationResult instanceof NoConstraintViolation) throw validationResult;
      await userDocRef.set(User.convert( c));
  } catch (e) {
      console.error(`Error when adding user record: ${e.message}`);
      return;
  }
  console.log(`User record ${slots.userId} created`);
}

User.destroy = async function(userId){

}

User.update = async function({userid, username, password, dateOfBirth, bio/*, user_type, myUsers, joinedClasses, iFollow, followers*/}){
  const userCollRef = db.collection("users"),
  userDocRef = userCollRef.doc( userId);

  try {
    // Merge existing data with updated data
    const userDocSn = await userDocRef.withConverter(User.converter).get();
    const userData = userDocSn.data();

    let user = new User({userid, username, password, dateOfBirth, bio, user_type});

    //await userDocRef.set({userId, userName, categories, price, description}, {merge: true});
    await userDocRef.set({userId: user.userId, userName: user.username, password: user.password, dateOfBirth: user.birthday, bio: user.bio, user_type: user.user_type}, {merge: true});
 } catch (e) {
   console.error(`Error when updating user record: ${e.message}`);
   return;
 }
 console.log(`User record ${userId} updated`);
}

User.retrieveAll = async function(){
  const usersCollRef = db.collection("users");
  let usersQuerySnapshot = null;
  try {
      usersQuerySnapshot = await usersCollRef.get();
  } catch (e) {
      console.error(`Error when retrieving user record ${e}`)
      return null;
  }
  const userDocs = usersQuerySnapshot.docs,
        userRecords = userDocs.map( d => d.data());
  console.log(`${userRecords.length} user records retrieved.`);
  return userRecords;
}
