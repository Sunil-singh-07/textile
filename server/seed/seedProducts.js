// Populates the marketplace with a demo product catalog.
//
// Usage: npm run seed   (from server/)
//
// This script only touches the Product collection (plus, if needed, creates
// a single demo User with role "supplier" to own the seeded products — it
// never modifies existing users). It does not change any schema, route, or
// controller. Safe to re-run: it removes only products owned by the demo
// supplier before reinserting, so it won't touch other suppliers' listings.

import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import productData from './productData.js';

const DEMO_SUPPLIER_EMAIL = 'demo.supplier@textilehub.dev';

// Only used if the demo supplier account doesn't exist yet. The password
// itself doesn't matter for seeding — it's stored hashed like any real
// account, and this script never prints or relies on it for login.
const DEMO_SUPPLIER_PASSWORD = 'DemoSupplier#2026';

const getOrCreateDemoSupplier = async () => {
  let supplier = await User.findOne({ email: DEMO_SUPPLIER_EMAIL });
  if (supplier) return supplier;

  const passwordHash = await bcrypt.hash(DEMO_SUPPLIER_PASSWORD, 10);
  supplier = await User.create({
    email: DEMO_SUPPLIER_EMAIL,
    passwordHash,
    role: 'supplier',
  });
  console.log(`Created demo supplier account: ${DEMO_SUPPLIER_EMAIL}`);
  return supplier;
};

const seed = async () => {
  await connectDB();

  try {
    const supplier = await getOrCreateDemoSupplier();

    // Only clear products previously seeded by this script, identified by
    // supplierId — never touches products belonging to other suppliers.
    const { deletedCount } = await Product.deleteMany({ supplierId: supplier._id });
    if (deletedCount > 0) {
      console.log(`Removed ${deletedCount} existing demo product(s) before reseeding.`);
    }

    const products = productData.map((product) => ({
      ...product,
      supplierId: supplier._id,
    }));

    const inserted = await Product.insertMany(products);
    console.log(`Seeded ${inserted.length} demo products for ${DEMO_SUPPLIER_EMAIL}.`);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seed();