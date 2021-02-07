import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  public sendMail(email: string, password: string): void {
    this
      .mailerService
      .sendMail({
        to: email, // list of receivers
        from: 'uni.insat@outlook.com', // sender address
        subject: 'Account Created PFE MANAGER ✔', // Subject line
        text: 'welcome', // plaintext body
        html: '<b>welcome to pfe platform</b>' +
          '<br><p>here is your email and password to login to the platform</p>' +
          '<b>For More Security, change the password ASAP</b>' +
          '<p>password: ' + password + '</p>' +
          '<p>email: ' + email + '</p>' +
          '<h4>INSAT with love</h4>', // HTML body content
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
