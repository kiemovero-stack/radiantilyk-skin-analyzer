import { PRODUCT_CATALOG } from './shared/productCatalog';
const re = /^RKA-\d{3}$/;
for (const cat of PRODUCT_CATALOG) {
  for (const p of cat.products) {
    if (!re.test(p.sku)) {
      console.log('Bad SKU:', p.sku, '-', p.name);
    }
  }
}
console.log('Done');
