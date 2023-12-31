import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';

@Injectable()
export class DayjsHelperService {
  makeDateRange(start, end, type): dayjs.Dayjs[] {
    const range = [];
    let current = start;
    while (!current.isAfter(end)) {
      range.push(current);
      current = current.add(1, type);
    }
    return range;
  }
}
