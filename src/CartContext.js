import React, { createContext, useState , useEffect  } from 'react';

import products from './global/constants/products';
import { SignInContext } from './contexts/authContext';
import {auth, db } from './../firebase';

// import { getFirestore,addDoc, collection,  setDoc, getDoc,getDocs, doc } from "firebase/firestore";
import { collection, where, getDocs, doc, setDoc, addDoc,  } from "firebase/firestore";

import { useContext } from 'react';


export const CartContext = createContext();

export function CartProvider(props) {
  const [items, setItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const { user, signedIn } = useContext(SignInContext);

 
  
  function removeItemFromCart(id) {
    setItems((prevItems) => {
      return prevItems.filter((item) => item.id !== id);
    });
  }

  useEffect(() => {
    // Update total amount when items array changes
    setTotalAmount(getCartSubTotal());
  }, [items]);

  useEffect(() => {
    // Update total amount when items array changes
    setTotalAmount(getCartSubTotal());
  }, [items]);



  function addItemToCart(id) {
    const product = products.find((item) => item.id === id);
    setItems((prevItems) => {
      const item = prevItems.find((item) => item.id === id);
      if (!item) {
        const newItem = {
          id,
          qty: 1,
          product,
        };
        console.log('Item added to cart:', newItem);
        return [...prevItems, newItem];
      } else {
        const newItems = prevItems.map((item) => {
          if (item.id === id) {
            item.qty++;
          }
          return item;
        });
        console.log('Item quantity updated in cart:', item);
        return newItems;
      }
    });
  }


  function listCartItemsByIds(ids) {
    if (!ids) {
      return [];
    }
    const cartItems = items.reduce((acc, item) => {
      // if (ids.includes(item.id)) {
        acc.push(item);
      // }
      return acc;
    }, []);
    return cartItems;
  }
  
  
  function incrementItemQty(id) {
    setItems(prevItems =>
      prevItems.map(item => {
        if (item.id === id) {
          return {
            ...item,
            qty: item.qty + 1,
          };
        }
        return item;
      })
    );
  }

  function decrementItemQty(id) {
    setItems(prevItems =>
      prevItems.map(item => {
        if (item.id === id) {
          return {
            ...item,
            qty: Math.max(item.qty - 1, 0),
          };
        }
        return item;
      })
    );
  }

  function removeItemFromCart(id) {
    setItems(prevItems =>
      prevItems.filter(item => item.id !== id)
    );
  }

  function getCartSubTotal() {
    // Calculate total price of items in the cart
    return items.reduce(
      (total, item) => total + item.qty * item.product.price,
      0
    );
  }



  function getCardSubTotal(item) {
    return items.reduce((sum, item) => (sum + (item.product.price * item.qty)), 0);
  }
  


  
  function getItemsCount() {
    return items.reduce((sum, item) => (item.qty ? sum + item.qty : sum), 0);
  }

  function getTotalPrice() {
    return items.reduce((sum, item) => (sum + item.totalPrice), 0);
  }


  
  function getTotal() {
    
 
    return items.reduce((sum, item) => (sum + (item.product.price * item.qty)), 0);
  }
  

  function getSubTotal() {
    return items.reduce((sum, item) => ( (item.product.price * item.qty)), 0);

  }
  
  
  function getAllCartItems() {
    return items.map(item => ({
      id: item.id,
      name: item.product.name,
      price: item.product.price,
      qty: item.qty
    }));
  }


  function getTotalAmount() {
    if (!items) {
          return 0;
        }
    return items.reduce((total, item) => total + getSubTotal(item), 0);
    // return items.reduce((sum, item) => sum + item.qty * item.product.price, 0).toFixed(2);

  }



  function emptyCart() {
    setItems([]);
  }




  // const saveCartToFirestore = (uid, items) => {
  //   const cartRef = collection(db, `cart/${uid}/user-cart`);
  //   setDoc(doc(cartRef, "cartItems"), { items });
  // };

  const saveCartToFirestore = (uid, items) => {
    if (items && items.length > 0) {
      const cartRef = collection(db, `cart/${uid}/user-cart`);
      setDoc(doc(cartRef, 'cartItems'), { items });
    }
  };


  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (uid) {
      saveCartToFirestore(uid, items);
    }
  }, [items, auth, db]);
  

  
  const saveOrderToFirestore = async () => {
    const ordersRef = collection(db, 'orders');
    const querySnapshot = await getDocs(ordersRef);
    const userId = user.uid;
    const userOrders = querySnapshot.docs.filter(doc => doc.data().user === userId);
  
    if (userOrders.length === 0) {
      // User has no orders, create a new collection for them
      const newOrder = { items, user:userId };
      const newOrderRef = await addDoc(collection(db, 'orders'), { user: userId });
      console.log("New order collection created with ID: ", newOrderRef.id);
      await addDoc(collection(newOrderRef, 'items'), newOrder);
      console.log("New document written to the new collection with ID: ", newOrderRef.id);
    } else {
      // User has an existing order collection, add the new order to it
      const userOrderRef = doc(db, 'orders', userOrders[0].id);
      const newOrder = { items, user: userId };
      const newOrderDocRef = await addDoc(collection(userOrderRef, 'items'), newOrder);
      console.log("New document written to existing collection with ID: ", newOrderDocRef.id);
    }
  }
  
  

  useEffect(() => {
    saveOrderToFirestore();
  }, [items, db]);

  
  return (
    <CartContext.Provider 
      value={{
        items,
        setItems,
        getItemsCount,

        getTotalPrice,
        emptyCart,
       
        addItemToCart,
        incrementItemQty,
        decrementItemQty,
        // removeItemFromCart,
        getCartSubTotal,

        getAllCartItems,
        getSubTotal,
        getTotal,
        getTotalAmount,
        removeItemFromCart,
        getCardSubTotal,
        listCartItemsByIds
      }}>
      {props.children}
    </CartContext.Provider>
  );
}

