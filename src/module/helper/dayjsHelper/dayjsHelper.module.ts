import { Module } from '@nestjs/common';
import { DayjsHelperService } from './dayjsHelper.service';

@Module({
  providers: [DayjsHelperService],
  exports: [DayjsHelperService],
})
export class DayjsHelperModule {}
