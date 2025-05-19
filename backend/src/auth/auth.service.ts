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


      const tasks = { cancelled: cancelledTasks, pending: pendingTasks, completed: completedTasks, overdue: overDueTasks };

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
    try {
      const { id } = AuthedUser
      const user = await this.prisma.user.findUnique({ where: { id } });

      if (!user) {
        throw new HttpException({ message: 'User not found', error: 'Not Found' }, HttpStatus.NOT_FOUND);
      }

      if (dto.oldPassword && !user.password) {
        throw new HttpException('Password not found', HttpStatus.BAD_REQUEST);
      }

      if (dto.oldPassword) {
        const isPasswordValid = await bcrypt.compare(dto.oldPassword, user.password);

        if (!isPasswordValid) {
          throw new HttpException({ message: 'Wrong password', error: 'Unauthorized' }, HttpStatus.UNAUTHORIZED);
        }
      }

      if (dto.newPassword) {
        const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
        await this.prisma.user.update({
          where: { id },
          data: { password: hashedPassword },
        });
      }

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          name: dto.name ?? user.name,
          email: dto.email ?? user.email,
        },
      });

      const { password, ...safeUser } = updatedUser;
      return safeUser;
    } catch (error) {
      this.logger.error(error.message, error.stack);

      if (error instanceof HttpException) throw error;

      throw new HttpException(
        {
          message: 'Update failed',
          error: error.message || 'Unexpected error',
        },
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
        throw new HttpException({ message: 'Wrong password', error: 'Unauthorized' }, HttpStatus.UNAUTHORIZED);
      }

      await this.prisma.user.delete({ where: { id } });
      const { count } = await this.prisma.task.deleteMany({ where: { creatorId: id } });

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
                        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
                          <h2 style="color: #2a9d8f;">Password Reset OTP</h2>
                          <p>Hello ${user.name},</p>
                          <p>Your one-time password (OTP) to reset your password is:</p>
                          <div style="
                            font-size: 28px;
                            font-weight: bold;
                            letter-spacing: 0.15em;
                            background: #e0f7f1;
                            padding: 12px 20px;
                            border-radius: 6px;
                            display: inline-block;
                            margin: 20px 0;
                            ">
                            ${formattedOTP}
                          </div>
                          <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
                          <p>Thank you,<br/>Task Master Support Team</p>
                        </div>
                      `;

      await this.mailService.sendMail(
        'topfateson@gmail.com',
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
