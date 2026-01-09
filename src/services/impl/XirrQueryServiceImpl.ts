import { CacheQueryRepository } from '../../domain/repositories/repositories-index';
import { XirrQueryService } from '../../domain/services/services-index';
import { XIRRbyScope } from '@/query-models/query-models-index';

export class XirrQueryServiceImpl implements XirrQueryService {
  constructor(
    private cacheQueryRepo: CacheQueryRepository
  ) { }
  async getXirr(scopeType: 'ITEM' | 'CATEGORY' | 'OVERALL', scopeId?: number | null): Promise<number | null> {
    return await this.cacheQueryRepo.getXirr(scopeType, scopeId);
  }
  async getAllXirr(scopeType: 'ITEM' | 'CATEGORY' | 'OVERALL'): Promise<XIRRbyScope[] | null> {

    return await this.cacheQueryRepo.getAllXirr(scopeType);

  }

}

