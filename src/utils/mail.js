import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Project Manager",
      link: "https://projectmanager.com",
    },
  });

  const emailTextual = mailGenerator.generatePlaintext(options.mailGenContent);
  const emailHTML = mailGenerator.generate(options.mailGenContent);

  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });

  const mail = {
    from:"mail.projectmanager@gmail.com",
    to:options.email,
    subject:options.subject,
    text:emailTextual,
    html:emailHTML
  }

  try {
    await transporter.sendMail(mail)
  } catch (error) {
    console.error("Email not sent!",error);
    
  }
};

const emailVerificationMailgenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to our app! we're excited to have you on board",
      action: {
        instructions:
          "To verify your email please click on the following button",
        button: {
          color: "#a21ff113",
          text: "Verify your email",
          link: verificationUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email we would love to help.",
    },
  };
};

const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro: "We got a request to reset the password of your account!",
      action: {
        instructions:
          "To reset the password please click on the following button",
        button: {
          color: "#22bc66",
          text: "Reset your password",
          link: passwordResetUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email we would love to help.",
    },
  };
};

export { emailVerificationMailgenContent, forgotPasswordMailgenContent, sendEmail };
