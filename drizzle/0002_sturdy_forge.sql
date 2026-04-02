ALTER TABLE `skinAnalyses` ADD `status` varchar(32) DEFAULT 'completed' NOT NULL;--> statement-breakpoint
ALTER TABLE `skinAnalyses` ADD `errorMessage` text;--> statement-breakpoint
ALTER TABLE `skinAnalyses` ADD `simulationImages` json;