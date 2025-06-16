// CommonJS wrapper for PaymanClient
const createPaymanClient = () => {
  try {
    const { PaymanClient } = require('@paymanai/payman-ts');
    return PaymanClient;
  } catch (error) {
    console.error('Failed to require PaymanClient:', error);
    throw error;
  }
};

module.exports = { createPaymanClient };
