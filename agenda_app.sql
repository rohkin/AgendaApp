-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Apr 19, 2016 at 02:14 PM
-- Server version: 10.1.9-MariaDB
-- PHP Version: 5.6.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `agenda_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `actionpoints`
--

CREATE TABLE `actionpoints` (
  `point_id` int(11) NOT NULL,
  `item_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `description` varchar(45) DEFAULT NULL,
  `title` varchar(45) DEFAULT NULL,
  `resolved` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `agendaitems`
--

CREATE TABLE `agendaitems` (
  `item_id` int(11) NOT NULL,
  `attachment_id` int(11) DEFAULT NULL,
  `meeting_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `active` int(1) NOT NULL,
  `default` int(11) DEFAULT NULL,
  `description` longtext,
  `position` int(11) DEFAULT NULL,
  `time` date DEFAULT NULL,
  `title` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `agendaitems`
--

INSERT INTO `agendaitems` (`item_id`, `attachment_id`, `meeting_id`, `user_id`, `active`, `default`, `description`, `position`, `time`, `title`) VALUES
(1, NULL, NULL, NULL, 1, 1, '{DESCRIPTION}', 1, NULL, 'Toileteren'),
(2, NULL, NULL, NULL, 1, 1, '{DESCRIPTION}', 2, NULL, 'Voorbespreking'),
(3, NULL, NULL, NULL, 0, 1, '{DESCRIPTION}', 4, NULL, 'Agendapunten'),
(4, NULL, NULL, NULL, 1, 1, '{DESCRIPTION}', 0, NULL, 'Actiepunten'),
(5, NULL, NULL, NULL, 0, 1, '{DESCRIPTION}', 5, NULL, 'Leerlingen afzeiken'),
(6, NULL, NULL, NULL, 1, 1, '{DESCRIPTION}', 3, NULL, 'Drank'),
(91, NULL, NULL, NULL, 0, 1, 'asd', 6, NULL, 'asd'),
(97, NULL, NULL, NULL, 0, 1, 'njk', 7, NULL, 'jkjsafnjk');

-- --------------------------------------------------------

--
-- Table structure for table `attachments`
--

CREATE TABLE `attachments` (
  `attachment_id` int(11) NOT NULL,
  `point_id` int(11) DEFAULT NULL,
  `note_id` int(11) DEFAULT NULL,
  `item_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `file_name` varchar(45) DEFAULT NULL,
  `file_type` varchar(45) DEFAULT NULL,
  `file_size` int(11) DEFAULT NULL,
  `file_content` mediumblob
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `meetings`
--

CREATE TABLE `meetings` (
  `meeting_id` int(11) NOT NULL,
  ` date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `meetings_users`
--

CREATE TABLE `meetings_users` (
  `meeting_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `role_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `notes`
--

CREATE TABLE `notes` (
  `note_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `point_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `description` varchar(45) DEFAULT NULL,
  `private` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `role_id` int(11) NOT NULL,
  `desc` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`role_id`, `desc`) VALUES
(0, 'u wut m8');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(45) DEFAULT NULL,
  `password` varchar(45) DEFAULT NULL,
  `first_name` varchar(45) DEFAULT NULL,
  `middle_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `password`, `first_name`, `middle_name`, `last_name`) VALUES
(1, 'jameyheel', 'test', 'Jamey', 'van', 'Heel');

-- --------------------------------------------------------

--
-- Table structure for table `users_points`
--

CREATE TABLE `users_points` (
  `user_id` int(11) DEFAULT NULL,
  `point_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `actionpoints`
--
ALTER TABLE `actionpoints`
  ADD KEY `point_id_INDEX` (`point_id`),
  ADD KEY `item_id_INDEX` (`item_id`),
  ADD KEY `user_id_INDEX` (`user_id`);

--
-- Indexes for table `agendaitems`
--
ALTER TABLE `agendaitems`
  ADD PRIMARY KEY (`item_id`),
  ADD KEY `item_id_INDEX` (`item_id`),
  ADD KEY `attachment_id_INDEX` (`attachment_id`),
  ADD KEY `meeting_id_INDEX` (`meeting_id`),
  ADD KEY `user_id_INDEX` (`user_id`);

--
-- Indexes for table `attachments`
--
ALTER TABLE `attachments`
  ADD PRIMARY KEY (`attachment_id`),
  ADD KEY `attachment_id_INDEX` (`attachment_id`),
  ADD KEY `point_id_INDEX` (`point_id`),
  ADD KEY `note_id_INDEX` (`note_id`),
  ADD KEY `user_id_INDEX` (`user_id`),
  ADD KEY `item_id_INDEX` (`item_id`);

--
-- Indexes for table `meetings`
--
ALTER TABLE `meetings`
  ADD PRIMARY KEY (`meeting_id`),
  ADD KEY `meeting_id_INDEX` (`meeting_id`);

--
-- Indexes for table `meetings_users`
--
ALTER TABLE `meetings_users`
  ADD KEY `user_id_INDEX` (`user_id`),
  ADD KEY `meeting_id_INDEX` (`meeting_id`),
  ADD KEY `fk_meetings_users_role1_idx` (`role_id`);

--
-- Indexes for table `notes`
--
ALTER TABLE `notes`
  ADD PRIMARY KEY (`note_id`),
  ADD KEY `note_id_INDEX` (`note_id`),
  ADD KEY `item_id_INDEX` (`item_id`),
  ADD KEY `point_id_INDEX` (`point_id`),
  ADD KEY `user_id_INDEX` (`user_id`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`role_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username_UNIQUE` (`username`);

--
-- Indexes for table `users_points`
--
ALTER TABLE `users_points`
  ADD KEY `user_id_INDEX` (`user_id`),
  ADD KEY `point_id_INDEX` (`point_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `actionpoints`
--
ALTER TABLE `actionpoints`
  MODIFY `point_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `agendaitems`
--
ALTER TABLE `agendaitems`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=98;
--
-- AUTO_INCREMENT for table `attachments`
--
ALTER TABLE `attachments`
  MODIFY `attachment_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `meetings`
--
ALTER TABLE `meetings`
  MODIFY `meeting_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `actionpoints`
--
ALTER TABLE `actionpoints`
  ADD CONSTRAINT `fk_points_items1` FOREIGN KEY (`item_id`) REFERENCES `agendaitems` (`item_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_points_notes1` FOREIGN KEY (`point_id`) REFERENCES `notes` (`point_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `agendaitems`
--
ALTER TABLE `agendaitems`
  ADD CONSTRAINT `fk_items_meetings1` FOREIGN KEY (`meeting_id`) REFERENCES `meetings` (`meeting_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_items_users1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `attachments`
--
ALTER TABLE `attachments`
  ADD CONSTRAINT `fk_attachments_items1` FOREIGN KEY (`item_id`) REFERENCES `agendaitems` (`item_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_attachments_notes1` FOREIGN KEY (`note_id`) REFERENCES `notes` (`note_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_attachments_points1` FOREIGN KEY (`point_id`) REFERENCES `actionpoints` (`point_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_attachments_users1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `meetings_users`
--
ALTER TABLE `meetings_users`
  ADD CONSTRAINT `fk_meetings_users_meetings` FOREIGN KEY (`meeting_id`) REFERENCES `meetings` (`meeting_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_meetings_users_role1` FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_meetings_users_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `notes`
--
ALTER TABLE `notes`
  ADD CONSTRAINT `fk_notes_items1` FOREIGN KEY (`item_id`) REFERENCES `agendaitems` (`item_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_notes_users1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `users_points`
--
ALTER TABLE `users_points`
  ADD CONSTRAINT `fk_users_points_points1` FOREIGN KEY (`point_id`) REFERENCES `actionpoints` (`point_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_users_points_users1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
