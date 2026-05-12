import Pocketbase from 'pocketbase';

const POCKETBASE_API_URL = import.meta.env.VITE_POCKETBASE_URL || "http://localhost:8090";

const pocketbaseClient = new Pocketbase(POCKETBASE_API_URL);

// TODO Phase 2: Replace with live PocketBase URL
// For Phase 1, we mock the create call
pocketbaseClient.collection = (collectionName) => ({
    create: async (data) => {
        console.log(`[Mock PocketBase] Saving to ${collectionName}:`, data);
        return { id: 'mock-id-123', ...data };
    }
});

export default pocketbaseClient;

export { pocketbaseClient };
