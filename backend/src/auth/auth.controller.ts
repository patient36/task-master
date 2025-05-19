import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login-dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthedUser } from 'src/common/types/authedUser';
import { ResetPassDto } from './dto/reset-pass.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('/create')
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @Public()
  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('/forgot-password')
  forgotPassword(@Body("email") email: string) {
    return this.authService.forgotPassword(email);
  }

  @Public()
  @Post('/reset-password')
  resetPassword(@Body() ResetPassDto: ResetPassDto) {
    return this.authService.resetPassword(ResetPassDto);
  }

  @Get('/me')
  getCurrentUser(@CurrentUser() user: AuthedUser) {
    return this.authService.getCurrentUser(user);
  }

  @Patch('/me')
  update(@Body() updateAuthDto: UpdateAuthDto, @CurrentUser() user: AuthedUser) {
    return this.authService.update(updateAuthDto, user);
  }

  @Delete('/me')
  deleteAccount(@Body() deleteUserDto: DeleteUserDto, @CurrentUser() user: AuthedUser) {
    return this.authService.deleteAccount(deleteUserDto, user);
  }
}
