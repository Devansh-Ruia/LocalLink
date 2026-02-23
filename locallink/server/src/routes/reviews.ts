import express from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest, requireRole } from '../middleware/auth';
import { validateBody } from '../middleware/validate';

const router = express.Router();
const prisma = new PrismaClient();

const createReviewSchema = z.object({
  bookingId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10)
});

router.post('/', authenticateToken, requireRole(['CUSTOMER']), validateBody(createReviewSchema), async (req: AuthRequest, res) => {
  try {
    const { bookingId, rating, comment } = req.body;
    const customerId = req.user!.id;

    const booking = await prisma.bookingRequest.findUnique({
      where: { id: bookingId },
      include: {
        customer: true,
        worker: true
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.customerId !== customerId) {
      return res.status(403).json({ error: 'You can only review your own bookings' });
    }

    if (booking.status !== 'COMPLETED') {
      return res.status(400).json({ error: 'Can only review completed bookings' });
    }

    const existingReview = await prisma.review.findUnique({
      where: { bookingId }
    });

    if (existingReview) {
      return res.status(400).json({ error: 'Review already exists for this booking' });
    }

    const review = await prisma.review.create({
      data: {
        reviewerId: customerId,
        workerId: booking.workerId,
        bookingId,
        rating,
        comment
      },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true
          }
        },
        worker: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    res.status(201).json({ review });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

router.get('/workers/:workerId/reviews', async (req, res) => {
  try {
    const { workerId } = req.params;

    const worker = await prisma.workerProfile.findUnique({
      where: { id: workerId }
    });

    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    const reviews = await prisma.review.findMany({
      where: { workerId },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true
          }
        },
        booking: {
          select: {
            id: true,
            serviceCategory: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({ reviews });
  } catch (error) {
    console.error('Get worker reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch worker reviews' });
  }
});

export default router;
