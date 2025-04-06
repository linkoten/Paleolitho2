import nodemailer from "nodemailer";

type EmailProps = {
  email: string;
  orderId: string;
  products: any[];
  total: number;
  shippingDetails: any;
  invoiceBuffer?: Buffer; // Rendre optionnel pour gérer l'absence de PDF
};

export async function sendOrderConfirmationEmail({
  email,
  orderId,
  products,
  total,
  invoiceBuffer,
}: EmailProps) {
  const transporter = nodemailer.createTransport({
    // Votre configuration SMTP ici
    host: process.env.SMTP_HOST || "smtp.example.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASSWORD || "",
    },
  });

  // Créer la liste des produits pour l'email
  const productsHtml = products
    .map(
      (product) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${product.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${product.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${(product.price / 100).toFixed(2)} €</td>
        </tr>
      `
    )
    .join("");

  // Préparer les options de l'email
  const mailOptions = {
    from: `"Paleolitho" <${process.env.SMTP_FROM || "noreply@paleolitho.fr"}>`,
    to: email,
    subject: `Paleolitho - Confirmation de commande #${orderId.slice(-8)}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h1 style="color: #333;">Merci pour votre commande!</h1>
        <p>Votre commande #${orderId.slice(-8)} a été confirmée et est en cours de traitement.</p>
        
        <h2 style="color: #333; margin-top: 20px;">Détails de la commande</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f9f9f9;">
              <th style="padding: 10px; text-align: left;">Produit</th>
              <th style="padding: 10px; text-align: center;">Qté</th>
              <th style="padding: 10px; text-align: right;">Prix</th>
            </tr>
          </thead>
          <tbody>
            ${productsHtml}
            <tr>
              <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Total:</td>
              <td style="padding: 10px; text-align: right; font-weight: bold;">${(total / 100).toFixed(2)} €</td>
            </tr>
          </tbody>
        </table>
        
        <p style="margin-top: 20px;">Nous vous tiendrons informé de l'avancement de votre commande.</p>
        <p>Pour toute question, n'hésitez pas à nous contacter.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #777; font-size: 12px;">
          <p>© ${new Date().getFullYear()} Paleolitho. Tous droits réservés.</p>
        </div>
      </div>
    `,
    attachments: invoiceBuffer
      ? [
          {
            filename: `facture-${orderId.slice(-8)}.pdf`,
            content: invoiceBuffer,
          },
        ]
      : [], // Attacher la facture uniquement si disponible
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email envoyé:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    return { success: false, error };
  }
}
