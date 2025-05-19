import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const isAuthEnabled = !!(process.env.SMTP_USER && process.env.SMTP_PASS);

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'localhost',
      port: Number(process.env.SMTP_PORT) || 1025,
      secure: process.env.SMTP_SECURE === 'true',
      auth: isAuthEnabled
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
    });
  }

  async sendMail(to: string, subject: string, text: string, html?: string) {
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM || '"No Reply" <support@task-master.com>',
      to,
      subject,
      text,
      html,
    });
  }
}
