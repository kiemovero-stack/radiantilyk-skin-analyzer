CREATE TABLE `scheduledEmails` (
`id` int AUTO_INCREMENT NOT NULL,
`analysisId` int NOT NULL,
`emailType` varchar(32) NOT NULL,
`recipientEmail` varchar(320) NOT NULL,
`config` json NOT NULL,
`scheduledAt` timestamp NOT NULL,
`sentAt` timestamp NULL,
`status` varchar(16) NOT NULL DEFAULT 'pending',
`errorMessage` text,
`createdAt` timestamp NOT NULL DEFAULT (now()),
CONSTRAINT `scheduledEmails_id` PRIMARY KEY(`id`)
);

CREATE TABLE `clientConsents` (
`id` int AUTO_INCREMENT NOT NULL,
`analysisId` int,
`patientFirstName` varchar(128) NOT NULL,
`patientLastName` varchar(128) NOT NULL,
`patientEmail` varchar(320) NOT NULL,
`patientDob` varchar(16) NOT NULL,
`signatureData` text NOT NULL,
`consentVersion` varchar(16) NOT NULL DEFAULT '1.0',
`ipAddress` varchar(64),
`userAgent` text,
`signedAt` timestamp NOT NULL DEFAULT (now()),
`createdAt` timestamp NOT NULL DEFAULT (now()),
CONSTRAINT `clientConsents_id` PRIMARY KEY(`id`)
);
