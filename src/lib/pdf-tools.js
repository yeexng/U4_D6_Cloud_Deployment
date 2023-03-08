import PdfPrinter from "pdfmake";
import imageToBase64 from "image-to-base64";

export const blogPostToPDFReadableStream = async (blogPost) => {
  const fonts = {
    Helvetica: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      italics: "Helvetica-Oblique",
      bolditalics: "Helvetica-BoldOblique",
    },
  };
  const printer = new PdfPrinter(fonts);

  const encodedImage = await imageToBase64(blogPost.img);

  const docDefinition = {
    content: [
      {
        image: `data:image/jpeg;base64,${encodedImage}`,
        width: 150,
      },
      blogPost.title,
      blogPost.content,
    ],
    defaultStyle: {
      font: "Helvetica",
    },
  };
  const pdfReadableStream = printer.createPdfKitDocument(docDefinition, {});
  pdfReadableStream.end();

  return pdfReadableStream;
};
