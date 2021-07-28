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
  constructor({userId, username, password, dateOfBirth, bio, user_type, myCourses, joinedClasses, iFollow, followers}){
    this.userId = userId;
    this.username = username;
    this.password = password;
    this.birthday = dateOfBirth;
    this.bio = bio;
    this.user_type = user_type;

    if(myCourses){
      this.myCourses = myCourses;
    }

    if(joinedClasses){
      this.joinedClasses = joinedClasses;
    }

    if(iFollow){
      this.iFollow = iFollow;
    }

    if(followers){
      this.followers = followers;
    }
  }

  get userId(){
    return this._userId;
  }

  set userId(userId){
    const validationResult = User.checkUserId(userId);
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
    } else if(parseInt(userId) < 1){
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
    const validationResult = User.checkPassword(password);
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
      const validationResult = User.checkBirthday(birthday);
      this._birthday = birthday;
      console.log(this._birthday);
    }
  }

  static checkBirthday(date){
    if(!date){
      // optional
      return new NoConstraintViolation();
    }

    let strDate = null;
    if(date instanceof Date){
      // convert to string form for ease of computation
      strDate = date.getFullYear() + "-" +
        (date.getMonth() + 1) + "-" +
        date.getDate();
    } else if(typeof(date) == "string"){
      if(!isNonEmptyString(date)){
        // Given as string and empty
        return new MandatoryValueConstraintViolation("A Release Date must be provided");
      }
      strDate = date;
    } else{
      // Wrong type given
      return new RangeConstraintViolation("Wrong type given as Date");
    }

    // check if in correct format for further validation?
    if((strDate.match(/-/g) || []).length != 2){
      return new RangeConstraintViolation("Expected format as YYY-MM-DD");
    }

    const tmpDate = new Date(strDate);
    strDate = tmpDate.getFullYear() + "-" + (tmpDate.getMonth() + 1) + "-" + tmpDate.getDate();

    let tmp = strDate.split('-');
    let ymd = [];
    let mon31day = [1, 3, 5, 7, 8, 10, 12]; // Months with 31 days

    if(tmp.length === 3){
      if(!(isIntegerOrIntegerString(tmp[0]) &&
        isIntegerOrIntegerString(tmp[1]) &&
        isIntegerOrIntegerString(tmp[2])))
      {
        // Could not extract date numbers
        return new RangeConstraintViolation("Expected format as YYYY-MM-DD");
      }
      ymd = [parseInt(tmp[0]), parseInt(tmp[1]), parseInt(tmp[2])];
      // Filter out dates < 1895-12-28
      if(ymd[0] < 1895){
        return new IntervalConstraintViolation("The release date must be greater then 1895-12-28");
      } else if(ymd[0] == 1895 && ymd[1] < 12){
        return new IntervalConstraintViolation("The release date must be greater then 1895-12-28");
      } else if(ymd[0] == 1895 && ymd[1] == 12 && ymd[2] < 28){
        return new IntervalConstraintViolation("The release date must be greater then 1895-12-28");
      }

      // Day range check
      if(typeof(mon31day.find(m => m === ymd[1])) !== 'undefined'){
        if(ymd[2] > 31 || ymd[2] < 1){
          return new IntervalConstraintViolation("This Date does not exist");
        }
      } else{
        if(ymd[2] > 30 || ymd[2] < 1){
          return new IntervalConstraintViolation("This Date does not exist");
        }
      }

      // Month range check
      if(ymd[1] < 1 || ymd[1] > 12){
        return new IntervalConstraintViolation("This Date does not exist");
      }

      /*
       * intercalary year
       * Each 4 years is an intercalary year.
       * If year % 100 is 0 then it is no intercalary year
       * except year % 100 && year % 400 is true
       *
       * https://klexikon.zum.de/wiki/Schaltjahr
       */
      let schalt = !(ymd[0] % 4) && ((ymd[0] % 100) || !(ymd[0] % 400));

      // Range test for days
      if(ymd[2] < 1 || ymd[2] > 31){
        return new IntervalConstraintViolation("A day must be given in the range 1 - 31");

      // Range test for months
      } else if(ymd[1] < 0 || ymd[1] > 12){
        return new IntervalConstraintViolation("Months range from 1 to 12");

      // intercalary year specials for february
      } else if(schalt){
        if(ymd[1] == 2 && ymd[2] > 29){
          return new IntervalConstraintViolation("February cannot have more then 29 days");
        }
      } else if(!schalt){
        if(ymd[1] == 2 && ymd[2] > 28){
          return new IntervalConstraintViolation("Seems this is not an intercalary year");
        }
      }
    } else{
      return new RangeConstraintViolation("Expected format as YYYY-MM-DD");
    }

    return new NoConstraintViolation();
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
    } else if(!usertype[type]){
      return new RangeConstraintViolation("Invalid Usertype provided");
    } else{
      return new NoConstraintViolation();
    }
  }

  get myCourses(){
    return this._myCourses;
  }

  set myCourses(courses){
    this._myCourses = [];
    if(Array.isArray(courses)){
      for(const i of courses){
        this.addMyCourse(i);
      }
    }
  }

  addMyCourse(course){
    const validationResult = Course.checkCourseId(course.courseId);
    if(validationResult instanceof NoConstraintViolation){
      this._myCourses.push(course);
    } else {
      throw validationResult;
    }
  }

  get joinedClasses(){
    return this._joinedClasses;
  }

  set joinedClasses(classes){
    this._joinedClasses = [];
    if(Array.isArray(classes)){
      for(const i of classes){
        this.addJoinedClass(i);
      }
    }
  }

  addJoinedClass(joinedClass){
    const validationResult = Class.checkClassId(joinedClass.classId);
    if(validationResult instanceof NoConstraintViolation){
      this._joinedClass.push(joinedClass);
    } else {
      throw validationResult;
    }
  }

  get iFollow(){
    return this._iFollow;
  }

  set iFollow(follow){
    this._iFollow = [];
    if(Array.isArray(follow)){
      for(const i of follow){
        this.addFollow(i);
      }
    }
  }

  addFollow(follow){
    const validationResult = User.checkUserId(follow.userId);
    if(validationResult instanceof NoConstraintViolation){
      this._iFollow.push(follow);
    } else {
      throw validationResult;
    }
  }

  get followers(){
    return this._followers;
  }



  set followers(followers){
    this._followers = [];
    if(Array.isArray(followers)){
      for(const i of followers){
        this.addFollower(i);
      }
    }
  }

  addFollower(follower){
    const validationResult = User.checkUserId(follower.userId);
    if(validationResult instanceof NoConstraintViolation){
      this._followers.push(follower);
    } else {
      throw validationResult;
    }
  }
}

User.convert = function(user){
  let slots = {
    userId: user.userId,
    username: user.username,
    password: user.password,
    user_type: user.user_type
  }
  if(user.birthday){
    slots.birthday = user.birthday;
  }
  if(user.bio){
    slots.bio = user.bio;
  }

  return slots
}

User.converter = {
    toFirestore: function (user) {
      let slots = {
        userId: user.userId,
        username: user.username,
        password: user.password,
        user_type: user.user_type,
        myCourses: user.myCourses,
        joinedClasses: user.joinedClasses,
        iFollow: user.iFollow,
        followers: user.followers
      }
      if(user.birthday){
        slots.birthday = user.birthday;
      }
      if(user.bio){
        slots.bio = user.bio;
      }
        const data = {
            userId: slots.userId,
            username: slots.username,
            password: slots.password,
            dateOfBirth: slots.birthday,
            bio: slots.bio,
            user_type: slots.user_type,
            myCourses: slots.myCourses,
            joinedClasses: slots.joinedClasses,
            ifollow: slots.iFollow,
            followers: slots.followers
        };

        return data;
    },
    fromFirestore: function (snapshot, options) {
        const data = snapshot.data( options);
        return new User( data);
    },
};

User.add = async function(slots){
  const userCollRef = db.collection("users"),
        userDocRef = userCollRef.doc( slots.userId.toString());
  try {
      let c = new User(slots);
      let validationResult = await User.checkUserIdAsId( c.userId);
      if(!validationResult instanceof NoConstraintViolation) throw validationResult;
      //validationResult = await User.checkUserIdAsIdRef( c.userId);
      //if (!validationResult instanceof NoConstraintViolation) throw validationResult;
      await userDocRef.set(User.convert( c));
  } catch (e) {
      console.error(`Error when adding user record: ${e.message}`);
      return;
  }
  console.log(`User record ${slots.userId} created`);
}

User.destroy = async function(userId){
  try{
    console.log(userId);
      await db.collection("users").doc(userId.toString()).delete();
      console.log(`User record "${userId}" deleted!`);
  } catch(e){
      console.log("Error deleting class with id " + classId + ": " + e);
  }
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

export {User, usertype};
