import LegalPageLayout, { LegalSection } from '../components/LegalPageLayout';

export default function BillingTerms() {
  return (
    <LegalPageLayout
      title="Billing & Subscription Terms"
      lastUpdated="June 1, 2026"
      intro="These Billing & Subscription Terms govern all transactions, billing cycles, pricing plans, and renewals for paid accounts on Sumalyze."
    >
      <LegalSection title="1. Subscription Plans & Feature Limits">
        <p>
          Sumalyze provides different subscription tiers to match your usage needs:
        </p>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 6, margin: '8px 0 0 16px', listStyleType: 'disc' }}>
          <li><strong>Free:</strong> For basic testing and casual use. Offers limited daily runs, basic document uploads, and core exports.</li>
          <li><strong>Starter:</strong> Designed for light professional needs. Offers monthly and daily quotas and basic PDF export.</li>
          <li><strong>Pro:</strong> For heavy users requiring higher file limits, extensive Agent runs, and advanced document exports.</li>
          <li><strong>Max:</strong> Our highest individual tier providing maximum quotas, large document uploads, and priority support.</li>
          <li><strong>Team Workspace:</strong> A waitlist-only plan offering shared team history and collaboration. Team Workspace access, pricing, and billing may be governed by separate written terms or onboarding agreements once waitlist applications are approved.</li>
        </ul>
        <p style={{ marginTop: 12 }}>
          <strong>No Unlimited Usage:</strong> Features are subject to strict resource allocations. Exceeding monthly or daily plan thresholds will restrict further processing until the quota resets or you upgrade your tier.
        </p>
      </LegalSection>

      <LegalSection title="2. Billing Cycles, Pricing, & Annual Billing">
        <p>
          Subscriptions are billed on a recurring basis:
        </p>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 6, margin: '8px 0 0 16px', listStyleType: 'disc' }}>
          <li><strong>Monthly:</strong> Monthly subscriptions renew on a monthly billing cycle starting from the purchase date.</li>
          <li><strong>Annual:</strong> Billed upfront for a 12-month period. Monthly-equivalent prices are displayed on our pricing page for comparative purposes. The full upfront annual cost is clearly presented to you at checkout before payment confirmation.</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Paddle Payment Processor & Security">
        <p>
          We use Paddle as our Merchant of Record and payment gateway. Paddle handles card authorizations, transactions, global taxation, compliance, and receipting. 
        </p>
        <p>
          By purchasing a plan, you agree to Paddle’s terms and privacy policies. Sumalyze does not collect, transmit, or store your raw credit card numbers or security codes.
        </p>
      </LegalSection>

      <LegalSection title="4. Auto-Renewal & Subscription Trials">
        <p>
          <strong>Auto-Renewal:</strong> To prevent service interruptions, your subscription automatically renews at the start of the next cycle. You authorize Paddle to charge the recurring subscription fee using the payment method on file.
        </p>
        <p>
          <strong>Trials:</strong> If you sign up for a trial period, billing details are required. If you do not cancel the trial before its expiration, it will automatically convert into a paid subscription, and the recurring fee will be charged.
        </p>
      </LegalSection>

      <LegalSection title="5. Customer Portal & Subscription Cancellation">
        <p>
          You can manage your subscription, update payment methods, download invoices, and cancel future renewals through the billing/customer portal available within your account settings, or by contacting our billing support team directly.
        </p>
        <p>
          Cancellation stops future renewal charges. Paid feature access will remain active through the remainder of the currently billed cycle.
        </p>
      </LegalSection>

      <LegalSection title="6. Taxes, VAT, and Billing Failures">
        <p>
          <strong>Taxes:</strong> Taxes, VAT, GST, or similar charges may apply and will be calculated and shown by Paddle at checkout where required. Any applicable taxes are calculated, displayed, and collected by Paddle at checkout based on your location.
        </p>
        <p>
          <strong>Failed Payments:</strong> If a recurring transaction fails, Paddle will attempt to re-charge the card over several days. During this period, your account status may be marked as past_due. If payments remain unpaid, your account will be downgraded to the Free tier, which may result in data access limits.
        </p>
      </LegalSection>

      <LegalSection title="7. Price Modifications & Billing Support">
        <p>
          We reserve the right to modify pricing tiers or feature limits. We will provide notice of material pricing changes where required by law or Paddle billing rules.
        </p>
        <p>
          For invoice requests, checkout errors, or cancellation issues, contact us at:{' '}
          <a href="mailto:billing@sumalyze.space" style={{ color: '#ff8fa3', textDecoration: 'underline' }}>billing@sumalyze.space</a>.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
