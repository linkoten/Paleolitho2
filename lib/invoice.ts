import PDFDocument from "pdfkit";

interface OrderProduct {
  name: string;
  description?: string | null;
  price: number;
  quantity: number;
  image?: string | null;
  id: string;
}

export async function createInvoice(
  order: any,
  products: OrderProduct[]
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      // Créer un document PDF avec options explicites pour éviter le problème des polices
      const doc = new PDFDocument({
        size: "A4",
        bufferPages: true,
        font: undefined, // Ne pas charger de police par défaut
        autoFirstPage: false, // Nous allons créer la première page manuellement
      });

      // Créer manuellement la première page
      doc.addPage();

      // Utiliser des polices basiques incorporées
      // NOTE: Évitez d'utiliser doc.font() avec des noms de polices
      // Utilisez plutôt des styles de texte directs

      // Collecter les morceaux de PDF en buffer
      const chunks: Buffer[] = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      // Générer l'en-tête (adapté pour éviter les appels explicites aux polices)
      generateHeader(doc);
      generateCustomerInformation(doc, order, null); // null pour l'adresse si non disponible
      generateInvoiceTable(doc, products);
      generateFooter(doc);

      doc.end();
    } catch (error) {
      console.error("Erreur lors de la création de la facture:", error);
      reject(error);
    }
  });
}

function generateHeader(doc: PDFKit.PDFDocument) {
  // Utilisez un style in-line au lieu de changer la police
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text("PALEOLITHO", 50, 45)
    .fontSize(10)
    .text("Paleolitho", 50, 80)
    .text("France", 50, 95)
    .text("www.paleolitho.fr", 50, 110)
    .moveDown();
}

function generateCustomerInformation(
  doc: PDFKit.PDFDocument,
  order: any,
  address: any
) {
  doc.fillColor("#444444").fontSize(20).text("Facture", 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .text("Numéro de facture:", 50, customerInformationTop)
    .text(`#${order.id.slice(-8)}`, 150, customerInformationTop)
    .text("Date:", 50, customerInformationTop + 15)
    .text(formatDate(new Date()), 150, customerInformationTop + 15)
    .text("Total:", 50, customerInformationTop + 30)
    .text(`${order.amount / 100} €`, 150, customerInformationTop + 30)
    .fontSize(10)
    .text("Informations client:", 300, customerInformationTop)
    .text(`${order.email}`, 300, customerInformationTop + 15);

  generateHr(doc, 252);
}

function generateInvoiceTable(
  doc: PDFKit.PDFDocument,
  products: OrderProduct[]
) {
  const invoiceTableTop = 330;

  doc.fontSize(10);
  generateTableRow(
    doc,
    invoiceTableTop,
    "Produit",
    "Description",
    "Prix Unitaire",
    "Quantité",
    "Total"
  );
  generateHr(doc, invoiceTableTop + 20);

  let positionY = invoiceTableTop + 30;
  let totalAmount = 0;

  for (const product of products) {
    const price = product.price / 100; // Convertir en euros
    const unitPrice = price / product.quantity;
    const lineTotal = price;
    totalAmount += lineTotal;

    generateTableRow(
      doc,
      positionY,
      product.name,
      truncateText(product.description || "", 30),
      `${unitPrice.toFixed(2)} €`,
      product.quantity.toString(),
      `${lineTotal.toFixed(2)} €`
    );

    positionY += 20;

    // Ajout d'une page si nécessaire
    if (positionY > 700) {
      doc.addPage();
      positionY = 50;
      generateTableHeader(doc, positionY);
      positionY += 20;
    }
  }

  // Ligne pour le total
  const subtotalPosition = positionY + 20;
  generateHr(doc, subtotalPosition - 10);

  doc
    .fontSize(10)
    .text("Total:", 400, subtotalPosition)
    .text(`${totalAmount.toFixed(2)} €`, 480, subtotalPosition);
}

function truncateText(text: string, maxLength: number): string {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

function generateTableHeader(doc: PDFKit.PDFDocument, y: number) {
  doc.fontSize(10);
  generateTableRow(
    doc,
    y,
    "Produit",
    "Description",
    "Prix Unitaire",
    "Quantité",
    "Total"
  );
  generateHr(doc, y + 20);
}

function generateTableRow(
  doc: PDFKit.PDFDocument,
  y: number,
  product: string,
  description: string,
  unitPrice: string,
  quantity: string,
  total: string
) {
  doc
    .fontSize(10)
    .text(product, 50, y)
    .text(description, 150, y)
    .text(unitPrice, 280, y, { width: 90, align: "right" })
    .text(quantity, 370, y, { width: 90, align: "right" })
    .text(total, 450, y, { width: 90, align: "right" });
}

function generateHr(doc: PDFKit.PDFDocument, y: number) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

function generateFooter(doc: PDFKit.PDFDocument) {
  doc
    .fontSize(10)
    .text(
      "Merci pour votre commande. Pour toute question, contactez-nous à contact@paleolitho.fr",
      50,
      730,
      { align: "center", width: 500 }
    );
}

function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}
