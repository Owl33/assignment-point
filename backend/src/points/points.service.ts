import { Injectable } from '@nestjs/common';
import { getStore, saveStore } from '../store';
import { EarnPointDto } from './dto/earn-point.dto';

@Injectable()
export class PointsService {
  earn(userId: number, params: EarnPointDto) {
    const store = getStore();
    const balanceEntry = this.ensureBalance(userId);
    balanceEntry.amount += params.amount;

    store.history.unshift({
      userId,
      type: 'earn',
      amount: params.amount,
      description: params.description ?? '포인트 적립',
      createdAt: new Date().toISOString(),
    });

    saveStore();

    return {
      balance: balanceEntry.amount,
    };
  }

  getBalance(userId: number) {
    const balance = this.ensureBalance(userId).amount;
    return { balance };
  }

  getHistory(userId: number) {
    const store = getStore();
    const history = store.history.filter((entry) => entry.userId === userId);
    return { history };
  }

  private ensureBalance(userId: number) {
    const store = getStore();
    let entry = store.balances.find((balance) => balance.userId === userId);
    if (!entry) {
      entry = { userId, amount: 0 };
      store.balances.push(entry);
    }
    return entry;
  }
}
