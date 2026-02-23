import express from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest, requireRole } from '../middleware/auth';
import { validateBody, validateQuery } from '../middleware/validate';

const router = express.Router();
const prisma = new PrismaClient();

const createWorkerProfileSchema = z.object({
  bio: z.string().min(10),
  serviceCategory: z.enum(['BABYSITTING', 'TUTORING', 'HANDYMAN', 'CLEANING', 'LANDSCAPING', 'PET_CARE', 'OTHER']),
  hourlyRate: z.number().positive().optional(),
  locationLat: z.number(),
  locationLng: z.number(),
  neighborhood: z.string().min(2),
  radiusMiles: z.number().positive().default(5),
  availabilityNotes: z.string().optional()
});

const updateWorkerProfileSchema = createWorkerProfileSchema.partial();

const searchWorkersSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  radius: z.number().positive().default(5),
  category: z.enum(['BABYSITTING', 'TUTORING', 'HANDYMAN', 'CLEANING', 'LANDSCAPING', 'PET_CARE', 'OTHER']).optional(),
  minRating: z.number().min(1).max(5).optional(),
  verifiedOnly: z.string().transform((val) => val === 'true').optional()
});

const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 3959;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

router.post('/profile', authenticateToken, requireRole(['WORKER']), validateBody(createWorkerProfileSchema), async (req: AuthRequest, res) => {
  try {
    const existingProfile = await prisma.workerProfile.findUnique({
      where: { userId: req.user!.id }
    });

    if (existingProfile) {
      return res.status(400).json({ error: 'Worker profile already exists' });
    }

    const profile = await prisma.workerProfile.create({
      data: {
        ...req.body,
        userId: req.user!.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImageUrl: true
          }
        }
      }
    });

    res.status(201).json({ profile });
  } catch (error) {
    console.error('Create worker profile error:', error);
    res.status(500).json({ error: 'Failed to create worker profile' });
  }
});

router.put('/profile', authenticateToken, requireRole(['WORKER']), validateBody(updateWorkerProfileSchema), async (req: AuthRequest, res) => {
  try {
    const profile = await prisma.workerProfile.update({
      where: { userId: req.user!.id },
      data: req.body,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImageUrl: true
          }
        }
      }
    });

    res.json({ profile });
  } catch (error) {
    console.error('Update worker profile error:', error);
    res.status(500).json({ error: 'Failed to update worker profile' });
  }
});

router.get('/search', authenticateToken, validateQuery(searchWorkersSchema), async (req: AuthRequest, res) => {
  try {
    const { lat, lng, radius, category, minRating, verifiedOnly } = req.query as any;

    let whereClause: any = {
      locationLat: {
        gte: lat - (radius / 69),
        lte: lat + (radius / 69)
      },
      locationLng: {
        gte: lng - (radius / (69 * Math.cos(lat * Math.PI / 180))),
        lte: lng + (radius / (69 * Math.cos(lat * Math.PI / 180)))
      }
    };

    if (category) {
      whereClause.serviceCategory = category;
    }

    if (verifiedOnly) {
      whereClause.isVerified = true;
    }

    const workers = await prisma.workerProfile.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImageUrl: true
          }
        },
        reviews: {
          select: {
            rating: true
          }
        }
      }
    });

    const workersWithDistance = workers
      .map(worker => {
        const distance = calculateDistance(lat, lng, worker.locationLat, worker.locationLng);
        const averageRating = worker.reviews.length > 0 
          ? worker.reviews.reduce((sum, review) => sum + review.rating, 0) / worker.reviews.length 
          : 0;
        
        return {
          ...worker,
          distance: Math.round(distance * 10) / 10,
          averageRating: Math.round(averageRating * 10) / 10,
          reviewCount: worker.reviews.length,
          reviews: undefined
        };
      })
      .filter(worker => worker.distance <= radius && (!minRating || worker.averageRating >= minRating))
      .sort((a, b) => a.distance - b.distance);

    res.json({ workers: workersWithDistance });
  } catch (error) {
    console.error('Search workers error:', error);
    res.status(500).json({ error: 'Failed to search workers' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const worker = await prisma.workerProfile.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImageUrl: true
          }
        },
        reviews: {
          include: {
            reviewer: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    const averageRating = worker.reviews.length > 0 
      ? worker.reviews.reduce((sum, review) => sum + review.rating, 0) / worker.reviews.length 
      : 0;

    res.json({
      worker: {
        ...worker,
        averageRating: Math.round(averageRating * 10) / 10,
        reviewCount: worker.reviews.length
      }
    });
  } catch (error) {
    console.error('Get worker error:', error);
    res.status(500).json({ error: 'Failed to fetch worker' });
  }
});

export default router;
