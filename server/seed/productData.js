// Demo catalog data for the marketplace.
//
// Every object below maps 1:1 onto the existing Product schema
// (server/models/Product.js): name, category, description, colors[],
// specs{gsm,width,composition}, price, stock, images[]. No extra fields
// (e.g. MOQ) are included since they don't exist on the model.
//
// `colors` are hex strings, matching how the frontend renders swatches
// (ProductCard.jsx sets `style={{ backgroundColor: color }}`) — not
// human-readable color names.
//
// Images are royalty-free stock photos from Unsplash's CDN
// (images.unsplash.com), referenced via their direct, hot-linkable URLs.

const productData = [
  {
    name: 'Classic Cotton Poplin',
    category: 'Cotton',
    description:
      'A crisp, lightweight cotton poplin with a smooth, tight weave. Ideal for shirting, dresses, and light tailoring where a clean drape and easy pressing matter.',
    colors: ['#FFFFFF', '#0A2342', '#B8283D', '#F3E7DA'],
    specs: { gsm: 120, width: '58"', composition: '100% Cotton' },
    price: 189,
    stock: 420,
    images: ['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80'],
  },
  {
    name: 'Heavyweight Cotton Twill',
    category: 'Cotton',
    description:
      'Durable cotton twill with a diagonal rib weave, popular for workwear, chinos, and structured jackets. Holds its shape well and resists creasing.',
    colors: ['#2F241D', '#6B4F3B', '#556B2F', '#3B4A5C'],
    specs: { gsm: 260, width: '60"', composition: '100% Cotton' },
    price: 245,
    stock: 310,
    images: ['https://images.unsplash.com/photo-1604176424472-9d7f8a0e15d3?w=800&q=80'],
  },
  {
    name: 'GOTS Organic Cotton',
    category: 'Cotton',
    description:
      'Certified organic cotton grown without synthetic pesticides, finished to a soft mid-weight hand. A go-to for sustainable apparel and baby wear lines.',
    colors: ['#F5F0E6', '#D3B599', '#8C6A52'],
    specs: { gsm: 160, width: '56"', composition: '100% Organic Cotton' },
    price: 265,
    stock: 280,
    images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80'],
  },
  {
    name: 'European Flax Linen',
    category: 'Linen',
    description:
      'Pure European flax linen with a natural slub texture and breathable open weave. A staple for summer shirting, resort wear, and home textiles.',
    colors: ['#F3E7DA', '#8C6A52', '#7A6C5D', '#DCD6C9'],
    specs: { gsm: 200, width: '54"', composition: '100% Linen' },
    price: 520,
    stock: 190,
    images: ['https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=800&q=80'],
  },
  {
    name: 'Cotton-Linen Blend',
    category: 'Linen',
    description:
      "A softer, easier-care alternative to pure linen, blending cotton for reduced wrinkling while keeping linen's breathability and texture.",
    colors: ['#EDE4D3', '#6B4F3B', '#3B4A5C'],
    specs: { gsm: 210, width: '54"', composition: '70% Linen / 30% Cotton' },
    price: 398,
    stock: 260,
    images: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80'],
  },
  {
    name: 'Soft Rayon Challis',
    category: 'Rayon',
    description:
      'Fluid, lightweight rayon with a silk-like drape and matte finish. Popular for flowy blouses, dresses, and lining applications.',
    colors: ['#B8283D', '#2F241D', '#F3E7DA', '#556B2F'],
    specs: { gsm: 110, width: '56"', composition: '100% Rayon' },
    price: 175,
    stock: 350,
    images: ['https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?w=800&q=80'],
  },
  {
    name: 'Viscose Twill',
    category: 'Viscose',
    description:
      'Semi-synthetic viscose woven in a fine twill for extra body and a subtle sheen. Drapes well for skirts, trousers, and elevated casualwear.',
    colors: ['#463327', '#8C6A52', '#0A2342'],
    specs: { gsm: 150, width: '58"', composition: '100% Viscose' },
    price: 210,
    stock: 300,
    images: ['https://images.unsplash.com/photo-1619532550766-12c525330e57?w=800&q=80'],
  },
  {
    name: 'Raw Selvedge Denim',
    category: 'Denim',
    description:
      'Unwashed selvedge denim woven on a shuttle loom for a clean, self-finished edge. Fades develop naturally with wear — favored by premium jeanswear brands.',
    colors: ['#1E2A38', '#0A2342'],
    specs: { gsm: 420, width: '32"', composition: '100% Cotton' },
    price: 610,
    stock: 150,
    images: ['https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80'],
  },
  {
    name: 'Stretch Denim',
    category: 'Denim',
    description:
      'Comfort-stretch denim with a touch of elastane for movement without losing structure. Widely used in skinny and slim-fit jeans.',
    colors: ['#3B4A5C', '#1E2A38', '#5C6B73'],
    specs: { gsm: 380, width: '58"', composition: '98% Cotton / 2% Elastane' },
    price: 385,
    stock: 275,
    images: ['https://images.unsplash.com/photo-1604176354204-9268737828e4?w=800&q=80'],
  },
  {
    name: 'Yarn-Dyed Chambray',
    category: 'Chambray',
    description:
      'Lightweight plain-weave chambray with a soft heathered look from its yarn-dyed warp and white weft. A breathable alternative to denim for shirting.',
    colors: ['#5C7A94', '#3B4A5C', '#DCD6C9'],
    specs: { gsm: 135, width: '56"', composition: '100% Cotton' },
    price: 220,
    stock: 240,
    images: ['https://images.unsplash.com/photo-1614251055880-ee96e4803393?w=800&q=80'],
  },
  {
    name: 'Cotton Canvas',
    category: 'Canvas',
    description:
      'Tightly woven, medium-weight cotton canvas with a firm hand. Suited to bags, aprons, and structured outerwear that needs body and abrasion resistance.',
    colors: ['#DCD6C9', '#6B4F3B', '#2F241D'],
    specs: { gsm: 340, width: '60"', composition: '100% Cotton' },
    price: 298,
    stock: 220,
    images: ['https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=800&q=80'],
  },
  {
    name: '12oz Duck Canvas',
    category: 'Canvas',
    description:
      'Heavy-duty cotton duck canvas, plain-woven for maximum density. Built for workwear, upholstery, and industrial bags that need to withstand heavy use.',
    colors: ['#8C6A52', '#2F241D'],
    specs: { gsm: 400, width: '60"', composition: '100% Cotton' },
    price: 340,
    stock: 180,
    images: ['https://images.unsplash.com/photo-1604176354204-9268737828e4?w=800&q=80'],
  },
  {
    name: 'Polyester Satin',
    category: 'Satin',
    description:
      'Glossy-faced polyester satin with a smooth, reflective surface and fluid drape. A budget-friendly option for eveningwear linings and decor.',
    colors: ['#B8283D', '#0A2342', '#F3E7DA', '#463327'],
    specs: { gsm: 100, width: '58"', composition: '100% Polyester' },
    price: 165,
    stock: 300,
    images: ['https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&q=80'],
  },
  {
    name: 'Mulberry Silk Satin',
    category: 'Silk',
    description:
      'Premium mulberry silk satin prized for its natural luster and cool hand-feel. A signature fabric for luxury eveningwear, lingerie, and scarves.',
    colors: ['#F3E7DA', '#B08968', '#D3B599', '#2F241D'],
    specs: { gsm: 90, width: '44"', composition: '100% Mulberry Silk' },
    price: 1180,
    stock: 95,
    images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80'],
  },
  {
    name: 'Sheer Chiffon',
    category: 'Chiffon',
    description:
      'Ultra-lightweight, semi-sheer chiffon with a soft crinkle texture and airy drape. A classic choice for overlays, sleeves, and flowing gowns.',
    colors: ['#F3E7DA', '#B8283D', '#5C7A94', '#DCD6C9'],
    specs: { gsm: 60, width: '58"', composition: '100% Polyester' },
    price: 145,
    stock: 260,
    images: ['https://images.unsplash.com/photo-1618354691792-d1d42acfd860?w=800&q=80'],
  },
  {
    name: 'Georgette Crepe',
    category: 'Georgette',
    description:
      'Crinkled, matte-finish georgette with a dry, slightly textured hand. Popular in South Asian and eveningwear garments for its graceful movement.',
    colors: ['#556B2F', '#B8283D', '#463327'],
    specs: { gsm: 75, width: '44"', composition: '100% Polyester' },
    price: 160,
    stock: 240,
    images: ['https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?w=800&q=80'],
  },
  {
    name: 'Crisp Organza',
    category: 'Organza',
    description:
      'Sheer, crisp-handed organza that holds structure and volume. Used for bridal overlays, embellished panels, and voluminous sleeves.',
    colors: ['#F3E7DA', '#F5F0E6', '#D3B599'],
    specs: { gsm: 50, width: '44"', composition: '100% Silk' },
    price: 420,
    stock: 130,
    images: ['https://images.unsplash.com/photo-1594736797933-d0f06ba69f41?w=800&q=80'],
  },
  {
    name: 'Crushed Velvet',
    category: 'Velvet',
    description:
      'Deep-pile crushed velvet with a rich sheen that shifts with light. A statement fabric for eveningwear, upholstery, and festive apparel.',
    colors: ['#463327', '#0A2342', '#5A1F2E', '#2F241D'],
    specs: { gsm: 310, width: '54"', composition: '92% Polyester / 8% Spandex' },
    price: 450,
    stock: 160,
    images: ['https://images.unsplash.com/photo-1600166898405-da9535204843?w=800&q=80'],
  },
  {
    name: 'Cotton Corduroy 8-Wale',
    category: 'Corduroy',
    description:
      "Medium-wale cotton corduroy with a soft, ridged pile. A cold-weather favorite for trousers, jackets, and children's wear.",
    colors: ['#6B4F3B', '#556B2F', '#3B4A5C', '#2F241D'],
    specs: { gsm: 320, width: '56"', composition: '100% Cotton' },
    price: 310,
    stock: 200,
    images: ['https://images.unsplash.com/photo-1620799139903-92c9f588f7f2?w=800&q=80'],
  },
  {
    name: 'Anti-Pill Fleece',
    category: 'Fleece',
    description:
      'Brushed polyester fleece finished for pill resistance, with a warm, lofty hand. Widely used in outerwear linings, hoodies, and blankets.',
    colors: ['#3B4A5C', '#2F241D', '#B8283D', '#DCD6C9'],
    specs: { gsm: 280, width: '60"', composition: '100% Polyester' },
    price: 235,
    stock: 300,
    images: ['https://images.unsplash.com/photo-1620799139943-13c5f1d5cf7a?w=800&q=80'],
  },
  {
    name: 'Wool Blend Suiting',
    category: 'Wool',
    description:
      "Fine wool-poly blend suiting with a smooth finish and good recovery. Balances the drape of wool with the easier care of a synthetic blend.",
    colors: ['#2F241D', '#3B4A5C', '#463327'],
    specs: { gsm: 260, width: '60"', composition: '70% Wool / 30% Polyester' },
    price: 680,
    stock: 140,
    images: ['https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?w=800&q=80'],
  },
  {
    name: 'Recycled Polyester Blend',
    category: 'Blends',
    description:
      'Mid-weight fabric blending recycled polyester with cotton for a softer hand and a lower environmental footprint versus virgin polyester.',
    colors: ['#8C6A52', '#55704F', '#2F241D'],
    specs: { gsm: 240, width: '58"', composition: '55% Recycled Polyester / 45% Cotton' },
    price: 198,
    stock: 320,
    images: ['https://images.unsplash.com/photo-1618354691321-51e2f1d5d8d0?w=800&q=80'],
  },
  {
    name: 'Terry Cotton Toweling',
    category: 'Terry',
    description:
      'Absorbent loop-pile terry cotton, finished on both faces. The standard choice for bathrobes, towels, and infant apparel.',
    colors: ['#FFFFFF', '#5C7A94', '#F3E7DA'],
    specs: { gsm: 400, width: '58"', composition: '100% Cotton' },
    price: 255,
    stock: 210,
    images: ['https://images.unsplash.com/photo-1620799140325-6b8f844fbe62?w=800&q=80'],
  },
  {
    name: '2x1 Rib Knit',
    category: 'Knits',
    description:
      'Stretchy 2x1 rib knit with pronounced vertical ribbing and excellent recovery. Used for cuffs, collars, and fitted knitwear.',
    colors: ['#2F241D', '#0A2342', '#B8283D', '#FFFFFF'],
    specs: { gsm: 220, width: '38"', composition: '95% Cotton / 5% Elastane' },
    price: 230,
    stock: 260,
    images: ['https://images.unsplash.com/photo-1620799139804-46e9a2d0f3e2?w=800&q=80'],
  },
  {
    name: 'Cotton Jersey Knit',
    category: 'Knits',
    description:
      'Soft single-jersey cotton knit with a fine, smooth face. The workhorse fabric for t-shirts, loungewear, and basics.',
    colors: ['#FFFFFF', '#2F241D', '#5C7A94', '#B8283D', '#556B2F'],
    specs: { gsm: 180, width: '60"', composition: '95% Cotton / 5% Elastane' },
    price: 195,
    stock: 400,
    images: ['https://images.unsplash.com/photo-1618354691329-6132e4fd8ff5?w=800&q=80'],
  },
  {
    name: 'Fine Cotton Muslin',
    category: 'Cotton',
    description:
      'Loosely woven, lightweight cotton muslin. Commonly used for garment toiles, draping samples, and breathable summer linings.',
    colors: ['#F5F0E6', '#FFFFFF'],
    specs: { gsm: 90, width: '58"', composition: '100% Cotton' },
    price: 110,
    stock: 380,
    images: ['https://images.unsplash.com/photo-1620799139989-88c0f8f1f6f4?w=800&q=80'],
  },
  {
    name: 'Cotton Lawn',
    category: 'Cotton',
    description:
      'Fine, high-thread-count cotton lawn with a silky-crisp hand and slight sheen. A premium choice for shirting and delicate summer garments.',
    colors: ['#F3E7DA', '#5C7A94', '#B8283D'],
    specs: { gsm: 100, width: '56"', composition: '100% Cotton' },
    price: 215,
    stock: 230,
    images: ['https://images.unsplash.com/photo-1618354691410-8f0c6e91b0b1?w=800&q=80'],
  },
  {
    name: 'Cotton Seersucker',
    category: 'Cotton',
    description:
      'Puckered-stripe cotton seersucker that stands slightly off the skin, keeping it cool in warm weather. A summer suiting and shirting classic.',
    colors: ['#5C7A94', '#FFFFFF', '#B8283D'],
    specs: { gsm: 140, width: '56"', composition: '100% Cotton' },
    price: 240,
    stock: 200,
    images: ['https://images.unsplash.com/photo-1618354691456-2c93a2b3f6c9?w=800&q=80'],
  },
  {
    name: 'Polyester Crepe',
    category: 'Crepe',
    description:
      'Matte, textured polyester crepe with a pebbled surface and good opacity. A reliable, easy-care fabric for tailored dresses and separates.',
    colors: ['#2F241D', '#3B4A5C', '#556B2F', '#463327'],
    specs: { gsm: 180, width: '58"', composition: '100% Polyester' },
    price: 205,
    stock: 260,
    images: ['https://images.unsplash.com/photo-1618354691503-3f9a8f5b6ea6?w=800&q=80'],
  },
  {
    name: 'Silk Taffeta',
    category: 'Silk',
    description:
      'Crisp, lightweight silk taffeta with a distinctive rustle and structured drape. A go-to for full-skirted gowns and formalwear.',
    colors: ['#F3E7DA', '#B8283D', '#0A2342'],
    specs: { gsm: 70, width: '44"', composition: '100% Silk' },
    price: 560,
    stock: 110,
    images: ['https://images.unsplash.com/photo-1618354691550-4d6f4c1c8b3d?w=800&q=80'],
  },
  {
    name: 'Brushed Cotton Flannel',
    category: 'Cotton',
    description:
      'Soft, brushed-face cotton flannel with a warm, napped hand. A cold-weather staple for shirting and sleepwear.',
    colors: ['#3B4A5C', '#B8283D', '#556B2F', '#2F241D'],
    specs: { gsm: 200, width: '56"', composition: '100% Cotton' },
    price: 225,
    stock: 270,
    images: ['https://images.unsplash.com/photo-1618354691597-6a2c1e0f5d1a?w=800&q=80'],
  },
];

export default productData;