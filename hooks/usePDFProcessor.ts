import { useState, useCallback, useRef } from 'react';
import { ProcessingState, ProcessedFile } from '@/types/pdf';

export interface PDFProcessorOptions {
  onProgress?: (progress: number) => void;
  onComplete?: (result: ProcessedFile) => void;
  onError?: (error: string) => void;
}

export function usePDFProcessor() {
  const [state, setState] = useState<ProcessingState>({
    status: 'idle',
    progress: 0,
  });
  
  const workerRef = useRef<Worker | null>(null);
  const requestIdRef = useRef<string>('');
  
  const initializeWorker = useCallback(() => {
    if (!workerRef.current && typeof Worker !== 'undefined') {
      try {
        workerRef.current = new Worker('/workers/pdf-processor.js');
      } catch (error) {
        console.warn('Worker not available, falling back to main thread processing');
        return;
      }
      
      workerRef.current.onmessage = (event) => {
        const { id, type, payload } = event.data;
        
        if (id !== requestIdRef.current) return;
        
        switch (type) {
          case 'progress':
            setState(prev => ({
              ...prev,
              progress: payload.progress,
            }));
            break;
            
          case 'success':
            const result: ProcessedFile = {
              name: 'processed.pdf',
              size: payload.length || 0,
              url: URL.createObjectURL(new Blob([new Uint8Array(payload)], { type: 'application/pdf' })),
              type: 'application/pdf',
            };
            
            setState({
              status: 'completed',
              progress: 100,
              result,
            });
            break;
            
          case 'error':
            setState({
              status: 'error',
              progress: 0,
              error: payload.message,
            });
            break;
        }
      };
      
      workerRef.current.onerror = (error) => {
        setState({
          status: 'error',
          progress: 0,
          error: 'Worker error occurred',
        });
      };
    }
  }, []);
  
  const processFiles = useCallback(async (
    type: 'merge' | 'split' | 'compress' | 'rotate' | 'watermark',
    files: File[],
    options: any = {}
  ) => {
    initializeWorker();
    
    // If worker is not available, fall back to main thread processing
    if (!workerRef.current) {
      return await processInMainThread(type, files, options);
    }
    
    setState({
      status: 'processing',
      progress: 0,
    });
    
    try {
      requestIdRef.current = Math.random().toString(36).substr(2, 9);
      
      let payload: any;
      
      switch (type) {
        case 'merge':
          payload = {
            files: await Promise.all(files.map(f => f.arrayBuffer())),
          };
          break;
          
        case 'split':
        case 'compress':
        case 'rotate':
        case 'watermark':
          if (files.length !== 1) {
            throw new Error('These operations require exactly one file');
          }
          payload = {
            file: await files[0].arrayBuffer(),
            ...options,
          };
          break;
          
        default:
          throw new Error(`Unsupported operation: ${type}`);
      }
      
      workerRef.current.postMessage({
        id: requestIdRef.current,
        type,
        payload,
      });
      
    } catch (error) {
      setState({
        status: 'error',
        progress: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }, [initializeWorker]);

  const processInMainThread = useCallback(async (
    type: 'merge' | 'split' | 'compress' | 'rotate' | 'watermark',
    files: File[],
    options: any = {}
  ) => {
    setState({
      status: 'processing',
      progress: 0,
    });

    try {
      // Import the merge function dynamically
      const { mergePDFs: mergePDFsSync } = await import('@/lib/pdf/merge');
      
      let result: Uint8Array;
      
      switch (type) {
        case 'merge':
          result = await mergePDFsSync(files, {
            onProgress: (progress) => {
              setState(prev => ({ ...prev, progress }));
            }
          });
          break;
        default:
          throw new Error(`${type} not implemented in main thread fallback`);
      }

      const processedFile: ProcessedFile = {
        name: `processed-${type}.pdf`,
        size: result.length,
        url: URL.createObjectURL(new Blob([new Uint8Array(result)], { type: 'application/pdf' })),
        type: 'application/pdf',
      };

      setState({
        status: 'completed',
        progress: 100,
        result: processedFile,
      });

    } catch (error) {
      setState({
        status: 'error',
        progress: 0,
        error: error instanceof Error ? error.message : 'Processing failed',
      });
    }
  }, []);
  
  const mergePDFs = useCallback((files: File[]) => {
    return processFiles('merge', files);
  }, [processFiles]);
  
  const splitPDF = useCallback((file: File, options: any) => {
    return processFiles('split', [file], options);
  }, [processFiles]);
  
  const compressPDF = useCallback((file: File, quality: 'low' | 'medium' | 'high') => {
    return processFiles('compress', [file], { quality });
  }, [processFiles]);
  
  const rotatePDF = useCallback((file: File, rotation: 90 | 180 | 270, pages?: number[]) => {
    return processFiles('rotate', [file], { rotation, pages });
  }, [processFiles]);
  
  const addWatermark = useCallback((
    file: File,
    text: string,
    position: 'center' | 'corner' = 'center',
    opacity: number = 0.5
  ) => {
    return processFiles('watermark', [file], { text, position, opacity });
  }, [processFiles]);
  
  const reset = useCallback(() => {
    setState({
      status: 'idle',
      progress: 0,
    });
    
    if (state.result?.url) {
      URL.revokeObjectURL(state.result.url);
    }
  }, [state.result?.url]);
  
  const cleanup = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
    
    if (state.result?.url) {
      URL.revokeObjectURL(state.result.url);
    }
  }, [state.result?.url]);
  
  return {
    state,
    mergePDFs,
    splitPDF,
    compressPDF,
    rotatePDF,
    addWatermark,
    reset,
    cleanup,
  };
}