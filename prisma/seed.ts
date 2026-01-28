/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
const { PrismaClient } = require("@prisma/client");

const clientePrisma = new PrismaClient();

const principal = async () => {
  await clientePrisma.$transaction(async (tx: any) => {
    await tx.restaurant.deleteMany();
    const restaurante = await tx.restaurant.create({
      data: {
        name: "TÍO'S food garden ",
        slug: "tios-food-garden",
        description: "La mejor comida rápida del mundo",
        whatsappNumber: "595982128110",
        avatarImageUrl:
          "https://scontent.fagt6-1.fna.fbcdn.net/v/t39.30808-6/324559270_1409422096263423_4128711233343453726_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=p2GgDNYQGGcQ7kNvwEfxIAA&_nc_oc=Adm-AbCTOIc08SLeENTOMnYaRoR9UCOf7NZ0NufA5eTTQ1xtjx4FVtWaerArZLehk5s&_nc_zt=23&_nc_ht=scontent.fagt6-1.fna&_nc_gid=XDZH946rqXBxqxtj_stWAQ&oh=00_AfpBaxVSMsn5W1-g09X9RlsOY5JGCoFFx22Irhrm_6UYRA&oe=697E9C0C",
        coverImageUrl:
          "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQac8bHYlkBUjlHSKiuseLm2hIFzVY0OtxEPnw",
      },
    });
    const categoriaCombos = await tx.menuCategory.create({
      data: {
        name: "Combos",
        restaurantId: restaurante.id,
      },
    });
    await tx.product.createMany({
      data: [
        {
          name: "McOferta mediana Big Mac doble",
          description:
            "Cuatro hamburguesas (100% carne de res), lechuga, queso en lonchas sabor cheddar, salsa especial, cebolla, pepinillos y pan con sésamo, acompañamiento y bebida.",
          price: 39900,
          imageUrl:
            "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQaHB8tslkBUjlHSKiuseLm2hIFzVY0OtxEPnw",
          menuCategoryId: categoriaCombos.id,
          restaurantId: restaurante.id,
          ingredients: [
            "Pan con sésamo",
            "Hamburguesa 100% de carne de res",
            "Lechuga",
            "Queso en lonchas sabor cheddar",
            "Salsa especial",
            "Cebolla",
            "Pepinillos",
          ],
        },
        {
          name: "Nuevo Brabo Melt con aros de cebolla",
          description:
            "Dos hamburguesas 100% de carne de res, “méquinese”, la exclusiva mayonesa especial con sabor a carne ahumada, aros de cebolla, tiras de bacon, queso procesado sabor cheddar y la deliciosa salsa láctea con queso tipo cheddar, todo en pan tipo brioche para una explosión de sabor en tus días de gloria. Acompañamiento y bebida.",
          price: 41500,
          imageUrl:
            "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQeGQofnEPyQaHEV2WL8rGUs41oMICtYfNkphl",
          menuCategoryId: categoriaCombos.id,
          restaurantId: restaurante.id,
          ingredients: [
            "Pan tipo brioche",
            "Hamburguesa 100% de carne de res",
            "Méquinese",
            "Mayonesa especial con sabor a carne ahumada",
            "Aros de cebolla",
            "Tiras de bacon",
            "Queso procesado sabor cheddar",
            "Salsa láctea con queso tipo cheddar",
          ],
        },
        {
          name: "McCrispy Chicken Elite",
          description:
            "Compuesto por pan tipo brioche con papa, salsa Honey&Fire, bacon en tiras, lechuga, tomate, queso sabor cheddar y 100% pechuga de pollo, sazonada y empanizada, acompañamiento y bebida.",
          price: 39900,
          imageUrl:
            "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQr12aTqPo3SsGjBJCaM7yhxnbDlXeL5N9dckv",
          menuCategoryId: categoriaCombos.id,
          restaurantId: restaurante.id,
          ingredients: [
            "Pan tipo brioche",
            "Papa",
            "Molho Honey&Fire",
            "Bacon en tiras",
            "Lechuga",
            "Tomate",
            "Queso sabor cheddar",
            "100% pechuga de pollo",
          ],
        },
        {
          name: "Doble Cheddar McMelt",
          description:
            "Dos hamburguesas (100% carne de res), salsa láctea con queso tipo cheddar, cebolla con salsa de soja y pan oscuro con sésamo, acompañamiento y bebida.",
          price: 36200,
          imageUrl:
            "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQWdq0w8niS9XCLQu7Nb4jvBYZze16goaOqsKR",
          menuCategoryId: categoriaCombos.id,
          restaurantId: restaurante.id,
          ingredients: [
            "Pan oscuro con sésamo",
            "Hamburguesa 100% de carne de res",
            "Salsa láctea con queso tipo cheddar",
            "Cebolla con salsa de soja",
          ],
        },
      ],
    });
    const categoriaHamburguesas = await tx.menuCategory.create({
      data: {
        name: "Hamburguesas",
        restaurantId: restaurante.id,
      },
    });
    await tx.product.createMany({
      data: [
        {
          name: "Big Mac",
          description:
            "Cuatro hamburguesas (100% carne de res), lechuga, queso en lonchas sabor cheddar, salsa especial, cebolla, pepinillos y pan con sésamo, acompañamiento y bebida.",
          ingredients: [
            "Pan con sésamo",
            "Hamburguesa 100% de carne de res",
            "Lechuga",
            "Queso en lonchas sabor cheddar",
            "Salsa especial",
            "Cebolla",
            "Pepinillos",
          ],
          price: 39900,
          imageUrl:
            "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQKfI6fivqActTvBGLXfQe4a8CJ6d3HiR7USPK",
          menuCategoryId: categoriaHamburguesas.id,
          restaurantId: restaurante.id,
        },
        {
          name: "Doble Cuarto de libra",
          description:
            "Dos hamburguesas 100% de carne de res, “méquinese”, la exclusiva mayonesa especial con sabor a carne ahumada, aros de cebolla, tiras de bacon, queso procesado sabor cheddar y la deliciosa salsa láctea con queso tipo cheddar, todo en pan tipo brioche para una explosión de sabor en tus días de gloria. Acompañamiento y bebida.",
          ingredients: [
            "Pan tipo brioche",
            "Hamburguesa 100% de carne de res",
            "Méquinese",
            "Mayonesa especial con sabor a carne ahumada",
            "Aros de cebolla",
            "Tiras de bacon",
            "Queso procesado sabor cheddar",
            "Salsa láctea con queso tipo cheddar",
          ],
          price: 41500,
          imageUrl:
            "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQ99rtECuYaDgmA4VujBU0wKn2ThXJvF3LHfyc",
          menuCategoryId: categoriaHamburguesas.id,
          restaurantId: restaurante.id,
        },
        {
          name: "McMelt",
          description:
            "Compuesto por pan tipo brioche con papa, salsa Honey&Fire, bacon en tiras, lechuga, tomate, queso sabor cheddar y 100% pechuga de pollo, sazonada y empanizada, acompañamiento y bebida.",
          ingredients: [
            "Pan tipo brioche",
            "Papa",
            "Molho Honey&Fire",
            "Bacon en tiras",
            "Lechuga",
            "Tomate",
            "Queso sabor cheddar",
            "100% pechuga de pollo",
          ],
          price: 39900,
          imageUrl:
            "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQUY0VlDTmvPeJLoyOjzNsMqFdxUI423nBl6br",
          menuCategoryId: categoriaHamburguesas.id,
          restaurantId: restaurante.id,
        },
        {
          name: "McNífico Bacon",
          description:
            "Dos hamburguesas (100% carne de res), salsa láctea con queso tipo cheddar, cebolla con salsa de soja y pan oscuro con sésamo, acompañamiento y bebida.",
          ingredients: [
            "Pan oscuro con sésamo",
            "Hamburguesa 100% de carne de res",
            "Salsa láctea con queso tipo cheddar",
            "Cebolla con salsa de soja",
          ],
          price: 36200,
          imageUrl:
            "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQBBmifbjzEVXRoycAtrP9vH45bZ6WDl3QF0a1",
          menuCategoryId: categoriaHamburguesas.id,
          restaurantId: restaurante.id,
        },
      ],
    });
    const categoriaPapasFritas = await tx.menuCategory.create({
      data: {
        name: "Papas fritas",
        restaurantId: restaurante.id,
      },
    });
    await tx.product.createMany({
      data: [
        {
          name: "Papas fritas grandes",
          description: "Papas fritas crujientes y sequitas. ¡Viene un montón!",
          ingredients: [],
          price: 10900,
          imageUrl:
            "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQNd3jSNrcJroaszwjUAlM6iSO5ZTx2HV70t31",
          menuCategoryId: categoriaPapasFritas.id,
          restaurantId: restaurante.id,
        },
        {
          name: "Papas fritas medianas",
          description:
            "Papas fritas crujientes y sequitas. ¡Viene una cantidad mediana!",
          ingredients: [],
          price: 9900,
          imageUrl:
            "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQ7Y6lv9tkc0L9oMIXZsFJtwnBh2KCz3y6uSW1",
          menuCategoryId: categoriaPapasFritas.id,
          restaurantId: restaurante.id,
        },
        {
          name: "Papas fritas pequeñas",
          description:
            "Papas fritas crujientes y sequitas. Viene poquito (¡es bueno para tu dieta!).",
          ingredients: [],
          price: 5900,
          imageUrl:
            "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQ5toOZxYa1oARJCUGh4EY3x8NjXHtvZ7lnVfw",
          menuCategoryId: categoriaPapasFritas.id,
          restaurantId: restaurante.id,
        },
      ],
    });
    const categoriaBebidas = await tx.menuCategory.create({
      data: {
        name: "Bebidas",
        restaurantId: restaurante.id,
      },
    });
    await tx.product.createMany({
      data: [
        {
          name: "Coca-cola",
          description: "Coca-cola fría para acompañar tu hamburguesa.",
          ingredients: [],
          price: 5900,
          imageUrl:
            "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQJS1b33q29eEsh0CVmOywrqx1UPnJpRGcHN5v",
          menuCategoryId: categoriaBebidas.id,
          restaurantId: restaurante.id,
        },
        {
          name: "Fanta Laranja",
          description: "Fanta de naranja fría para acompañar tu hamburguesa.",
          ingredients: [],
          price: 5900,
          imageUrl:
            "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQW7Kxm9gniS9XCLQu7Nb4jvBYZze16goaOqsK",
          menuCategoryId: categoriaBebidas.id,
          restaurantId: restaurante.id,
        },
        {
          name: "Agua mineral",
          description: "La bebida favorita de Cristiano Ronaldo.",
          ingredients: [],
          price: 2900,
          imageUrl:
            "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQ7i05S5tkc0L9oMIXZsFJtwnBh2KCz3y6uSW1",
          menuCategoryId: categoriaBebidas.id,
          restaurantId: restaurante.id,
        },
      ],
    });
    const categoriaPostres = await tx.menuCategory.create({
      data: {
        name: "Postres",
        restaurantId: restaurante.id,
      },
    });
    await tx.product.createMany({
      data: [
        {
          name: "Cono de vainilla",
          description: "Cono de helado sabor vainilla.",
          ingredients: [],
          price: 3900,
          imageUrl:
            "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQtfuQrAKkI75oJfPT0crZxvX82ui9qV3hLFdY",
          menuCategoryId: categoriaPostres.id,
          restaurantId: restaurante.id,
        },
        {
          name: "Cono de chocolate",
          description: "Cono de helado sabor chocolate.",
          ingredients: [],
          price: 3900,
          imageUrl:
            "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQBH21ijzEVXRoycAtrP9vH45bZ6WDl3QF0a1M",
          menuCategoryId: categoriaPostres.id,
          restaurantId: restaurante.id,
        },
        {
          name: "Cono mixto",
          description: "Cono de helado sabor vainilla y chocolate.",
          ingredients: [],
          price: 2900,
          imageUrl:
            "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQ4rBrtULypXmR6JiWuhzS8ALjVkrF3yfatC7E",
          menuCategoryId: categoriaPostres.id,
          restaurantId: restaurante.id,
        },
      ],
    });
  });
};

principal()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await clientePrisma.$disconnect();
  });
