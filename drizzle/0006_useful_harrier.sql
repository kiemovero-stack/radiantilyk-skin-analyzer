CREATE TABLE `bookingAppointments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`staffId` int NOT NULL,
	`appointmentDate` varchar(10) NOT NULL,
	`startTime` varchar(5) NOT NULL,
	`endTime` varchar(5) NOT NULL,
	`service` varchar(256),
	`notes` text,
	`status` enum('confirmed','cancelled','completed','no_show') NOT NULL DEFAULT 'confirmed',
	`stripePaymentMethodId` varchar(128),
	`noShowChargeAmount` int,
	`googleCalendarEventId` varchar(256),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bookingAppointments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bookingAvailability` (
	`id` int AUTO_INCREMENT NOT NULL,
	`staffId` int NOT NULL,
	`dayOfWeek` int NOT NULL,
	`startTime` varchar(5) NOT NULL,
	`endTime` varchar(5) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bookingAvailability_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bookingClients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fullName` varchar(256) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(32) NOT NULL,
	`dateOfBirth` varchar(16) NOT NULL,
	`passwordHash` varchar(256) NOT NULL,
	`stripeCustomerId` varchar(128),
	`hasCardOnFile` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bookingClients_id` PRIMARY KEY(`id`),
	CONSTRAINT `bookingClients_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `bookingStaff` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`name` varchar(256) NOT NULL,
	`email` varchar(320) NOT NULL,
	`title` varchar(128),
	`googleCalendarId` varchar(320),
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bookingStaff_id` PRIMARY KEY(`id`),
	CONSTRAINT `bookingStaff_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `rewardsMembers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(256),
	`points` int NOT NULL DEFAULT 0,
	`lifetimePoints` int NOT NULL DEFAULT 0,
	`tier` enum('Glow','Radiant','Luminous','Icon') NOT NULL DEFAULT 'Glow',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `rewardsMembers_id` PRIMARY KEY(`id`),
	CONSTRAINT `rewardsMembers_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `rewardsTransactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`memberId` int NOT NULL,
	`type` enum('earn','redeem') NOT NULL,
	`points` int NOT NULL,
	`action` varchar(128) NOT NULL,
	`description` text,
	`referenceId` varchar(128),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `rewardsTransactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `skinAnalyses` ADD `staffNotes` text;