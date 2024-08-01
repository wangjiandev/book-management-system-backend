import { CallHandler, ExecutionContext, Inject, Injectable, Logger, NestInterceptor } from '@nestjs/common'
import { Response } from 'express'
import { Request } from 'express'
import { Observable, tap } from 'rxjs'

/**
 * 接口访问记录拦截器
 */
@Injectable()
export class InvokeRecordInterceptor implements NestInterceptor {
  @Inject(Logger)
  private readonly logger = new Logger()

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>()
    const response = context.switchToHttp().getResponse<Response>()

    const userAgent = request.headers['user-agent']
    const { ip, method, path } = request

    this.logger.log(
      `${method} ${path} ${ip} ${userAgent}: ${context.getClass().name} ${context.getHandler().name} invoked...`,
      InvokeRecordInterceptor.name,
    )
    this.logger.log(`user: ${request.user?.userId}, ${request.user?.username}`, InvokeRecordInterceptor.name)
    const now = Date.now()

    return next.handle().pipe(
      tap((res) => {
        this.logger.log(
          `${method} ${path} ${ip} ${userAgent}: ${response.statusCode}: ${Date.now() - now}ms`,
          InvokeRecordInterceptor.name,
        )
        this.logger.log(`Response: ${JSON.stringify(res)}`, InvokeRecordInterceptor.name)
      }),
    )
  }
}
