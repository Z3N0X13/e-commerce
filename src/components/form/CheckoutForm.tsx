"use client";

import Image from "next/image";
import { toast } from "sonner";
import React, { useState } from "react";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useCartUI } from "@/app/context/cart-ui";

const CheckoutForm = () => {
  const [cvc, setCvc] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [adress, setAdress] = useState("");
  const [expiry, setExpiry] = useState("");
  const [country, setCountry] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [apartment, setApartment] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [useShippingAsBilling, setUseShippingAsBilling] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "paypal" | "shop"
  >("card");

  const { cart, closeCheckout, clearCart } = useCartUI();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = () => {
    const cvcValid = /^[0-9]{3,4}$/.test(cvc);
    const emailValid = /\S+@\S+\.\S+/.test(email);
    const postalValid = /^[0-9]{4,6}$/.test(postalCode);
    const expiryValid = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expiry);
    const cardValid = /^[0-9]{13,19}$/.test(cardNumber.replace(/\s+/g, ""));

    return (
      emailValid &&
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      adress.trim() !== "" &&
      city.trim() !== "" &&
      country.trim() !== "" &&
      postalValid &&
      cardValid &&
      expiryValid &&
      cvcValid &&
      nameOnCard.trim() !== ""
    );
  };

  const totalPrice = cart.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  const shippingPrice = totalPrice > 0 ? 5 : 0;

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const payload = {
        email,
        firstName,
        lastName,
        address: adress,
        apartment: apartment || undefined,
        city,
        postalCode,
        country,
        paymentMethod,
        nameOnCard,
        cardNumber,
        expiry,
        cvc,
        rememberMe,
        useShippingAsBilling,
        shippingPrice,
        subtotal: totalPrice,
        total: totalPrice + shippingPrice,
        items: cart.map((item) => ({
          productId: item.id,
          title: item.title,
          imageUrl: item.imageUrl,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data.error || "Erreur lors de l'enregistrement de la commande"
        );
      }

      toast.success("Commande confirmée ! Vous pouvez trouver l'avancement de votre commande dans l'onglet Mes Commandes");
      clearCart();
      closeCheckout();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Une erreur est survenue";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-10 px-6 overflow-y-auto divide-x-2 divide-gray-300 dark:divide-gray-600">
        <section className="flex flex-col space-y-6 pr-10">
          <form className="space-y-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Contact</h3>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Livraison</h3>
              <Input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Pays/Region"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Prénom"
                />
                <Input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Nom"
                />
              </div>
              <Input
                type="text"
                value={adress}
                onChange={(e) => setAdress(e.target.value)}
                placeholder="Adresse"
              />
              <Input
                type="text"
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
                placeholder="Appartement (optionnel)"
                required={false}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="number"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="Code postal"
                />
                <Input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ville"
                />
              </div>
            </div>
            <div className="flex justify-center items-start p-6 bg-gray-100 dark:bg-gray-700 mt-2 rounded-2xl">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Paiement
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                  Toutes les transactions sont sécurisées et cryptées.
                </p>

                <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                  <label
                    className={`flex items-center p-4 cursor-pointer ${
                      paymentMethod === "card"
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="mr-4"
                    />
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Carte de crédit
                    </span>
                    <div className="ml-auto flex space-x-2">
                      <Image
                        src="/assets/card/visa.png"
                        alt="Visa"
                        className="h-6 object-contain"
                        width={24}
                        height={24}
                      />
                      <Image
                        src="/assets/card/mastercard.png"
                        alt="Mastercard"
                        className="h-6 object-contain"
                        width={24}
                        height={24}
                      />
                      <Image
                        src="/assets/card/amex.svg"
                        alt="Amex"
                        className="h-6 object-contain"
                        width={24}
                        height={24}
                      />
                      <Image
                        src="/assets/card/discover.png"
                        alt="Discover"
                        className="h-6 object-contain"
                        width={24}
                        height={24}
                      />
                      <span className="px-2 py-0.5 text-gray-600 dark:text-gray-300 text-sm rounded bg-gray-200 dark:bg-gray-700">
                        +4
                      </span>
                    </div>
                  </label>

                  {paymentMethod === "card" && (
                    <div className="p-4 border-t border-gray-200 dark:border-gray-600 space-y-3">
                      <Input
                        type="text"
                        placeholder="Numéro de carte"
                        value={cardNumber}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, "");
                          value = value.replace(/(.{4})/g, "$1 ").trim();
                          setCardNumber(value);
                        }}
                        maxLength={19}
                      />
                      <div className="flex space-x-3">
                        <Input
                          type="text"
                          placeholder="Date d'expiration (MM / YY)"
                          value={expiry}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, "");
                            if (value.length >= 3) {
                              value =
                                value.slice(0, 2) + "/" + value.slice(2, 4);
                            }
                            setExpiry(value);
                          }}
                          maxLength={5}
                        />
                        <Input
                          type="text"
                          placeholder="Code de sécurité"
                          value={cvc}
                          onChange={(e) => setCvc(e.target.value)}
                        />
                      </div>
                      <Input
                        type="text"
                        placeholder="Nom sur la carte"
                        value={nameOnCard}
                        onChange={(e) => setNameOnCard(e.target.value)}
                      />
                      <label className="flex items-center mt-2">
                        <input
                          type="checkbox"
                          checked={useShippingAsBilling}
                          onChange={() =>
                            setUseShippingAsBilling(!useShippingAsBilling)
                          }
                          className="mr-2"
                        />
                        <span className="text-gray-700 dark:text-gray-300">
                          Use shipping adress as billing adress
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-start">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="mt-3 h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label htmlFor="remember" className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Se souvenir de moi</span>
                <br />
                Enregistrer mes informations pour un paiement plus rapide
              </label>
            </div>
          </form>
        </section>

        <aside className="relative">
          <div className="sticky top-6 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-8 text-gray-900 dark:text-white">
              Résumé de la commande
            </h3>
            <section className="flex flex-col">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-6 border-b border-gray-200 dark:border-gray-700 pb-4 mb-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 shadow-sm">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        width={80}
                        height={80}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex flex-col justify-between">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {item.title}
                      </span>
                      <label className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Quantité :
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          className="ml-2 w-16 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          disabled
                        />
                      </label>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Total :{" "}
                      {(item.price * item.quantity).toLocaleString("fr-FR")} €
                    </p>
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center mt-4 pt-4">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  Sous-total :
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {totalPrice.toLocaleString("fr-FR")} €
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  Prix expédition :
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {shippingPrice.toLocaleString("fr-FR")} €
                </span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 mt-4" />
              <div className="flex justify-between items-center mt-4 pt-4">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  Total :
                </span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {(totalPrice + shippingPrice).toLocaleString("fr-FR")} €
                </span>
              </div>
            </section>
          </div>
        </aside>
      </div>
      <div className="mt-4 flex justify-center">
        <Button
          type="button"
          className="mx-auto w-full sm:w-2/3 md:w-1/2 h-12 mt-4 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-purple-500"
          onClick={handleSubmit}
          disabled={!isFormValid() || isSubmitting}
          aria-disabled={!isFormValid() || isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            "Traitement…"
          ) : (
            <>
              Confirmer la commande <span>—</span>
              <span className="font-bold ml-0.5">
                {(totalPrice + shippingPrice).toLocaleString("fr-FR")} €
              </span>
            </>
          )}
        </Button>
      </div>
    </>
  );
};

export default CheckoutForm;
