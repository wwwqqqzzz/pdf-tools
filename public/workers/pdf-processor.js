// Simple PDF processor worker
// This is a placeholder - in production you would use the full TypeScript worker

self.onmessage = async function(event) {
  const { id, type, payload } = event.data;
  
  try {
    // Simulate processing
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      self.postMessage({
        id,
        type: 'progress',
        payload: { progress: Math.min(progress, 90) }
      });
      
      if (progress >= 90) {
        clearInterval(interval);
        
        // Simulate completion
        setTimeout(() => {
          self.postMessage({
            id,
            type: 'success',
            payload: new Uint8Array([1, 2, 3, 4, 5]) // Mock result
          });
        }, 500);
      }
    }, 200);
    
  } catch (error) {
    self.postMessage({
      id,
      type: 'error',
      payload: {
        message: error.message || 'Processing failed',
      }
    });
  }
};