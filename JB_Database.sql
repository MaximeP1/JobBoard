DROP TABLE IF EXISTS `companies`;

CREATE TABLE `companies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
;

DROP TABLE IF EXISTS `advertisements`;

CREATE TABLE `advertisements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `preview` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `wage` int DEFAULT NULL,
  `place` varchar(50) DEFAULT NULL,
  `workingTime` int DEFAULT NULL,
  `company` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `company` (`company`),
  CONSTRAINT `advertisements_ibfk_1` FOREIGN KEY (`company`) REFERENCES `companies` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
;

DROP TABLE IF EXISTS `people`;

CREATE TABLE `people` (
  `id` int NOT NULL AUTO_INCREMENT,
  `applicant` tinyint(1) DEFAULT NULL,
  `recruiter` tinyint(1) DEFAULT NULL,
  `admin` tinyint(1) DEFAULT '0',
  `firstName` varchar(50) DEFAULT NULL,
  `lastName` varchar(50) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password` char(60) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
;

DROP TABLE IF EXISTS `applications`;

CREATE TABLE `applications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `applicant` int DEFAULT NULL,
  `fullName` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `advertisement` int NOT NULL,
  `message` text,
  PRIMARY KEY (`id`),
  KEY `applicant` (`applicant`),
  KEY `advertisement` (`advertisement`),
  CONSTRAINT `applications_ibfk_1` FOREIGN KEY (`applicant`) REFERENCES `people` (`id`),
  CONSTRAINT `applications_ibfk_2` FOREIGN KEY (`advertisement`) REFERENCES `advertisements` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
;


DROP TABLE IF EXISTS `mails`;

CREATE TABLE `mails` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sender` int NOT NULL,
  `recipient` int NOT NULL,
  `company` int NOT NULL,
  `advertisement` int NOT NULL,
  `message` text,
  PRIMARY KEY (`id`),
  KEY `sender` (`sender`),
  KEY `recipient` (`recipient`),
  KEY `company` (`company`),
  KEY `advertisement` (`advertisement`),
  CONSTRAINT `mails_ibfk_1` FOREIGN KEY (`sender`) REFERENCES `people` (`id`),
  CONSTRAINT `mails_ibfk_2` FOREIGN KEY (`recipient`) REFERENCES `people` (`id`),
  CONSTRAINT `mails_ibfk_3` FOREIGN KEY (`company`) REFERENCES `companies` (`id`),
  CONSTRAINT `mails_ibfk_4` FOREIGN KEY (`advertisement`) REFERENCES `advertisements` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
;
