const vehicleOwnerModel = require("../models/vehicleOwnerModel");
const riderModel = require("../models/riderModel");
const adminModel = require("../models/adminModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth_mail_template = require("../utils/tpl/auth.mail.tpl");
const transport = require("../helpers/mail.helper");
const onboarding_template = require("../utils/tpl/onboard");

class AuthenticationError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AuthenticationError';
  }
}

class AuthService {
  constructor() {
    this.modelMap = {
      owner: vehicleOwnerModel,
      rider: riderModel,
      admin: adminModel
    };
  }

  validateLoginInput(email, password) {
    if (!email?.trim()) {
      throw new AuthenticationError('Email is required', 400);
    }
    if (!password?.trim()) {
      throw new AuthenticationError('Password is required', 400);
    }
  }

  async findUserByEmail(accountType, email) {
    const Model = this.modelMap[accountType];
    if (!Model) {
      throw new AuthenticationError('Invalid account type', 400);
    }

    const user = await Model.findOne({
      email: { $regex: new RegExp(email, 'i') }
    });

    if (!user) {
      throw new AuthenticationError('Account not found', 404);
    }
    return user;
  }

  async validateUserStatus(user) {
    if (user.deleted) {
      throw new AuthenticationError('Account has been deleted', 404);
    }
    if (!user.account_active) {
      throw new AuthenticationError('Account has been deactivated, contact an admin', 401);
    }
  }

  async verifyPassword(password, hashedPassword) {
    const isValid = await bcrypt.compare(password, hashedPassword);
    if (!isValid) {
      throw new AuthenticationError('Email or Password is incorrect', 400);
    }
  }

  generateToken(userId, accountType) {
    return jwt.sign(
      {
        uId: userId,
        accountType: accountType
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  }

  async login(accountType, email, password) {
    try {
      this.validateLoginInput(email, password);

      const user = await this.findUserByEmail(accountType, email);
      await this.validateUserStatus(user);
      await this.verifyPassword(password, user.password);

      if (!user.email_verified) {
        const otp = await this.generateOTP();
        await user.updateOne({otp});

        await transport.sendMail({
          from: process.env.SMTP_FROM_EMAIL || "chida.codes@gmail.com",
          to: user.email,
          subject: "Verify your email",
          html: onboarding_template.otp({
            name: user.full_name,
            otp
          })
        });
        return {
          token:null,
          okay: true,
          message: 'An email has been sent to you with an OTP to verify your email address. Please check your email and input the OTP in the login page.',
          profile: user.toObject()
        };
      }

      const token = this.generateToken(user._id, user.account_type);
      user.password = null;
      const userProfile = user.toObject();
      delete userProfile.password;

      return {
        okay: true,
        token,
        profile: userProfile
      };
    } catch (error) {
      console.error('Login error:', error);
      throw new AuthenticationError(
        error.message || 'Error logging in',
        error.statusCode || 500
      );
    }
  }

  async generateOTP() {
    return Math.floor(100000 + Math.random() * 9000);
  }

  async sendPasswordResetEmail(user, token) {
    try {
      return new Promise((resolve, reject) => {
        transport.sendMail({
          from: process.env.SMTP_FROM_EMAIL || "chida.codes@gmail.com",
          to: user.email,
          subject: "Password Reset Request",
          html: auth_mail_template.reset({
            name: user.full_name,
            otp: token
          })
        }, (error, info) => {
          if (error) {
            console.error('Email sending failed:', error);
            reject(new Error('Failed to send reset email'));
          } else {
            resolve({
              status: true,
              message: 'Reset email sent successfully'
            });
          }
        });
      });
    } catch (error) {
      throw new Error('Failed to send reset email');
    }
  }

  async requestPasswordReset(email) {
    try {
      // Try to find user across all models
      const user = await Promise.any([
        this.findUserByEmail('owner', email),
        this.findUserByEmail('rider', email),
        this.findUserByEmail('admin', email)
      ]).catch(() => null);

      if (!user) {
        return {
          status: false,
          message: 'User not found'
        };
      }

      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      


      return await this.sendPasswordResetEmail(user, token);
    } catch (error) {
      console.error('Password reset error:', error);
      return {
        status: false,
        message: 'Error processing password reset request'
      };
    }
  }
}

const authService = new AuthService();

module.exports = {
  accountLoginFunction: (accountType, email, password) => 
    authService.login(accountType, email, password),
  pw_reset_controller: (email) => 
    authService.requestPasswordReset(email)
};