import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { CustomError } from '../../utils/error';

const supabaseAuthPlugin = async (fastify: FastifyInstance) => {
  /**
   * Send OTP
   */

  fastify.decorate('sendOTP', async (phone: string) => {
    try {
      const { data, error } = await fastify.supabase.auth.signInWithOtp({ phone });

      if (error) {
        throw CustomError.createHttpError({
          httpCode: Number(error.code) || 400,
          errorResponse: error.message,
          downstream_system: 'SUPABASE'
        });
      }

      return data;
    } catch (error) {
      fastify.log.error(error, 'ERROR SENDING OTP');
    }
  });

  /**
   * Verify OTP
   */

  fastify.decorate('verifyOTP', async (phone: string, otp: string) => {
    try {
      const { data, error } = await fastify.supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: 'sms'
      });

      if (error) {
        throw CustomError.createHttpError({
          httpCode: Number(error.code) || 400,
          errorResponse: error.message,
          downstream_system: 'SUPABASE'
        });
      }

      return data;
    } catch (error) {
      fastify.log.error(error, 'ERROR VERIFYING OTP');
    }
  });
};

export default fastifyPlugin(supabaseAuthPlugin);
