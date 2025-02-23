// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { FieldPath, addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, setDoc, where } from "firebase/firestore";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import {_} from 'svelte-i18n';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


//important: deze mogen hier niet zo staan en moeten versleuteld worden
const firebaseConfig = {
  apiKey: "AIzaSyAp3UikwGG9dLl9oLgfHZCN7YzQ6fYFqjg",
  authDomain: "vitosenegal-1d0bd.firebaseapp.com",
  projectId: "vitosenegal-1d0bd",
  storageBucket: "vitosenegal-1d0bd.appspot.com",
  messagingSenderId: "384833192651",
  appId: "1:384833192651:web:e8446feaac0f898b3f914e",
  measurementId: "G-MKTCEF0F0Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
auth.languageCode = 'nl';

export const LoginUser = async (/** @type {string} */ email, /** @type {string} */ password) => {
  return await signInWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
    var favoriete = await GetFavoriteFromUser(userCredential.user.uid);
    localStorage.setItem("favoriete", JSON.stringify(favoriete));
    var crops = await GetCropsFromUser(userCredential.user.uid);
    localStorage.setItem("crops", JSON.stringify(crops));
    return true;
  }).catch((error) => {
    alert($_("user or password incorrect"));
    return false;
  });
}

export const Getuser = async () => {
  const user = auth.currentUser;
  if (user) {
    return user;
  } else {
    return null;
  }
}

export const LogoutUser = async () => {
  return await signOut(auth).then(() => {
    localStorage.setItem("favoriete",JSON.stringify([]));
    localStorage.setItem("crops",JSON.stringify([]));
    return true;
  }).catch((error) => {
    return false;
  });
}

export const RegisterUser = async (/** @type {string} */ email, /** @type {string} */ password) => {
  return await createUserWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
    await setDoc(doc(db, "userInfo",userCredential.user.uid),{admin: false, email: email});
    await addDoc(collection(db, "userInfo",userCredential.user.uid, "favorite"),{name: "Dakar"});
    localStorage.setItem("favoriete", JSON.stringify(["Dakar"]));
    await addDoc(collection(db, "userInfo",userCredential.user.uid, "crops"),{name: "Millet"});
    localStorage.setItem("crops", JSON.stringify(["Millet"]));
    return userCredential.user;
  }).catch((error) => {
    alert($_("somthing went wrong, try again later"));
    return false;
  });
}

export const DeleteUser = async (user) => {
  await user.delete().then(() => {
    return true;
  }).catch((error) => {
    return false;
  });
}


export const ForgotPassword = async (/** @type {string} */ email) => {
  return sendPasswordResetEmail(auth, email).then(() => {
    alert($_('reset password email sent'));
    return true;
  }).catch((error) => {
    return false;
  });
}

export const GetFavoriteFromUser = async (/** @type {string} */ userId) => {
  const dataUser = await getDocs(collection(db,"userInfo", userId, "favorite"))
  var userFavourite = [];
  dataUser.forEach((doc) => {
    userFavourite.push(doc.data().name);
  });
  return userFavourite;
}

export const GetCropsFromUser = async (/** @type {string} */ userId) => {
  const dataUser = await getDocs(collection(db,"userInfo", userId, "crops"))
  var userCrops = [];
  dataUser.forEach((doc) => {
    userCrops.push(doc.data().name);
  });
  return userCrops;
}

export const GetCity = async () => {
  const data = await getDocs(collection(db, "cities"));
  var cities = [];
  data.forEach((doc) => {
    cities.push(doc.data().name);
  }); 
  return cities;
}

export const GetAllCrops = async () => {
  const data = await getDocs(collection(db, "allCrops"));
  var allCrops = [];
  data.forEach((doc) => {
    allCrops.push(doc.data().name);
  }); 
  return allCrops;
}

export const IsCityFromUserFavoriet = async (/** @type {string} */ userId, city) => {
  const data = await getDocs(collection(db, "userInfo",userId,"favorite"));
  data.forEach((doc) => {
    if(doc.data().name == city){
      return true;
    }
  });
  return false;
}

export const DoesUserGrowCrop = async (/** @type {string} */ userId, crop) => {
  const data = await getDocs(collection(db, "userInfo",userId,"crops"));
  data.forEach((doc) => {
    if(doc.data().name == crop){
      return true;
    }
  });
  return false;
}

export const addCityToFavorietUser = async (UserId,city) => {
  try{
    await addDoc(collection(db, "userInfo",UserId,"favorite"), { name: ""+city });
  }
  catch(e){}
}

export const addCropForUser = async (UserId,crop) => {
  try{
    await addDoc(collection(db, "userInfo",UserId,"crops"), { name: ""+crop });
  }
  catch(e){}
}

export const removeFromFavorieteUser = async (UserId,city) => {
  const data = await getDocs(collection(db, "userInfo",UserId,"favorite"));
  var id;
  data.forEach((doc) => {
    if(doc.data().name == city){
      id = doc.id;
    }
  });
  try{
    if(id != null){
      await deleteDoc(doc(db, "userInfo",UserId,"favorite",id));
    }   
  }
  catch(e){

  }
}

export const removeCropForUser = async (UserId,crop) => {
  const data = await getDocs(collection(db, "userInfo",UserId,"crops"));
  var id;
  data.forEach((doc) => {
    if(doc.data().name == crop){
      id = doc.id;
    }
  });
  try{
    if(id != null){
      await deleteDoc(doc(db, "userInfo",UserId,"crops",id));
    }   
  }
  catch(e){

  }
}

export const IsUserAdmin = async () => {
  const user = auth.currentUser;
  if (user) {
    const data = await getDoc(doc(db, "userInfo", user.uid));
    return data.data().admin;
  } else {
    return false;
  }
}

export const GetAllUsers = async () => {
  const data = await getDocs(collection(db, "userInfo"));
  var users = [];
  data.forEach((doc) => {
    users.push({"uid":doc.id,"userData":doc.data()});
  });
  return users;
}

export const SetUserAdmin = async (user, admin) => {
  await setDoc(doc(db, "userInfo", user.uid), { admin: admin, email: user.userData.email });
}

export const getNewsForCity = async (city) => {
  const data = await getDocs(collection(db, "news", city,"newsElements"));
  var news = [];
  data.forEach((doc) => {
    var element = doc.data();
    element.id = doc.id;
    news.push(element);
  });
  return news;
}

export const addNewsForCity = async (city, news) => {
  await addDoc(collection(db, "news", city,"newsElements"), news);
}

export const uploadNewsAndFoto = async(imageData, imageName, news) => {
  const metadata = {
    contentType: 'image/jpeg',
  };
  let refStorage = ref(storage, 'newsImages/' + imageName);
  await uploadBytes(refStorage, imageData, metadata);
  news.img = 'newsImages/' + imageName;
  await addNewsForCity(news.location, news);
}

export const getNewsImage = async (imageName) => {
  const url = await getDownloadURL(ref(storage, imageName));
  return url;
}

export const SetNewCity = async (city) => {
  await addDoc(collection(db, "cities"), { name: city });
}

export const SetNewCrop = async (crop) => {
  await addDoc(collection(db, "allCrops"), { name: crop });
}

export const RemoveCityFB = async (city) => {
  const data = await getDocs(collection(db, "cities"));
  var id;
  data.forEach((doc) => {
    if(doc.data().name == city){
      id = doc.id;
    }
  });
  try{
    if(id != null){
      await deleteDoc(doc(db, "cities",id));
      const userData = await getDocs(collection(db, "userInfo"));
      userData.forEach(async (item) => {
        const userId = item.id;
        const favoriteData = await getDocs(collection(db, "userInfo", userId, "favorite"));
        favoriteData.forEach(async (favoriteDoc) => {
          if (favoriteDoc.data().name === city) {
            await deleteDoc(doc(db, "userInfo", userId, "favorite", favoriteDoc.id));
          }
        });
      });
    }   
  }
  catch(e){
  }
}

export const deleteCropFB = async (crop) => {
  const data = await getDocs(collection(db, "allCrops"));
  var id;
  data.forEach((doc) => {
    if(doc.data().name == crop){
      id = doc.id;
    }
  });
  try{
    if(id != null){
      await deleteDoc(doc(db, "allCrops",id));
      const userData = await getDocs(collection(db, "userInfo"));
      userData.forEach(async (item) => {
        const userId = item.id;
        const cropData = await getDocs(collection(db, "userInfo", userId, "crops"));
        cropData.forEach(async (favoriteDoc) => {
          if (cropDoc.data().name === crop) {
            await deleteDoc(doc(db, "userInfo", userId, "crops", cropDoc.id));
          }
        });
      });
    }   
  }
  catch(e){
  }
}

export const UpdateNews = async (news) => {
  try{
    if(news.id != null){
      await setDoc(doc(db, "news", news.location,"newsElements",news.id), news);
    }   
  }
  catch(e){
  }
}

export const RemoveNews = async (news) => {
  try{
    if(news.id != null){
      await deleteDoc(doc(db, "news", news.location,"newsElements",news.id));
      var storageRef = ref(storage,news.img);
      await deleteObject(storageRef);
    }   
  }
  catch(e){
    alert($_("something went wrong, try again later"));
    await addNewsForCity(news.location, news);
  }
}