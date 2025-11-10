import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EarnPointDto } from './dto/earn-point.dto';
import { PointsService } from './points.service';

interface RequestWithUser {
  user: {
    userId: number;
  };
}

@Controller('api')
@UseGuards(JwtAuthGuard)
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Post('earn')
  earn(@Req() req: RequestWithUser, @Body() dto: EarnPointDto) {
    return this.pointsService.earn(req.user.userId, dto);
  }

  @Get('balance')
  balance(@Req() req: RequestWithUser) {
    return this.pointsService.getBalance(req.user.userId);
  }

  @Get('history')
  history(@Req() req: RequestWithUser) {
    return this.pointsService.getHistory(req.user.userId);
  }
}
