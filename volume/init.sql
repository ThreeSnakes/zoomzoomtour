-- init.sql

-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS db;

-- 사용할 데이터베이스 선택
USE db;

-- 테이블 생성
CREATE TABLE `CLIENT` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
    `ctime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `mtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `SELLER` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
    `ctime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `mtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `TOUR` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
    `description` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
    `seller_id` int DEFAULT NULL,
    `ctime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `mtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `FK_TOUR_SELLER_ID` (`seller_id`),
    CONSTRAINT `FK_TOUR_SELLER_ID` FOREIGN KEY (`seller_id`) REFERENCES `SELLER` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `HOLIDAY` (
    `id` int NOT NULL AUTO_INCREMENT,
    `date` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
    `tour_id` int DEFAULT NULL,
    `ctime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `mtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `FK_TOUR_HOLIDAY_ID` (`tour_id`),
    CONSTRAINT `FK_TOUR_HOLIDAY_ID` FOREIGN KEY (`tour_id`) REFERENCES `TOUR` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `REGULAR_HOLIDAY` (
    `id` int NOT NULL AUTO_INCREMENT,
    `day` int NOT NULL,
    `tour_id` int DEFAULT NULL,
    `ctime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `mtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `FK_TOUR_REGULAR_HOLIDAY_ID` (`tour_id`),
    CONSTRAINT `FK_TOUR_REGULAR_HOLIDAY_ID` FOREIGN KEY (`tour_id`) REFERENCES `TOUR` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `RESERVATION` (
    `ctime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `mtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `token` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
    `state` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'WAIT',
    `date` timestamp NOT NULL,
    `client_id` int DEFAULT NULL,
    `tour_id` int DEFAULT NULL,
    PRIMARY KEY (`token`),
    KEY `FK_RESERVATION_CLIENT_ID` (`client_id`),
    KEY `FK_RESERVATION_TOUR_ID` (`tour_id`),
    CONSTRAINT `FK_RESERVATION_TOUR_ID` FOREIGN KEY (`tour_id`) REFERENCES `TOUR` (`id`),
    CONSTRAINT `FK_RESERVATION_CLIENT_ID` FOREIGN KEY (`client_id`) REFERENCES `CLIENT` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 데이터 삽입
INSERT INTO `CLIENT` (`id`, `name`) VALUES
    (1, 'John Doe'),
    (2, 'Jane Smith'),
    (3, 'Bob Johnson'),
    (4, 'Alice Williams'),
    (5, 'Michael Davis'),
    (6, 'Emily Brown'),
    (7, 'David Miller'),
    (8, 'Olivia Wilson'),
    (9, 'James Taylor'),
    (10, 'Sophia Anderson'),
    (11, 'William Martinez'),
    (12, 'Ava Thompson'),
    (13, 'Christopher Moore'),
    (14, 'Emma Hall'),
    (15, 'Daniel White'),
    (16, 'Grace Lee'),
    (17, 'Matthew Turner'),
    (18, 'Chloe Harris'),
    (19, 'Ethan Carter'),
    (20, 'Lily Walker');

INSERT INTO `SELLER` (`id`, `name`) VALUES
    (1, 'Adventure Explorers'),
    (2, 'Global Odyssey Tours'),
    (3, 'Epic Journeys Inc.'),
    (4, 'Wanderlust Travel Co.'),
    (5, 'Discovery Ventures'),
    (6, 'Voyage Quest Agency'),
    (7, 'Panorama Adventures'),
    (8, 'Horizon Expeditions'),
    (9, 'Enchanting Destinations'),
    (10, 'Evergreen Escapes');

INSERT INTO `TOUR` (`name`, `description`, `seller_id`) VALUES
    ('🌄 Adventure Seekers Expedition', 'Explore breathtaking landscapes and embark on thrilling adventures.', 1),
    ('🏛️ Cultural Heritage Tour', 'Immerse yourself in the rich history and traditions of different cultures.', 2),
    ('🏞️ Epic Wilderness Retreat', 'Disconnect from the world and reconnect with nature in this unforgettable retreat.', 3),
    ('🌃 City Lights Exploration', 'Experience the vibrant energy of city lights and urban wonders.', 4),
    ('🏝️ Discover Hidden Paradises', 'Uncover secret paradises and enjoy secluded, pristine environments.', 5),
    ('🌌 Voyage to the Unknown', 'Embark on a journey to uncharted territories and discover the unknown.', 6),
    ('🏞️ Panoramic Landscapes Tour', 'Witness awe-inspiring panoramic views of diverse landscapes.', 7),
    ('🌅 Horizon Sunset Cruise', 'Sail into the horizon and witness breathtaking sunsets on this memorable cruise.', 8),
    ('✨ Enchanted Escapes', 'Indulge in enchanting escapes to magical destinations that captivate the soul.', 9),
    ('🌲 Evergreen Nature Retreat', 'Immerse yourself in the tranquility of evergreen landscapes and rejuvenate your spirit.', 10),
    ('🐋 Whale Watching Adventure', 'Get up close with majestic whales on this thrilling whale watching expedition.', 1),
    ('🏔️ Mystical Mountains Expedition', 'Embark on a mystical journey to explore the heights of majestic mountains.', 2),
    ('🏝️ Island Paradise Getaway', 'Escape to idyllic island paradises and experience ultimate relaxation.', 3),
    ('🚁 City Skyline Helicopter Tour', 'Soar above city skylines and witness iconic landmarks from a unique perspective.', 4),
    ('🦓 Safari Adventure Expedition', 'Embark on a safari adventure to witness the wonders of wildlife in their natural habitat.', 5);

INSERT INTO `HOLIDAY` (`date`, `tour_id`) VALUES
    ('2024-01-05', 1),
    ('2024-02-10', 3),
    ('2024-03-15', 5),
    ('2024-04-20', 7),
    ('2024-05-25', 9),
    ('2024-06-30', 11),
    ('2024-07-05', 13);

INSERT INTO `REGULAR_HOLIDAY` (`day`, `tour_id`) VALUES
    (1, 2),
    (0, 2),
    (3, 4),
    (5, 6),
    (0, 8),
    (2, 10),
    (4, 12),
    (6, 14);

# WAIT 상태를 테스트 하기 위해서 tour_id 1에는 6개의 예약을 잡아 넣는다.
INSERT INTO `RESERVATION` (`token`, `state`, `date`, `client_id`, `tour_id`) VALUES
    (UUID(), 'APPROVE', '2024-02-01 00:00:00', 1, 1),
    (UUID(), 'APPROVE', '2024-02-01 00:00:00', 2, 1),
    (UUID(), 'APPROVE', '2024-02-01 00:00:00', 3, 1),
    (UUID(), 'APPROVE', '2024-02-01 00:00:00', 4, 1),
    (UUID(), 'APPROVE', '2024-02-01 00:00:00', 5, 1),
    (UUID(), 'WAIT', '2024-02-01 00:00:00', 6, 1);


INSERT INTO `RESERVATION` (`token`, `state`, `date`, `client_id`, `tour_id`) VALUES
    (UUID(), 'APPROVE', '2024-02-03 00:00:00', 6, 3),
    (UUID(), 'APPROVE', '2024-02-18 00:00:00', 7, 3),
    (UUID(), 'APPROVE', '2024-02-15 00:00:00', 8, 5),
    (UUID(), 'APPROVE', '2024-02-10 00:00:00', 9, 7),
    (UUID(), 'APPROVE', '2024-02-25 00:00:00', 10, 9),
    (UUID(), 'APPROVE', '2024-02-15 00:00:00', 11, 11),
    (UUID(), 'APPROVE', '2024-02-01 00:00:00', 12, 13),
    (UUID(), 'APPROVE', '2024-02-05 00:00:00', 13, 15),
    (UUID(), 'APPROVE', '2024-02-20 00:00:00', 14, 2),
    (UUID(), 'APPROVE', '2024-01-10 00:00:00', 15, 4),
    (UUID(), 'APPROVE', '2024-01-15 00:00:00', 16, 6),
    (UUID(), 'APPROVE', '2024-01-05 00:00:00', 17, 7),
    (UUID(), 'APPROVE', '2025-02-20 00:00:00', 18, 10),
    (UUID(), 'APPROVE', '2025-02-10 00:00:00', 19, 14),
    (UUID(), 'APPROVE', '2025-01-05 00:00:00', 20, 15);