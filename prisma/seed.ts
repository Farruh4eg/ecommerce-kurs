import { PrismaClient, devicetype, memorytype, simtype } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const product = await prisma.products.create({
    data: {
      name: 'Apple IPhone 15',
      price: 115899,
      instock: true,
      suppliers: {
        create: {
          companyname: 'Apple',
          country: 'США',
          city: 'Купертино',
          address: 'Infinite Loop 1',
          postalcode: 95014,
          phone: '+14086065775',
          email: null,
          producttype: [
            devicetype.SMARTPHONE,
            devicetype.TABLET,
            devicetype.CABLE,
            devicetype.CHARGER,
            devicetype.HEADPHONE,
            devicetype.WATCH,
            devicetype.PLAYER,
          ],
        },
      },
      discountavailable: false,
      discount: 0,
      producttype: devicetype.SMARTPHONE,
      releaseyear: 2023,
      color: 'белый',
      memoryamount: 128,
      memoryunit: memorytype.GB,
      sdslot: false,
      cameracount: 2,
      cameraresolution: 48,
      frontcameraresolution: 12,
      os: 'IOS',
      osversion: 'IOS 17',
      cpumodel: 'Apple A16 Bionic',
      cpucores: 6,
      simtype: simtype.NANO_SIM,
      simcount: 1,
      displaysize: 6.1,
      displayheight: 2556,
      displaywidth: 1179,
      refreshrate: 60,
      batterytype: 'Li-Ion',
      batterycapacity: 3349,
      width: 71.6,
      height: 147.6,
      thickness: 7.8,
      weight: 171,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
