export interface IPaymentService {
    createPaymentIntent(amount: number, currency: string): Promise<string>;
    confirmPayment(paymentIntentId: string): Promise<boolean>;
    refundPayment(paymentIntentId: string, amount?: number): Promise<boolean>;
  }