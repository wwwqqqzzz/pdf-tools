import { Metadata } from 'next';
import Link from 'next/link';
import { 
  DocumentDuplicateIcon,
  ScissorsIcon,
  ArrowsPointingInIcon,
  DocumentTextIcon,
  PhotoIcon,
  ArrowPathIcon,
  PaintBrushIcon,
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'PDF Tools - Free Online PDF Editor & Converter',
  description: 'Free online PDF tools for merging, splitting, compressing, and converting PDF files. Fast, secure, and private - all processing happens in your browser.',
};

const tools = [
  {
    name: 'Merge PDF',
    description: 'Combine multiple PDF files into one document',
    href: '/merge-pdf',
    icon: DocumentDuplicateIcon,
    color: 'bg-blue-500',
    status: 'available',
  },
  {
    name: 'Split PDF',
    description: 'Extract pages or split PDF into multiple files',
    href: '/split-pdf',
    icon: ScissorsIcon,
    color: 'bg-green-500',
    status: 'available',
  },
  {
    name: 'Compress PDF',
    description: 'Light compression through metadata cleanup',
    href: '/compress-pdf',
    icon: ArrowsPointingInIcon,
    color: 'bg-purple-500',
    status: 'available',
  },
  {
    name: 'PDF to Word',
    description: 'Extract text content to RTF format (Word compatible)',
    href: '/pdf-to-word',
    icon: DocumentTextIcon,
    color: 'bg-orange-500',
    status: 'available',
  },
  {
    name: 'Word to PDF',
    description: 'Convert text documents to PDF format',
    href: '/word-to-pdf',
    icon: DocumentTextIcon,
    color: 'bg-red-500',
    status: 'available',
  },
  {
    name: 'PDF to JPG',
    description: 'Convert PDF pages to high-quality images',
    href: '/pdf-to-jpg',
    icon: PhotoIcon,
    color: 'bg-pink-500',
    status: 'available',
  },
  {
    name: 'JPG to PDF',
    description: 'Convert images to PDF documents',
    href: '/jpg-to-pdf',
    icon: PhotoIcon,
    color: 'bg-indigo-500',
    status: 'available',
  },
  {
    name: 'Rotate PDF',
    description: 'Rotate PDF pages to fix orientation',
    href: '/rotate-pdf',
    icon: ArrowPathIcon,
    color: 'bg-teal-500',
    status: 'available',
  },
  {
    name: 'Add Watermark',
    description: 'Add text or image watermarks to PDF files',
    href: '/add-watermark',
    icon: PaintBrushIcon,
    color: 'bg-yellow-500',
    status: 'available',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">PDF Tools</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/privacy" className="text-gray-600 hover:text-gray-900">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-gray-900">
                Terms
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Free Online PDF Tools
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Process your PDF files quickly and securely. All operations happen in your browser - 
            your files never leave your device.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="flex items-center text-green-600">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              100% Private & Secure
            </div>
            <div className="flex items-center text-blue-600">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Fast Processing
            </div>
            <div className="flex items-center text-purple-600">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              No Registration Required
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Choose Your PDF Tool
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool) => (
              <div key={tool.name} className="relative">
                {tool.status === 'available' ? (
                  <Link
                    href={tool.href}
                    className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200 block hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                  >
                    <div className="flex items-center mb-4">
                      <div className={`${tool.color} p-3 rounded-lg mr-4`}>
                        <tool.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600">
                          {tool.name}
                        </h4>
                      </div>
                    </div>
                    <p className="text-gray-600">{tool.description}</p>
                  </Link>
                ) : (
                  <div className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200 block opacity-75 cursor-not-allowed">
                    <div className="flex items-center mb-4">
                      <div className={`${tool.color} p-3 rounded-lg mr-4`}>
                        <tool.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600">
                          {tool.name}
                        </h4>
                        <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full mt-1">
                          Coming Soon
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600">{tool.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our PDF Tools?
            </h3>
            <p className="text-xl text-gray-600">
              Built with privacy and performance in mind
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                100% Secure
              </h4>
              <p className="text-gray-600">
                All processing happens in your browser. Your files never leave your device.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Lightning Fast
              </h4>
              <p className="text-gray-600">
                Process small files in under 3 seconds with our optimized algorithms.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Completely Free
              </h4>
              <p className="text-gray-600">
                No hidden fees, no registration required. Use all tools unlimited times.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h5 className="text-xl font-bold mb-4">PDF Tools</h5>
              <p className="text-gray-400 mb-4">
                Free online PDF tools that respect your privacy. All processing happens 
                locally in your browser for maximum security.
              </p>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Tools</h6>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/merge-pdf" className="hover:text-white">Merge PDF</Link></li>
                <li><Link href="/split-pdf" className="hover:text-white">Split PDF</Link></li>
                <li><Link href="/compress-pdf" className="hover:text-white">Compress PDF</Link></li>
                <li><Link href="/pdf-to-word" className="hover:text-white">PDF to Word</Link></li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Legal</h6>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PDF Tools. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}