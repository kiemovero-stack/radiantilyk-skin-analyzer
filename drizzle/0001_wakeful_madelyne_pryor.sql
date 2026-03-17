CREATE TABLE `skinAnalyses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`patientFirstName` varchar(128) NOT NULL DEFAULT '',
	`patientLastName` varchar(128) NOT NULL DEFAULT '',
	`patientEmail` varchar(320) NOT NULL DEFAULT '',
	`patientDob` varchar(16) NOT NULL DEFAULT '',
	`imageUrl` text NOT NULL,
	`report` json NOT NULL,
	`skinHealthScore` int,
	`skinType` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `skinAnalyses_id` PRIMARY KEY(`id`)
);
