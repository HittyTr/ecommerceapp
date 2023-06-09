
import { db } from './firebase';
import {collection,getDocs,doc,getDoc, setDoc} from 'firebase/firestore';
import {Product} from '../types/types';
import {Category,SubCategory} from '../types/types';

export const handleProductAdd = (category:string,subcategory:string,productobject:Product) => {
    const productRef = doc(db, category, subcategory,'products',`${productobject.id}`);
    setDoc(productRef, productobject);
}
export const getCategoryId = async (categoryname:string) => {
    const categoryRef = collection(db, 'Categories');
    const querySnapshot = await getDocs(categoryRef);
    let categoryid = '';
    querySnapshot.forEach((doc) => {
        if(doc.data().name === categoryname){
            categoryid = doc.data().id;
        }
    }
    );
    return categoryid;
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
    let subcategories:SubCategory[] = [];
    if (docSnap.exists()) {
        subcategories = docSnap.data().subcategories;
    }
    return subcategories;
}
export const getCategoryNameBySubcategory = async (subcategory:string) => {
    const categoryRef = collection(db, 'Categories');
    const querySnapshot = await getDocs(categoryRef);
    let categoryname = '';
    querySnapshot.forEach((doc) => {
        doc.data().subcategories.forEach((subcat:SubCategory) => {
            if(subcat.name === subcategory){
                categoryname = doc.data().name;
            }
        })
    }
    );
    return categoryname;
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

export const getProduct = async (category:string,subcategory:string,productid:string) => {
    const productRef = doc(db, category,subcategory,'products',`${productid}`);
    const docSnap = await getDoc(productRef);
    let product ={} as Product



    if (docSnap.exists()) {
        product = docSnap.data() as Product;
    }
    return product;
}


export const getProductByCategory = async (categoryid:string,categoryname:string) => {
    let subcategories = await getSubCategory(categoryid);
    let products:Product[] = [];
    for (let i = 0; i < subcategories.length; i++) {
        let productsubcategory = await getProducts(categoryname,subcategories[i].name);
        products.push(...productsubcategory);
    }
    return products;
}

export const getAllProducts = async () => {
    let docRef = collection(db, 'products');
    const querySnapshot = await getDocs(docRef);
    let products:Product[] = []
    querySnapshot.forEach((doc) => {
        products.push({id:doc.data().id,title:doc.data().title,description:doc.data().description,image:doc.data().image,price:doc.data().price,category:doc.data().category,subcategory:doc.data().subcategory,stock:doc.data().stock})
    }
    );
    return products;
}

export const saveProduct = async () => {
    const productList = await getAllProducts();
    for (let i = 0; i < productList.length; i++) {
        let productRef = doc(db,'products',`${productList[i].id}`);
        await setDoc(productRef, productList[i]);
    }
}

export const filterProducts = async (search:string) => {
    let products = await getAllProducts();
    let filteredProducts = products.filter((product) => {
        return product.title.toLowerCase().includes(search.toLowerCase()) || product.description.toLowerCase().includes(search.toLowerCase());
    })
    return filteredProducts;
}