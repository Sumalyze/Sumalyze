import LegalPageLayout, { LegalSection } from '../components/LegalPageLayout';

export default function RefundPolicy() {
  return (
    <LegalPageLayout
      title="Refund Policy"
      lastUpdated="June 1, 2026"
      intro="At Sumalyze, we aim to provide a premium AI workspace experience. We offer a robust Free plan to allow you to evaluate our tools before making a purchase. This Refund Policy describes the terms and conditions under which refunds are reviewed and issued for paid subscriptions."
    >
      <LegalSection title="1. Free Evaluation & Trial Periods">
        <p>
          We strongly encourage users to try the Free plan and review their feature needs and plan limits (including daily/monthly run quotas and file size boundaries) before subscribing to a paid tier (Starter, Pro, Max). 
        </p>
        <p>
          <strong>Trials:</strong> From time to time, we may offer subscription trials. You must cancel your subscription before the trial period ends to avoid being charged the standard recurring subscription fee.
        </p>
      </LegalSection>

      <LegalSection title="2. Subscription Cancellation & Auto-Renewals">
        <p>
          All paid subscriptions are processed through Paddle, our Merchant of Record and payment provider. Subscriptions renew automatically at the start of each billing period (monthly or annual) unless cancelled.
        </p>
        <p>
          <strong>Effect of Cancellation:</strong> Cancelling your subscription stops future renewal charges. Your paid account access will continue until the end of your current paid billing period, but cancellation does not trigger an automatic refund of the current period's payment.
        </p>
      </LegalSection>

      <LegalSection title="3. Refund Request Window & Eligibility Criteria">
        <p>
          Refunds are reviewed manually on a case-by-case basis and are not automatic. <strong>All refund requests must be submitted within 7 days of the charge in question.</strong>
        </p>
        <p>We will consider issuing a refund under the following circumstances:</p>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 6, margin: '8px 0 0 16px', listStyleType: 'disc' }}>
          <li>A technical billing error, duplicate charge, or system failure resulting in you being billed multiple times for the same subscription period.</li>
          <li>An accidental annual renewal, provided that you contact us within 7 days of the renewal date and have not consumed any paid AI processing credits or run any Agent pipelines during the new billing cycle.</li>
          <li>A major, documented platform outage or server-side issue that prevented you from accessing paid features for more than 48 consecutive hours, and which our support team is unable to resolve.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Non-Refundable Cases">
        <p>Refunds will not be issued in the following scenarios:</p>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 6, margin: '8px 0 0 16px', listStyleType: 'disc' }}>
          <li>Change of mind, personal budgeting issues, or deciding you no longer need the tool after paid usage has occurred.</li>
          <li>Significant utilization of your plan limits (e.g. you have run multiple text analyses or Agent queries during the active billing period).</li>
          <li>Failure to cancel a trial or active subscription before the renewal date.</li>
          <li>Account suspension or termination resulting from a violation of our Terms of Service (e.g. rate-limit abuse, scraping, or illegal activities).</li>
          <li>Voluntary support and donation payments made through Ko-fi, unless explicitly required by law or Ko-fi policy.</li>
          <li>Custom enterprise or Team Workspace agreements, which are governed by their respective written contracts.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. How to Request a Refund">
        <p>
          To request a refund review, please contact our billing department by sending an email to:{' '}
          <a href="mailto:billing@sumalyze.space" style={{ color: '#ff8fa3', textDecoration: 'underline' }}>billing@sumalyze.space</a>.
        </p>
        <p>
          To help us process your request quickly, please include:
        </p>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 6, margin: '8px 0 0 16px', listStyleType: 'disc' }}>
          <li>Your registered account email address.</li>
          <li>Your Paddle transaction reference ID or invoice number.</li>
          <li>The date and amount of the charge.</li>
          <li>A brief description of your reason for requesting a refund.</li>
        </ul>
        <p style={{ marginTop: 12 }}>
          Approved refunds are processed through Paddle and may also be subject to Paddle’s refund review, buyer terms, and payment method limitations. Once issued, refund timing depends on Paddle, the payment method, and the user’s financial institution.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
