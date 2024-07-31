import { Injectable } from '@nestjs/common'
import { createTransport, Transporter } from 'nodemailer'

@Injectable()
export class EmailService {
  private transporter: Transporter

  constructor() {
    this.transporter = createTransport({
      host: 'smtp.qq.com',
      port: 587,
      secure: false,
      auth: {
        user: '928647866@qq.com',
        pass: '你的授权码',
      },
    })
  }

  async sendMail({ to, subject, html }) {
    await this.transporter.sendMail({
      from: {
        name: '会议室预定系统',
        address: '你的邮箱地址',
      },
      to,
      subject,
      html,
    })
  }
}
