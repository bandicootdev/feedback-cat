import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackstatusService } from './feedbackstatus.service';

describe('FeedbackstatusService', () => {
  let service: FeedbackstatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeedbackstatusService],
    }).compile();

    service = module.get<FeedbackstatusService>(FeedbackstatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
