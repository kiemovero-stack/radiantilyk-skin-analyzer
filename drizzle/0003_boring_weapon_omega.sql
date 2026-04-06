CREATE TABLE `referralCodes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(32) NOT NULL,
	`referrerName` varchar(256) NOT NULL,
	`referrerEmail` varchar(320) NOT NULL,
	`analysisId` int NOT NULL,
	`discountPercent` int NOT NULL DEFAULT 15,
	`timesUsed` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `referralCodes_id` PRIMARY KEY(`id`),
	CONSTRAINT `referralCodes_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `referralRedemptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`referralCodeId` int NOT NULL,
	`referredName` varchar(256) NOT NULL,
	`referredEmail` varchar(320) NOT NULL,
	`referredAnalysisId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `referralRedemptions_id` PRIMARY KEY(`id`)
);
