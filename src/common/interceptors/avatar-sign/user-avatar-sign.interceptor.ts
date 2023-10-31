import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { mergeMap } from "rxjs/operators";

import { AssetsService } from "../../assets";

@Injectable()
export class UserAvatarSignInterceptor implements NestInterceptor {
  assetsService: Partial<AssetsService>;

  constructor(
    // private readonly assetsService: AssetsService,
  ) {
    this.assetsService = {
      async signUrl(url: string): Promise<string> {
        return url;
      },
    };
  }

  intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next
      .handle()
      .pipe(mergeMap(async (data) => {
        if (!data) {
          return data;
        }

        const hasUserWithAvatar = this.isDataHasUserWithAvatar(data);

        if (!hasUserWithAvatar) {
          return data;
        }

        return await this.signAvatarUrl(data);
      }));
  }

  private isDataHasUserWithAvatar(data): boolean {
    if (data.avatarUrl) {
      return true;
    }

    if (data.user?.avatarUrl) {
      return true;
    }

    if (data.users && data.users[0]?.avatarUrl) {
      return true;
    }

    if (Array.isArray(data) && data[0]?.avatarUrl) {
      return true;
    }

    return false;
  }

  private async signAvatarUrl(data): Promise<unknown> {
    if (data.avatarUrl) {
      const signedUrl = await this.assetsService.signUrl(data.avatarUrl);

      return ({ ...data, avatarUrl: signedUrl });
    }

    if (data.user?.avatarUrl) {
      const signedUrl = await this.assetsService.signUrl(data.user.avatarUrl);

      return ({ ...data, user: { ...data.user, avatarUrl: signedUrl } });
    }

    if (data.users && data.users[0]?.avatarUrl) {
      const signedUsers = await Promise.all(data.users.map(async (el) => {
        const signedUrl = await this.assetsService.signUrl(el.avatarUrl);

        return ({ ...el, avatarUrl: signedUrl });
      }));

      return { ...data, users: signedUsers };
    }

    if (Array.isArray(data) && data[0]?.avatarUrl) {
      return await Promise.all(data.map(async (el) => {
        const signedUrl = await this.assetsService.signUrl(el.avatarUrl);

        return ({ ...el, avatarUrl: signedUrl });
      }));
    }

    return data;
  }
}
