# Troubleshooting Guide

## Common Issues and Solutions

### Build Errors

#### "Cannot find module '@tailwindcss/forms'"
**Solution**: Install the missing Tailwind CSS plugins:
```bash
npm install @tailwindcss/forms @tailwindcss/typography
```

#### "Next.js is outdated"
**Solution**: Update Next.js to the latest version:
```bash
npm install next@latest
```

#### "Module not found: Can't resolve 'pdf-lib'"
**Solution**: Install the PDF processing dependencies:
```bash
npm install pdf-lib pdfjs-dist
```

### Runtime Errors

#### "Worker is not defined"
**Cause**: Web Workers are not available in the current environment.
**Solution**: The app will automatically fall back to main thread processing.

#### "Cannot read properties of undefined"
**Cause**: Missing environment variables or configuration.
**Solution**: 
1. Copy `.env.example` to `.env.local`
2. Fill in the required environment variables

### Development Issues

#### Port 3000 is already in use
**Solution**: Use a different port:
```bash
npm run dev -- -p 3001
```

#### TypeScript errors
**Solution**: Run type checking:
```bash
npm run type-check
```

#### Linting errors
**Solution**: Fix linting issues:
```bash
npm run lint:fix
```

### Performance Issues

#### Slow PDF processing
**Causes**:
- Large file sizes
- Limited browser memory
- Complex PDF structure

**Solutions**:
- Use smaller files for testing
- Close other browser tabs
- Try with simpler PDF files

#### Memory errors
**Solutions**:
- Refresh the browser
- Use smaller files
- Close other applications

### Browser Compatibility

#### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

#### Unsupported Features
- Internet Explorer (not supported)
- Very old mobile browsers

### Getting Help

1. **Check the console**: Open browser developer tools and check for error messages
2. **Run setup check**: `npm run check-setup`
3. **Clear cache**: Clear browser cache and restart development server
4. **Reinstall dependencies**: 
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Reporting Issues

When reporting issues, please include:
- Browser version and operating system
- Error messages from console
- Steps to reproduce the issue
- File types and sizes you're trying to process