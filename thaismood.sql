-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 19, 2019 at 10:18 AM
-- Server version: 10.1.38-MariaDB-0ubuntu0.18.04.1
-- PHP Version: 7.2.17-0ubuntu0.18.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `thaismood`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity`
--

CREATE TABLE `activity` (
  `username` varchar(100) NOT NULL,
  `activity` varchar(200) NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `emotion`
--

CREATE TABLE `emotion` (
  `username` varchar(100) NOT NULL,
  `emotion` int(11) NOT NULL,
  `level` int(11) NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `emotion`
--

INSERT INTO `emotion` (`username`, `emotion`, `level`, `date`) VALUES
('', 2, 1, '2019-05-16'),
('', 3, 0, '2019-05-15'),
('', 1, 3, '2019-05-14'),
('', 5, 1, '2019-05-13'),
('', 5, 2, '2019-05-12');

-- --------------------------------------------------------

--
-- Table structure for table `evaluation`
--

CREATE TABLE `evaluation` (
  `username` varchar(100) NOT NULL,
  `2q` int(11) DEFAULT NULL,
  `9q` int(11) NOT NULL,
  `8q` int(11) NOT NULL,
  `mdq` int(11) NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `exercise`
--

CREATE TABLE `exercise` (
  `username` varchar(100) NOT NULL,
  `step_count` int(11) NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `login`
--

CREATE TABLE `login` (
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(500) NOT NULL,
  `token` char(6) DEFAULT NULL,
  `otp` char(4) NOT NULL,
  `is_verified` int(10) UNSIGNED NOT NULL,
  `type` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='auth database';

--
-- Dumping data for table `login`
--

INSERT INTO `login` (`username`, `email`, `password`, `token`, `otp`, `is_verified`, `type`) VALUES
('', 'panphinit@gmail.com', '$2b$15$oM8/T3gNZlrAoHhNWdQDsOgnb.xU5MCOXi4OLU4gT3PIdhV4tWCKu', '123456', '6607', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `note`
--

CREATE TABLE `note` (
  `username` varchar(100) NOT NULL,
  `note` varchar(1000) NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `sleep`
--

CREATE TABLE `sleep` (
  `username` varchar(100) NOT NULL,
  `total_time` int(11) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `user_profile_general`
--

CREATE TABLE `user_profile_general` (
  `username` varchar(100) NOT NULL,
  `dob` date NOT NULL,
  `is_caffeine` bit(1) NOT NULL DEFAULT b'0',
  `is_drug_addict` bit(1) NOT NULL DEFAULT b'0',
  `created` datetime NOT NULL,
  `last_modified` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `user_profile_patient`
--

CREATE TABLE `user_profile_patient` (
  `username` varchar(100) NOT NULL,
  `sex` varchar(6) NOT NULL,
  `is_pregnant` bit(1) NOT NULL DEFAULT b'0',
  `dob` date NOT NULL,
  `weight` float NOT NULL,
  `height` float NOT NULL,
  `bmi` float NOT NULL,
  `is_caffeine` bit(1) NOT NULL DEFAULT b'0',
  `is_drug_addict` bit(1) NOT NULL DEFAULT b'0',
  `disease` varchar(500) NOT NULL,
  `created` datetime NOT NULL,
  `last_modified` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity`
--
ALTER TABLE `activity`
  ADD KEY `activity_username_foreignkey` (`username`);

--
-- Indexes for table `emotion`
--
ALTER TABLE `emotion`
  ADD KEY `emotion_username_foreignkey` (`username`);

--
-- Indexes for table `evaluation`
--
ALTER TABLE `evaluation`
  ADD KEY `evaluation_username_foreignkey` (`username`);

--
-- Indexes for table `exercise`
--
ALTER TABLE `exercise`
  ADD KEY `excercise_username_foreignkey` (`username`);

--
-- Indexes for table `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `note`
--
ALTER TABLE `note`
  ADD KEY `note_username_foreignkey` (`username`);

--
-- Indexes for table `sleep`
--
ALTER TABLE `sleep`
  ADD KEY `sleep_username_foreignkey` (`username`);

--
-- Indexes for table `user_profile_general`
--
ALTER TABLE `user_profile_general`
  ADD KEY `user_profile_general_username_foreignkey` (`username`);

--
-- Indexes for table `user_profile_patient`
--
ALTER TABLE `user_profile_patient`
  ADD KEY `user_profile_patient_username_foreignkey` (`username`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity`
--
ALTER TABLE `activity`
  ADD CONSTRAINT `activity_username_foreignkey` FOREIGN KEY (`username`) REFERENCES `login` (`username`);

--
-- Constraints for table `emotion`
--
ALTER TABLE `emotion`
  ADD CONSTRAINT `emotion_username_foreignkey` FOREIGN KEY (`username`) REFERENCES `login` (`username`);

--
-- Constraints for table `evaluation`
--
ALTER TABLE `evaluation`
  ADD CONSTRAINT `evaluation_username_foreignkey` FOREIGN KEY (`username`) REFERENCES `login` (`username`);

--
-- Constraints for table `exercise`
--
ALTER TABLE `exercise`
  ADD CONSTRAINT `excercise_username_foreignkey` FOREIGN KEY (`username`) REFERENCES `login` (`username`);

--
-- Constraints for table `note`
--
ALTER TABLE `note`
  ADD CONSTRAINT `note_username_foreignkey` FOREIGN KEY (`username`) REFERENCES `login` (`username`);

--
-- Constraints for table `sleep`
--
ALTER TABLE `sleep`
  ADD CONSTRAINT `sleep_username_foreignkey` FOREIGN KEY (`username`) REFERENCES `login` (`username`);

--
-- Constraints for table `user_profile_general`
--
ALTER TABLE `user_profile_general`
  ADD CONSTRAINT `user_profile_general_username_foreignkey` FOREIGN KEY (`username`) REFERENCES `login` (`username`);

--
-- Constraints for table `user_profile_patient`
--
ALTER TABLE `user_profile_patient`
  ADD CONSTRAINT `user_profile_patient_username_foreignkey` FOREIGN KEY (`username`) REFERENCES `login` (`username`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
