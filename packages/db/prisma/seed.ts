import { PrismaClient ,User, Event,AuthProviderType,EventType} from '@prisma/client';
const prisma = new PrismaClient();
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcryptjs';

const mapData = [
  { name: "Agadir", latitude: 30.46667, longitude: -9.91667 },
  { name: "Al Hoceima", latitude: 35.13333, longitude: -3.96667 },
  { name: "Alhucema s/Al Hoceima", latitude: 35.13333, longitude: -3.08333 },
  { name: "Anti Atlas", latitude: 30, longitude: -8.5 },
  { name: "Ar Rachid iya/Er Rachidia", latitude: 31, longitude: -4.3 },
  { name: "Atlas Mts ./Haut Atlas", latitude: 32, longitude: -5 },
  { name: "Baddouza , Ras", latitude: 32, longitude: -9 },
  { name: "Beni Mall al", latitude: 32, longitude: -6 },
  { name: "Bouarfa", latitude: 32, longitude: -1 },
  { name: "Casablanca", latitude: 33, longitude: -7 },
  { name: "Dar el Bei da/Casablanca", latitude: 33, longitude: -7 },
  { name: "El Jadida", latitude: 33, longitude: -8 },
  { name: "Er Rachid ia", latitude: 31, longitude: -4 },
  { name: "Er Rif", latitude: 35, longitude: -4 },
  { name: "Essaouira", latitude: 31, longitude: -9 },
  { name: "Fedala/M ohammedia", latitude: 33, longitude: -7 },
  { name: "Fes", latitude: 34, longitude: -5 },
  { name: "Fez/Fes", latitude: 34, longitude: -5 },
  { name: "Figuig", latitude: 32, longitude: 47 },
  { name: "Goulimine", latitude: 28, longitude: -10 },
  { name: "Guelmine /Goulimine", latitude: 28, longitude: -10 },
  { name: "Haut Atla s", latitude: 32, longitude: -5 },
  { name: "High Atla s/Haut Atlas", latitude: 32, longitude: -5 },
  { name: "Juby, C.", latitude: 28, longitude: -12 },
  { name: "Kenitra ", latitude: 34, longitude: 6 },
  { name: "Khemisse t ", latitude: 33, longitude: 6 },
  { name: "Khouribga ", latitude: 32, longitude: 6 },
  { name: "Ksar el Kebir ", latitude: 35, longitude: 6 },
  { name: "Ksar es Souk/Er Rachidia ", latitude: 31, longitude: 4 },
  { name: "Marrakech ", latitude: 31, longitude: 8 },
  { name: "Mazagan /El Jadida ", latitude: 33, longitude: 8 },
  { name: "Meknes ", latitude: 33, longitude: 5 },
  { name: "Mogador/ Essauira ", latitude: 31, longitude: 9 },
  { name: "Mohammedia ", latitude: 33, longitude: 7 },
  { name: "Moulouya O.", latitude: 35, longitude: 2 },
  { name: "Moyen Atlas ", latitude: 33, longitude: 5 },
  { name: "Nador ", latitude: 35, longitude: 0 },
  { name: "Ouarzazate ", latitude: 30, longitude: 6 },
  { name: "Ouezzane", latitude: 34, longitude: 5 },
  { name: "Oujda ", latitude: 34, longitude: 1 },
  { name: "Rabat ", latitude: 34, longitude: 6 },
  { name: "Rhir cap ", latitude: 30, longitude: 9 },
  { name: "Safi ", latitude: 32, longitude: 9 },
  { name: "Settat ", latitude: 33, longitude: 7 },
  { name: "Tanger ", latitude: 35 , longitude: 5 },
  { name: "Tangier/ Tanger ", latitude: 35, longitude: 5 },
  { name: "Toubkal, Djebel ", latitude: 31, longitude: 8 },
  { name: "Villa Bens/Tarfaya ", latitude: 27, longitude: -12 },
];

const popularEventTags = [
  "Arts & Culture",
  "Business & Professional",
  "Charity & Causes",
  "Community & Civic",
  "Education & Learning",
  "Fashion & Beauty",
  "Film, Media & Entertainment",
  "Food & Drink",
  "Health & Wellness",
  "Hobbies & Special Interests",
  "Music",
  "Performing & Visual Arts",
  "Religion & Spirituality",
  "Science & Technology",
  "Seasonal & Holiday",
  "Sports & Fitness",
  "Travel & Outdoor",
  "Other"
];


const NUM_USERS = 100;
const NUM_COMMUNITIES = 30;
const NUM_EVENTS = 200;
const NUM_TICKETS = 500;
const NUM_PAYMENTS = 300;

async function main() {
  await prisma.$transaction(async (tx) => {
    // Create cities (keep as is)
    for (const location of mapData) {
      await tx.city.upsert({
        where: { name: location.name },
        update: {},
        create: location,
      });
    }
    console.log('Cities created');

    // Create tags (keep as is)
    for (const tagName of popularEventTags) {
      await tx.tag.upsert({
        where: { name: tagName },
        update: {},
        create: { name: tagName },
      });
    }
    console.log('Tags created');

    // Create users
    const users: User[] = []; // Explicitly type users as User[]
    for (let i = 0; i < NUM_USERS; i++) {
      const uid = faker.string.uuid();
      const user = await tx.user.upsert({
        where: { uid },
        update: {},
        create: {
          uid,
          name: faker.person.fullName(),
          image: faker.image.avatar(),
          stripe_customer_id: faker.string.alphanumeric(10),
          createdAt: faker.date.past(),
          updatedAt: faker.date.recent(),
          tags: {
            connect: faker.helpers.arrayElements(popularEventTags, { min: 1, max: 5 }).map(tag => ({ name: tag })),
          },
        },
      });
      users.push(user);

      // Create credentials or auth provider (keep as is)
      if (Math.random() > 0.5) {
        await tx.credentials.create({
          data: {
            uid: user.uid,
            email: faker.internet.email(),
            passwordHash: await bcrypt.hash('123456', 10),
          },
        });
      } else {
        await tx.authProvider.create({
          data: {
            uid: user.uid,
            type: Math.random() > 0.5 ? AuthProviderType.GOOGLE : AuthProviderType.CREDENTIALS,
          },
        });
      }

      // Assign roles (keep as is)
      if (Math.random() < 0.1) {
        await tx.admin.create({ data: { uid: user.uid } });
      } else if (Math.random() < 0.3) {
        await tx.organization.create({ data: { uid: user.uid } });
      } else {
        await tx.individual.create({ data: { uid: user.uid } });
      }
    }
    console.log('Users created');

    // Create communities
    const communities = [];
    for (let i = 0; i < NUM_COMMUNITIES; i++) {
      const community = await tx.community.create({
        data: {
          name: faker.company.name(),
          description: faker.lorem.paragraph(),
          uid: users[i].uid,
          image: faker.image.avatar(),
          tags: {
            connect: faker.helpers.arrayElements(popularEventTags, { min: 1, max: 3 }).map(tag => ({ name: tag })),
          },
        },
      });
      communities.push(community);
    }
    console.log('Communities created');

    // Create events
    const cities = await tx.city.findMany();
    const events:Event[] = [];
    for (let i = 0; i < NUM_EVENTS; i++) {
      const startDate = faker.date.future();
      const endDate = new Date(startDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000);
      const city = faker.helpers.arrayElement(cities);
      const eventType = faker.helpers.arrayElement([EventType.FREE, EventType.PAID]);
      const event = await tx.event.create({
        data: {
          title: faker.lorem.words(3),
          description: faker.lorem.paragraph(),
          date: startDate,
          city_id: city.id,
          uid: users[Math.floor(Math.random() * users.length)].uid,
          community_id: Math.random() > 0.5 ? communities[Math.floor(Math.random() * communities.length)].community_id : null,
          address: faker.location.streetAddress(),
          longitude: faker.location.longitude(),
          latitude: faker.location.latitude(),
          tags: {
            connect: faker.helpers.arrayElements(popularEventTags, { min: 1, max: 3 }).map(tag => ({ name: tag })),
          },
          ticketSold: faker.number.int({ min: 10, max: 100 }),

          ticketAmount: faker.number.int({ min: 100, max: 500 }),
          TicketPrice: eventType === EventType.PAID ? parseFloat(faker.finance.amount({ min: 5, max: 500, dec: 2 })) : 0,
          image: faker.image.avatar(),
          type: eventType,
        },
      });
      events.push(event);
    }
    console.log('Events created');

    // Create tickets (using createMany)
    await tx.ticket.createMany({
      data: Array.from({ length: NUM_TICKETS }, () => ({
        event_id: events[Math.floor(Math.random() * events.length)].event_id,
        uid: users[Math.floor(Math.random() * users.length)].uid,
        status: faker.helpers.arrayElement(['reserved', 'paid', 'cancelled']),
      })),
    });
    console.log('Tickets created');

    // Create payments (using createMany)
    await tx.payment.createMany({
      data: Array.from({ length: NUM_PAYMENTS }, () => ({
        uid: users[Math.floor(Math.random() * users.length)].uid,
        amount: parseFloat(faker.finance.amount({ min: 10, max: 1000 })),
        currency: 'USD',
        status: faker.helpers.arrayElement(['pending', 'completed', 'failed']),
        billing_date: faker.date.recent(),
      })),
    });
    console.log('Payments created');
  }, { timeout: 100000 });
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });