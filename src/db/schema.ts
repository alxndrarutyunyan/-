import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Web App Users (authenticated via Firebase)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Telegram Bot Users
export const botUsers = pgTable('bot_users', {
  id: serial('id').primaryKey(),
  telegramId: text('telegram_id').notNull().unique(),
  username: text('username'),
  firstName: text('first_name'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Chat Interaction Logs
export const chatLogs = pgTable('chat_logs', {
  id: serial('id').primaryKey(),
  telegramId: text('telegram_id'),
  role: text('role').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
