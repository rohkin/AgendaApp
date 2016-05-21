-- phpMyAdmin SQL Dump
-- version 4.4.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: May 21, 2016 at 01:20 PM
-- Server version: 5.6.26
-- PHP Version: 5.6.12

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

CREATE TABLE IF NOT EXISTS `actionpoints` (
  `point_id` int(11) NOT NULL,
  `item_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `description` varchar(45) DEFAULT NULL,
  `title` varchar(45) DEFAULT NULL,
  `resolved` int(1) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `actionpoints`
--

INSERT INTO `actionpoints` (`point_id`, `item_id`, `user_id`, `date`, `description`, `title`, `resolved`) VALUES
(2, 98, 1, NULL, 'Test Actionpoint Desc #1.1', 'Test Actionpoint Title #1.1', 0),
(3, 98, 1, NULL, 'Test Actionpoint Desc #1.2', 'Test Actionpoint Title #1.2', 0),
(4, 99, 1, NULL, 'Test Actionpoint Desc #2.1', 'Test Actionpoint Title #2.1', 0),
(5, 99, 1, NULL, 'Test Actionpoint Desc #2.2', 'Test Actionpoint Title #2.2', 0),
(6, 100, 1, NULL, 'Test Actionpoint Desc #3.1', 'Test Actionpoint Title #3.1', 0),
(7, 100, 1, NULL, 'Test Actionpoint Desc #3.2', 'Test Actionpoint Title #3.2', 0);

-- --------------------------------------------------------

--
-- Table structure for table `agendaitems`
--

CREATE TABLE IF NOT EXISTS `agendaitems` (
  `item_id` int(11) NOT NULL,
  `attachment_id` int(11) DEFAULT NULL,
  `meeting_id` int(11) DEFAULT NULL,
  `active` int(1) NOT NULL,
  `default` int(11) DEFAULT NULL,
  `description` longtext,
  `position` int(11) DEFAULT NULL,
  `time` date DEFAULT NULL,
  `title` varchar(45) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=118 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `agendaitems`
--

INSERT INTO `agendaitems` (`item_id`, `attachment_id`, `meeting_id`, `active`, `default`, `description`, `position`, `time`, `title`) VALUES
(1, NULL, NULL, 1, 1, '{DESCRIPTION}', 1, NULL, 'Toileteren'),
(2, NULL, NULL, 1, 1, '{DESCRIPTION}', 2, NULL, 'Voorbespreking'),
(3, NULL, NULL, 0, 1, '{DESCRIPTION}', 4, NULL, 'Agendapunten'),
(4, NULL, NULL, 1, 1, '{DESCRIPTION}', 0, NULL, 'Actiepunten'),
(5, NULL, NULL, 0, 1, '{DESCRIPTION}', 5, NULL, 'Leerlingen afzeiken'),
(6, NULL, NULL, 1, 1, '{DESCRIPTION}', 3, NULL, 'Drank'),
(91, NULL, NULL, 0, 1, 'asd', 6, NULL, 'asd'),
(97, NULL, NULL, 0, 1, 'njk', 7, NULL, 'jkjsafnjk'),
(98, NULL, 1, 1, 0, 'Test Data Desc #1', NULL, NULL, 'Test Data Title #1'),
(99, NULL, 1, 1, 0, 'Test Data Desc #2', NULL, NULL, 'Test Data Title #2'),
(100, NULL, 1, 1, 0, 'Test Data Desc #3', NULL, NULL, 'Test Data Title #3'),
(114, NULL, 1, 1, 0, '{DESCRIPTION}', NULL, NULL, 'Actiepunten'),
(115, NULL, 1, 1, 0, '{DESCRIPTION}', 1, NULL, 'Toileteren'),
(116, NULL, 1, 1, 0, '{DESCRIPTION}', 2, NULL, 'Voorbespreking'),
(117, NULL, 1, 1, 0, '{DESCRIPTION}', 3, NULL, 'Drank');

-- --------------------------------------------------------

--
-- Table structure for table `attachments`
--

CREATE TABLE IF NOT EXISTS `attachments` (
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

CREATE TABLE IF NOT EXISTS `meetings` (
  `meeting_id` int(11) NOT NULL,
  `date` date DEFAULT NULL,
  `active` int(1) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `meetings`
--

INSERT INTO `meetings` (`meeting_id`, `date`, `active`) VALUES
(1, '2016-04-25', 0);

-- --------------------------------------------------------

--
-- Table structure for table `meetings_users`
--

CREATE TABLE IF NOT EXISTS `meetings_users` (
  `meeting_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `role_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `meetings_users`
--

INSERT INTO `meetings_users` (`meeting_id`, `user_id`, `role_id`) VALUES
(1, 1, 1),
(1, 2, 2),
(1, 3, 4);

-- --------------------------------------------------------

--
-- Table structure for table `notes`
--

CREATE TABLE IF NOT EXISTS `notes` (
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

CREATE TABLE IF NOT EXISTS `role` (
  `role_id` int(11) NOT NULL,
  `desc` varchar(45) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`role_id`, `desc`) VALUES
(1, 'Voorzitter'),
(2, 'Notulist'),
(3, 'Penningmeester'),
(4, 'Minion');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(45) DEFAULT NULL,
  `password` varchar(45) DEFAULT NULL,
  `first_name` varchar(45) DEFAULT NULL,
  `middle_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `password`, `first_name`, `middle_name`, `last_name`) VALUES
(1, 'jameyheel', 'test', 'Jamey', 'van', 'Heel'),
(2, 'kimdewit', 'test', 'Kim', 'de', 'Wit'),
(3, 'mennobut', 'test', 'Menno', NULL, 'But');

-- --------------------------------------------------------

--
-- Table structure for table `users_points`
--

CREATE TABLE IF NOT EXISTS `users_points` (
  `user_id` int(11) DEFAULT NULL,
  `point_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users_points`
--

INSERT INTO `users_points` (`user_id`, `point_id`) VALUES
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7);

-- --------------------------------------------------------

--
-- Table structure for table `user_items`
--

CREATE TABLE IF NOT EXISTS `user_items` (
  `user_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `creator` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `actionpoints`
--
ALTER TABLE `actionpoints`
  ADD PRIMARY KEY (`point_id`),
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
  ADD KEY `meeting_id_INDEX` (`meeting_id`);

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
  ADD PRIMARY KEY (`role_id`),
  ADD UNIQUE KEY `role_id` (`role_id`);

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
  MODIFY `point_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `agendaitems`
--
ALTER TABLE `agendaitems`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=118;
--
-- AUTO_INCREMENT for table `attachments`
--
ALTER TABLE `attachments`
  MODIFY `attachment_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `meetings`
--
ALTER TABLE `meetings`
  MODIFY `meeting_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `actionpoints`
--
ALTER TABLE `actionpoints`
  ADD CONSTRAINT `fk_points_items1` FOREIGN KEY (`item_id`) REFERENCES `agendaitems` (`item_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `agendaitems`
--
ALTER TABLE `agendaitems`
  ADD CONSTRAINT `fk_items_meetings1` FOREIGN KEY (`meeting_id`) REFERENCES `meetings` (`meeting_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

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
  ADD CONSTRAINT `fk_meetings_users_role` FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`),
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
