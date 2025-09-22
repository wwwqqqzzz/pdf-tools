import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - PDF Tools',
  description: 'Terms of Service for PDF Tools. Free online PDF processing tools with complete privacy protection.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <a href="/" className="text-2xl font-bold text-gray-900">PDF Tools</a>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="/privacy" className="text-gray-600 hover:text-gray-900">Privacy</a>
              <a href="/merge-pdf" className="text-gray-600 hover:text-gray-900">Merge PDF</a>
              <a href="/split-pdf" className="text-gray-600 hover:text-gray-900">Split PDF</a>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-lg text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <p className="mb-6">
              Welcome to PDF Tools. These Terms of Service govern your use of our website 
              and services. By using our service, you agree to these terms.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Service Description</h2>
            <p className="mb-4">
              PDF Tools provides free online PDF processing tools including:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>PDF merging and splitting</li>
              <li>PDF compression and optimization</li>
              <li>Format conversion tools (PDF ↔ Word, PDF ↔ Images)</li>
              <li>PDF rotation and watermarking</li>
              <li>Other PDF manipulation tools</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Acceptable Use</h2>
            <p className="mb-4">You agree to use our service only for lawful purposes. You may not:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Process copyrighted material without proper authorization</li>
              <li>Upload malicious files, viruses, or harmful content</li>
              <li>Attempt to reverse engineer or compromise our service</li>
              <li>Use automated tools to overload our servers</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Interfere with other users' access to the service</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Privacy and Data Protection</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>All file processing happens entirely in your browser</li>
              <li>We do not store, access, or transmit your files to our servers</li>
              <li>Your files are automatically cleared from browser memory after processing</li>
              <li>We do not collect personal information without your consent</li>
              <li>See our Privacy Policy for complete details on data handling</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Service Availability</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>We strive for 99.9% uptime but cannot guarantee uninterrupted service</li>
              <li>We may perform scheduled maintenance that temporarily affects availability</li>
              <li>We reserve the right to modify, suspend, or discontinue features with notice</li>
              <li>Service availability may vary based on your internet connection and device</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. File Size and Usage Limits</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Free users: Maximum 25MB per file, 10 files per operation</li>
              <li>Processing timeout: 60 seconds per operation</li>
              <li>Daily usage limits may apply to prevent abuse</li>
              <li>These limits may change with reasonable notice</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Intellectual Property</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>You retain all rights to your files and content</li>
              <li>Our service, website content, and technology are protected by copyright</li>
              <li>You may not copy, distribute, or create derivative works of our service</li>
              <li>Our trademarks and logos may not be used without permission</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Disclaimers and Limitations</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Our service is provided "as is" without warranties of any kind</li>
              <li>We are not responsible for data loss, corruption, or quality issues</li>
              <li>Always maintain backups of important files before processing</li>
              <li>We are not liable for any direct, indirect, or consequential damages</li>
              <li>Our liability is limited to the maximum extent permitted by law</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Third-Party Services</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>We may display advertisements provided by third-party services</li>
              <li>We use analytics services to improve our website performance</li>
              <li>We are not responsible for third-party content or services</li>
              <li>Third-party services have their own terms and privacy policies</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. User Conduct</h2>
            <p className="mb-4">Users are expected to:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Use the service responsibly and ethically</li>
              <li>Respect the rights of others and applicable laws</li>
              <li>Report any security vulnerabilities or abuse</li>
              <li>Provide accurate information when contacting support</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Termination</h2>
            <p className="mb-6">
              We may terminate or suspend access to our service immediately, without prior notice, 
              for conduct that we believe violates these Terms or is harmful to other users, 
              our service, or third parties.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to Terms</h2>
            <p className="mb-6">
              We reserve the right to modify these terms at any time. We will notify users of 
              significant changes by posting a notice on our website or updating the "Last updated" 
              date. Continued use of the service after changes constitutes acceptance of new terms.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Information</h2>
            <p className="mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="mb-2">
                <strong>Email:</strong> support@pdftools.com
              </p>
              <p className="mb-2">
                <strong>Website:</strong> https://pdftools.com
              </p>
              <p>
                <strong>Response Time:</strong> We aim to respond within 48 hours
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Governing Law</h2>
            <p className="mb-6">
              These Terms are governed by and construed in accordance with applicable laws. 
              Any disputes will be resolved in the appropriate courts. If any provision of 
              these Terms is found to be unenforceable, the remaining provisions will remain in effect.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Entire Agreement</h2>
            <p className="mb-6">
              These Terms of Service, together with our Privacy Policy, constitute the entire 
              agreement between you and PDF Tools regarding the use of our service.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Thank you for using PDF Tools!
              </h3>
              <p className="text-blue-700">
                We're committed to providing you with the best PDF processing experience 
                while protecting your privacy and data. If you have any questions or 
                feedback, please don't hesitate to contact us.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}