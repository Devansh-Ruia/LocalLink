import { PrismaClient, UserRole, ServiceCategory, VerificationBadge, BookingStatus } from '@prisma/client';
import { hashPassword } from '../src/utils/password';

const prisma = new PrismaClient();

// Demo Customer Accounts
const customerData = [
  { name: 'Sarah Mitchell', email: 'sarah@test.com', location: 'Back Bay' },
  { name: 'James Rodriguez', email: 'james@test.com', location: 'Fenway' },
  { name: 'Priya Patel', email: 'priya@test.com', location: 'Allston' }
];

// Demo Worker Profiles with realistic Boston locations
const workerData = [
  {
    name: 'Maria Santos',
    email: 'maria@test.com',
    bio: 'Been cleaning homes in the Roxbury area for 8 years. I bring my own supplies and I\'m thorough—baseboards, ovens, you name it. References available.',
    serviceCategory: ServiceCategory.CLEANING,
    hourlyRate: 30,
    verificationBadge: VerificationBadge.FULLY_CERTIFIED,
    location: { lat: 42.3292, lng: -71.0846, neighborhood: 'Roxbury' }
  },
  {
    name: 'David Chen',
    email: 'david@test.com',
    bio: 'MIT grad tutoring math and physics for high school and college students. Patient approach, flexible scheduling.',
    serviceCategory: ServiceCategory.TUTORING,
    hourlyRate: 45,
    verificationBadge: VerificationBadge.ID_VERIFIED,
    location: { lat: 42.3318, lng: -71.1212, neighborhood: 'Brookline' }
  },
  {
    name: 'Angela Washington',
    email: 'angela@test.com',
    bio: 'Mother of three, CPR certified, 10+ years watching kids in the neighborhood. Your little ones are safe with me.',
    serviceCategory: ServiceCategory.BABYSITTING,
    hourlyRate: 22,
    verificationBadge: VerificationBadge.FULLY_CERTIFIED,
    location: { lat: 42.3016, lng: -71.0674, neighborhood: 'Dorchester' }
  },
  {
    name: 'Mike O\'Brien',
    email: 'mike@test.com',
    bio: 'I fix things. Plumbing, drywall, furniture assembly, minor electrical. No job too small.',
    serviceCategory: ServiceCategory.HANDYMAN,
    hourlyRate: 40,
    verificationBadge: VerificationBadge.SKILL_CHECKED,
    location: { lat: 42.3381, lng: -71.0476, neighborhood: 'South Boston' }
  },
  {
    name: 'Fatima Al-Hassan',
    email: 'fatima@test.com',
    bio: 'PhD candidate at Harvard. I tutor ESL, writing, and Arabic. I love helping people find their voice.',
    serviceCategory: ServiceCategory.TUTORING,
    hourlyRate: 50,
    verificationBadge: VerificationBadge.FULLY_CERTIFIED,
    location: { lat: 42.3736, lng: -71.1097, neighborhood: 'Cambridge' }
  },
  {
    name: 'Carlos Rivera',
    email: 'carlos@test.com',
    bio: 'Lawn care, garden design, snow removal in winter. Born and raised in JP.',
    serviceCategory: ServiceCategory.LANDSCAPING,
    hourlyRate: 35,
    verificationBadge: VerificationBadge.ID_VERIFIED,
    location: { lat: 42.3097, lng: -71.1151, neighborhood: 'Jamaica Plain' }
  },
  {
    name: 'Jenny Park',
    email: 'jenny@test.com',
    bio: 'Vet tech student who loves animals. Dog walking, cat sitting, happy to handle medication schedules.',
    serviceCategory: ServiceCategory.PET_CARE,
    hourlyRate: 25,
    verificationBadge: VerificationBadge.NONE,
    location: { lat: 42.3588, lng: -71.0707, neighborhood: 'Beacon Hill' }
  },
  {
    name: 'Robert Williams',
    email: 'robert@test.com',
    bio: 'Licensed contractor, 15 years experience. Kitchens, bathrooms, decks. Free estimates.',
    serviceCategory: ServiceCategory.HANDYMAN,
    hourlyRate: 35,
    verificationBadge: VerificationBadge.FULLY_CERTIFIED,
    location: { lat: 42.2676, lng: -71.0924, neighborhood: 'Mattapan' }
  },
  {
    name: 'Lisa Nguyen',
    email: 'lisa@test.com',
    bio: 'Detail-oriented house and apartment cleaning. I specialize in move-in/move-out deep cleans.',
    serviceCategory: ServiceCategory.CLEANING,
    hourlyRate: 28,
    verificationBadge: VerificationBadge.SKILL_CHECKED,
    location: { lat: 42.3513, lng: -71.0625, neighborhood: 'Chinatown' }
  },
  {
    name: 'Tom Jackson',
    email: 'tom@test.com',
    bio: 'Mowing, trimming, leaf cleanup. Just starting out but I work hard and show up on time.',
    serviceCategory: ServiceCategory.LANDSCAPING,
    hourlyRate: 30,
    verificationBadge: VerificationBadge.NONE,
    location: { lat: 42.2834, lng: -71.1270, neighborhood: 'Roslindale' }
  },
  {
    name: 'Aisha Brown',
    email: 'aisha@test.com',
    bio: 'Education major at Northeastern. Experienced with kids ages 2-10. Can help with homework too.',
    serviceCategory: ServiceCategory.BABYSITTING,
    hourlyRate: 20,
    verificationBadge: VerificationBadge.ID_VERIFIED,
    location: { lat: 42.3309, lng: -71.1042, neighborhood: 'Mission Hill' }
  },
  {
    name: 'Greg Murphy',
    email: 'greg@test.com',
    bio: 'Odd jobs and errands—grocery runs, furniture moving, airport rides. Text me what you need.',
    serviceCategory: ServiceCategory.OTHER,
    hourlyRate: 0,
    verificationBadge: VerificationBadge.SKILL_CHECKED,
    location: { lat: 42.3782, lng: -71.0602, neighborhood: 'Charlestown' }
  }
];

// Realistic review comments
const reviewComments = [
  'Maria cleaned our apartment before move-out and we got our full deposit back. Highly recommend.',
  'David helped my son go from a C to an A- in calculus. Worth every penny.',
  'Mike showed up on time and fixed our leaky faucet in 20 minutes. Fair price too.',
  'Jenny was great with our dog but forgot to lock the back gate once. Otherwise solid.',
  'Fatima is an amazing tutor. My English has improved so much since we started working together.',
  'Carlos transformed our backyard. It looks like a professional landscape now.',
  'Robert renovated our kitchen and it\'s beautiful. Professional and on budget.',
  'Lisa does an incredible deep clean. Our place has never looked this good.',
  'Tom is reliable and does great work. Our lawn has never looked better.',
  'Aisha is wonderful with our kids. They love her and she\'s always on time.',
  'Greg helped us move last minute. Super helpful and reasonable rates.'
];

async function main() {
  console.log('Starting LocalLink seed with Boston-area demo data...');

  // Clear existing data
  await prisma.review.deleteMany();
  await prisma.message.deleteMany();
  await prisma.bookingRequest.deleteMany();
  await prisma.workerProfile.deleteMany();
  await prisma.user.deleteMany();

  console.log('Cleared existing data');

  // Create customers
  const customers = [];
  for (const customer of customerData) {
    const user = await prisma.user.create({
      data: {
        email: customer.email,
        password: await hashPassword('password123'),
        name: customer.name,
        role: UserRole.CUSTOMER,
        phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`
      }
    });
    customers.push(user);
  }
  console.log('Created 3 customer accounts');

  // Create workers
  const workers = [];
  for (const worker of workerData) {
    const user = await prisma.user.create({
      data: {
        email: worker.email,
        password: await hashPassword('password123'),
        name: worker.name,
        role: UserRole.WORKER,
        phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`
      }
    });

    const workerProfile = await prisma.workerProfile.create({
      data: {
        userId: user.id,
        bio: worker.bio,
        serviceCategory: worker.serviceCategory,
        hourlyRate: worker.hourlyRate,
        locationLat: worker.location.lat,
        locationLng: worker.location.lng,
        neighborhood: worker.location.neighborhood,
        radiusMiles: Math.floor(Math.random() * 5) + 5,
        isVerified: worker.verificationBadge !== VerificationBadge.NONE,
        verificationBadge: worker.verificationBadge,
        availabilityNotes: 'Available weekdays and weekends. Flexible scheduling.'
      }
    });

    workers.push({ user, profile: workerProfile });
  }
  console.log('Created 12 worker profiles');

  // Create demo bookings
  const bookings = [];
  const bookingConfigs = [
    { customerIndex: 0, workerIndex: 0, status: BookingStatus.COMPLETED, service: ServiceCategory.CLEANING },
    { customerIndex: 1, workerIndex: 1, status: BookingStatus.ACCEPTED, service: ServiceCategory.TUTORING },
    { customerIndex: 2, workerIndex: 2, status: BookingStatus.PENDING, service: ServiceCategory.BABYSITTING },
    { customerIndex: 0, workerIndex: 3, status: BookingStatus.COMPLETED, service: ServiceCategory.HANDYMAN },
    { customerIndex: 1, workerIndex: 4, status: BookingStatus.ACCEPTED, service: ServiceCategory.TUTORING },
    { customerIndex: 2, workerIndex: 5, status: BookingStatus.PENDING, service: ServiceCategory.LANDSCAPING },
    { customerIndex: 0, workerIndex: 6, status: BookingStatus.COMPLETED, service: ServiceCategory.PET_CARE }
  ];

  for (const config of bookingConfigs) {
    const customer = customers[config.customerIndex];
    const worker = workers[config.workerIndex];
    
    const proposedDate = new Date();
    proposedDate.setDate(proposedDate.getDate() + Math.floor(Math.random() * 14) - 7);

    const booking = await prisma.bookingRequest.create({
      data: {
        customerId: customer.id,
        workerId: worker.profile.id,
        serviceCategory: config.service,
        message: `Looking for ${config.service.toLowerCase()} services. Please let me know your availability.`,
        proposedDate,
        proposedTime: ['09:00 AM', '10:30 AM', '02:00 PM', '03:30 PM'][Math.floor(Math.random() * 4)],
        status: config.status
      }
    });

    bookings.push(booking);

    // Add reviews for completed bookings
    if (config.status === BookingStatus.COMPLETED) {
      await prisma.review.create({
        data: {
          reviewerId: customer.id,
          workerId: worker.profile.id,
          bookingId: booking.id,
          rating: Math.random() > 0.2 ? 5 : Math.floor(Math.random() * 2) + 3,
          comment: reviewComments[Math.floor(Math.random() * reviewComments.length)]
        }
      });
    }

    // Add messages for accepted/completed bookings
    if (config.status === BookingStatus.ACCEPTED || config.status === BookingStatus.COMPLETED) {
      const messages = [
        'Hi, I can come by Thursday around 2pm. Does that work?',
        'Perfect, see you then! The key is under the mat.',
        'Looking forward to working with you!',
        'Thanks for the opportunity!'
      ];
      
      for (let i = 0; i < 2; i++) {
        await prisma.message.create({
          data: {
            bookingId: booking.id,
            senderId: i % 2 === 0 ? customer.id : worker.user.id,
            text: messages[i]
          }
        });
      }
    }
  }
  console.log('Created 7 demo bookings with reviews and messages');

  console.log('Seed completed successfully!');
  console.log('\nDemo Accounts (password: password123):');
  console.log('Customers:');
  customerData.forEach((customer, index) => {
    console.log(`  ${index + 1}. ${customer.name} - ${customer.email}`);
  });
  console.log('Workers:');
  workerData.forEach((worker, index) => {
    console.log(`  ${index + 1}. ${worker.name} - ${worker.email} (${worker.serviceCategory})`);
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
