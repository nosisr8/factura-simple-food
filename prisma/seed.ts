/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
const { PrismaClient } = require("@prisma/client");

const clientePrisma = new PrismaClient();

const principal = async () => {
  await clientePrisma.$transaction(async (tx: any) => {
    await tx.restaurant.deleteMany();
    const PLACEHOLDER_IMAGE_URL =
      "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQac8bHYlkBUjlHSKiuseLm2hIFzVY0OtxEPnw";

    const toIngredients = (description: string) =>
      description
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);

    const createCategory = async (name: string, restaurantId: string) => {
      return await tx.menuCategory.create({
        data: { name, restaurantId },
      });
    };

    const createProducts = async ({
      restaurantId,
      menuCategoryId,
      products,
    }: {
      restaurantId: string;
      menuCategoryId: string;
      products: Array<{
        name: string;
        description?: string;
        price: number;
        imageUrl?: string;
        ingredients?: string[];
      }>;
    }) => {
      await tx.product.createMany({
        data: products.map((p) => ({
          name: p.name,
          description: p.description ?? "",
          price: p.price,
          imageUrl: p.imageUrl ?? PLACEHOLDER_IMAGE_URL,
          ingredients: p.ingredients ?? toIngredients(p.description ?? ""),
          menuCategoryId,
          restaurantId,
        })),
      });
    };

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

    // === CATEGORÍAS / PRODUCTOS (catálogo de las imágenes) ===
    const categoriaBebidas = await createCategory("Bebidas", restaurante.id);
    await createProducts({
      restaurantId: restaurante.id,
      menuCategoryId: categoriaBebidas.id,
      products: [
        // Cervezas / varios
        { name: "Pilsen 3/4", price: 15000 },
        { name: "Bud 3/4", price: 22000 },
        { name: "Corona 3/4", price: 27000 },
        { name: "Bud Lata", price: 9000 },
        { name: "Coronita 210", price: 10000 },
        { name: "Coronita 330", price: 12000 },
        { name: "Smirnoff", price: 13000 },
        { name: "Munich Ultra", price: 10000 },
        { name: "Michelob Lata", price: 9000 },
        { name: "Michelob Botella", price: 10000 },
        { name: "Pilsen Chico", price: 10000 },
        { name: "Miller 3/4", price: 22000 },
        { name: "Vino", price: 45000 },
        // Gaseosas / jugos
        { name: "Coca 1/2", price: 10000 },
        { name: "Coca 1L", price: 15000 },
        { name: "Coca 1 1/2", price: 18000 },
        { name: "Coca 2L", price: 22000 },
        { name: "Coca Personal", price: 5000 },
        { name: "Frugos Chico", price: 6000 },
        { name: "Frugos 1L", price: 17000 },
        { name: "Agua", price: 5000 },
        { name: "Agua con gas", price: 5000 },
        { name: "Powerade", price: 10000 },
        { name: "Agua tónica", price: 10000 },
        { name: "Schweppes", price: 10000 },
      ],
    });

    const categoriaTragos = await createCategory("Tragos", restaurante.id);
    await createProducts({
      restaurantId: restaurante.id,
      menuCategoryId: categoriaTragos.id,
      products: [
        {
          name: "Tequila Sunrise",
          description: "Tequila, sumo de naranja, granadina, hielo",
          price: 25000,
        },
        { name: "Shot de Tequila", description: "Tequila, limón, sal", price: 20000 },
        {
          name: "Margarita Blue",
          description: "Tequila, blue curacao, sumo de limón, hielo",
          price: 30000,
        },
        {
          name: "Margarita Coronada",
          description: "Tequila, triple sec, limón, coronita, hielo",
          price: 40000,
        },
        {
          name: "Margarita Frozen",
          description: "Tequila, triple sec, limón, hielo",
          price: 35000,
        },
        { name: "Copa King", price: 45000 },
        { name: "Jarra", price: 60000 },
      ],
    });

    const categoriaJugos = await createCategory("Jugos", restaurante.id);
    await createProducts({
      restaurantId: restaurante.id,
      menuCategoryId: categoriaJugos.id,
      products: [
        { name: "Jugo de Frutilla", description: "Frutilla, agua, hielo, azúcar", price: 20000 },
        { name: "Jugo de Limón", description: "Limón, agua, hielo, azúcar", price: 20000 },
        { name: "Limonada", description: "Limón, agua, hielo, azúcar", price: 15000 },
        { name: "Jugo de Naranja", description: "Naranja, agua, hielo, azúcar", price: 15000 },
        { name: "Jugo de Piña", description: "Piña, agua, hielo, azúcar", price: 15000 },
        { name: "Jugo de Pera", description: "Pera, agua, hielo, azúcar", price: 15000 },
        { name: "Jugo de Durazno", description: "Durazno, agua, hielo, azúcar", price: 15000 },
      ],
    });

    const categoriaZodiaco = await createCategory("Signos Zodiacales", restaurante.id);
    await createProducts({
      restaurantId: restaurante.id,
      menuCategoryId: categoriaZodiaco.id,
      products: [
        { name: "Capricornio", description: "Jagger Drinks, Fernet, jugo de naranja, hielo", price: 25000 },
        { name: "Acuario", description: "Laguna Azul: Vodka, blue curacao, soda, hielo", price: 25000 },
        { name: "Piscis", description: "Mint Julep: Borbón, menta, soda, hielo", price: 25000 },
        { name: "Aries", description: "Old Fashion: Ginebra, triple sec, soda, hielo", price: 25000 },
        { name: "Tauro", description: "Cosmopolitan: Vodka, vermut rosso, triple sec, granadina, hielo", price: 25000 },
        { name: "Géminis", description: "Margarita salada y dulce: Tequila, sumo de limón, azúcar, sal, hielo", price: 25000 },
        { name: "Cáncer", description: "Pinch: Vodka, sumo de durazno, hielo", price: 25000 },
        { name: "Leo", description: "Ginebra mix: Ginebra, agua tónica, sumo de naranja, granadina, hielo", price: 25000 },
        { name: "Virgo", description: "Pearl pasión: Ron dorado, frutos rojos, soda, hielo", price: 25000 },
        { name: "Libra", description: "Aperol spritz: Aperol, espumante, hielo", price: 25000 },
        { name: "Sagitario", price: 25000 },
        { name: "Escorpio", price: 25000 },
      ],
    });

    const categoriaHamburguesas = await createCategory("Hamburguesas", restaurante.id);
    await createProducts({
      restaurantId: restaurante.id,
      menuCategoryId: categoriaHamburguesas.id,
      products: [
        { name: "Hamburguesa Simple", description: "Carne vacuna, queso, jamón, repollo y tomate", price: 16000 },
        { name: "Hamburguesa Completa", description: "Carne vacuna, queso, jamón, repollo, tomate y huevo", price: 18000 },
        {
          name: "Hamburguesa Premium",
          description: "Carne vacuna, queso, jamón, repollo, tomate, pepinillo, huevo, cebolla caramelizada y panceta",
          price: 25000,
        },
        { name: "Hamburguesa Cheddar", description: "Carne vacuna, queso cheddar, jamón, huevo, repollo y tomate", price: 25000 },
        { name: "Hamburguesa Katupiry", description: "Carne vacuna, queso katupiry, jamón, huevo, repollo y tomate", price: 25000 },
        { name: "Hamburguesa Al Pesto", description: "Carne vacuna, queso katupiry y salsa al pesto", price: 25000 },
        {
          name: "Hamburguesa Doble Cheddar",
          description: "Doble carne vacuna, queso cheddar, cebollas caramelizadas, panceta, huevo, repollo y tomate",
          price: 32000,
        },
        {
          name: "Hamburguesa Doble Katupiry",
          description: "Doble carne vacuna, queso katupiry, cebollas caramelizadas, panceta, huevo, repollo y tomate",
          price: 32000,
        },
        { name: "Hamburguesa Italiana", description: "Carne vacuna, queso cheddar, albahaca, tomate, panceta y huevo", price: 30000 },
        { name: "Hamburguesa Jalapeño", description: "Carne vacuna, queso cheddar, repollo, tomate, huevo y jalapeño", price: 30000 },
        { name: "Hamburguesa Koygua", description: "Carne vacuna, queso cheddar, huevo, cebolla caramelizada", price: 30000 },
        { name: "Hamburguesa Mbarete", description: "Carne de vacío, queso cheddar, huevo, cebolla morada", price: 32000 },
        {
          name: "Hamburguesa Mbarete Doble",
          description: "Doble carne de vacío, queso cheddar, doble huevo, cebolla morada",
          price: 45000,
        },
      ],
    });

    const categoriaSandwichLomito = await createCategory("Sándwich de Lomito", restaurante.id);
    await createProducts({
      restaurantId: restaurante.id,
      menuCategoryId: categoriaSandwichLomito.id,
      products: [
        { name: "Lomito Simple", description: "Carne de lomito, queso, jamón, repollo y tomate", price: 23000 },
        { name: "Lomito Completo", description: "Carne de lomito, queso, jamón, repollo, tomate y huevo", price: 28000 },
        {
          name: "Lomito Premium",
          description: "Carne de lomito, queso, jamón, repollo, tomate, pepinillo, huevo, cebolla caramelizada y panceta",
          price: 33000,
        },
        {
          name: "Lomito Koygua",
          description: "Carne de lomito, queso cheddar, repollo, tomate, huevo, cebolla caramelizada, panceta, locote rojo, verde y amarillo",
          price: 35000,
        },
      ],
    });

    const categoriaChivito = await createCategory("Chivito Uruguayo", restaurante.id);
    await createProducts({
      restaurantId: restaurante.id,
      menuCategoryId: categoriaChivito.id,
      products: [
        {
          name: "Chivito Uruguayo",
          description: "Carne de lomito, jamón y queso, queso katupiry, cebolla caramelizada, panceta, huevo, repollo y tomate",
          price: 47000,
        },
        {
          name: "Chivito Reforzado",
          description: "Doble carne de lomito, doble jamón y queso, queso katupiry, doble cebolla caramelizada, doble panceta, doble huevo, repollo y tomate",
          price: 55000,
        },
        { name: "Chivito Animal", description: "Doble de todo + queso katupiry, pepinillos", price: 68000 },
      ],
    });

    const categoriaLomitoArabe = await createCategory("Lomito Árabe", restaurante.id);
    await createProducts({
      restaurantId: restaurante.id,
      menuCategoryId: categoriaLomitoArabe.id,
      products: [
        { name: "Lomito Árabe Mixto", description: "Repollo, tomate, carne y pollo, queso mozzarella", price: 27000 },
        { name: "Lomito Árabe Carne", description: "Repollo, tomate, carne, queso mozzarella", price: 32000 },
        { name: "Lomito Árabe Pollo", description: "Repollo, tomate, pollo, queso mozzarella", price: 25000 },
        { name: "Lomito Árabe Cheddar", description: "Repollo, tomate, carne y pollo, huevo, cheddar, cebolla caramelizada", price: 32000 },
      ],
    });

    const categoriaDelicatessen = await createCategory("Delicatessen de Tío's", restaurante.id);
    await createProducts({
      restaurantId: restaurante.id,
      menuCategoryId: categoriaDelicatessen.id,
      products: [
        { name: "Ensalada Cesar", description: "Pollo en trozos, pan tostado, tomate y salsa especial", price: 35000 },
        { name: "Wrap de Pollo", price: 30000 },
        { name: "Wrap de Carne", price: 30000 },
        { name: "Milanesa de Carne", price: 32000 },
        { name: "Milanesa de Pollo", price: 28000 },
        { name: "Milanesa Napolitana", price: 38000 },
        { name: "Milanesa a Caballo", price: 38000 },
        { name: "Quesadilla de Carne", price: 28000 },
        { name: "Quesadilla de Pollo", price: 25000 },
        { name: "Quesadilla de Queso", price: 25000 },
        { name: "Picaña al Ajo con mandioca frita", price: 70000 },
        { name: "Box Mexicano", price: 85000 },
        { name: "Tacos", price: 17000 },
        { name: "Burrito", price: 27000 },
        { name: "Nachos", price: 25000 },
      ],
    });

    const categoriaPicadas = await createCategory("Picadas", restaurante.id);
    await createProducts({
      restaurantId: restaurante.id,
      menuCategoryId: categoriaPicadas.id,
      products: [
        { name: "Picada Grill (2 personas)", price: 100000 },
        { name: "Picada Grill (4 personas)", price: 170000 },
        { name: "Picada Frita (2 personas)", price: 55000 },
        { name: "Picada Frita (4 personas)", price: 90000 },
        { name: "Papas Cheddar o Katupiry (chica)", price: 25000 },
        { name: "Papas Cheddar o Katupiry (grande)", price: 48000 },
        { name: "Papas Fritas (chica)", price: 12000 },
        { name: "Papas Fritas (grande)", price: 15000 },
        { name: "Bolitas de Papa", price: 25000 },
        { name: "Aros de Cebolla", price: 25000 },
        { name: "Choripapas (2 personas)", price: 35000 },
        { name: "Choripapas (4 personas)", price: 60000 },
      ],
    });

    const categoriaMilapizzas = await createCategory("Milapizzas", restaurante.id);
    await createProducts({
      restaurantId: restaurante.id,
      menuCategoryId: categoriaMilapizzas.id,
      products: [
        { name: "Rapa Kanchera", price: 35000 },
        { name: "Milapizza Koygua", price: 70000 },
        { name: "Milapizza Peperoni", price: 60000 },
        { name: "Milapizza Napocheddar", price: 65000 },
        { name: "Milapizza Napomozarella", price: 60000 },
        { name: "Milapizza Alemana", price: 70000 },
      ],
    });

    const categoriaPicadasRaton = await createCategory("Picadas al Ratón", restaurante.id);
    await createProducts({
      restaurantId: restaurante.id,
      menuCategoryId: categoriaPicadasRaton.id,
      products: [
        { name: "Picadas al Ratón (2 personas)", price: 50000 },
        { name: "Picadas al Ratón (4 personas)", price: 90000 },
      ],
    });

    const categoriaEmpanadas = await createCategory("Empanadas", restaurante.id);
    await createProducts({
      restaurantId: restaurante.id,
      menuCategoryId: categoriaEmpanadas.id,
      products: [
        { name: "Empanada de Carne", price: 6000 },
        { name: "Empanada de Jamón y Queso", price: 6000 },
        { name: "Empanada de Mandioca", price: 7000 },
        { name: "Empanada de Pajagua Mascada", price: 6000 },
        { name: "Croqueta de Mandioca", price: 7000 },
      ],
    });

    const categoriaSandwichMilanesa = await createCategory("Sándwiches de Milanesa", restaurante.id);
    await createProducts({
      restaurantId: restaurante.id,
      menuCategoryId: categoriaSandwichMilanesa.id,
      products: [
        { name: "Sándwich de Milanesa de Pollo", price: 13000 },
        { name: "Sándwich de Milanesa de Carne", price: 15000 },
        { name: "Sándwich de Milanesa de Pollo Especial", description: "Jamón, queso y huevo", price: 17000 },
        { name: "Sándwich de Milanesa de Carne Especial", description: "Jamón, queso y huevo", price: 18000 },
      ],
    });

    const categoriaPizzasPorciones = await createCategory("Pizzas (porciones)", restaurante.id);
    const pizzasPorciones = [
      {
        name: "Mozzarella",
        description: "Queso mozzarella, salsa y orégano",
        normal: 35000,
        mediana: 20000,
      },
      {
        name: "Peperoni",
        description: "Queso mozzarella, salsa, orégano y peperoni",
        normal: 45000,
        mediana: 28000,
      },
      {
        name: "Huevo",
        description: "Queso mozzarella, salsa, tomate en cubo, huevo, orégano (pesto a elección)",
        normal: 45000,
        mediana: 28000,
      },
      {
        name: "Napolitana",
        description: "Queso mozzarella, salsa, orégano, tomate, jamón y queso",
        normal: 45000,
        mediana: 28000,
      },
      { name: "Palmito", description: "Queso mozzarella, salsa, orégano, palmito y queso katupiry", normal: 45000, mediana: 28000 },
      { name: "Choclo", description: "Queso mozzarella, salsa, orégano, choclo y queso katupiry", normal: 45000, mediana: 28000 },
      { name: "Jamón y Queso", description: "Queso mozzarella, salsa, orégano y jamón", normal: 45000, mediana: 28000 },
      { name: "Doble Mozzarella", description: "Doble queso mozzarella, salsa y orégano", normal: 45000, mediana: 28000 },
      {
        name: "Cuatro Quesos",
        description: "Queso mozzarella, cheddar, katupiry, cuartirolo, salsa y orégano",
        normal: 55000,
        mediana: 32000,
      },
      {
        name: "Pollo con Katupiry",
        description: "Queso mozzarella, salsa, orégano, pollo, queso katupiry",
        normal: 48000,
        mediana: 28000,
      },
      {
        name: "Atún",
        description: "Queso mozzarella, salsa, atún, cebolla caramelizada y orégano",
        normal: 50000,
        mediana: 28000,
      },
      {
        name: "Carnívoro",
        description: "Queso mozzarella, salsa, orégano, carne salteada, queso katupiry, cebolla y panceta",
        normal: 55000,
        mediana: 32000,
      },
      {
        name: "Antojos de Tío's",
        description: "Salsa de la casa, lomito, champiñones, queso katupiry",
        normal: 60000,
        mediana: 35000,
      },
      {
        name: "Mexicana",
        description: "Queso mozzarella, salsa, orégano, locote rojo y verde, cebolla morada, carne de lomito, picante de la casa y jalapeño",
        normal: 48000,
        mediana: 30000,
      },
      { name: "Italiana", description: "Queso mozzarella, salsa, orégano, locote rojo, verde, tomate y pesto", normal: 48000, mediana: 28000 },
      { name: "Alemana", description: "Queso mozzarella, salsa, orégano, panceta, pesto y cebolla caramelizada", normal: 48000, mediana: 28000 },
      {
        name: "Vegetariana",
        description: "Queso mozzarella, salsa, orégano, huevo duro, locote verde, tomate, choclo y pesto",
        normal: 48000,
        mediana: 28000,
      },
      {
        name: "La Ahumada",
        description: "Chorizo napolitano, panceta, cebollas, queso mozzarella, salsa y orégano",
        normal: 50000,
        mediana: 30000,
      },
      { name: "Burger Pizza", description: "Carne de hamburguesa, queso, jamón, huevo y salsa", normal: 58000, mediana: 0 },
    ];

    await createProducts({
      restaurantId: restaurante.id,
      menuCategoryId: categoriaPizzasPorciones.id,
      products: pizzasPorciones
        .flatMap((p) => {
          const base = { description: p.description };
          const items = [
            { name: `${p.name} (porción normal)`, price: p.normal, ...base },
          ];
          if (p.mediana && p.mediana > 0) {
            items.push({ name: `${p.name} (porción mediana)`, price: p.mediana, ...base });
          }
          return items;
        })
        .filter((p) => p.price > 0),
    });

    const categoriaMetroPizzas = await createCategory("Metro Pizzas", restaurante.id);
    const metroPizzas = [
      { name: "Huevo", description: "Queso mozzarella, salsa, tomate en cubo, huevo, orégano (pesto a elección)", medio: 55000, metro: 105000 },
      { name: "Jamón y Queso", description: "Queso mozzarella, salsa, orégano y jamón", medio: 55000, metro: 110000 },
      { name: "Doble Mozzarella", description: "Doble queso mozzarella, salsa y orégano", medio: 55000, metro: 116000 },
      { name: "Cuatro Quesos", description: "Queso mozzarella, cheddar, katupiry, cuartirolo, salsa y orégano", medio: 63000, metro: 125000 },
      { name: "Pollo con Katupiry", description: "Queso mozzarella, salsa, orégano, pollo, queso katupiry", medio: 60000, metro: 120000 },
      { name: "Carnívoro", description: "Queso mozzarella, salsa, orégano, carne salteada, queso katupiry, cebolla y panceta", medio: 63000, metro: 125000 },
      { name: "Antojos de Tío's", description: "Salsa de la casa, lomito, champiñones, queso katupiry", medio: 70000, metro: 140000 },
      { name: "Mexicana", description: "Queso mozzarella, salsa, orégano, locote rojo y verde, cebolla morada, carne de lomito, picante de la casa y jalapeño", medio: 63000, metro: 125000 },
      { name: "Italiana", description: "Queso mozzarella, salsa, orégano, locote rojo, verde, tomate y pesto", medio: 63000, metro: 125000 },
      { name: "Alemana", description: "Queso mozzarella, salsa, orégano, panceta, pesto y cebolla caramelizada", medio: 63000, metro: 125000 },
      { name: "Vegetariana", description: "Queso mozzarella, salsa, orégano, huevo duro, locote verde, tomate, choclo y pesto", medio: 63000, metro: 125000 },
      { name: "La Ahumada", description: "Chorizo napolitano, panceta, cebollas, queso mozzarella, salsa y orégano", medio: 63000, metro: 125000 },
      { name: "Lomi Pizza", description: "Carne de lomito, queso, jamón, huevo y salsa", medio: 140000, metro: 280000 },
      { name: "Burger Pizza", description: "Carne de hamburguesa, queso, jamón, huevo y salsa", medio: 130000, metro: 250000 },
    ];

    await createProducts({
      restaurantId: restaurante.id,
      menuCategoryId: categoriaMetroPizzas.id,
      products: metroPizzas.flatMap((p) => [
        { name: `${p.name} (1/2 metro)`, description: p.description, price: p.medio },
        { name: `${p.name} (1 metro)`, description: p.description, price: p.metro },
      ]),
    });

    const categoriaAdicionales = await createCategory("Adicionales", restaurante.id);
    await createProducts({
      restaurantId: restaurante.id,
      menuCategoryId: categoriaAdicionales.id,
      products: [
        { name: "Borde relleno", price: 12000 },
        { name: "Aceituna", price: 3000 },
        { name: "Aceituna (por medio metro)", price: 5000 },
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
