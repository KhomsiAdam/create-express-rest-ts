import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import { log } from './logger.service';

const mail = {
  name: 'name',
  link: 'link',
  intro: 'intro',
  instructions: 'instructions',
  color: '#22BC66',
  text: 'text',
  outro: 'outro',
  subject: 'subject',
};

// Configure mailgen by setting a theme and your product info
const mailGenerator = new Mailgen({
  theme: 'default',
  product: {
    name: mail.name,
    link: mail.link,
  },
});

const generatedEmail = () => {
  const content = {
    body: {
      intro: mail.intro,
      action: {
        instructions: mail.instructions,
        button: {
          color: mail.color,
          text: mail.text,
          link: mail.link,
        },
      },
      outro: mail.outro,
    },
  };
  return content;
};

export const sendMail = async (email: string) => {
  const emailBody = mailGenerator.generate(generatedEmail());
  const emailText = mailGenerator.generatePlaintext(generatedEmail());

  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const info = await transporter.sendMail({
    from: `"${mail.name}" <${testAccount.user}>`,
    to: email,
    subject: mail.subject,
    text: emailText,
    html: emailBody,
  });

  // __log.debug(`Message sent: ${info.messageId}`);
  log.debug(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
};
