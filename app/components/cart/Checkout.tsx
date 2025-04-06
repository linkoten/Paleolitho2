"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import CountryModal from "@/app/components/cart/CountryModal";

export default function Checkout({ user }: { user: any }) {
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const checkStockAvailability = () => {
      const cartItems = user.cart.cartItems;
      const isStockExceeded = cartItems.some(
        (item: any) => item.quantity > item.product.stock
      );
      setIsButtonDisabled(isStockExceeded);
    };

    checkStockAvailability();
  }, [user]);

  const handleCheckoutClick = () => {
    setIsModalOpen(true);
  };

  const handleCountrySelect = (country: string) => {
    checkout(country);
  };

  const checkout = async (country: string) => {
    setLoading(true);
    try {
      const cartItems = user.cart.cartItems;
      console.log("Cart items:", cartItems, country);

      // Send all cart items in one request
      const response = await axios.post("/api/webhook/stripe/payment", {
        cartItems,
        country,
      });
      const responseData = await response.data;
      console.log("Response data:", responseData);
      window.location.href = responseData.url;
    } catch (error: any) {
      console.error("Error during checkout:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <Button
        onClick={handleCheckoutClick}
        className="w-full"
        disabled={isButtonDisabled || loading}
      >
        {loading ? "Processing..." : "Checkout"}
      </Button>
      {isButtonDisabled && (
        <p className="text-red-500 mt-2">
          Certains articles de votre panier ont une quantité supérieure au stock
          disponible.
        </p>
      )}
      <CountryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectCountry={handleCountrySelect}
      />
    </div>
  );
}
