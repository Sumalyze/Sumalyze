import LegalPageLayout, { LegalSection } from '../components/LegalPageLayout';

export default function RefundPolicy() {
  return (
    <LegalPageLayout
      title="Refund Policy"
      lastUpdated="June 16, 2026"
      intro="Sumalyze uses Paddle as its Merchant of Record for all subscription billing. Paddle processes payments, manages subscriptions, and handles refund requests on our behalf in accordance with Paddle's Buyer Terms and Refund Policy."
    >
      <LegalSection title="1. Merchant of Record">
        <p>
          All payments for Sumalyze paid plans (Starter, Pro, Max) are processed by <strong>Paddle.com Market Limited</strong> ("Paddle"), acting as the Merchant of Record. When you subscribe to a paid plan, your contract for the purchase is with Paddle, not directly with Sumalyze.
        </p>
        <p>
          Paddle is responsible for collecting payments, issuing invoices, handling VAT/tax compliance, and processing refunds according to its own Buyer Terms and applicable law.
        </p>
      </LegalSection>

      <LegalSection title="2. 14-Day Refund Window">
        <p>
          <strong>We offer a 14-day refund window</strong> from the date of your initial purchase or subscription renewal. If you are unsatisfied with your plan within this period, you may request a full refund, subject to the eligibility criteria below.
        </p>
        <p>
          Refund requests submitted after 14 days from the charge date will not be approved, except in cases of verified billing errors or service failures on our end.
        </p>
      </LegalSection>

      <LegalSection title="3. Eligibility">
        <p>You are eligible for a refund within the 14-day window if:</p>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 6, margin: '8px 0 0 16px', listStyleType: 'disc' }}>
          <li>You have not substantially used your plan quota (e.g., run significant analyses or Agent pipelines during the billing period).</li>
          <li>A technical billing error or duplicate charge occurred.</li>
          <li>A verified platform outage prevented access to paid features for more than 48 consecutive hours and could not be resolved by our support team.</li>
          <li>You accidentally renewed an annual subscription and contact us within 14 days of the renewal date without consuming paid features.</li>
        </ul>
        <p>
          Refunds are not automatic — they are reviewed on a case-by-case basis and may also be subject to review by Paddle under its Buyer Terms.
        </p>
      </LegalSection>

      <LegalSection title="4. Non-Refundable Cases">
        <p>Refunds will not be issued in the following cases:</p>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 6, margin: '8px 0 0 16px', listStyleType: 'disc' }}>
          <li>Requests submitted more than 14 days after the charge date.</li>
          <li>Significant usage of plan quota during the billing period.</li>
          <li>Change of mind after active usage of paid features.</li>
          <li>Failure to cancel before a subscription renewal.</li>
          <li>Account suspension due to a Terms of Service violation.</li>
          <li>Voluntary Ko-fi support payments, which are non-refundable unless required by applicable law or Ko-fi policy.</li>
          <li>Custom Team Workspace agreements governed by a separate written contract.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Cancellation">
        <p>
          You may cancel your subscription at any time via your Sumalyze account settings or through Paddle's subscription management portal. Cancellation stops future renewals. You retain access to paid features until the end of your current billing period.
        </p>
        <p>
          Cancellation alone does not trigger an automatic refund for the current period.
        </p>
      </LegalSection>

      <LegalSection title="6. How to Request a Refund">
        <p>
          To request a refund, contact our billing team at{' '}
          <a href="mailto:billing@sumalyze.space" style={{ color: '#ff8fa3', textDecoration: 'underline' }}>billing@sumalyze.space</a>{' '}
          within 14 days of the charge.
        </p>
        <p>Please include:</p>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 6, margin: '8px 0 0 16px', listStyleType: 'disc' }}>
          <li>Your registered account email address.</li>
          <li>Your Paddle transaction reference ID or invoice number.</li>
          <li>The date and amount of the charge.</li>
          <li>A brief description of your reason for requesting a refund.</li>
        </ul>
        <p>
          Once approved, refunds are processed by Paddle and timing depends on your payment method and financial institution. Paddle may also independently review the request under its Buyer Terms and Refund Policy.
        </p>
      </LegalSection>

      <LegalSection title="7. Paddle Buyer Terms">
        <p>
          As Paddle is the Merchant of Record, your purchase is also governed by{' '}
          <a href="https://www.paddle.com/legal/buyer-terms" target="_blank" rel="noopener noreferrer" style={{ color: '#ff8fa3', textDecoration: 'underline' }}>
            Paddle's Buyer Terms
          </a>{' '}
          and{' '}
          <a href="https://www.paddle.com/legal/refunds" target="_blank" rel="noopener noreferrer" style={{ color: '#ff8fa3', textDecoration: 'underline' }}>
            Paddle's Refund Policy
          </a>. In the event of a conflict between Sumalyze's refund terms and Paddle's terms, Paddle's terms as Merchant of Record will apply.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
