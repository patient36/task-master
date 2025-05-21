import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login-dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { DeleteUserDto } from './dto/delete-user.dto';
import { AuthedUser } from 'src/common/types/authedUser';
import { ResetPassDto } from './dto/reset-pass.dto';
import { OtpService } from 'src/redis/otp.service';
import { MailService } from 'src/mail/mail.service';
import { AuthTokenService } from 'src/redis/auth-token.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly otpService: OtpService, private readonly mailService: MailService, private readonly authTokenService: AuthTokenService) { }
  private readonly logger = new Logger(AuthService.name);

  async register(dto: CreateAuthDto) {
    try {
      const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } });

      if (existingUser) {
        throw new HttpException({ message: 'User already exists', error: 'Conflict' }, HttpStatus.CONFLICT)
      }

      const hashedPassword = await bcrypt.hash(dto.password, 10);

      const user = await this.prisma.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          password: hashedPassword,
        },
      });

      const accessToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '6h' })
      await this.authTokenService.storeToken(accessToken, user.id, 21600);

      const welcomeMessage = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background: #f9fafb;
              margin: 0;
              padding: 40px 20px;
              color: #111827;
            }
            .container {
              max-width: 600px;
              margin: auto;
              background: white;
              border-radius: 8px;
              padding: 30px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            }
            .header {
              font-size: 24px;
              font-weight: bold;
              color: #2563eb;
            }
            .message {
              margin-top: 20px;
              font-size: 16px;
              line-height: 1.6;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">🎉 Welcome to Task Master!</div>
            <div class="message">
              <p>Hi ${user.name},</p>
              <p>
                We're thrilled to have you on board. Start organizing, tracking, and
                completing your tasks efficiently with Task Master.
              </p>
              <p>
                Explore your dashboard and take full control of your productivity.
              </p>
              <p>Cheers,<br />The Task Master Team</p>
            </div>
          </div>
        </body>
      </html>
`
      await this.mailService.sendMail(
        dto.email,
        'Welcome to Task Master',
        'Welcome to Task Master',
        welcomeMessage
      );
      const { password, ...safeUser } = user;
      return { user: safeUser, accessToken };

    } catch (error) {
      this.logger.error(error.message, error.stack);

      if (error instanceof HttpException) throw error

      throw new HttpException(
        {
          message: 'Registration failed',
          error: error.message || 'Unexpected error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(dto: LoginDto) {
    try {
      const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

      if (!user) {
        throw new HttpException({ message: 'User not found', error: 'Not Found' }, HttpStatus.NOT_FOUND)
      }

      const isPasswordValid = await bcrypt.compare(dto.password, user.password);

      if (!isPasswordValid) {
        throw new HttpException({ message: 'Wrong password', error: 'Unauthorized' }, HttpStatus.UNAUTHORIZED)
      }

      const accessToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '6h' })
      await this.authTokenService.storeToken(accessToken, user.id, 21600);
      const { password, ...safeUser } = user;
      return { user: safeUser, accessToken };
    } catch (error) {
      this.logger.error(error.message, error.stack);

      if (error instanceof HttpException) throw error

      throw new HttpException(
        {
          message: 'Login Failed',
          error: error.message || 'Unexpected error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCurrentUser(user: AuthedUser) {
    try {
      const dbUser = await this.prisma.user.findUnique({ where: { id: user.id } });
      if (!dbUser) {
        throw new HttpException({ message: 'User not found', error: 'Not Found' }, HttpStatus.NOT_FOUND);
      }

      const cancelledTasks = await this.prisma.task.count({ where: { creatorId: user.id, status: 'CANCELLED' } });

      const pendingTasks = await this.prisma.task.count({ where: { creatorId: user.id, status: 'PENDING' } });

      const completedTasks = await this.prisma.task.count({ where: { creatorId: user.id, status: 'COMPLETED' } });

      const overDueTasks = await this.prisma.task.count({ where: { creatorId: user.id, status: 'OVERDUE' } });


      const tasks = { cancelled: cancelledTasks, pending: pendingTasks, completed: completedTasks, overdue: overDueTasks, total: cancelledTasks + pendingTasks + completedTasks + overDueTasks };

      const { password, ...safeUser } = dbUser;
      return { user: safeUser, tasks };
    } catch (error) {
      this.logger.error(error.message, error.stack);

      if (error instanceof HttpException) throw error

      throw new HttpException(
        {
          message: 'Authentication failed',
          error: error.message || 'Unexpected error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(dto: UpdateAuthDto, AuthedUser: AuthedUser) {
    const { id } = AuthedUser;

    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) {
        throw new HttpException({ message: 'User not found' }, HttpStatus.NOT_FOUND);
      }

      if (dto.oldPassword && !user.password) {
        throw new HttpException('Password not found', HttpStatus.BAD_REQUEST);
      }

      if (dto.oldPassword) {
        const isValid = await bcrypt.compare(dto.oldPassword, user.password);
        if (!isValid) {
          throw new HttpException({ message: 'Wrong password' }, HttpStatus.UNAUTHORIZED);
        }
      }

      if (dto.newPassword) {
        const hashed = await bcrypt.hash(dto.newPassword, 10);
        await this.prisma.user.update({
          where: { id },
          data: { password: hashed },
        });
      }

      if (dto.email && dto.email !== user.email) {
        const existingEmail = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existingEmail) {
          throw new HttpException({ message: 'Email already in use' }, HttpStatus.CONFLICT);
        }
      }

      const updated = await this.prisma.user.update({
        where: { id },
        data: {
          name: dto.name ?? user.name,
          email: dto.email ?? user.email,
        },
      });

      const { password, ...safeUser } = updated;
      return safeUser;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        { message: 'Update failed', error: error.message || 'Unexpected error' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteAccount(dto: DeleteUserDto, AuthedUser: AuthedUser) {
    try {
      const { id } = AuthedUser
      const user = await this.prisma.user.findUnique({ where: { id } });

      if (!user) {
        throw new HttpException({ message: 'User not found', error: 'Not Found' }, HttpStatus.NOT_FOUND);
      }

      if (!user.password) {
        throw new HttpException('Password not found', HttpStatus.BAD_REQUEST);
      }

      const isPasswordValid = await bcrypt.compare(dto.password, user.password);

      if (!isPasswordValid) {
        throw new HttpException('Wrong password', HttpStatus.BAD_REQUEST);
      }

      await this.prisma.user.delete({ where: { id } });
      const { count } = await this.prisma.task.deleteMany({ where: { creatorId: id } });

      const goodbyeMessage = `
     <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background: #f9fafb;
              margin: 0;
              padding: 40px 20px;
              color: #111827;
            }
            .container {
              max-width: 600px;
              margin: auto;
              background: white;
              border-radius: 8px;
              padding: 30px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            }
            .header {
              font-size: 24px;
              font-weight: bold;
              color: #dc2626;
            }
            .message {
              margin-top: 20px;
              font-size: 16px;
              line-height: 1.6;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">👋 Goodbye from Task Master</div>
            <div class="message">
              <p>Hi ${user.name},</p>
              <p>
                Your account has been successfully deleted from Task Master. We're
                sorry to see you go.
              </p>
              <p>
                If this was a mistake or you change your mind, you're always welcome
                back!
              </p>
              <p>Take care,<br />The Task Master Team</p>
            </div>
          </div>
        </body>
      </html>
`
      await this.mailService.sendMail(
        user.email,
        'Goodbye from Task Master',
        'Goodbye from Task Master',
        goodbyeMessage
      );

      return { message: 'Account deleted successfully', deletedTasks: count };
    } catch (error) {
      this.logger.error(error.message, error.stack);

      if (error instanceof HttpException) throw error;

      throw new HttpException(
        {
          message: 'Account deletion failed',
          error: error.message || 'Unexpected error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async forgotPassword(email: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });

      if (!user) {
        throw new HttpException({ message: 'User not found', error: 'Not Found' }, HttpStatus.NOT_FOUND);
      }

      const OTP = Math.floor(100000000000 + Math.random() * 900000000000).toString();

      await this.otpService.saveToken(email, OTP);
      const formatOTP = (otp: string) => otp.match(/.{1,4}/g)?.join(' ') ?? otp;

      const formattedOTP = formatOTP(OTP);

      const htmlMessage = `
  <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 40px 20px; color: #111827;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);">
      <h2 style="color: #2a9d8f; margin-bottom: 20px;">🔐 Password Reset OTP</h2>
      <p style="font-size: 16px;">Hello <strong>${user.name}</strong>,</p>
      <p style="font-size: 16px; margin-top: 10px;">
        Your one-time password (OTP) to reset your password is:
      </p>
      <div style="
        font-size: 28px;
        font-weight: 600;
        letter-spacing: 0.15em;
        background: #e0f7f1;
        color: #065f46;
        padding: 14px 24px;
        border-radius: 6px;
        display: inline-block;
        margin: 20px 0;
      ">
        ${formattedOTP}
      </div>
      <p style="font-size: 16px;">This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone.</p>
      <p style="font-size: 16px; margin-top: 30px;">
        Thank you,<br />
        <span style="color: #6b7280;">Task Master Support Team</span>
      </p>
    </div>
  </div>
`;


      await this.mailService.sendMail(
        email,
        'Password Reset OTP',
        `Your OTP is ${formattedOTP}`,
        htmlMessage
      );

      return { message: 'OTP sent' };
    } catch (error) {
      this.logger.error(error.message, error.stack);

      if (error instanceof HttpException) throw error;

      throw new HttpException(
        {
          message: 'Password reset failed',
          error: error.message || 'Unexpected error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async resetPassword(dto: ResetPassDto) {
    try {
      const isValid = await this.otpService.verifyToken(dto.email, dto.OTP);

      if (!isValid) {
        throw new HttpException({ message: 'Invalid OTP', error: 'Unauthorized' }, HttpStatus.UNAUTHORIZED);
      }

      const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

      if (!user) {
        throw new HttpException({ message: 'User not found', error: 'Not Found' }, HttpStatus.NOT_FOUND);
      }

      const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
      await this.otpService.removeToken(dto.email);
      await this.prisma.user.update({
        where: { email: dto.email },
        data: { password: hashedPassword },
      });

      const passwordResetMessage = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background: #f9fafb;
              margin: 0;
              padding: 40px 20px;
              color: #111827;
            }
            .container {
              max-width: 600px;
              margin: auto;
              background: #ffffff;
              border-radius: 8px;
              padding: 30px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            }
            .header {
              font-size: 22px;
              font-weight: 600;
              color: #16a34a;
            }
            .message {
              margin-top: 20px;
              font-size: 16px;
              line-height: 1.6;
            }
            .warning {
              color: #dc2626;
              font-weight: 500;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">🔐 Your Password Was Changed</div>
            <div class="message">
              <p>Hi ${user.name},</p>
              <p>
                We wanted to let you know that your password was successfully updated.
              </p>
              <p>
                If you made this change, no further action is needed.
                <br />
                <span class="warning">
                  If you did not change your password, please reset it immediately and contact support.
                </span>
              </p>
              <p>
                Stay secure,<br />
                The Task Master Team
              </p>
            </div>
          </div>
        </body>
      </html>
      `
      await this.mailService.sendMail(
        dto.email,
        'Password Reset Confirmation',
        'Your password has been reset',
        passwordResetMessage
      );

      return { message: 'Password reset successfully' };
    } catch (error) {
      this.logger.error(error.message, error.stack);

      if (error instanceof HttpException) throw error;

      throw new HttpException(
        {
          message: 'Password reset failed',
          error: error.message || 'Unexpected error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async logout(token: string): Promise<{ message: string }> {
    try {

      if (!token) {
        throw new HttpException('Missing token', HttpStatus.BAD_REQUEST);
      }
      await this.authTokenService.invalidateToken(token);

      return { message: 'Logout successful' };
    } catch (error) {
      this.logger.error(error.message, error.stack);

      if (error instanceof HttpException) throw error;

      throw new HttpException(
        {
          message: 'Logout failed',
          error: error.message || 'Unexpected error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
