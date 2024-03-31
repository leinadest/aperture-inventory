const mongoose = require('mongoose');

const Images = require('./images');
const Item = require('../models/item');

// Set up mongoose connection
mongoose.set('strictQuery', false);
const mongoDB = process.env.MONGODB_URI;

async function main() {
  await mongoose.connect(mongoDB);
}
main().catch((err) => console.log(err));

// Initialize test data
const itemDetails = {
  name: 'Repulsion Gel',
  description:
    "Used as far back as 1953 by Aperture Science, the Repulsion Gel is the company's first attempt at a dietetic pudding substitute. The gel, a bright blue color, is said to be a sweeter, slightly less non-toxic form of fiberglass insulation. Its purpose was to cause subsequently ingested food items to bounce off the lining of the dieter's distended stomach and out of their mouth. However, for various reasons, the product was also pulled from the shelves like the Propulsion Gel, and reconverted into a testing element for use with the Aperture Science Portable Quantum Tunneling Device, the forerunner of the Aperture Science Handheld Portal Device. The material was eventually deemed hazardous even by Aperture Science's standards, and sealed away in Test Shaft 9 along with the Propulsion Gel and Conversion Gel",
  category: [],
  price: '100/kg',
  numberInStock: 1433,
  imagePaths: ['public/images/Repulsion_Gel.png'],
};

// Test model save
async function testSave() {
  const imageUrls = await Promise.all(
    itemDetails.imagePaths.map((imagePath) => Images.uploadImage(imagePath))
  );
  console.log(`Item URLs: ${imageUrls}`);
  const item = new Item({
    name: itemDetails.name,
    description: itemDetails.description,
    category: itemDetails.category,
    price: itemDetails.price,
    numberInStock: itemDetails.numberInStock,
    images: imageUrls,
  });
  console.log(`Item: ${item}`);
  console.log(`Outcome: ${await item.save()}`);
}

// Test image url
async function testUrl() {
  const imageUrls = await Promise.all(
    itemDetails.imagePaths.map((imagePath) => Images.uploadImage(imagePath))
  );
  console.log(`Item URLs: ${imageUrls}`);
  const item = new Item({
    name: itemDetails.name,
    description: itemDetails.description,
    category: itemDetails.category,
    price: itemDetails.price,
    numberInStock: itemDetails.numberInStock,
    images: imageUrls,
  });
  console.log(`Item: ${item}`);
}

testUrl();
