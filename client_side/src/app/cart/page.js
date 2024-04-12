'use client'
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const CartPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const memberId = searchParams.get('memberid');
        const response = await fetch('http://localhost:4000/getcartitems', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ MemberId: memberId }),
        });

        if (response.ok) {
          const data = await response.json();
          setCartItems(data); // Store cart items in state
        } else {
          console.error('Failed to fetch cart items');
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, [searchParams]);

  const handleCheckout = async () => {
    try {
      const memberId = searchParams.get('memberid');
      
      // Calculate total amount from cart items
      const totalAmount = cartItems.reduce((total, item) => total + item.price, 0);
      
      // Get current date
      const currentDate = new Date().toISOString().split('T')[0];
      
      // Send request to create billing record
      const response = await fetch('http://localhost:4000/createbilling', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          MemberId: memberId,
          Date: currentDate,
          Amount: totalAmount,
        }),
      });

      if (response.ok) {
        console.log('Billing record created successfully');
        router.push(`/dashboard?memberid=${memberId}`);
        // Optionally, you can redirect the user to another page after successful checkout
      } else {
        console.error('Failed to create billing record');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="dashboard-container bg-white p-8 rounded-lg shadow-md max-w-3xl w-full flex flex-col">
        <h1 className="text-3xl font-bold mb-2 text-center text-black">Welcome to Your Cart</h1>
        <div className="dashboard-content flex">
          <div className="dashboard-info-container w-full mr-8">
            <div className="w-full mb-8">
              <div className="mb-8"></div> {/* Add space between sections */}
              <h2 className="text-2xl font-bold mb-4 text-center text-black">Your Cart Items</h2>
              {cartItems.map((item, index) => (
                <div key={index} className="mb-4 flex justify-between items-center text-black"> {/* Changed text color to black */}
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gray-300 rounded-full flex justify-center items-center mr-4">
                      <p className="text-lg font-bold">${item.price}</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold">{item.sessionName}</p> {/* Assuming item has sessionName property */}
                      <p className="text-sm text-gray-500">Refund Not Applicable</p> {/* Change to your product description */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <button onClick={handleCheckout} className="bg-black text-white font-bold py-2 px-4 rounded mx-auto mt-4">
          Complete Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
