import express from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { validateBody } from '../middleware/validate';

const router = express.Router();
const prisma = new PrismaClient();

const createMessageSchema = z.object({
  text: z.string().min(1).max(1000)
});

router.post('/:bookingId/messages', authenticateToken, validateBody(createMessageSchema), async (req: AuthRequest, res) => {
  try {
    const { bookingId } = req.params;
    const { text } = req.body;
    const senderId = req.user!.id;

    const booking = await prisma.bookingRequest.findUnique({
      where: { id: bookingId },
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

    if (booking.customerId !== senderId && booking.worker.user.id !== senderId) {
      return res.status(403).json({ error: 'Not authorized to message on this booking' });
    }

    if (!['ACCEPTED', 'COMPLETED'].includes(booking.status)) {
      return res.status(400).json({ error: 'Can only message on accepted or completed bookings' });
    }

    const message = await prisma.message.create({
      data: {
        bookingId,
        senderId,
        text
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true
          }
        }
      }
    });

    res.status(201).json({ message });
  } catch (error) {
    console.error('Create message error:', error);
    res.status(500).json({ error: 'Failed to create message' });
  }
});

router.get('/:bookingId/messages', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user!.id;

    const booking = await prisma.bookingRequest.findUnique({
      where: { id: bookingId },
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

    if (booking.customerId !== userId && booking.worker.user.id !== userId) {
      return res.status(403).json({ error: 'Not authorized to view messages on this booking' });
    }

    const messages = await prisma.message.findMany({
      where: { bookingId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    res.json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

export default router;
