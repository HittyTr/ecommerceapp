import { db } from './firebase';
import {collection,getDocs,doc,getDoc, setDoc} from 'firebase/firestore';
import {Product} from '../types';
import {Category} from '../types';


export const handleProductAdd = (category:string,subcategory:string,productobject:Product) => {
    const productRef = doc(db, category, subcategory,'products',`${productobject.id}`);
    setDoc(productRef, productobject);
}

export const getCategory = async () => {
    const categoryRef = collection(db, 'Categories');
    const querySnapshot = await getDocs(categoryRef);
    let categories:Category[] = [];

    querySnapshot.forEach((doc) => {
        categories.push({id:doc.data().id,name:doc.data().name})
    }
    );
    return categories;
}

export const getSubCategory = async (category:string) => {
    const subcategoryRef = doc(db, 'Categories',`${category}`);
    const docSnap = await getDoc(subcategoryRef);
    let subcategories:Category[] = [];
    if (docSnap.exists()) {
        subcategories = docSnap.data().subcategories;
    }
    return subcategories;
}

export const getProducts = async (category:string,subcategory:string) => {
    const productRef = collection(db, category,subcategory,'products');
    const querySnapshot = await getDocs(productRef);
    let products:Product[] = [];

    querySnapshot.forEach((doc) => {
        products.push({id:doc.data().id,title:doc.data().title,description:doc.data().description,image:doc.data().image,price:doc.data().price,category:doc.data().category,subcategory:doc.data().subcategory,stock:doc.data().stock})
    }
    );
    return products;
}