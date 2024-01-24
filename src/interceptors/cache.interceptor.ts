import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject } from '@nestjs/common';
import { Observable, map, of } from 'rxjs';
import { Cache } from 'cache-manager';

@Injectable()
export class ArticleCacheInterceptor implements NestInterceptor {
    prefix = 'articles_'
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {

    const http = context.switchToHttp();
    const request = http.getRequest();
    const key = this.prefix+request.url.split('?')[1]

    const cachedData = await this.cacheManager.get(key)
    if (cachedData) return of (cachedData)
    
    return next.handle().pipe(
        map(data => {
            this.cacheManager.set(key, data, { ttl: 20 } as any)
            return data
        })
    );
  }
}