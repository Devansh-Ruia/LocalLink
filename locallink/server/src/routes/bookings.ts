import express from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest, requireRole } from '../middleware/auth';
import { validateBody, validateQuery } from '../middleware/validate';

const router = express.Router();
const prisma = new PrismaClient();

const createBookingSchema = z.object({
  workerId: z.string().uuid(),
  serviceCategory: z.enum(['BABYSITTING', 'TUTORING', 'HANDYMAN', 'CLEANING', 'LANDSCAPING', 'PET_CARE', 'OTHER']),
  message: z.string().min(10),
  proposedDate: z.string().transform((val) => new Date(val)),
  proposedTime: z.string().min(1)
});

const updateBookingStatusSchema = z.object({
  status: z.enum(['ACCEPTED', 'DECLINED', 'COMPLETED', 'CANCELLED'])
});

const getBookingsQuerySchema = z.object({
  status: z.enum(['PENDING', 'ACCEPTED', 'DECLINED', 'COMPLETED', 'CANCELLED']).optional()
});

router.post('/', authenticateToken, requireRole(['CUSTOMER']), validateBody(createBookingSchema), async (req: AuthRequest, res) => {
  try {
    const { workerId, serviceCategory, message, proposedDate, proposedTime } = req.body;

    const worker = await prisma.workerProfile.findUnique({
      where: { id: workerId }
    });

    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    if (worker.userId === req.user!.id) {
      return res.status(400).json({ error: 'Cannot book yourself' });
    }

    const booking = await prisma.bookingRequest.create({
      data: {
        customerId: req.user!.id,
        workerId,
        serviceCategory,
        message,
        proposedDate,
        proposedTime
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        worker: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    res.status(201).json({ booking });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

router.get('/', authenticateToken, validateQuery(getBookingsQuerySchema), async (req: AuthRequest, res) => {
  try {
    const { status } = req.query as any;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    let whereClause: any = {};

    if (userRole === 'CUSTOMER') {
      whereClause.customerId = userId;
    } else if (userRole === 'WORKER') {
      const workerProfile = await prisma.workerProfile.findUnique({
        where: { userId }
      });
      
      if (!workerProfile) {
        return res.status(404).json({ error: 'Worker profile not found' });
      }
      
      whereClause.workerId = workerProfile.id;
    }

    if (status) {
      whereClause.status = status;
    }

    const bookings = await prisma.bookingRequest.findMany({
      where: whereClause,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImageUrl: true
          }
        },
        worker: {
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
        },
        reviews: {
          select: {
            id: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({ bookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

router.put('/:id/status', authenticateToken, validateBody(updateBookingStatusSchema), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const booking = await prisma.bookingRequest.findUnique({
      where: { id },
      include: {
        customer: true,
        worker: {
          include: {
            user: true
          }
        }
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (userRole === 'CUSTOMER' && booking.customerId !== userId) {
      return res.status(403).json({ error: 'Not authorized to modify this booking' });
    }

    if (userRole === 'WORKER' && booking.worker.user.id !== userId) {
      return res.status(403).json({ error: 'Not authorized to modify this booking' });
    }

    if (userRole === 'CUSTOMER' && !['CANCELLED'].includes(status)) {
      return res.status(400).json({ error: 'Customers can only cancel bookings' });
    }

    if (userRole === 'WORKER') {
      if (booking.status !== 'PENDING' && ['ACCEPTED', 'DECLINED'].includes(status)) {
        return res.status(400).json({ error: 'Can only accept or decline pending bookings' });
      }
      
      if (booking.status !== 'ACCEPTED' && status === 'COMPLETED') {
        return res.status(400).json({ error: 'Can only mark accepted bookings as completed' });
      }
    }

    if (userRole === 'CUSTOMER' && !['PENDING', 'ACCEPTED'].includes(booking.status)) {
      return res.status(400).json({ error: 'Can only cancel pending or accepted bookings' });
    }

    const updatedBooking = await prisma.bookingRequest.update({
      where: { id },
      data: { status },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        worker: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    res.json({ booking: updatedBooking });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
});

export default router;
