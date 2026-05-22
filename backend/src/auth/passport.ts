import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as DiscordStrategy } from 'passport-discord';
import bcrypt from 'bcrypt';
import { writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  getUserByEmail, getUserById,
  getUserByDiscordId, createDiscordUser, updateDiscordAvatar,
  createPlayer, updateDisplayName,
} from '../db/helpers.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(__dirname, '../../../frontend');
const AVATAR_DIRS = [
  join(FRONTEND_ROOT, 'public/npcs'),
  join(FRONTEND_ROOT, 'dist/npcs'),
  join(FRONTEND_ROOT, 'stable/npcs'),
];

async function downloadDiscordAvatar(discordId: string, avatarHash: string | null): Promise<void> {
  if (!avatarHash) return;
  const url = `https://cdn.discordapp.com/avatars/${discordId}/${avatarHash}.png?size=128`;
  try {
    const response = await fetch(url);
    if (!response.ok) return;
    const buffer = Buffer.from(await response.arrayBuffer());
    const filename = `avatar_${discordId}.png`;
    await Promise.all(AVATAR_DIRS.map((dir) => writeFile(join(dir, filename), buffer).catch(() => {})));
  } catch (err) {
    console.error('Failed to download Discord avatar:', err);
  }
}

passport.serializeUser((user: Express.User, done) => {
  done(null, (user as { user_id: number }).user_id);
});

passport.deserializeUser(async (userId: number, done) => {
  try {
    const user = await getUserById(userId);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await getUserByEmail(email);
      if (!user || !user.password_hash) {
        return done(null, false, { message: 'Invalid email or password' });
      }
      const isValid = await bcrypt.compare(password, user.password_hash);
      if (!isValid) {
        return done(null, false, { message: 'Invalid email or password' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const DISCORD_CALLBACK_URL = process.env.DISCORD_CALLBACK_URL;
const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID;

if (DISCORD_CLIENT_ID && DISCORD_CLIENT_SECRET && DISCORD_CALLBACK_URL) {
  passport.use(
    new DiscordStrategy(
      {
        clientID: DISCORD_CLIENT_ID,
        clientSecret: DISCORD_CLIENT_SECRET,
        callbackURL: DISCORD_CALLBACK_URL,
        scope: ['identify', 'guilds'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Guild membership gate
          if (DISCORD_GUILD_ID) {
            const inGuild = profile.guilds?.some((g) => g.id === DISCORD_GUILD_ID);
            if (!inGuild) {
              return done(null, false, { message: 'You must be a member of the required Discord server.' });
            }
          }

          const displayName = (profile as unknown as { global_name?: string }).global_name || profile.username;

          // Find existing user by Discord ID
          let user = await getUserByDiscordId(profile.id);
          if (user) {
            await updateDiscordAvatar(user.user_id, profile.avatar);
            await updateDisplayName(user.user_id, displayName);
            await downloadDiscordAvatar(profile.id, profile.avatar);
            return done(null, user);
          }

          // New Discord user — generate a unique numeric user ID
          let userId: number | null = null;
          for (let attempt = 0; attempt < 20; attempt++) {
            const candidate = Math.floor(Math.random() * 900000) + 100000;
            try {
              await createDiscordUser(candidate, profile.id, profile.avatar);
              await createPlayer(candidate);
              userId = candidate;
              break;
            } catch (err: unknown) {
              if (err instanceof Error && 'code' in err && (err as NodeJS.ErrnoException).code === 'ER_DUP_ENTRY') {
                continue;
              }
              throw err;
            }
          }
          if (userId === null) throw new Error('Failed to generate unique user ID');

          await updateDisplayName(userId, displayName);
          await downloadDiscordAvatar(profile.id, profile.avatar);
          user = await getUserByDiscordId(profile.id);
          return done(null, user!);
        } catch (err) {
          return done(err as Error);
        }
      },
    ),
  );
}

export default passport;
