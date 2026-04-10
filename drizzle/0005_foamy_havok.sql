ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','staff') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `skinAnalyses` ADD `patientPhone` varchar(32) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `skinAnalyses` ADD `contactedAt` timestamp;--> statement-breakpoint
ALTER TABLE `skinAnalyses` ADD `contactNotes` text;--> statement-breakpoint
ALTER TABLE `skinAnalyses` ADD `contactMethod` varchar(32);--> statement-breakpoint
ALTER TABLE `skinAnalyses` ADD `intakeData` json;--> statement-breakpoint
ALTER TABLE `skinAnalyses` ADD `scoreHistory` json;