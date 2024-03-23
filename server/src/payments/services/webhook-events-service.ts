import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WebhookEvent } from '../../entities/payments/webhook-event.entity';

@Injectable()
export class WebhookEventsService {
  constructor(
    @InjectRepository(WebhookEvent)
    private readonly webhookEventRepo: Repository<WebhookEvent>,
  ) {}

  async create(event: Omit<WebhookEvent, 'id'>): Promise<WebhookEvent> {
    return this.webhookEventRepo.save(event);
  }

  async setProcessed(
    id: number,
    processed: boolean,
    processing_error?: string,
  ): Promise<WebhookEvent> {
    const event = await this.webhookEventRepo.findOneBy({ id });
    event.processed = processed;
    event.processing_error = processing_error;
    return this.webhookEventRepo.save(event);
  }

  async findAll() {
    return this.webhookEventRepo.find();
  }
}
