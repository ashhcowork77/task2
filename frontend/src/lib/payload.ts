// Payload stub for demo mode
// In production with database, configure Payload properly

export const getPayloadInstance = async () => {
  throw new Error('Payload is in demo mode. Configure DATABASE_URL for full functionality.');
};

export const getServerPayload = async () => {
  return getPayloadInstance();
};
