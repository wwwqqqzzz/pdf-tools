import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - PDF Tools',
  description: 'Learn how PDF Tools protects your privacy. All file processing happens locally in your browser.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <a href="/" className="text-2xl font-bold text-gray-900">PDF Tools</a>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-lg text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-green-900 mb-3">🔒 Your Privacy is Our Priority</h2>
              <p className="text-green-800">
                <strong>We do not collect, store, or process your files on our servers.</strong> All PDF processing 
                happens entirely in your browser, ensuring complete privacy and security of your documents.
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Protect Your Privacy</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Local Processing Only</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>All PDF operations (merge, split, compress) happen in your browser</li>
              <li>Your files never leave your device</li>
              <li>No file uploads to our servers</li>
              <li>Files are automatically cleared from memory when you close the page</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Data We Do NOT Collect</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Your PDF files or their contents</li>
              <li>File names or metadata</li>
              <li>Personal information from documents</li>
              <li>Any data that could identify you personally</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Data We May Collect</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Anonymous usage statistics (which tools are used most)</li>
              <li>Technical information (browser type, device type) for optimization</li>
              <li>Error logs (without file content) to improve our service</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Cookies and Tracking</h3>
            <p className="mb-4">
              We use minimal cookies for:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Remembering your preferences (theme, language)</li>
              <li>Anonymous analytics to improve our service</li>
              <li>Advertising (Google Adsense) - you can opt out anytime</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Third-Party Services</h3>
            <p className="mb-4">
              We use these third-party services:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Google Analytics:</strong> Anonymous usage statistics</li>
              <li><strong>Google Adsense:</strong> Advertising (no personal data shared)</li>
              <li><strong>Vercel:</strong> Website hosting (no file data processed)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Your Rights</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>You can use our service without providing any personal information</li>
              <li>You can disable cookies in your browser settings</li>
              <li>You can request deletion of any data we may have collected</li>
              <li>You can contact us with any privacy concerns</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Contact Us</h3>
            <p className="mb-4">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mb-6">
              <strong>Email:</strong> privacy@pdftools.com
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Changes to This Policy</h3>
            <p className="mb-6">
              We may update this Privacy Policy from time to time. We will notify you of any changes 
              by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}