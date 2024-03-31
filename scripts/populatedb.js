#! /usr/bin/env node

console.log(
  'This script populates some test items, categories, and item instances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const mongoose = require('mongoose');
const Images = require('../api/images');
const Item = require('../models/item');
const Category = require('../models/category');
const ItemInstance = require('../models/itemInstance');

const categories = [];
const items = [];
const itemInstances = [];

mongoose.set('strictQuery', false);

const mongoDB = userArgs[0];

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoryCreate(index, name, description) {
  const category = new Category({ name, description });
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function itemCreate(
  index,
  name,
  description,
  category,
  price,
  numberInStock,
  imagePaths
) {
  const itemDetail = {
    name,
    description,
    price,
    numberInStock,
  };
  if (category) itemDetail.category = category;
  itemDetail.images = await Promise.all(
    imagePaths.map((imagePath) => Images.uploadImage(imagePath))
  );

  const item = new Item(itemDetail);
  await item.save();
  items[index] = item;
  console.log(`Added item: ${name}`);
}

async function itemInstanceCreate(index, item, dueDack, status) {
  const itemInstanceDetail = { item };
  if (dueDack) itemInstanceDetail.due_back = dueDack;
  if (status) itemInstanceDetail.status = status;

  const itemInstance = new ItemInstance(itemInstanceDetail);
  await itemInstance.save();
  itemInstances[index] = itemInstance;
  console.log(`Added itemInstance: ${item}`);
}

async function createCategories() {
  console.log('Adding categories');
  const categoriesData = [
    {
      name: 'Gels',
      description:
        'This category encompasses various types of experimental gels developed by Aperture Science for use in testing environments. These gels exhibit unique properties such as portal conductivity, surface adhesion, and velocity redirection. They are primarily used to facilitate puzzle-solving challenges and traversal obstacles within Aperture Science testing chambers.',
    },
    {
      name: 'Robots',
      description:
        'This category includes a diverse range of robotic entities designed and manufactured by Aperture Science for various purposes, including testing, maintenance, and research. These robots exhibit advanced AI capabilities and are integral to the operation of Aperture Science facilities.',
    },
    {
      name: 'Testing Elements',
      description:
        'This category comprises a wide array of testing elements and components utilized in Aperture Science testing chambers to create challenging and innovative puzzles for test subjects.',
    },
    {
      name: 'Weapons',
      description:
        'This category encompasses a collection of experimental weaponry and defensive systems developed by Aperture Science for security and defensive purposes. These weapons feature advanced technology and unconventional capabilities, making them effective tools for defending Aperture Science facilities and neutralizing threats.',
    },
  ];
  await Promise.all(
    categoriesData.map(({ name, description }, i) =>
      categoryCreate(i, name, description)
    )
  );
}

async function createItems() {
  console.log('Adding Items');
  const itemsData = [
    {
      name: 'Repulsion Gel',
      description:
        "Used as far back as 1953 by Aperture Science, the Repulsion Gel is the company's first attempt at a dietetic pudding substitute. The gel, a bright blue color, is said to be a sweeter, slightly less non-toxic form of fiberglass insulation. Its purpose was to cause subsequently ingested food items to bounce off the lining of the dieter's distended stomach and out of their mouth. However, for various reasons, the product was also pulled from the shelves like the Propulsion Gel, and reconverted into a testing element for use with the Aperture Science Portable Quantum Tunneling Device, the forerunner of the Aperture Science Handheld Portal Device. The material was eventually deemed hazardous even by Aperture Science's standards, and sealed away in Test Shaft 9 along with the Propulsion Gel and Conversion Gel",
      category: [categories[0], categories[2]],
      price: '100/kg',
      numberInStock: 1433,
      imagePaths: ['public/images/Repulsion_Gel.png'],
    },
    {
      name: 'Propulsion Gel',
      description: `Used as far back as 1971 by Aperture Science, this orange and supposedly sweet and largely non-toxic liquid of fiberglass insulation was originally to serve as a diet aid, serving as a dietetic pudding substitute and marketed under the name "Propulsion Pudding". Its purpose was to increase the velocity of any food following it through the digestive tract, leaving the body no time to absorb calories. However it was pulled from shelves when it was discovered that digestion plays several crucial roles in the eating process, such as breaking food into manageable chunks before being violently expelled from the human body.[2] The Propulsion Pudding was subsequently renamed "Propulsion Gel", and made for use with the ASHPD in Test Chambers instead, while another attempt at a dietetic pudding substitute, the Repulsion Gel, was tested.`,
      category: [categories[0], categories[2]],
      price: '100/kg',
      numberInStock: 1542,
      imagePaths: ['public/images/Propulsion.jpg'],
    },
    {
      name: 'Conversion Gel',
      description: `Conversion Gel is a white fluid that allows the Portal gun to place portals on surfaces that would normally be unfit for placing portals. Conversion Gel is made up of ground-up Moon rocks, as they are an excellent portal-conducting surface.`,
      category: [categories[0], categories[2]],
      price: '100/kg',
      numberInStock: 1293,
      imagePaths: ['public/images/Conversion_Gel.png'],
    },
    {
      name: 'Adhesion Gel',
      description: `Adhesion gel is a purple gel that effectively acts as super glue that sticks to its surface and to any other object that comes in contact. Its effect allows for users to apply it on walls and ceilings upon which they can then transverse across. The production of this item has been discontinued until its radioactive-like side effects have been addressed.`,
      category: [categories[0], categories[2]],
      price: '100/kg',
      numberInStock: 0,
      imagePaths: ['public/images/adhesion_gel.png'],
    },
    {
      name: 'Animal King',
      description: `A gigantic Turret covered with a leopard skin-patterned texture and wearing a crown. It comes installed with functionality to play deep bass tones.`,
      category: categories[1],
      price: '2200000/unit',
      numberInStock: 11,
      imagePaths: ['public/images/Animal_king.jpg'],
    },
    {
      name: 'Personality Construct',
      description: `Aperture Science Personality Constructs, also known as Personality Cores or Personality Spheres, are artificial intelligences developed by Aperture Science. They are housed within spherical casings and have handles for ease of transport by humans, and are used for a wide range of purposes in the Enrichment Center. Alongside the Nanobots, they are the backbones of the facility.`,
      category: categories[1],
      price: '160000/unit',
      numberInStock: 964,
      imagePaths: ['public/images/FactCore.png'],
    },
    {
      name: 'Sentry Turret',
      description: `The Aperture Science Sentry Turret, or simply known as sentries or turrets, is a Personality Construct-based gun platform used throughout the Aperture Science Enrichment Center. The Aperture Sentry Turret has a single red eye/sensor, a sleek appearance, and predominately white color scheme. The Turrets are not only important testing track obstacles, but are also used to protect restricted areas of the facility as well as in the testing of Military Androids and the Portal Device. The Sentry Turrets are armed with two dual machine guns, which can only be armed once a target comes within visual sight. Upon visual acquisition of the target, the Sentry Turret will come to full alert, and the machine guns will emerge. They will begin to fire at any visible targets (usually Test Subjects, intruders or dummies). When no targets are in visual range, the Sentry will scan the area in a sweeping motion with its laser targeting beam. Upon seeing that there are no more targets, the Sentry Turret will return to sleep mode after three seconds. These weapons, the machine guns, along with its antenna are normally hidden inside the body, during the Turret's "sleep mode". The consumer version of the Sentry Turret is available in hundreds of different designer patterns and colors, including "Forest" and "Desert", as well as "Table" and "Evening at the Improv."`,
      category: [categories[1], categories[2], categories[3]],
      price: '200000/unit',
      numberInStock: 543,
      imagePaths: ['public/images/Portal2_Turret_Standard.png'],
    },
    {
      name: 'ATLAS',
      description: `ATLAS is a male bipedal Personality Construct-based android.`,
      category: categories[1],
      price: '300000/unit',
      numberInStock: 57,
      imagePaths: ['public/images/Atlas_from_Personality_Test.jpg'],
    },
    {
      name: 'P-body',
      description: `P-body is a female bipedal Personality Construct-based android.`,
      category: categories[1],
      price: '300000/unit',
      numberInStock: 57,
      imagePaths: ['public/images/P-Body_from_Personality_Test.jpg'],
    },
    {
      name: '1500 Megawatt Aperture Science Heavy Duty Super-Colliding Super Button',
      description: `The 1500 Megawatt Aperture Science Heavy Duty Super-Colliding Super Button is a common cube-and-button testing element in the Aperture Science Enrichment Center.`,
      category: categories[2],
      price: '1000/unit',
      numberInStock: 2475,
      imagePaths: [
        'public/images/Portal_2_Heavy_Duty_Super-Colliding_Super_Button_active.png',
      ],
    },
    {
      name: 'Aperture Science Aerial Faith Plate',
      description: `The Aperture Science Aerial Faith Plate is a testing element used throughout the Aperture Science Enrichment Center. Created by Aperture Science from at least 1998, this catapult plate is part of a larger trust experiment designed to help Aperture Science discover whether the capacity for trust or solving problems could be affected by being catapulted into space. It was discovered that these attributes were negatively affected. Upon contact, these platforms fling Test Subjects (and any objects, such as Weighted Storage Cubes, Sentry Turrets, or Personality Cores) into the air with a 50,000 pound-foot force. When a Faith Plate fails to launch the user, it will emit a distress beacon, causing the blue lights on it to flash into orange repeatedly.`,
      category: categories[2],
      price: '5000/unit',
      numberInStock: 1186,
      imagePaths: ['public/images/Faith_plate.png'],
    },
    {
      name: 'Aperture Science Crusher',
      description: `The Aperture Science Crusher is a variation of the Aperture Science Panel with extensive redesigns, with the sole purpose of killing Test Subjects through impaling.`,
      category: categories[2],
      price: '7000/unit',
      numberInStock: 783,
      imagePaths: ['public/images/Crusher2.png'],
    },
    {
      name: 'Aperture Science Edgeless Safety Cube Receptacle',
      description: `The Aperture Science Edgeless Safety Cube Receptacle is a testing element used throughout the Aperture Science Enrichment Center. Edgeless Cubes must be placed into the receptacle to activate certain testing elements such as doors, platforms, or in deploying more testing elements.`,
      category: categories[2],
      price: '1500/unit',
      numberInStock: 1742,
      imagePaths: ['public/images/Weighted_Storage_Cube_Receptacle_active.png'],
    },
    {
      name: 'Aperture Science Emergency Intelligence Incinerator',
      description: `The Aperture Science Emergency Intelligence Incinerator is an equipment incinerator used within the Aperture Science Enrichment Center. The Emergency Intelligence Incinerator works via a small button pedestal, which opens an iris over the top of the incinerator. The flame symbol and the word "CAUTION" is inscribed around its rim.`,
      category: categories[2],
      price: '5000/unit',
      numberInStock: 623,
      imagePaths: ['public/images/Incinerator.png'],
    },
    {
      name: 'Aperture Science Excursion Funnel Generator',
      description: `The Aperture Science Excursion Funnel is a testing element in use since 1998. It is used in the Enrichment Center that acts as a tractor beam.`,
      category: categories[2],
      price: '10000/unit',
      numberInStock: 452,
      imagePaths: ['public/images/Excursion_Funnel.jpeg'],
    },
    {
      name: 'Aperture Science Hard Light Bridge Generator',
      description: `The Hard Light Bridge is a translucent but solid surface that can be redirected through portals to reach or serve as a blockade to certain areas. Bridges may be emitted horizontally or vertically depending on the position of its emitter. Horizontal bridges can be walked upon, and users can continue seamlessly along them through any portals they pass. Vertical bridges act more as portable walls that can be used as obstacles.`,
      category: categories[2],
      price: '10000/unit',
      numberInStock: 424,
      imagePaths: ['public/images/Hard_light_surface.jpg'],
    },
    {
      name: 'Aperture Science High Energy Pellet Emitter and Receiver',
      description: `The Aperture Science High Energy Pellet is a testing element used in the Test Chambers of the Aperture Science computer-aided Enrichment Center. Pellets kill humans in a single hit, and will disintegrate after a few seconds.`,
      category: categories[2],
      price: '10000/unit',
      numberInStock: 523,
      imagePaths: [
        'public/images/Combine_Ball_launcher.png',
        'public/images/Combine_Ball_catcher.png',
      ],
    },
    {
      name: 'Aperture Science Laser Field',
      description: `The Laser Field is comprised of dozens of low-intensity lasers which prevent Test Subjects from passing through without disabling it, otherwise resulting in death. It affects living beings but not equipment, thus acting as the exact opposite of the Aperture Science Material Emancipation Grill.`,
      category: categories[2],
      price: '8000/unit',
      numberInStock: 223,
      imagePaths: ['public/images/Portal_2_Laser_Grid.png'],
    },
    {
      name: 'Aperture Science Material Emancipation Grill',
      description: `The Aperture Science Material Emancipation Grill, also known as Emancipation Grid, Portal Fizzler, or simply Fizzler, is a testing element and anti-thievery enforcement generally featured directly before the conclusion of a test chamber in the Enrichment Center. It is used to prevent staff from stealing Aperture products. It also is very dangerous, as it can emancipate dental fillings, tooth crowns, tooth enamel, teeth, and ear tubes.`,
      category: categories[2],
      price: '8000/unit',
      numberInStock: 3631,
      imagePaths: ['public/images/Emancipation_Grid.jpg'],
    },
    {
      name: 'Aperture Science Weighted Pivot Cube',
      description: `The Aperture Science Weighted Pivot Cube is a testing element used in the Aperture Science Enrichment Center. The purpose of the Redirection Cube is solely to redirect a Thermal Discouragement Beam to achieve a set task. When a Thermal Discouragement Beam makes contact with the cube, it is redirected through the marked side. When the cube is picked up, this "output" side is turned forward if possible, to better assist aiming redirected beams.`,
      category: categories[2],
      price: '650/unit',
      numberInStock: 3486,
      imagePaths: ['public/images/Portal2_ReflectionCube.png'],
    },
    {
      name: 'Aperture Science Weighted Storage Cube',
      description: `The Weighted Storage Cube is a device used for solving cube-and-button based puzzles in the various Test Chambers found throughout the Enrichment Center.`,
      category: categories[2],
      price: '400/unit',
      numberInStock: 6320,
      imagePaths: ['public/images/Portal2_StorageCube.png'],
    },
    {
      name: 'Thermal Discouragement Beam Emitter and Receiver',
      description: `The Thermal Discouragement Beam is a testing element that is used throughout the Aperture Science Enrichment Center. It can be used to destroy threats such as Sentry Turrets, and will slowly kill a test subject whilst also pushing them away.`,
      category: categories[2],
      price: '10000/unit',
      numberInStock: 761,
      imagePaths: [
        'public/images/Peti_laser_emitter.png',
        'public/images/Peti_laser_catcher.png',
      ],
    },
    {
      name: 'Aperture Science Bomb',
      description: `Aperture Science Bombs are spherical bombs created by Aperture Science that explode on contact with surfaces.`,
      category: categories[3],
      price: '500/unit',
      numberInStock: 3702,
      imagePaths: ['public/images/Portal_2_Bomb.png'],
    },
    {
      name: 'Aperture Science Handheld Portal Device',
      description: `The Aperture Science Handheld Portal Device, originally marketed in the 1950s as an Aperture Science Portable Quantum Tunneling Device, also commonly known as a Portal Gun or by its acronym, "ASHPD", is an experimental tool used to create two portals through which objects can pass. The portals can be placed on any surface which is made out of manufactured or refined moon rock and large enough to accommodate them. The ASHPD also has a zero-point energy field manipulator, similar to the Gravity Gun but far weaker. It can pick up objects, but only those directly in front of it.`,
      category: categories[3],
      price: '7860000000/unit',
      numberInStock: 10,
      imagePaths: ['public/images/Portal_Gun_Concept_Art.png'],
    },
    {
      name: 'Rocket Sentry',
      description: `The Rocket Sentry is a static rocket-firing gun platform that is based on a Personality Construct and used in the Aperture Science Enrichment Center. When activated, the Core's left panel slides out so a rocket launcher and sensory device that emits a blue-green laser for targeting are revealed. In addition, the Personality Core "eye" is used to indicate the current status of the turret by color: Green = idle; Yellow = locked on target; Red = firing the rocket.`,
      category: categories[3],
      price: '220000/unit',
      numberInStock: 317,
      imagePaths: ['public/images/Portal_Rocket_Turret.png'],
    },
  ];
  await Promise.all(
    itemsData.map(
      ({ name, description, category, price, numberInStock, imagePaths }, i) =>
        itemCreate(
          i,
          name,
          description,
          category,
          price,
          numberInStock,
          imagePaths
        )
    )
  );
}

async function createItemInstances() {
  console.log('Adding item instances');
  const itemInstancesData = items.map((item) => ({
    item,
    dueBack: false,
    status: 'Available',
  }));
  await Promise.all(
    itemInstancesData.map(({ item, dueBack, status }, i) =>
      itemInstanceCreate(i, item, dueBack, status)
    )
  );
}

async function main() {
  console.log('Debug: About to connect');
  await mongoose.connect(mongoDB);
  console.log('Debug: Should be connected?');
  await createCategories();
  await createItems();
  await createItemInstances();
  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
}

main().catch((err) => console.log(err));
