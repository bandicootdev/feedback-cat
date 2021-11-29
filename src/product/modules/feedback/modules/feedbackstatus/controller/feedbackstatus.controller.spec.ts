import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackstatusController } from './feedbackstatus.controller';

describe('FeedbackstatusController', () => {
  let controller: FeedbackstatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedbackstatusController],
    }).compile();

    controller = module.get<FeedbackstatusController>(FeedbackstatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
