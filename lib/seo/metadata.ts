import { Metadata } from 'next';

// 工具页面SEO配置
export const toolsMetadata = {
  'merge-pdf': {
    title: 'Merge PDF Files Online - Free PDF Merger Tool',
    description: 'Combine multiple PDF files into one document online for free. Fast, secure PDF merging with drag-and-drop support. No registration required.',
    keywords: 'merge PDF, combine PDF, PDF merger, join PDF files, PDF combiner, online PDF merge',
    h1: 'Merge PDF Files Online',
    faq: [
      {
        question: 'How do I merge PDF files?',
        answer: 'Simply upload your PDF files, arrange them in the desired order, and click merge. The combined PDF will be ready for download.'
      },
      {
        question: 'Is it safe to merge PDFs online?',
        answer: 'Yes, all processing happens in your browser. Your files never leave your device, ensuring complete privacy and security.'
      },
      {
        question: 'How many PDF files can I merge?',
        answer: 'You can merge up to 20 PDF files at once, with a total size limit of 50MB for optimal performance.'
      }
    ]
  },
  
  'split-pdf': {
    title: 'Split PDF Pages Online - Free PDF Splitter Tool',
    description: 'Split PDF files by page ranges or extract individual pages online for free. Secure PDF splitting with instant download.',
    keywords: 'split PDF, PDF splitter, extract PDF pages, divide PDF, separate PDF pages, PDF page extractor',
    h1: 'Split PDF Files Online',
    faq: [
      {
        question: 'How can I split a PDF file?',
        answer: 'Upload your PDF, select the pages or page ranges you want to extract, and download the split files individually or as a ZIP.'
      },
      {
        question: 'Can I split password-protected PDFs?',
        answer: 'Currently, we support splitting of unprotected PDF files only. Please remove password protection before splitting.'
      }
    ]
  },
  
  'compress-pdf': {
    title: 'Compress PDF Online - Free PDF Size Reducer',
    description: 'Reduce PDF file size online for free. Compress PDFs while maintaining quality. Three compression levels available.',
    keywords: 'compress PDF, reduce PDF size, PDF compressor, shrink PDF, optimize PDF, PDF size reducer',
    h1: 'Compress PDF Files Online',
    faq: [
      {
        question: 'How much can I compress a PDF?',
        answer: 'Compression results vary by content. Text-heavy PDFs compress better than image-heavy ones. Our tool focuses on metadata cleanup and structure optimization.'
      },
      {
        question: 'Will compression affect PDF quality?',
        answer: 'Our compression preserves text and vector graphics quality. Light compression has minimal impact, while heavy compression may affect some elements.'
      }
    ]
  },
  
  'pdf-to-word': {
    title: 'PDF to Word Converter - Free PDF to DOC/DOCX Online',
    description: 'Convert PDF to Word documents online for free. Extract text from PDF and save as RTF format compatible with Microsoft Word.',
    keywords: 'PDF to Word, PDF to DOC, PDF to DOCX, convert PDF to Word, PDF text extraction, PDF converter',
    h1: 'Convert PDF to Word Online',
    faq: [
      {
        question: 'What format does the converted file use?',
        answer: 'We convert PDFs to RTF (Rich Text Format) which is fully compatible with Microsoft Word and other text editors.'
      },
      {
        question: 'Are images and formatting preserved?',
        answer: 'Our converter focuses on text extraction. Complex layouts, images, and advanced formatting may require manual adjustment.'
      }
    ]
  },
  
  'word-to-pdf': {
    title: 'Word to PDF Converter - Free DOC/DOCX to PDF Online',
    description: 'Convert Word documents to PDF online for free. Transform DOC, DOCX, and TXT files to PDF format with preserved formatting.',
    keywords: 'Word to PDF, DOC to PDF, DOCX to PDF, convert Word to PDF, document converter, text to PDF',
    h1: 'Convert Word to PDF Online',
    faq: [
      {
        question: 'Which file formats are supported?',
        answer: 'We support TXT, DOC, and DOCX files. For best results with complex formatting, use our text-based conversion.'
      },
      {
        question: 'Is the original formatting preserved?',
        answer: 'Basic text formatting is preserved. Complex layouts, images, and advanced Word features may require specialized tools.'
      }
    ]
  },
  
  'pdf-to-jpg': {
    title: 'PDF to JPG Converter - Convert PDF Pages to Images',
    description: 'Convert PDF pages to JPG images online for free. High-quality PDF to image conversion with batch download support.',
    keywords: 'PDF to JPG, PDF to image, convert PDF to JPG, PDF page to image, PDF image extractor',
    h1: 'Convert PDF to JPG Images',
    faq: [
      {
        question: 'What image quality can I expect?',
        answer: 'We offer three quality levels: low (fast), medium (balanced), and high (best quality). Choose based on your needs.'
      },
      {
        question: 'Can I download all images at once?',
        answer: 'Yes, you can download individual images or get all pages as a convenient ZIP file.'
      }
    ]
  },
  
  'jpg-to-pdf': {
    title: 'JPG to PDF Converter - Convert Images to PDF Online',
    description: 'Convert JPG, PNG, and other images to PDF online for free. Combine multiple images into a single PDF document.',
    keywords: 'JPG to PDF, image to PDF, convert images to PDF, photo to PDF, picture to PDF converter',
    h1: 'Convert Images to PDF Online',
    faq: [
      {
        question: 'Which image formats are supported?',
        answer: 'We support JPG, JPEG, PNG, GIF, and WebP formats. Multiple images can be combined into a single PDF.'
      },
      {
        question: 'How are images arranged in the PDF?',
        answer: 'Images are automatically fitted to pages while maintaining aspect ratio. You can reorder images before conversion.'
      }
    ]
  },
  
  'rotate-pdf': {
    title: 'Rotate PDF Pages Online - Free PDF Rotation Tool',
    description: 'Rotate PDF pages online for free. Fix document orientation with 90°, 180°, or 270° rotation options.',
    keywords: 'rotate PDF, PDF rotation, fix PDF orientation, turn PDF pages, PDF page rotation',
    h1: 'Rotate PDF Pages Online',
    faq: [
      {
        question: 'Can I rotate specific pages only?',
        answer: 'Currently, rotation is applied to all pages in the document. Individual page rotation will be added in future updates.'
      },
      {
        question: 'Does rotation affect PDF quality?',
        answer: 'No, rotation is a lossless operation that only changes page orientation without affecting content quality.'
      }
    ]
  },
  
  'add-watermark': {
    title: 'Add Watermark to PDF - Free PDF Watermark Tool',
    description: 'Add text or image watermarks to PDF files online for free. Customize position, opacity, and rotation for professional results.',
    keywords: 'PDF watermark, add watermark to PDF, PDF text watermark, PDF image watermark, watermark PDF online',
    h1: 'Add Watermark to PDF Online',
    faq: [
      {
        question: 'What types of watermarks can I add?',
        answer: 'You can add both text watermarks (with custom fonts and colors) and image watermarks (logos, signatures, etc.).'
      },
      {
        question: 'Can I control watermark transparency?',
        answer: 'Yes, you can adjust opacity from 10% to 100% and position the watermark anywhere on the page with rotation options.'
      }
    ]
  }
};

// 生成页面元数据
export function generateToolMetadata(toolKey: keyof typeof toolsMetadata): Metadata {
  const tool = toolsMetadata[toolKey];
  
  return {
    title: tool.title,
    description: tool.description,
    keywords: tool.keywords,
    openGraph: {
      title: tool.title,
      description: tool.description,
      type: 'website',
      siteName: 'PDF Tools',
    },
    twitter: {
      card: 'summary_large_image',
      title: tool.title,
      description: tool.description,
    },
    alternates: {
      canonical: `/${toolKey}`,
    },
  };
}

// 生成结构化数据
export function generateToolStructuredData(toolKey: keyof typeof toolsMetadata) {
  const tool = toolsMetadata[toolKey];
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.title,
    description: tool.description,
    url: `https://pdftools.com/${toolKey}`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    featureList: tool.faq.map(faq => faq.question),
    mainEntity: {
      '@type': 'FAQPage',
      mainEntity: tool.faq.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    }
  };
}