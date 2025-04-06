import { getUserFromDatabase } from "@/lib/userAction";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_KEY_SECRET as string);

// Structure de données pour les frais d'expédition
interface ShippingRate {
  amount: number;
  displayName: string;
}

// Définition des types pour les pays autorisés par Stripe
type AllowedCountry =
  | "AC"
  | "AD"
  | "AE"
  | "AF"
  | "AG"
  | "AI"
  | "AL"
  | "AM"
  | "AO"
  | "AQ"
  | "AR"
  | "AT"
  | "AU"
  | "AW"
  | "AX"
  | "AZ"
  | "BA"
  | "BB"
  | "BD"
  | "BE"
  | "BF"
  | "BG"
  | "BH"
  | "BI"
  | "BJ"
  | "BL"
  | "BM"
  | "BN"
  | "BO"
  | "BQ"
  | "BR"
  | "BS"
  | "BT"
  | "BV"
  | "BW"
  | "BY"
  | "BZ"
  | "CA"
  | "CD"
  | "CF"
  | "CG"
  | "CH"
  | "CI"
  | "CK"
  | "CL"
  | "CM"
  | "CN"
  | "CO"
  | "CR"
  | "CV"
  | "CW"
  | "CY"
  | "CZ"
  | "DE"
  | "DJ"
  | "DK"
  | "DM"
  | "DO"
  | "DZ"
  | "EC"
  | "EE"
  | "EG"
  | "EH"
  | "ER"
  | "ES"
  | "ET"
  | "FI"
  | "FJ"
  | "FK"
  | "FO"
  | "FR"
  | "GA"
  | "GB"
  | "GD"
  | "GE"
  | "GF"
  | "GG"
  | "GH"
  | "GI"
  | "GL"
  | "GM"
  | "GN"
  | "GP"
  | "GQ"
  | "GR"
  | "GS"
  | "GT"
  | "GU"
  | "GW"
  | "GY"
  | "HK"
  | "HN"
  | "HR"
  | "HT"
  | "HU"
  | "ID"
  | "IE"
  | "IL"
  | "IM"
  | "IN"
  | "IO"
  | "IQ"
  | "IS"
  | "IT"
  | "JE"
  | "JM"
  | "JO"
  | "JP"
  | "KE"
  | "KG"
  | "KH"
  | "KI"
  | "KM"
  | "KN"
  | "KR"
  | "KW"
  | "KY"
  | "KZ"
  | "LA"
  | "LB"
  | "LC"
  | "LI"
  | "LK"
  | "LR"
  | "LS"
  | "LT"
  | "LU"
  | "LV"
  | "LY"
  | "MA"
  | "MC"
  | "MD"
  | "ME"
  | "MF"
  | "MG"
  | "MK"
  | "ML"
  | "MM"
  | "MN"
  | "MO"
  | "MQ"
  | "MR"
  | "MS"
  | "MT"
  | "MU"
  | "MV"
  | "MW"
  | "MX"
  | "MY"
  | "MZ"
  | "NA"
  | "NC"
  | "NE"
  | "NG"
  | "NI"
  | "NL"
  | "NO"
  | "NP"
  | "NR"
  | "NU"
  | "NZ"
  | "OM"
  | "PA"
  | "PE"
  | "PF"
  | "PG"
  | "PH"
  | "PK"
  | "PL"
  | "PM"
  | "PN"
  | "PR"
  | "PS"
  | "PT"
  | "PY"
  | "QA"
  | "RE"
  | "RO"
  | "RS"
  | "RU"
  | "RW"
  | "SA"
  | "SB"
  | "SC"
  | "SE"
  | "SG"
  | "SH"
  | "SI"
  | "SJ"
  | "SK"
  | "SL"
  | "SM"
  | "SN"
  | "SO"
  | "SR"
  | "SS"
  | "ST"
  | "SV"
  | "SX"
  | "SZ"
  | "TA"
  | "TC"
  | "TD"
  | "TF"
  | "TG"
  | "TH"
  | "TJ"
  | "TK"
  | "TL"
  | "TM"
  | "TN"
  | "TO"
  | "TR"
  | "TT"
  | "TV"
  | "TW"
  | "TZ"
  | "UA"
  | "UG"
  | "US"
  | "UY"
  | "UZ"
  | "VA"
  | "VC"
  | "VE"
  | "VG"
  | "VN"
  | "VU"
  | "WF"
  | "WS"
  | "XK"
  | "YE"
  | "YT"
  | "ZA"
  | "ZM"
  | "ZW";

// Définition des zones d'expédition
const shippingZones = {
  FR: "France",
  zoneA: [
    "AT",
    "BE",
    "BG",
    "HR",
    "CY",
    "CZ",
    "DK",
    "EE",
    "FI",
    "DE",
    "GR",
    "HU",
    "IE",
    "IT",
    "LV",
    "LT",
    "LU",
    "MT",
    "NL",
    "PL",
    "PT",
    "RO",
    "SK",
    "SI",
    "ES",
    "SE",
    "CH",
    "GB",
  ],
  zoneB: [
    "AM",
    "AL",
    "DZ",
    "AZ",
    "BY",
    "BA",
    "GE",
    "IS",
    "MK",
    "MA",
    "MD",
    "ME",
    "NO",
    "RS",
    "TN",
    "TR",
    "UA",
  ],
  zoneOutremer1: ["GP", "MQ", "RE", "GF", "YT", "PM", "MF", "BL"],
  zoneOutremer2: ["NC", "PF", "WF", "TF"],
};

// Tarifs d'expédition par zone et par poids en grammes
const shippingRates = {
  FR: {
    500: { amount: 700, displayName: "Livraison en France" },
    1000: { amount: 880, displayName: "Livraison en France moins de 1kg" },
    2000: { amount: 1015, displayName: "Livraison en France moins de 2kg" },
    5000: { amount: 1560, displayName: "Livraison en France moins de 5kg" },
    10000: { amount: 2270, displayName: "Livraison en France moins de 10kg" },
    15000: { amount: 2870, displayName: "Livraison en France moins de 15kg" },
    30000: { amount: 3555, displayName: "Livraison en France moins de 30kg" },
  },
  zoneA: {
    500: {
      amount: 1425,
      displayName: "Livraison dans l'Union Européenne + Suisse moins de 0.5 kg",
    },
    1000: {
      amount: 1760,
      displayName: "Livraison dans l'Union Européenne + Suisse moins de 1 kg",
    },
    2000: {
      amount: 1995,
      displayName: "Livraison dans l'Union Européenne + Suisse moins de 2 kg",
    },
    5000: {
      amount: 2550,
      displayName: "Livraison dans l'Union Européenne + Suisse moins de 5 kg",
    },
    10000: {
      amount: 4205,
      displayName: "Livraison dans l'Union Européenne + Suisse moins de 10 kg",
    },
    15000: {
      amount: 6180,
      displayName: "Livraison dans l'Union Européenne + Suisse moins de 15 kg",
    },
    30000: {
      amount: 8005,
      displayName: "Livraison dans l'Union Européenne + Suisse moins de 30 kg",
    },
  },
  zoneB: {
    500: { amount: 2140, displayName: "Livraison Zone B moins de 0.5 kg" },
    1000: { amount: 2555, displayName: "Livraison Zone B moins de 1 kg" },
    2000: { amount: 2795, displayName: "Livraison Zone B moins de 2 kg" },
    5000: { amount: 3590, displayName: "Livraison Zone B moins de 5 kg" },
    10000: { amount: 5940, displayName: "Livraison Zone B moins de 10 kg" },
    15000: { amount: 8060, displayName: "Livraison Zone B moins de 15 kg" },
    20000: { amount: 9855, displayName: "Livraison Zone B moins de 20 kg" },
  },
  zoneOutremer1: {
    500: {
      amount: 1265,
      displayName: "Livraison Zone Outremer moins de 0.5 kg",
    },
    1000: {
      amount: 2000,
      displayName: "Livraison Zone Outremer moins de 1 kg",
    },
    2000: {
      amount: 2725,
      displayName: "Livraison Zone Outremer moins de 2 kg",
    },
    5000: {
      amount: 4095,
      displayName: "Livraison Zone Outremer moins de 5 kg",
    },
    10000: {
      amount: 6560,
      displayName: "Livraison Zone Outremer moins de 10 kg",
    },
    15000: {
      amount: 13705,
      displayName: "Livraison Zone Outremer moins de 15 kg",
    },
    30000: {
      amount: 15055,
      displayName: "Livraison Zone Outremer moins de 30 kg",
    },
  },
  zoneOutremer2: {
    500: {
      amount: 1285,
      displayName: "Livraison Zone Outremer moins de 0.5 kg",
    },
    1000: {
      amount: 1995,
      displayName: "Livraison Zone Outremer moins de 1 kg",
    },
    2000: {
      amount: 3525,
      displayName: "Livraison Zone Outremer moins de 2 kg",
    },
    5000: {
      amount: 5890,
      displayName: "Livraison Zone Outremer moins de 5 kg",
    },
    10000: {
      amount: 11535,
      displayName: "Livraison Zone Outremer moins de 10 kg",
    },
    15000: {
      amount: 26315,
      displayName: "Livraison Zone Outremer moins de 15 kg",
    },
    30000: {
      amount: 30235,
      displayName: "Livraison Zone Outremer moins de 30 kg",
    },
  },
  zoneC: {
    500: { amount: 3160, displayName: "Livraison Zone C" },
    1000: { amount: 3515, displayName: "Livraison Zone C, moins de 1kg" },
    2000: { amount: 4850, displayName: "Livraison Zone C, moins de 2kg" },
    5000: { amount: 7080, displayName: "Livraison Zone C, moins de 5kg" },
    10000: { amount: 13380, displayName: "Livraison Zone C, moins de 10kg" },
    15000: { amount: 19015, displayName: "Livraison Zone C, moins de 15kg" },
    20000: { amount: 23180, displayName: "Livraison Zone C, moins de 20kg" },
  },
};

// Fonction pour déterminer la zone d'expédition
function getShippingZone(country: string): string {
  if (country === "FR") return "FR";
  if (shippingZones.zoneA.includes(country)) return "zoneA";
  if (shippingZones.zoneB.includes(country)) return "zoneB";
  if (shippingZones.zoneOutremer1.includes(country)) return "zoneOutremer1";
  if (shippingZones.zoneOutremer2.includes(country)) return "zoneOutremer2";
  return "zoneC";
}

// Fonction pour déterminer le palier de poids applicable
function getWeightTier(totalWeight: number, zone: string): number {
  const weightTiers = Object.keys(
    shippingRates[zone as keyof typeof shippingRates]
  )
    .map(Number)
    .sort((a, b) => a - b);

  for (const tier of weightTiers) {
    if (totalWeight <= tier) {
      return tier;
    }
  }

  // Si le poids dépasse tous les paliers définis, on retourne le dernier palier
  return weightTiers[weightTiers.length - 1];
}

// Fonction pour créer une session Stripe avec les options d'expédition
async function createCheckoutSession(
  customer: Stripe.Customer,
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
  country: AllowedCountry,
  shippingRate: ShippingRate,
  userId: string, // Ajouter l'ID utilisateur
  productDetails: any[] // Ajouter les détails du produit
): Promise<Stripe.Checkout.Session> {
  // Préparez les métadonnées des produits
  const productMetadata: { [key: string]: string } = {};
  productDetails.forEach((product, index) => {
    productMetadata[`productId_${index}`] = product.id;
  });

  return await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    customer: customer.id,
    mode: "payment",
    billing_address_collection: "required",
    shipping_address_collection: {
      allowed_countries: [country],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: shippingRate.amount,
            currency: "eur",
          },
          display_name: shippingRate.displayName,
        },
      },
    ],
    customer_update: {
      address: "auto",
      name: "auto",
    },
    success_url: `${process.env.DOMAIN_URL}/dashboard/payment/success`,
    cancel_url: `${process.env.DOMAIN_URL}/dashboard/payment/cancel`,
    line_items: lineItems,
    metadata: {
      userId,
      ...productMetadata,
    },
  });
}

export const POST = async (request: NextRequest) => {
  try {
    const { cartItems, country } = await request.json();
    console.log("Received products:", cartItems);
    console.log("Received country:", country);

    let totalWeight = 0;
    cartItems.forEach((item: any) => {
      totalWeight += item.product.weight * item.quantity;
    });

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const user = await getUserFromDatabase(userId);
    if (!user?.email) {
      throw new Error("User not authenticated");
    }

    const customer = await stripe.customers.create({ email: user.email });
    console.log("Customer created:", customer);

    // Création des line items pour Stripe
    const lineItems = cartItems.map((product: any) => {
      const amountInCents = Math.round(product.product.price * 100);
      if (amountInCents < 50) {
        throw new Error(
          `The price of ${product.product.title} is too low, must be at least 0.50 in your currency.`
        );
      }
      return {
        quantity: product.quantity,
        price_data: {
          product_data: {
            name: product.product.title,
            description: product.product.description,
            images: [product.product.images[0]],
          },
          currency: "EUR",
          unit_amount: amountInCents,
        },
      };
    });

    // Détermination de la zone et du tarif d'expédition
    const zone = getShippingZone(country);
    const weightTier = getWeightTier(totalWeight, zone);
    const zoneRates = shippingRates[zone as keyof typeof shippingRates];
    const shippingRate = zoneRates[weightTier as keyof typeof zoneRates];

    // Création de la session de paiement avec les options d'expédition appropriées
    const checkOutSession = await createCheckoutSession(
      customer,
      lineItems,
      country as AllowedCountry,
      shippingRate,
      userId, // Passer l'ID utilisateur
      cartItems.map((item: any) => ({ id: item.product.id })) // Passer les IDs de produits
    );

    console.log("Checkout session created:", checkOutSession.url);

    return NextResponse.json(
      { msg: checkOutSession, url: checkOutSession.url },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error occurred:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
