CREATE TABLE "user_chats" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"chatId" text NOT NULL,
	"createdAt" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chat" ADD COLUMN "updatedAt" timestamp;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "createdAt" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "updatedAt" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "user_chats" ADD CONSTRAINT "user_chats_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_chats" ADD CONSTRAINT "user_chats_chatId_chat_id_fk" FOREIGN KEY ("chatId") REFERENCES "public"."chat"("id") ON DELETE cascade ON UPDATE no action;