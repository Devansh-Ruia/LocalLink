import { PrismaClient, UserRole, ServiceCategory, VerificationBadge, BookingStatus } from '@prisma/client';
import { hashPassword } from '../src/utils/password';

const prisma = new PrismaClient();

const bostonNeighborhoods = [
  'Back Bay', 'Beacon Hill', 'North End', 'South End', 'Fenway', 
  'Cambridge', 'Somerville', 'Brookline', 'Jamaica Plain', 'Allston'
];

const bostonLocations = [
  { lat: 42.3496, lng: -71.0764, neighborhood: 'Back Bay' },
  { lat: 42.3589, lng: -71.0637, neighborhood: 'Beacon Hill' },
  { lat: 42.3647, lng: -71.0542, neighborhood: 'North End' },
  { lat: 42.3387, lng: -71.0903, neighborhood: 'South End' },
  { lat: 42.3463, lng: -71.0972, neighborhood: 'Fenway' },
  { lat: 42.3736, lng: -71.1097, neighborhood: 'Cambridge' },
  { lat: 42.3876, lng: -71.0995, neighborhood: 'Somerville' },
  { lat: 42.3318, lng: -71.1212, neighborhood: 'Brookline' },
  { lat: 42.3115, lng: -71.1140, neighborhood: 'Jamaica Plain' },
  { lat: 42.3516, lng: -71.1312, neighborhood: 'Allston' }
];

const workerData = [
  {
    name: 'Sarah Johnson',
    email: 'sarah.j@locallink.com',
    bio: 'Experienced babysitter with 8+ years caring for children aged 6 months to 12 years. CPR certified, patient, and creative with activities.',
    serviceCategory: ServiceCategory.BABYSITTING,
    hourlyRate: 25,
    verificationBadge: VerificationBadge.FULLY_CERTIFIED
  },
  {
    name: 'Michael Chen',
    email: 'michael.c@locallink.com',
    bio: 'Math and science tutor for middle and high school students. MIT graduate with teaching experience. Patient and good at explaining complex concepts.',
    serviceCategory: ServiceCategory.TUTORING,
    hourlyRate: 45,
    verificationBadge: VerificationBadge.SKILL_CHECKED
  },
  {
    name: 'David Martinez',
    email: 'david.m@locallink.com',
    bio: 'Reliable handyman with 15+ years experience. Plumbing, electrical, carpentry, and general home repairs. Licensed and insured.',
    serviceCategory: ServiceCategory.HANDYMAN,
    hourlyRate: 65,
    verificationBadge: VerificationBadge.FULLY_CERTIFIED
  },
  {
    name: 'Emily Rodriguez',
    email: 'emily.r@locallink.com',
    bio: 'Professional house cleaning service. Thorough, efficient, and trustworthy. Bring my own supplies. Specialize in deep cleaning.',
    serviceCategory: ServiceCategory.CLEANING,
    hourlyRate: 35,
    verificationBadge: VerificationBadge.ID_VERIFIED
  },
  {
    name: 'James Wilson',
    email: 'james.w@locallink.com',
    bio: 'Landscaping and garden maintenance expert. Lawn care, tree trimming, garden design, and seasonal cleanup.',
    serviceCategory: ServiceCategory.LANDSCAPING,
    hourlyRate: 40,
    verificationBadge: VerificationBadge.SKILL_CHECKED
  },
  {
    name: 'Lisa Anderson',
    email: 'lisa.a@locallink.com',
    bio: 'Pet lover providing dog walking and pet sitting services. Experienced with all breeds, can administer medication, and provide overnight care.',
    serviceCategory: ServiceCategory.PET_CARE,
    hourlyRate: 20,
    verificationBadge: VerificationBadge.ID_VERIFIED
  },
  {
    name: 'Robert Taylor',
    email: 'robert.t@locallink.com',
    bio: 'Professional tutor specializing in SAT/ACT prep and college application essays. Harvard grad with proven track record.',
    serviceCategory: ServiceCategory.TUTORING,
    hourlyRate: 60,
    verificationBadge: VerificationBadge.FULLY_CERTIFIED
  },
  {
    name: 'Jennifer Brown',
    email: 'jennifer.b@locallink.com',
    bio: 'Experienced childcare provider specializing in infants and toddlers. Former preschool teacher, First Aid certified.',
    serviceCategory: ServiceCategory.BABYSITTING,
    hourlyRate: 30,
    verificationBadge: VerificationBadge.SKILL_CHECKED
  },
  {
    name: 'Carlos Garcia',
    email: 'carlos.g@locallink.com',
    bio: 'General handyman services: painting, minor repairs, furniture assembly, and home maintenance. Reliable and detail-oriented.',
    serviceCategory: ServiceCategory.HANDYMAN,
    hourlyRate: 55,
    verificationBadge: VerificationBadge.ID_VERIFIED
  },
  {
    name: 'Amanda White',
    email: 'amanda.w@locallink.com',
    bio: 'Eco-friendly cleaning service using non-toxic products. Organizational expert and home staging specialist.',
    serviceCategory: ServiceCategory.CLEANING,
    hourlyRate: 42,
    verificationBadge: VerificationBadge.NONE
  },
  {
    name: 'Kevin Lee',
    email: 'kevin.l@locallink.com',
    bio: 'Music teacher offering piano and guitar lessons for all ages. Classical training, patient with beginners.',
    serviceCategory: ServiceCategory.TUTORING,
    hourlyRate: 50,
    verificationBadge: VerificationBadge.SKILL_CHECKED
  },
  {
    name: 'Maria Thompson',
    email: 'maria.t@locallink.com',
    bio: 'Professional dog walker and pet sitter. Large dog experience, can handle multiple pets, references available.',
    serviceCategory: ServiceCategory.PET_CARE,
    hourlyRate: 18,
    verificationBadge: VerificationBadge.ID_VERIFIED
  },
  {
    name: 'Steven Harris',
    email: 'steven.h@locallink.com',
    bio: 'Landscaping specialist: lawn installation, irrigation systems, hardscaping, and garden maintenance. 10 years experience.',
    serviceCategory: ServiceCategory.LANDSCAPING,
    hourlyRate: 48,
    verificationBadge: VerificationBadge.FULLY_CERTIFIED
  },
  {
    name: 'Rachel Clark',
    email: 'rachel.c@locallink.com',
    bio: 'Night nanny and newborn care specialist. Sleep training expert, lactation support, and postpartum assistance.',
    serviceCategory: ServiceCategory.BABYSITTING,
    hourlyRate: 35,
    verificationBadge: VerificationBadge.FULLY_CERTIFIED
  },
  {
    name: 'Daniel Lewis',
    email: 'daniel.l@locallink.com',
    bio: 'Computer repair and tech support specialist. Virus removal, hardware upgrades, and software troubleshooting.',
    serviceCategory: ServiceCategory.OTHER,
    hourlyRate: 70,
    verificationBadge: VerificationBadge.SKILL_CHECKED
  }
];

const customerData = [
  { name: 'Alex Turner', email: 'alex.t@locallink.com' },
  { name: 'Sophie Martin', email: 'sophie.m@locallink.com' },
  { name: 'Ryan Cooper', email: 'ryan.c@locallink.com' },
  { name: 'Emma Davis', email: 'emma.d@locallink.com' },
  { name: 'Oliver Wilson', email: 'oliver.w@locallink.com' }
];

const reviewComments = [
  'Excellent service! Very professional and reliable.',
  'Great experience, would definitely recommend.',
  'Exceeded my expectations. Very skilled and friendly.',
  'Outstanding work! Arrived on time and did a fantastic job.',
  'Very satisfied with the service. Will hire again.',
  'Professional, punctual, and reasonably priced.',
  'Amazing quality of work. Highly recommend!',
  'Very knowledgeable and patient. Great results.',
  'Exceptional service from start to finish.',
  'Couldn\'t be happier with the work done.'
];

async function main() {
  console.log('Starting seed...');

  await prisma.review.deleteMany();
  await prisma.message.deleteMany();
  await prisma.bookingRequest.deleteMany();
  await prisma.workerProfile.deleteMany();
  await prisma.user.deleteMany();

  console.log('Cleared existing data');

  const workers = [];
  
  for (const worker of workerData) {
    const location = bostonLocations[Math.floor(Math.random() * bostonLocations.length)];
    
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
        locationLat: location.lat + (Math.random() - 0.5) * 0.02,
        locationLng: location.lng + (Math.random() - 0.5) * 0.02,
        neighborhood: location.neighborhood,
        radiusMiles: Math.floor(Math.random() * 10) + 3,
        isVerified: worker.verificationBadge !== VerificationBadge.NONE,
        verificationBadge: worker.verificationBadge,
        availabilityNotes: 'Available weekdays and weekends. Flexible scheduling.'
      }
    });

    workers.push({ user, profile: workerProfile });
  }

  console.log('Created workers');

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

  console.log('Created customers');

  const bookings = [];
  
  for (let i = 0; i < 25; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const worker = workers[Math.floor(Math.random() * workers.length)];
    
    if (customer.id === worker.user.id) continue;

    const statuses = [BookingStatus.COMPLETED, BookingStatus.ACCEPTED, BookingStatus.PENDING];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    const proposedDate = new Date();
    proposedDate.setDate(proposedDate.getDate() + Math.floor(Math.random() * 30) - 15);

    const booking = await prisma.bookingRequest.create({
      data: {
        customerId: customer.id,
        workerId: worker.profile.id,
        serviceCategory: worker.profile.serviceCategory,
        message: `Looking for ${worker.profile.serviceCategory.toLowerCase()} services. ${worker.profile.serviceCategory === ServiceCategory.BABYSITTING ? 'Need childcare for my two kids.' : 'Please let me know your availability.'}`,
        proposedDate,
        proposedTime: ['09:00 AM', '10:30 AM', '02:00 PM', '03:30 PM', '06:00 PM'][Math.floor(Math.random() * 5)],
        status
      }
    });

    bookings.push(booking);

    if (status === BookingStatus.COMPLETED && Math.random() > 0.3) {
      await prisma.review.create({
        data: {
          reviewerId: customer.id,
          workerId: worker.profile.id,
          bookingId: booking.id,
          rating: Math.floor(Math.random() * 2) + 4,
          comment: reviewComments[Math.floor(Math.random() * reviewComments.length)]
        }
      });
    }

    if (status === BookingStatus.ACCEPTED || status === BookingStatus.COMPLETED) {
      const messageCount = Math.floor(Math.random() * 5) + 1;
      for (let j = 0; j < messageCount; j++) {
        await prisma.message.create({
          data: {
            bookingId: booking.id,
            senderId: j % 2 === 0 ? customer.id : worker.user.id,
            text: j % 2 === 0 
              ? 'Thanks for accepting! Looking forward to the service.'
              : 'You\'re welcome! I\'ll be there on time and ready to help.'
          }
        });
      }
    }
  }

  console.log('Created bookings, reviews, and messages');

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
