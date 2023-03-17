import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (recipientEmail) => {
  try {
    const message = {
      to: recipientEmail,
      from: process.env.SENDER_EMAIL,
      subject: "Test test",
      text: "Testing 123",
      html: "<strong>BLA BLA BLA<strong>",
    };
    await sgMail.send(message);
  } catch (error) {
    console.log(error);
  }
};
