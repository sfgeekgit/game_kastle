declare module 'passport-discord' {
  import passport from 'passport';

  interface DiscordGuild {
    id: string;
    name: string;
    icon: string | null;
    owner: boolean;
    permissions: number;
  }

  interface Profile {
    id: string;
    username: string;
    discriminator: string;
    avatar: string | null;
    guilds?: DiscordGuild[];
    provider: 'discord';
    accessToken: string;
    fetchedAt: Date;
  }

  type VerifyCallback = (
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: Error | null, user?: Express.User | false, info?: { message: string }) => void,
  ) => void;

  interface StrategyOptions {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    scope: string[];
  }

  class Strategy implements passport.Strategy {
    constructor(options: StrategyOptions, verify: VerifyCallback);
    name: 'discord';
    authenticate(req: import('express').Request, options?: object): void;
  }
}
