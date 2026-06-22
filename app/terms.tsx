import LegalLayout, {
  MailLink,
  P,
  Section,
} from "@/components/legal/LegalLayout";
import { APP_NAME, SUPPORT_EMAIL } from "@/utils/appInfo";

export default function TermsScreen() {
  return (
    <LegalLayout title="Terms of Service" updated="June 22, 2026">
      <P>
        Welcome to {APP_NAME}. By downloading or using the app you agree to these
        Terms of Service. Please read them carefully.
      </P>

      <Section heading="Use of the app">
        <P>
          {APP_NAME} is provided to help you organize tasks and reminders. You
          agree to use it only for lawful personal purposes and not to misuse or
          interfere with how it works.
        </P>
      </Section>

      <Section heading="Your content">
        <P>
          The tasks and information you create belong to you and are stored on
          your device. You are responsible for keeping your device and data
          secure. We are not able to recover data that is lost, for example after
          uninstalling the app or resetting your data.
        </P>
      </Section>

      <Section heading="Reminders">
        <P>
          The app schedules reminders on a best-effort basis using your device's
          notification system. Delivery can be affected by device settings,
          battery optimization, or the operating system. {APP_NAME} should not be
          relied upon as the sole reminder for safety-critical or time-critical
          events.
        </P>
      </Section>

      <Section heading="No warranty">
        <P>
          The app is provided "as is" without warranties of any kind. We do not
          guarantee that it will be uninterrupted, error-free, or fit for a
          particular purpose.
        </P>
      </Section>

      <Section heading="Limitation of liability">
        <P>
          To the extent permitted by law, we are not liable for any loss or
          damage arising from your use of, or inability to use, the app,
          including missed reminders or lost data.
        </P>
      </Section>

      <Section heading="Changes to these terms">
        <P>
          We may update these terms from time to time. Continued use of the app
          after changes means you accept the updated terms.
        </P>
      </Section>

      <Section heading="Contact us">
        <P>Questions about these terms? Reach us at:</P>
        <MailLink email={SUPPORT_EMAIL} />
      </Section>
    </LegalLayout>
  );
}
