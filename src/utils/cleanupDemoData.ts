import {
  Firestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import {
  KNOWN_DEMO_STORE_IDS,
  KNOWN_DEMO_PRODUCT_IDS,
  KNOWN_DEMO_USER_IDS,
} from '../constants/marketplace';

export interface CleanupPreview {
  demoStores: { id: string; name?: string }[];
  demoProducts: { id: string; title?: string }[];
  demoReviews: { id: string; targetId?: string }[];
  totalRecordsFound: number;
}

export interface CleanupResult {
  deletedStoreIds: string[];
  deletedProductIds: string[];
  deletedReviewIds: string[];
  totalDeleted: number;
  success: boolean;
  message: string;
}

/**
 * Dry-run preview of existing demo/seed records in Cloud Firestore.
 * Does NOT execute any writes or deletions.
 */
export async function previewDemoCleanup(db: Firestore): Promise<CleanupPreview> {
  const preview: CleanupPreview = {
    demoStores: [],
    demoProducts: [],
    demoReviews: [],
    totalRecordsFound: 0,
  };

  const demoStoreSet = new Set(KNOWN_DEMO_STORE_IDS);
  const demoProdSet = new Set(KNOWN_DEMO_PRODUCT_IDS);

  try {
    // 1. Inspect stores
    const storesSnap = await getDocs(collection(db, 'stores'));
    storesSnap.forEach((docSnap) => {
      const data = docSnap.data();
      const id = docSnap.id;
      if (demoStoreSet.has(id) || (data.ownerId && KNOWN_DEMO_USER_IDS.includes(data.ownerId))) {
        preview.demoStores.push({ id, name: data.name });
      }
    });

    // 2. Inspect products
    const prodsSnap = await getDocs(collection(db, 'products'));
    prodsSnap.forEach((docSnap) => {
      const data = docSnap.data();
      const id = docSnap.id;
      if (demoProdSet.has(id) || (data.sellerId && KNOWN_DEMO_USER_IDS.includes(data.sellerId))) {
        preview.demoProducts.push({ id, title: data.title });
      }
    });

    // 3. Inspect reviews
    const reviewsSnap = await getDocs(collection(db, 'reviews'));
    reviewsSnap.forEach((docSnap) => {
      const data = docSnap.data();
      const id = docSnap.id;
      if (
        id.startsWith('rev-demo') ||
        (data.authorId && KNOWN_DEMO_USER_IDS.includes(data.authorId)) ||
        (data.targetId && (demoStoreSet.has(data.targetId) || demoProdSet.has(data.targetId)))
      ) {
        preview.demoReviews.push({ id, targetId: data.targetId });
      }
    });

    preview.totalRecordsFound =
      preview.demoStores.length + preview.demoProducts.length + preview.demoReviews.length;
  } catch (err) {
    console.error('Error previewing demo records cleanup:', err);
  }

  return preview;
}

/**
 * Auditable, idempotent cleanup: removes verified demo records from Cloud Firestore.
 * Requires explicit user confirmation via the UI.
 * Never deletes legitimate user records.
 */
export async function executeDemoCleanup(db: Firestore): Promise<CleanupResult> {
  const result: CleanupResult = {
    deletedStoreIds: [],
    deletedProductIds: [],
    deletedReviewIds: [],
    totalDeleted: 0,
    success: false,
    message: '',
  };

  try {
    const preview = await previewDemoCleanup(db);

    // Delete verified demo stores
    for (const store of preview.demoStores) {
      await deleteDoc(doc(db, 'stores', store.id));
      result.deletedStoreIds.push(store.id);
    }

    // Delete verified demo products
    for (const prod of preview.demoProducts) {
      await deleteDoc(doc(db, 'products', prod.id));
      result.deletedProductIds.push(prod.id);
    }

    // Delete verified demo reviews
    for (const rev of preview.demoReviews) {
      await deleteDoc(doc(db, 'reviews', rev.id));
      result.deletedReviewIds.push(rev.id);
    }

    // Clear stale demo localStorage cache if present
    try {
      const storedStores = localStorage.getItem('shopza_stores');
      if (storedStores) {
        const parsed = JSON.parse(storedStores);
        const filtered = Array.isArray(parsed)
          ? parsed.filter((s: any) => !KNOWN_DEMO_STORE_IDS.includes(s.id))
          : [];
        localStorage.setItem('shopza_stores', JSON.stringify(filtered));
      }

      const storedProds = localStorage.getItem('shopza_products');
      if (storedProds) {
        const parsed = JSON.parse(storedProds);
        const filtered = Array.isArray(parsed)
          ? parsed.filter((p: any) => !KNOWN_DEMO_PRODUCT_IDS.includes(p.id))
          : [];
        localStorage.setItem('shopza_products', JSON.stringify(filtered));
      }

      const storedReviews = localStorage.getItem('shopza_reviews');
      if (storedReviews) {
        const parsed = JSON.parse(storedReviews);
        const filtered = Array.isArray(parsed)
          ? parsed.filter((r: any) => !r.id?.startsWith('rev-demo'))
          : [];
        localStorage.setItem('shopza_reviews', JSON.stringify(filtered));
      }
    } catch (e) {
      console.warn('LocalStorage demo cleanup notice:', e);
    }

    result.totalDeleted =
      result.deletedStoreIds.length +
      result.deletedProductIds.length +
      result.deletedReviewIds.length;
    result.success = true;
    result.message = `Successfully cleaned ${result.totalDeleted} verified demo record(s) from Cloud Firestore.`;
  } catch (err: any) {
    console.error('Failed to execute demo cleanup:', err);
    result.success = false;
    result.message = err.message || 'Failed to remove demo records.';
  }

  return result;
}
