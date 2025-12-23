# NestJS 请求处理组件对比指南

## 📊 执行顺序总览

```
客户端请求
    ↓
1. Middleware（中间件）
    ↓
2. Guard（守卫）
    ↓
3. Interceptor（拦截器 - before）
    ↓
4. Pipe（管道）
    ↓
5. Controller（控制器方法）
    ↓
6. Interceptor（拦截器 - after）
    ↓
7. Filter（过滤器 - 仅在异常时）
    ↓
客户端响应
```

## 🔧 Middleware（中间件）

### 作用
- 在**路由处理之前**执行
- 可以访问请求和响应对象
- 可以修改请求和响应
- 可以结束请求-响应循环
- 调用下一个中间件

### 使用时机
- ✅ 日志记录
- ✅ CORS 处理
- ✅ 请求体解析
- ✅ Session 处理
- ✅ 通用的请求预处理

### 示例（项目中的 LoggerMiddleware）

```typescript
// src/common/middleware/logger.middleware.ts
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // 在路由处理之前执行
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    
    // 可以修改请求对象
    req['requestTime'] = Date.now();
    
    // 调用下一个中间件或路由处理器
    next();
  }
}
```

### 应用方式

```typescript
// 在模块中配置
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*'); // 应用到所有路由
  }
}

// 或者在 main.ts 中全局应用
app.use(LoggerMiddleware);
```

---

## 🔍 Pipe（管道）

### 作用
- **转换**：将输入数据转换为所需格式
- **验证**：验证输入数据，验证失败抛出异常

### 使用时机
- ✅ 数据类型转换（字符串 → 数字）
- ✅ 数据验证（DTO 验证）
- ✅ 数据清理和标准化
- ✅ 参数解析

### 内置 Pipe

```typescript
ParseIntPipe      // 字符串 → 整数
ParseFloatPipe    // 字符串 → 浮点数
ParseBoolPipe     // 字符串 → 布尔值
ParseArrayPipe    // 字符串 → 数组
ParseUUIDPipe     // 验证 UUID
ValidationPipe    // 验证 DTO
```

### 示例

```typescript
// 1. 参数级别使用
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  // id 已经是 number 类型
  return this.userService.findById(id);
}

// 2. 方法级别使用
@Post()
@UsePipes(new ValidationPipe())
create(@Body() createDto: CreateUserDto) {
  return this.userService.create(createDto);
}

// 3. 全局使用（在 main.ts 中）
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,        // 自动删除非白名单属性
  transform: true,        // 自动转换类型
  forbidNonWhitelisted: true, // 非白名单属性抛出错误
}));
```

### 自定义 Pipe

```typescript
@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('Validation failed');
    }
    return val;
  }
}
```

---

## 🚨 Filter（过滤器/异常过滤器）

### 作用
- 捕获和处理**异常**
- 统一错误响应格式
- 记录错误日志

### 使用时机
- ✅ 统一异常处理
- ✅ 自定义错误响应格式
- ✅ 错误日志记录
- ✅ 将技术错误转换为用户友好的消息

### 示例（项目中的 HttpExceptionFilter）

```typescript
// src/common/filters/http-exception.filter.ts
@Catch() // 捕获所有异常
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 确定状态码
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // 记录服务器错误
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      console.error('Internal Server Error:', exception);
    }

    // 返回统一格式的错误响应
    response.status(status).json({
      code: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception instanceof HttpException 
        ? exception.getResponse() 
        : 'Internal server error',
    });
  }
}
```

### 应用方式

```typescript
// 1. 全局应用（main.ts）
app.useGlobalFilters(new HttpExceptionFilter());

// 2. 控制器级别
@UseFilters(HttpExceptionFilter)
@Controller('users')
export class UserController {}

// 3. 方法级别
@Post()
@UseFilters(HttpExceptionFilter)
create() {}
```

---

## 🔄 Interceptor（拦截器）

### 作用
- 在方法执行**前后**添加额外逻辑
- 转换返回结果
- 转换抛出的异常
- 扩展基本功能
- 完全覆盖函数执行

### 使用时机
- ✅ 响应转换（统一响应格式）
- ✅ 性能监控（记录执行时间）
- ✅ 缓存
- ✅ 日志记录
- ✅ 超时处理

### 示例（项目中的 TransformInterceptor）

```typescript
// src/common/interceptors/transform.interceptor.ts
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    // 在方法执行前可以做一些事情
    console.log('Before...');
    
    // 执行方法并转换响应
    return next
      .handle()
      .pipe(
        map((data) => ({
          code: 200,
          data,
          message: 'Success',
        }))
      );
  }
}
```

### 更多 Interceptor 示例

```typescript
// 1. 性能监控
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() => console.log(`执行时间: ${Date.now() - now}ms`))
      );
  }
}

// 2. 超时处理
@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(5000), // 5秒超时
      catchError(err => {
        if (err instanceof TimeoutError) {
          throw new RequestTimeoutException();
        }
        return throwError(err);
      }),
    );
  }
}
```

---

## 📋 对比总结表

| 特性 | Middleware | Pipe | Filter | Interceptor |
|------|-----------|------|--------|-------------|
| **执行时机** | 最早（路由前） | 路由处理前 | 异常发生时 | 方法前后 |
| **主要用途** | 通用预处理 | 数据转换/验证 | 异常处理 | 响应转换/AOP |
| **访问路由参数** | ❌ | ✅ | ✅ | ✅ |
| **修改请求** | ✅ | ❌ | ❌ | ❌ |
| **修改响应** | ✅ | ❌ | ✅ | ✅ |
| **异步支持** | ✅ | ✅ | ✅ | ✅ |
| **全局应用** | ✅ | ✅ | ✅ | ✅ |
| **依赖注入** | ✅ | ✅ | ✅ | ✅ |

---

## 🎯 实际应用场景

### 场景 1：用户请求日志
**使用 Middleware**
```typescript
// 记录所有请求的基本信息
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`${req.method} ${req.url}`);
    next();
  }
}
```

### 场景 2：ID 参数验证和转换
**使用 Pipe**
```typescript
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  // id 自动转换为 number 并验证
}
```

### 场景 3：统一错误响应
**使用 Filter**
```typescript
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // 统一错误格式
    return {
      code: status,
      message: error.message,
      timestamp: new Date().toISOString(),
    };
  }
}
```

### 场景 4：统一成功响应格式
**使用 Interceptor**
```typescript
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map(data => ({
        code: 200,
        data,
        message: 'Success',
      }))
    );
  }
}
```

---

## 💡 选择建议

### 使用 Middleware 当你需要：
- 在路由解析之前处理请求
- 访问原始的 req/res 对象
- 实现通用的请求预处理（日志、CORS、Session）

### 使用 Pipe 当你需要：
- 验证和转换输入数据
- 确保数据类型正确
- 清理和标准化数据

### 使用 Filter 当你需要：
- 捕获和处理异常
- 统一错误响应格式
- 记录错误日志

### 使用 Interceptor 当你需要：
- 转换响应数据
- 添加额外的响应字段
- 性能监控
- 缓存
- 在方法执行前后添加逻辑

---

## 🔍 项目中的实际应用

### 1. Middleware - 日志记录
```typescript
// src/common/middleware/logger.middleware.ts
// 记录每个请求的方法、URL、时间戳和 IP
```

### 2. Pipe - 数据验证
```typescript
// main.ts
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  transform: true,
  forbidNonWhitelisted: true,
}));
```

### 3. Filter - 异常处理
```typescript
// src/common/filters/http-exception.filter.ts
// 统一处理所有异常，返回标准格式
```

### 4. Interceptor - 响应转换
```typescript
// src/common/interceptors/transform.interceptor.ts
// 将所有成功响应包装成 { code, data, message } 格式
```

---

## 📚 参考资源

- [NestJS Middleware](https://docs.nestjs.com/middleware)
- [NestJS Pipes](https://docs.nestjs.com/pipes)
- [NestJS Exception Filters](https://docs.nestjs.com/exception-filters)
- [NestJS Interceptors](https://docs.nestjs.com/interceptors)
