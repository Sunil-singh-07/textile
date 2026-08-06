// Client-side refinement filters for the marketplace grid.
//
// GET /products only accepts category/search/minPrice/maxPrice/color (see
// server/controllers/productController.js) — there's no server-side
// support for material composition, GSM, or availability, and the Product
// model has no MOQ field at all (server/models/Product.js). Rather than
// invent query params the API doesn't accept, `material`/`gsm`/`inStock`
// are applied here, client-side, to whichever page the server already
// returned. Price and category stay server-side since the API supports
// them directly — see buildProductQuery in MarketplacePage.
//
// One consequence: once these client-only filters are active, the number
// of cards shown can be lower than the server's `total`/pagination implies.
// That's an inherent limit of filtering without backend support, not a bug.

const COMPOSITION_STOPWORDS = new Set(['recycled', 'blend', 'blended', 'and', 'of']);

// Pulls distinct fabric-type words out of every product's specs.composition
// string, e.g. "70% Linen / 30% Cotton" -> ['Cotton', 'Linen']. Derived
// purely from whatever data is loaded — never a hardcoded material list.
export const extractMaterialOptions = (products = []) => {
  const seen = new Map(); // lowercase key -> display casing

  products.forEach((product) => {
    const composition = product?.specs?.composition;
    if (!composition) return;

    composition
      .split(/[^A-Za-z]+/)
      .map((word) => word.trim())
      .filter((word) => word.length > 2 && !COMPOSITION_STOPWORDS.has(word.toLowerCase()))
      .forEach((word) => {
        const key = word.toLowerCase();
        if (!seen.has(key)) seen.set(key, word);
      });
  });

  return Array.from(seen.values()).sort((a, b) => a.localeCompare(b));
};

export const applyClientFilters = (
  products = [],
  { materials = [], gsmMin, gsmMax, inStockOnly } = {}
) =>
  products.filter((product) => {
    if (inStockOnly && (product.status === 'out_of_stock' || product.stock === 0)) return false;

    const gsm = product?.specs?.gsm;
    if (gsmMin !== '' && gsmMin !== undefined && gsmMin !== null) {
      if (gsm === undefined || gsm < Number(gsmMin)) return false;
    }
    if (gsmMax !== '' && gsmMax !== undefined && gsmMax !== null) {
      if (gsm === undefined || gsm > Number(gsmMax)) return false;
    }

    if (materials.length > 0) {
      const composition = (product?.specs?.composition || '').toLowerCase();
      const matchesSelected = materials.some((material) =>
        composition.includes(material.toLowerCase())
      );
      if (!matchesSelected) return false;
    }

    return true;
  });
