import React, { useState, useEffect } from 'react';
import { Shield, FileText, MapPin, Mail } from 'lucide-react';

interface LegalPageProps {
  initialTab?: 'privacy' | 'terms';
  onBack?: () => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ initialTab = 'privacy' }) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>(initialTab);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get('page');
    if (pageParam === 'terms' || window.location.hash === '#terms') {
      setActiveTab('terms');
    } else if (pageParam === 'privacy' || window.location.hash === '#privacy') {
      setActiveTab('privacy');
    }
  }, []);

  const handleTabChange = (tab: 'privacy' | 'terms') => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set('page', tab);
    url.hash = tab;
    window.history.replaceState({}, '', url.toString());
  };

  const effectiveDate = 'September 27, 2026';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-purple-100 selection:text-purple-900 pb-16">
      {/* Clean Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
              Covai Meter Taxi
            </h1>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => handleTabChange('privacy')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'privacy'
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Privacy Policy</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('terms')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'terms'
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Terms & Conditions</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Document Body */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {/* Tab 1: Privacy Policy */}
        {activeTab === 'privacy' && (
          <article className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-10 space-y-8 leading-relaxed">
            {/* Header */}
            <div className="border-b border-slate-100 pb-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Privacy Policy
              </h2>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                Last Updated: <span className="text-slate-800">{effectiveDate}</span> · Effective Date: {effectiveDate}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Application: <strong>Covai Meter Taxi</strong> · Coimbatore, Tamil Nadu, India.
              </p>
            </div>

            {/* Introduction */}
            <section className="space-y-3">
              <p className="text-sm text-slate-700">
                At <strong>Covai Meter Taxi</strong> (referred to as “the App”, “we”, “us”, or “our”), we respect your privacy and are committed to protecting the personal data of our drivers and users. This Privacy Policy details how we collect, use, process, store, and disclose information when you install, register with, or use <strong>Covai Meter Taxi</strong> on your mobile device.
              </p>
              <p className="text-sm text-slate-700">
                Please read this document carefully. By installing or utilizing the App, you acknowledge and agree to the practices outlined in this Privacy Policy.
              </p>
            </section>

            {/* Section 1: Prominent Disclosure - Location & Background GPS */}
            <section className="space-y-3 p-5 rounded-2xl bg-amber-50/70 border border-amber-200">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-700 shrink-0" />
                <h3 className="text-base font-bold text-slate-900">
                  1. Location Data & Background GPS Tracking Disclosure
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-amber-950 font-medium">
                <strong>Covai Meter Taxi</strong> collects and processes precise GPS location data and background location data solely to enable core taxi meter functionality:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-amber-900">
                <li>
                  <strong>Real-Time Meter Calculation:</strong> Computing exact distance traveled, route duration, vehicle speed, and waiting time to calculate accurate trip fares.
                </li>
                <li>
                  <strong>Background Tracking During Active Trips:</strong> When a meter trip is started, the App continuously tracks distance and GPS positions even when running in the background, minimized, or when the screen is locked, ensuring accurate fare calculation throughout the journey.
                </li>
                <li>
                  <strong>No Tracking When Idle:</strong> Location data collection ceases when a trip is ended or when the meter is not actively running.
                </li>
                <li>
                  <strong>No Sale of Location Data:</strong> We do not sell, rent, or trade your real-time or historical GPS location data to any third-party advertisers or data brokers.
                </li>
              </ul>
            </section>

            {/* Section 2: Information We Collect */}
            <section className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900">
                2. Information We Collect
              </h3>
              <p className="text-sm text-slate-700">
                We only collect data necessary to administer driver accounts, enforce single-device authorization, and calculate taxi fares:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                  <h4 className="font-bold text-slate-900 mb-1">A. Driver Identity & Contact</h4>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600">
                    <li>Driver Full Name</li>
                    <li>Registered Mobile Phone Number</li>
                    <li>Driver ID (e.g. 001, 002)</li>
                    <li>4-Digit Secure Login PIN</li>
                  </ul>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                  <h4 className="font-bold text-slate-900 mb-1">B. Vehicle Information</h4>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600">
                    <li>Vehicle Registration Number (e.g. TN 38 AA 1234)</li>
                    <li>Vehicle Category (Mini, Sedan, INNOVA, SUV, etc.)</li>
                    <li>Applicable fare tariff rates</li>
                  </ul>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                  <h4 className="font-bold text-slate-900 mb-1">C. Hardware & Device Binding</h4>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600">
                    <li>Unique Device Hardware ID / Device Binding Token</li>
                    <li>Operating System version & model</li>
                    <li>Used strictly for single-phone anti-fraud locking</li>
                  </ul>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                  <h4 className="font-bold text-slate-900 mb-1">D. Trip & Meter Records</h4>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600">
                    <li>Trip start time, end time, and duration</li>
                    <li>Total distance (km) and waiting charges</li>
                    <li>Final calculated trip tariff</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 3: Android System Permissions Required */}
            <section className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900">
                3. Android Device Permissions Required
              </h3>
              <p className="text-sm text-slate-700">
                To function properly as a digital taxi meter, the App requests the following Android permissions:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Permission</th>
                      <th className="p-2.5">Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-2.5 font-mono text-purple-700 font-semibold">ACCESS_FINE_LOCATION</td>
                      <td className="p-2.5 text-slate-600">High-accuracy GPS tracking to compute trip kilometers and waiting speed thresholds.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono text-purple-700 font-semibold">ACCESS_BACKGROUND_LOCATION</td>
                      <td className="p-2.5 text-slate-600">Allows the meter to continue calculating distance seamlessly if the driver receives a call or minimizes the app during a ride.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono text-purple-700 font-semibold">FOREGROUND_SERVICE</td>
                      <td className="p-2.5 text-slate-600">Maintains persistent meter computation with a visible status bar notification during active trips.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono text-purple-700 font-semibold">INTERNET</td>
                      <td className="p-2.5 text-slate-600">Authenticating driver PINs, syncing fleet authorization, and updating tariff tables.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 4: Data Storage, Security & Single-Device Binding */}
            <section className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900">
                4. Data Storage, Security & Single-Device Binding
              </h3>
              <p className="text-sm text-slate-700">
                We implement industry-standard administrative, physical, and technical security measures (including HTTPS/TLS transmission and Google Cloud Firestore security rules) to safeguard driver credentials and trip records.
              </p>
              <p className="text-sm text-slate-700">
                <strong>Device Binding Security:</strong> Each driver account is bound to a single physical device upon first login. This prevents unauthorized multiple logins or credential sharing. If a driver changes their phone, the fleet admin can reset the binding token from the Admin Console.
              </p>
            </section>

            {/* Section 5: Third-Party Service Providers */}
            <section className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900">
                5. Third-Party Service Providers
              </h3>
              <p className="text-sm text-slate-700">
                We do not sell, rent, or lease personal information. We may transmit necessary operational data only to trusted infrastructure providers:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-600">
                <li>
                  <strong>Google Play Services:</strong> Core Android system libraries for location retrieval, map services, and app updates.
                </li>
                <li>
                  <strong>Google Cloud / Firebase:</strong> Secure database cloud hosting (Firestore) for driver rosters and tariff synchronization.
                </li>
                <li>
                  <strong>Legal Requirements:</strong> We may disclose data if compelled by applicable law, regulation, legal process, or lawful request by Indian public authorities.
                </li>
              </ul>
            </section>

            {/* Section 6: Data Retention & Deletion */}
            <section className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                6. Data Retention and Account / Data Deletion Policy
              </h3>
              <p className="text-xs sm:text-sm text-slate-700">
                In compliance with Google Play Store User Data policies:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-600">
                <li>
                  Driver profiles and trip summaries are retained for as long as the driver is enrolled with Covai Meter Taxi.
                </li>
                <li>
                  <strong>Right to Deletion:</strong> Any driver or operator can request complete deletion of their account, personal details, device binding ID, and trip history.
                </li>
                <li>
                  <strong>How to Request Deletion:</strong> Email us at <a href="mailto:covaimetertaxi@gmail.com" className="font-bold text-purple-700 underline">covaimetertaxi@gmail.com</a> with the subject <em>“Data Deletion Request - [Driver ID]”</em>. Deletion requests are processed within 14 business days.
                </li>
              </ul>
            </section>

            {/* Section 7: Children's Privacy */}
            <section className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900">
                7. Children’s Privacy
              </h3>
              <p className="text-sm text-slate-700">
                The App is exclusively intended for licensed commercial taxi drivers aged 18 and older. We do not knowingly solicit or collect personal information from individuals under the age of 18.
              </p>
            </section>

            {/* Section 8: Changes to this Policy */}
            <section className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900">
                8. Changes to this Privacy Policy
              </h3>
              <p className="text-sm text-slate-700">
                We may periodically update this Privacy Policy to reflect app enhancements or legal mandates. Any revisions will be reflected on this page with an updated “Last Updated” date.
              </p>
            </section>

            {/* Section 9: Contact Us */}
            <section className="space-y-3 p-5 rounded-2xl bg-purple-50/60 border border-purple-200/80">
              <h3 className="text-base font-bold text-purple-950 flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-700" />
                <span>9. Contact & Support Information</span>
              </h3>
              <p className="text-xs sm:text-sm text-purple-900">
                If you have questions, feedback, or data privacy requests regarding <strong>Covai Meter Taxi</strong>, please contact:
              </p>
              <div className="text-xs sm:text-sm text-purple-950 space-y-1 font-medium">
                <p><strong>Entity:</strong> Covai Meter Taxi</p>
                <p><strong>Official Email:</strong> <a href="mailto:covaimetertaxi@gmail.com" className="font-bold text-purple-700 underline">covaimetertaxi@gmail.com</a></p>
                <p><strong>Location:</strong> Coimbatore, Tamil Nadu, India</p>
              </div>
            </section>
          </article>
        )}

        {/* Tab 2: Terms & Conditions */}
        {activeTab === 'terms' && (
          <article className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-10 space-y-8 leading-relaxed">
            {/* Header */}
            <div className="border-b border-slate-100 pb-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Terms & Conditions
              </h2>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                Last Updated: <span className="text-slate-800">{effectiveDate}</span> · Effective Date: {effectiveDate}
              </p>
              <p className="text-sm text-slate-700 mt-4 leading-normal">
                By installing, registering, accessing, or using <strong>Covai Meter Taxi</strong> (“App”), you acknowledge that you have read, understood, and agreed to these Terms & Conditions.
              </p>
            </div>

            {/* Sections 1 to 17 */}
            <div className="space-y-6 text-sm text-slate-700">
              <section className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900">
                  1. Purpose of the App
                </h3>
                <p>
                  The App is a taxi meter and trip-management tool designed to assist drivers with fare calculations, trip tracking, trip records, and related operational functions.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900">
                  2. Fare Calculation
                </h3>
                <p>
                  Fare amounts displayed by the App are calculated or estimated using configured tariff settings, GPS/location data, distance, time, waiting time, and other applicable parameters.
                </p>
                <p>
                  The App is a calculation and record-keeping tool only. Drivers are responsible for verifying the applicable tariff, trip details, additional charges, and final fare before collecting payment from passengers.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900">
                  3. Driver Responsibility
                </h3>
                <p>
                  Drivers are solely responsible for complying with all applicable laws, permits, licences, insurance requirements, taxation requirements, transport regulations, local authority requirements, and other legal obligations applicable to their taxi or transport service.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900">
                  4. GPS and Technical Accuracy
                </h3>
                <p>
                  The Company does not guarantee that GPS signals, location information, distance measurements, travel-time calculations, routes, or fare calculations will always be accurate or available.
                </p>
                <p>
                  Factors such as GPS signal quality, device hardware, network connectivity, battery level, satellite availability, road conditions, and software or third-party service limitations may affect App results.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900">
                  5. Verification Before Payment
                </h3>
                <p>
                  Drivers must verify trip details, distance, waiting time, applicable charges, and the final fare before completing a trip and collecting payment from a passenger.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900">
                  6. No Participation in Passenger Transactions
                </h3>
                <p>
                  The App does not participate in fare negotiations, fare collection, payment recovery, refunds, or dispute resolution between drivers and passengers unless a separate service specifically states otherwise.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900">
                  7. Fare and Service Disputes
                </h3>
                <p>
                  Drivers are responsible for handling disputes, refund requests, overcharge or undercharge claims, customer complaints, and other claims relating to fares or taxi services provided by the driver, subject to applicable law.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900">
                  8. Additional Charges
                </h3>
                <p>
                  Where legally permitted and applicable, drivers are responsible for correctly determining and collecting additional charges such as tolls, parking charges, permit charges, waiting charges, state entry taxes, and other applicable trip-related charges.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900">
                  9. Device and Connectivity
                </h3>
                <p>
                  Drivers are responsible for maintaining a compatible device, sufficient battery power, internet connectivity where required, GPS/location permissions, and other technical requirements necessary to use the App.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900">
                  10. Prohibited Use
                </h3>
                <p>
                  Users must not misuse the App, interfere with its operation, create fraudulent or false trip records, attempt unauthorized access, reverse engineer the App, modify the App without authorization, or use the App for unlawful purposes.
                </p>
                <p>
                  The Company may suspend or terminate access where reasonably necessary because of misuse, fraud, security concerns, or violation of these Terms, subject to applicable law.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900">
                  11. Service Availability and Liability
                </h3>
                <p>
                  The Company does not guarantee uninterrupted or error-free operation of the App.
                </p>
                <p>
                  To the maximum extent permitted by applicable law, the Company will not be responsible for indirect or consequential losses arising from the use of the App, including loss of income, business interruption, customer disputes, fare disputes, data loss, or other losses resulting from reliance on App calculations or information.
                </p>
                <p>
                  Nothing in these Terms excludes or limits any liability that cannot legally be excluded or limited under applicable law.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900">
                  12. Fees and Payments
                </h3>
                <p>
                  Any registration, activation, subscription, renewal, verification, compliance, or other fees charged by the Company will be communicated through the applicable service or payment terms.
                </p>
                <p>
                  Refund eligibility, if any, will be governed by the applicable payment and refund policy and applicable law.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900">
                  13. Changes to the App and Terms
                </h3>
                <p>
                  The Company may update, modify, suspend, or discontinue App features and may update tariff configurations, pricing structures, policies, or these Terms from time to time.
                </p>
                <p>
                  Where required by applicable law, users will be provided with appropriate notice of material changes.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900">
                  14. Acceptance of Updated Terms
                </h3>
                <p>
                  Continued use of the App after the effective date of updated Terms constitutes acceptance of the revised Terms, where legally permitted.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900">
                  15. Governing Law and Jurisdiction
                </h3>
                <p>
                  These Terms shall be governed by the laws applicable in India.
                </p>
                <p>
                  Subject to any mandatory jurisdiction or dispute-resolution rights provided by applicable law, disputes relating to the App shall be subject to the jurisdiction of the competent courts in Coimbatore, Tamil Nadu, India.
                </p>
              </section>

              <section className="space-y-1.5 p-4 rounded-2xl bg-purple-50/70 border border-purple-200">
                <h3 className="text-base font-bold text-purple-950">
                  16. Privacy
                </h3>
                <p className="text-purple-900">
                  Use of the App is also subject to the{' '}
                  <button
                    type="button"
                    onClick={() => handleTabChange('privacy')}
                    className="font-bold underline text-purple-700 hover:text-purple-900 cursor-pointer"
                  >
                    Covai Meter Taxi Privacy Policy
                  </button>
                  , which explains how personal and device information, including location information where applicable, is collected, used, stored, and shared.
                </p>
              </section>

              <section className="space-y-2 p-5 rounded-2xl bg-slate-900 text-white">
                <h3 className="text-base font-bold text-amber-400">
                  17. Final Acknowledgement
                </h3>
                <p className="text-xs sm:text-sm text-slate-200">
                  By tapping <strong>“I Agree”</strong> or using the App, you acknowledge that you have read and understood these Terms & Conditions and agree to use the App in accordance with them.
                </p>
                <p className="text-xs sm:text-sm text-slate-300">
                  You understand that the App is a tool for fare calculation and trip management and that responsibility for taxi services, applicable fares, passenger interactions, legal compliance, and collection of payment remains with the driver, subject to applicable law.
                </p>
              </section>
            </div>
          </article>
        )}

        {/* Clean Bottom Footer */}
        <div className="mt-8 text-center text-xs text-slate-400 space-y-1">
          <p>© {new Date().getFullYear()} Covai Meter Taxi. All rights reserved.</p>
          <p>Coimbatore, Tamil Nadu, India · covaimetertaxi@gmail.com</p>
        </div>
      </main>
    </div>
  );
};
