import LegalLayout, {
  Bullet,
  MailLink,
  P,
  Section,
} from "@/components/legal/LegalLayout";
import { SUPPORT_EMAIL } from "@/utils/appInfo";

export default function PrivacyPolicyScreen() {
  return (
    <LegalLayout title="Privacy Policy" updated="June 22, 2026">
      <P>
        Daily Planner ("the app", "we", "us") is built to help you plan tasks
        and receive reminders. We respect your privacy. This policy explains
        what information the app uses and how it is handled.
      </P>

      <Section heading="Information we store">
        <P>
          The app stores the data you create directly on your device. We do not
          run servers that collect or receive your personal data. This on-device
          data includes:
        </P>
        <Bullet>Your tasks, schedules, priorities and completion history.</Bullet>
        <Bullet>The profile details you enter, such as name and wake/sleep times.</Bullet>
        <Bullet>Your reminder and notification preferences.</Bullet>
      </Section>

      <Section heading="How your data is used">
        <P>
          Your information is used only to run the app's features — showing your
          planner, calculating your stats and streaks, and scheduling the
          reminders you ask for. It stays on your device.
        </P>
      </Section>

      <Section heading="Notifications">
        <P>
          With your permission, the app schedules local notifications to remind
          you about your tasks. These reminders are generated on your device.
          You can turn notification permission off at any time in your device
          settings.
        </P>
      </Section>

      <Section heading="Advertising">
        <P>
          The app displays ads through Google AdMob. To serve ads, Google may
          collect and process limited data such as your device's advertising
          ID, IP address, and general device information, and may use it to
          provide and personalize ads.
        </P>
        <P>
          You can read how Google uses this data at
          policies.google.com/technologies/partner-sites, and you can reset or
          limit your advertising ID from your device settings.
        </P>
      </Section>

      <Section heading="Data sharing">
        <P>
          We do not sell or rent your personal data. Apart from the advertising
          data handled by Google AdMob (see Advertising above), your data stays
          on your device and is not transmitted to us.
        </P>
      </Section>

      <Section heading="Data retention and deletion">
        <P>
          Your data remains on your device until you delete it. You can remove
          everything at any time using "Reset Data" in the Profile screen, or by
          uninstalling the app, which clears all stored data.
        </P>
      </Section>

      <Section heading="Children's privacy">
        <P>
          The app is not directed at children under 13 and does not knowingly
          collect personal information from them.
        </P>
      </Section>

      <Section heading="Changes to this policy">
        <P>
          We may update this policy from time to time. Material changes will be
          reflected by updating the date at the top of this page.
        </P>
      </Section>

      <Section heading="Contact us">
        <P>If you have questions about this policy, reach us at:</P>
        <MailLink email={SUPPORT_EMAIL} />
      </Section>
    </LegalLayout>
  );
}
