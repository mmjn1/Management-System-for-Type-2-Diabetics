-- MySQL dump 10.13  Distrib 8.3.0, for macos12.6 (x86_64)
--
-- Host: localhost    Database: glucocaredb
-- ------------------------------------------------------
-- Server version	8.0.25

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=149 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add message',2,'add_message'),(6,'Can change message',2,'change_message'),(7,'Can delete message',2,'delete_message'),(8,'Can view message',2,'view_message'),(9,'Can add medical license',3,'add_medicallicense'),(10,'Can change medical license',3,'change_medicallicense'),(11,'Can delete medical license',3,'delete_medicallicense'),(12,'Can view medical license',3,'view_medicallicense'),(13,'Can add role',4,'add_role'),(14,'Can change role',4,'change_role'),(15,'Can delete role',4,'delete_role'),(16,'Can view role',4,'view_role'),(17,'Can add support inquiry',5,'add_supportinquiry'),(18,'Can change support inquiry',5,'change_supportinquiry'),(19,'Can delete support inquiry',5,'delete_supportinquiry'),(20,'Can view support inquiry',5,'view_supportinquiry'),(21,'Can add weekly availability',6,'add_weeklyavailability'),(22,'Can change weekly availability',6,'change_weeklyavailability'),(23,'Can delete weekly availability',6,'delete_weeklyavailability'),(24,'Can view weekly availability',6,'view_weeklyavailability'),(25,'Can add user',7,'add_customuser'),(26,'Can change user',7,'change_customuser'),(27,'Can delete user',7,'delete_customuser'),(28,'Can view user',7,'view_customuser'),(29,'Can add doctor',8,'add_doctor'),(30,'Can change doctor',8,'change_doctor'),(31,'Can delete doctor',8,'delete_doctor'),(32,'Can view doctor',8,'view_doctor'),(33,'Can add patient',9,'add_patient'),(34,'Can change patient',9,'change_patient'),(35,'Can delete patient',9,'delete_patient'),(36,'Can view patient',9,'view_patient'),(37,'Can add time slot',10,'add_timeslot'),(38,'Can change time slot',10,'change_timeslot'),(39,'Can delete time slot',10,'delete_timeslot'),(40,'Can view time slot',10,'view_timeslot'),(41,'Can add prescription',11,'add_prescription'),(42,'Can change prescription',11,'change_prescription'),(43,'Can delete prescription',11,'delete_prescription'),(44,'Can view prescription',11,'view_prescription'),(45,'Can add patient appointment',12,'add_patientappointment'),(46,'Can change patient appointment',12,'change_patientappointment'),(47,'Can delete patient appointment',12,'delete_patientappointment'),(48,'Can view patient appointment',12,'view_patientappointment'),(49,'Can add doctor appointment',13,'add_doctorappointment'),(50,'Can change doctor appointment',13,'change_doctorappointment'),(51,'Can delete doctor appointment',13,'delete_doctorappointment'),(52,'Can view doctor appointment',13,'view_doctorappointment'),(53,'Can add permission',14,'add_permission'),(54,'Can change permission',14,'change_permission'),(55,'Can delete permission',14,'delete_permission'),(56,'Can view permission',14,'view_permission'),(57,'Can add group',15,'add_group'),(58,'Can change group',15,'change_group'),(59,'Can delete group',15,'delete_group'),(60,'Can view group',15,'view_group'),(61,'Can add content type',16,'add_contenttype'),(62,'Can change content type',16,'change_contenttype'),(63,'Can delete content type',16,'delete_contenttype'),(64,'Can view content type',16,'view_contenttype'),(65,'Can add session',17,'add_session'),(66,'Can change session',17,'change_session'),(67,'Can delete session',17,'delete_session'),(68,'Can view session',17,'view_session'),(69,'Can add Token',18,'add_token'),(70,'Can change Token',18,'change_token'),(71,'Can delete Token',18,'delete_token'),(72,'Can view Token',18,'view_token'),(73,'Can add token',19,'add_tokenproxy'),(74,'Can change token',19,'change_tokenproxy'),(75,'Can delete token',19,'delete_tokenproxy'),(76,'Can view token',19,'view_tokenproxy'),(77,'Can add field choice',20,'add_fieldchoice'),(78,'Can change field choice',20,'change_fieldchoice'),(79,'Can delete field choice',20,'delete_fieldchoice'),(80,'Can view field choice',20,'view_fieldchoice'),(81,'Can add form',21,'add_form'),(82,'Can change form',21,'change_form'),(83,'Can delete form',21,'delete_form'),(84,'Can view form',21,'view_form'),(85,'Can add section',22,'add_section'),(86,'Can change section',22,'change_section'),(87,'Can delete section',22,'delete_section'),(88,'Can view section',22,'view_section'),(89,'Can add file attachment',23,'add_fileattachment'),(90,'Can change file attachment',23,'change_fileattachment'),(91,'Can delete file attachment',23,'delete_fileattachment'),(92,'Can view file attachment',23,'view_fileattachment'),(93,'Can add field',24,'add_field'),(94,'Can change field',24,'change_field'),(95,'Can delete field',24,'delete_field'),(96,'Can view field',24,'view_field'),(97,'Can add field response',25,'add_fieldresponse'),(98,'Can change field response',25,'change_fieldresponse'),(99,'Can delete field response',25,'delete_fieldresponse'),(100,'Can view field response',25,'view_fieldresponse'),(101,'Can add form response',26,'add_formresponse'),(102,'Can change form response',26,'change_formresponse'),(103,'Can delete form response',26,'delete_formresponse'),(104,'Can view form response',26,'view_formresponse'),(105,'Can add user meal entry',27,'add_usermealentry'),(106,'Can change user meal entry',27,'change_usermealentry'),(107,'Can delete user meal entry',27,'delete_usermealentry'),(108,'Can view user meal entry',27,'view_usermealentry'),(109,'Can add advices',28,'add_advices'),(110,'Can change advices',28,'change_advices'),(111,'Can delete advices',28,'delete_advices'),(112,'Can view advices',28,'view_advices'),(113,'Can add diagnoses',29,'add_diagnoses'),(114,'Can change diagnoses',29,'change_diagnoses'),(115,'Can delete diagnoses',29,'delete_diagnoses'),(116,'Can view diagnoses',29,'view_diagnoses'),(117,'Can add follow ups',30,'add_followups'),(118,'Can change follow ups',30,'change_followups'),(119,'Can delete follow ups',30,'delete_followups'),(120,'Can view follow ups',30,'view_followups'),(121,'Can add histories',31,'add_histories'),(122,'Can change histories',31,'change_histories'),(123,'Can delete histories',31,'delete_histories'),(124,'Can view histories',31,'view_histories'),(125,'Can add salt',32,'add_salt'),(126,'Can change salt',32,'change_salt'),(127,'Can delete salt',32,'delete_salt'),(128,'Can view salt',32,'view_salt'),(129,'Can add symptoms',33,'add_symptoms'),(130,'Can change symptoms',33,'change_symptoms'),(131,'Can delete symptoms',33,'delete_symptoms'),(132,'Can view symptoms',33,'view_symptoms'),(133,'Can add tests',34,'add_tests'),(134,'Can change tests',34,'change_tests'),(135,'Can delete tests',34,'delete_tests'),(136,'Can view tests',34,'view_tests'),(137,'Can add vitals',35,'add_vitals'),(138,'Can change vitals',35,'change_vitals'),(139,'Can delete vitals',35,'delete_vitals'),(140,'Can view vitals',35,'view_vitals'),(141,'Can add medicine',36,'add_medicine'),(142,'Can change medicine',36,'change_medicine'),(143,'Can delete medicine',36,'delete_medicine'),(144,'Can view medicine',36,'view_medicine'),(145,'Can add drugs',37,'add_drugs'),(146,'Can change drugs',37,'change_drugs'),(147,'Can delete drugs',37,'delete_drugs'),(148,'Can view drugs',37,'view_drugs');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `authtoken_token`
--

DROP TABLE IF EXISTS `authtoken_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `authtoken_token` (
  `key` varchar(40) NOT NULL,
  `created` datetime(6) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`key`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `authtoken_token_user_id_35299eff_fk_HealthMan` FOREIGN KEY (`user_id`) REFERENCES `HealthManagementApp_customuser` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authtoken_token`
--

LOCK TABLES `authtoken_token` WRITE;
/*!40000 ALTER TABLE `authtoken_token` DISABLE KEYS */;
/*!40000 ALTER TABLE `authtoken_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_message`
--

DROP TABLE IF EXISTS `chat_message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_message` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `message` longtext NOT NULL,
  `timestamp` datetime(6) NOT NULL,
  `recipient_id` bigint NOT NULL,
  `sender_id` bigint NOT NULL,
  `attachment` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `chat_message_recipient_id_519a6b56_fk_HealthMan` (`recipient_id`),
  KEY `chat_message_sender_id_991c686c_fk_HealthMan` (`sender_id`),
  CONSTRAINT `chat_message_recipient_id_519a6b56_fk_HealthMan` FOREIGN KEY (`recipient_id`) REFERENCES `HealthManagementApp_customuser` (`id`),
  CONSTRAINT `chat_message_sender_id_991c686c_fk_HealthMan` FOREIGN KEY (`sender_id`) REFERENCES `HealthManagementApp_customuser` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_message`
--

LOCK TABLES `chat_message` WRITE;
/*!40000 ALTER TABLE `chat_message` DISABLE KEYS */;
INSERT INTO `chat_message` VALUES (4,'Hello Usman, how are you!','2024-04-03 19:36:42.410638',8,2,''),(5,'I\'m great Dr. Ali, how are you','2024-04-03 19:37:14.843349',2,8,''),(6,'I\'m great thank you!','2024-04-03 19:37:29.917277',8,2,''),(7,'That\'s good to hear','2024-04-03 19:37:40.896220',2,8,''),(8,'','2024-04-03 19:41:07.071640',8,2,'attachments/1712173264354.png'),(9,'','2024-04-03 19:43:54.215578',2,8,'attachments/1712173432627.png'),(10,'I sent you the blue image','2024-04-03 19:54:54.466465',2,8,'');
/*!40000 ALTER TABLE `chat_message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_HealthMan` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_HealthMan` FOREIGN KEY (`user_id`) REFERENCES `HealthManagementApp_customuser` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
INSERT INTO `django_admin_log` VALUES (1,'2024-03-20 01:41:34.060892','1','LE4343GL - Leicester',1,'[{\"added\": {}}]',3,1),(2,'2024-03-20 01:44:55.380224','2','LE4344EM - Leicester',1,'[{\"added\": {}}]',3,1),(3,'2024-03-20 01:46:11.338665','3','LE4345PN - Leicester',1,'[{\"added\": {}}]',3,1),(4,'2024-03-20 01:47:37.678841','4','LE4346YM - Leicester',1,'[{\"added\": {}}]',3,1),(5,'2024-03-20 01:49:18.364902','5','LE4347LX - Leicester',1,'[{\"added\": {}}]',3,1),(6,'2024-03-20 01:51:11.579689','6','LE4348HW - Leicester',1,'[{\"added\": {}}]',3,1),(7,'2024-03-20 01:52:42.560182','7','LE4349PS - Leicester',1,'[{\"added\": {}}]',3,1),(8,'2024-03-20 01:53:58.443931','8','LE4350YY - Leicester',1,'[{\"added\": {}}]',3,1),(9,'2024-03-20 03:53:18.494754','1','mukhtar162@hotmail.com',2,'[{\"changed\": {\"fields\": [\"Role\"]}}]',7,1),(10,'2024-03-20 05:25:41.205183','8','LE4350MA - Leicester',2,'[{\"changed\": {\"fields\": [\"License number\", \"Doctor initials\"]}}]',3,1),(11,'2024-03-20 05:56:47.272261','3','mmjn1@student.le.ac.uk',3,'',7,1),(12,'2024-03-20 11:53:50.476902','4','Doctor Mukhtar: Specialty - Endocrinology, Years of Experience - 23 - 2024-03-22',3,'',12,1),(13,'2024-03-20 11:53:50.493017','3','Doctor Mukhtar: Specialty - Endocrinology, Years of Experience - 23 - 2024-03-20',3,'',12,1),(14,'2024-03-20 11:53:50.496829','2','Doctor Mukhtar: Specialty - Endocrinology, Years of Experience - 23 - 2024-03-20',3,'',12,1),(15,'2024-03-20 11:53:50.499319','1','Doctor Mukhtar: Specialty - Endocrinology, Years of Experience - 23 - 2024-03-20',3,'',12,1),(16,'2024-03-20 11:53:57.137140','5','Doctor Mukhtar: Specialty - Endocrinology, Years of Experience - 23 - 2024-03-21',3,'',12,1),(17,'2024-03-20 20:19:09.666545','6','Doctor Mukhtar: Specialty - Endocrinology, Years of Experience - 22',3,'',8,1),(18,'2024-03-20 20:35:55.732802','6','Doctor Mukhtar: Specialty - Endocrinology, Years of Experience - 23 - 2024-03-19',3,'',12,1),(19,'2024-03-20 20:38:19.794688','6','mukhtar78925@yahoo.com',3,'',7,1),(20,'2024-03-20 20:40:46.167469','5','Wednesday: 10:00:00 to 10:30:00 at Victoria Park Health Centre',3,'',10,1),(21,'2024-03-20 20:40:46.181141','3','Tuesday: 11:30:00 to 11:45:00 at Victoria Park Health Centre',3,'',10,1),(22,'2024-03-20 20:57:52.484043','5','Patient Musa: Type of Diabetes - Type 2, Date of Diagnosis - 2024-01-02',3,'',9,1),(23,'2024-03-20 21:09:18.887456','5','mmjn1@student.le.ac.uk',3,'',7,1),(24,'2024-03-20 23:31:42.654960','7','Doctor Mukhtar: Specialty - Endocrinology, Years of Experience - 23 - 2024-03-20',2,'[{\"changed\": {\"fields\": [\"Patient\"]}}]',12,1),(25,'2024-03-21 16:33:11.331381','11','Dr. Mukhtar Ali - 2024-03-25',3,'',12,1),(26,'2024-03-21 16:33:11.363363','8','Dr. Mukhtar Ali - 2024-03-26',3,'',12,1),(27,'2024-03-22 14:05:26.856474','17','Dr. Mukhtar Ali - 2024-03-27',3,'',12,1),(28,'2024-03-22 20:59:36.620081','23','Dr. Mukhtar Ali - 2024-04-03',3,'',12,1),(29,'2024-03-22 20:59:36.631243','22','Dr. Mukhtar Ali - 2024-04-04',3,'',12,1),(30,'2024-03-22 21:10:08.973948','24','Dr. Mukhtar Ali - 2024-04-03',3,'',12,1),(31,'2024-03-22 21:10:08.984094','25','Dr. Mukhtar Ali - 2024-04-08',3,'',12,1),(32,'2024-03-22 21:31:25.371004','26','Dr. Mukhtar Ali - 2024-04-03',3,'',12,1),(33,'2024-03-22 22:27:12.251865','28','Dr. Mukhtar Ali - 2024-04-03',3,'',12,1),(34,'2024-03-27 12:47:27.950129','1','Questionnaire',1,'[{\"added\": {}}]',21,1),(35,'2024-03-27 12:57:18.913779','1','Personal Details',1,'[{\"added\": {}}]',22,1),(36,'2024-03-27 13:09:23.765475','1','Personal Details',3,'',22,1),(37,'2024-03-27 13:09:40.223893','1','Questionnaire',3,'',21,1),(38,'2024-03-27 15:01:33.668193','3','Questionnaire',3,'',21,1),(39,'2024-03-27 15:01:33.679470','2','Questionnaire',3,'',21,1),(40,'2024-03-27 15:07:22.323359','4','Questionnaire',1,'[{\"added\": {}}]',21,1),(41,'2024-03-29 17:52:02.209291','4','Response to Monthly Diabetes Management Log by Mukhtar Ali',3,'',26,1),(42,'2024-03-29 17:52:02.249398','3','Response to Monthly Diabetes Management Log by Mukhtar Ali',3,'',26,1),(43,'2024-03-29 17:52:02.255422','2','Response to Monthly Diabetes Management Log by Mukhtar Ali',3,'',26,1),(44,'2024-03-29 17:52:02.259396','1','Response to Monthly Diabetes Management Log by Mukhtar Ali',3,'',26,1),(45,'2024-03-29 17:52:17.686644','7','Response to Monthly Diabetes Management Log by Mukhtar Ali',3,'',26,1),(46,'2024-03-29 17:52:17.698202','6','Response to Monthly Diabetes Management Log by Mukhtar Ali',3,'',26,1),(47,'2024-03-29 17:52:17.701217','5','Response to Monthly Diabetes Management Log by Mukhtar Ali',3,'',26,1),(48,'2024-03-29 17:52:32.126368','8','Response to Monthly Diabetes Management Log by Mukhtar Ali',3,'',26,1),(49,'2024-03-29 20:56:38.657343','10','Response to Monthly Diabetes Management Log by Mukhtar Ali',3,'',26,1),(50,'2024-04-11 21:33:40.572979','15','fried chicken and salad',3,'',27,1),(51,'2024-04-11 21:33:40.605104','14','White rice and chicken fajitas',3,'',27,1),(52,'2024-04-11 21:33:40.613048','13','scrambled eggs with avocado',3,'',27,1),(53,'2024-04-11 21:33:40.624282','12','fish and chips',3,'',27,1),(54,'2024-04-11 21:33:40.628569','11','chicken and waffles with a banana milkshake',3,'',27,1),(55,'2024-04-11 21:33:40.632740','10','',3,'',27,1),(56,'2024-04-11 21:33:40.636323','9','',3,'',27,1),(57,'2024-04-11 21:33:40.638724','8','',3,'',27,1),(58,'2024-04-11 21:33:40.642270','7','',3,'',27,1),(59,'2024-04-11 21:33:40.645897','6','grilled fish with salmon and sweet potato',3,'',27,1),(60,'2024-04-11 21:33:40.649285','5','fish and chips',3,'',27,1),(61,'2024-04-11 21:33:40.653965','4','chicken and chips',3,'',27,1),(62,'2024-04-11 21:33:40.658151','3','I had fish and chips',3,'',27,1),(63,'2024-04-11 21:33:40.661099','2','fish and chips',3,'',27,1),(64,'2024-04-11 21:33:40.665811','1','fish and chips',3,'',27,1),(65,'2024-04-12 01:33:08.365677','21','weetabix and oat milk',3,'',27,1),(66,'2024-04-12 01:33:08.398596','20','chicken and chips',3,'',27,1),(67,'2024-04-12 01:33:08.406648','19','pasta with betroot',3,'',27,1),(68,'2024-04-12 01:33:08.413759','18','tuna salad with brown rice',3,'',27,1),(69,'2024-04-12 01:33:08.416777','17','peanut better with brown bread',3,'',27,1),(70,'2024-04-12 01:33:08.427543','16','fried egg and chips',3,'',27,1),(71,'2024-04-16 19:01:06.294570','8','1592525111261d8150bf16a4dd118735bc08e1b0',1,'[{\"added\": {}}]',19,1),(72,'2024-04-16 19:01:29.964693','8','1592525111261d8150bf16a4dd118735bc08e1b0',3,'',19,1);
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(15,'auth','group'),(14,'auth','permission'),(18,'authtoken','token'),(19,'authtoken','tokenproxy'),(2,'chat','message'),(16,'contenttypes','contenttype'),(28,'HealthManagementApp','advices'),(7,'HealthManagementApp','customuser'),(29,'HealthManagementApp','diagnoses'),(8,'HealthManagementApp','doctor'),(13,'HealthManagementApp','doctorappointment'),(37,'HealthManagementApp','drugs'),(24,'HealthManagementApp','field'),(20,'HealthManagementApp','fieldchoice'),(25,'HealthManagementApp','fieldresponse'),(23,'HealthManagementApp','fileattachment'),(30,'HealthManagementApp','followups'),(21,'HealthManagementApp','form'),(26,'HealthManagementApp','formresponse'),(31,'HealthManagementApp','histories'),(3,'HealthManagementApp','medicallicense'),(36,'HealthManagementApp','medicine'),(9,'HealthManagementApp','patient'),(12,'HealthManagementApp','patientappointment'),(11,'HealthManagementApp','prescription'),(4,'HealthManagementApp','role'),(32,'HealthManagementApp','salt'),(22,'HealthManagementApp','section'),(5,'HealthManagementApp','supportinquiry'),(33,'HealthManagementApp','symptoms'),(34,'HealthManagementApp','tests'),(10,'HealthManagementApp','timeslot'),(27,'HealthManagementApp','usermealentry'),(35,'HealthManagementApp','vitals'),(6,'HealthManagementApp','weeklyavailability'),(17,'sessions','session');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2024-03-20 01:34:10.973742'),(2,'contenttypes','0002_remove_content_type_name','2024-03-20 01:34:11.063843'),(3,'auth','0001_initial','2024-03-20 01:34:11.281363'),(4,'auth','0002_alter_permission_name_max_length','2024-03-20 01:34:11.347091'),(5,'auth','0003_alter_user_email_max_length','2024-03-20 01:34:11.357720'),(6,'auth','0004_alter_user_username_opts','2024-03-20 01:34:11.369333'),(7,'auth','0005_alter_user_last_login_null','2024-03-20 01:34:11.382863'),(8,'auth','0006_require_contenttypes_0002','2024-03-20 01:34:11.386612'),(9,'auth','0007_alter_validators_add_error_messages','2024-03-20 01:34:11.397677'),(10,'auth','0008_alter_user_username_max_length','2024-03-20 01:34:11.411782'),(11,'auth','0009_alter_user_last_name_max_length','2024-03-20 01:34:11.429435'),(12,'auth','0010_alter_group_name_max_length','2024-03-20 01:34:11.465503'),(13,'auth','0011_update_proxy_permissions','2024-03-20 01:34:11.596650'),(14,'auth','0012_alter_user_first_name_max_length','2024-03-20 01:34:11.609369'),(15,'HealthManagementApp','0001_initial','2024-03-20 01:34:12.709330'),(16,'admin','0001_initial','2024-03-20 01:34:12.844445'),(17,'admin','0002_logentry_remove_auto_add','2024-03-20 01:34:12.859010'),(18,'admin','0003_logentry_add_action_flag_choices','2024-03-20 01:34:12.899972'),(19,'authtoken','0001_initial','2024-03-20 01:34:12.984788'),(20,'authtoken','0002_auto_20160226_1747','2024-03-20 01:34:13.052998'),(21,'authtoken','0003_tokenproxy','2024-03-20 01:34:13.060387'),(22,'chat','0001_initial','2024-03-20 01:34:13.201813'),(23,'chat','0002_message_attachment','2024-03-20 01:34:13.248815'),(24,'chat','0003_alter_message_attachment','2024-03-20 01:34:13.267055'),(25,'sessions','0001_initial','2024-03-20 01:34:13.313753'),(26,'HealthManagementApp','0002_doctor_medical_license','2024-03-20 01:37:32.450403'),(27,'HealthManagementApp','0003_patientappointment_patient','2024-03-20 23:03:48.840276'),(28,'HealthManagementApp','0004_field_form_section_fileattachment_fieldchoice_and_more','2024-03-26 21:34:52.369768'),(29,'HealthManagementApp','0005_remove_field_max_value_remove_field_min_value_and_more','2024-03-27 13:20:22.326533'),(30,'HealthManagementApp','0006_formresponse_fieldresponse','2024-03-28 15:56:37.693040'),(31,'HealthManagementApp','0007_usermealentry','2024-04-10 16:34:27.562553'),(32,'HealthManagementApp','0008_remove_usermealentry_patient','2024-04-10 16:40:19.697607'),(33,'HealthManagementApp','0009_usermealentry_patient','2024-04-11 19:58:09.189011'),(34,'HealthManagementApp','0010_remove_usermealentry_patient','2024-04-15 10:08:11.113409'),(35,'HealthManagementApp','0011_advices_diagnoses_followups_histories_salt_symptoms_and_more','2024-04-16 10:16:46.227990'),(36,'HealthManagementApp','0012_patient_email_patient_mobile_patient_age_and_more','2024-04-16 11:54:02.914163'),(37,'HealthManagementApp','0013_alter_prescription_advices_and_more','2024-04-16 12:02:48.776896'),(38,'HealthManagementApp','0014_remove_patient_email_remove_patient_mobile_and_more','2024-04-16 18:40:13.308808'),(39,'HealthManagementApp','0015_patient_email_patient_mobile_patient_age_and_more','2024-04-17 15:32:47.147887');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
INSERT INTO `django_session` VALUES ('bh1pps7x0upz02ft5yhrk2vwke1bayvv','.eJxVjMsOwiAQRf-FtSEwNDxcuvcbyDADUjWQlHZl_Hdt0oVu7znnvkTEba1xG3mJM4uz0OL0uyWkR2474Du2W5fU27rMSe6KPOiQ1875eTncv4OKo35rQG28scFYQ1CKdgkosSLGHEAFDEhpAl1g8h4SOnCsivHWAXvFXov3B90oN5Y:1rmkvJ:3x7J8HuK6h-enlcM83qqRsXdKj5WncvfMX4ji9vJMJU','2024-04-03 01:39:21.842509'),('qr4ybvj2vqv1jd1hqnt6r48ko0sm1jzt','.eJxVjMsOwiAQRf-FtSEwNDxcuvcbyDADUjWQlHZl_Hdt0oVu7znnvkTEba1xG3mJM4uz0OL0uyWkR2474Du2W5fU27rMSe6KPOiQ1875eTncv4OKo35rQG28scFYQ1CKdgkosSLGHEAFDEhpAl1g8h4SOnCsivHWAXvFXov3B90oN5Y:1ru9ae:W7JmlPrRPUEh3L90yGzSprzqbfoWhakfhznfGcp40L0','2024-04-23 11:24:36.606852'),('r774euy2kcagfw1gpemcaxwg8kx0fspd','.eJxVjMsOwiAQRf-FtSEwNDxcuvcbyDADUjWQlHZl_Hdt0oVu7znnvkTEba1xG3mJM4uz0OL0uyWkR2474Du2W5fU27rMSe6KPOiQ1875eTncv4OKo35rQG28scFYQ1CKdgkosSLGHEAFDEhpAl1g8h4SOnCsivHWAXvFXov3B90oN5Y:1rnnLk:pI-04V8GrJXMEq-rmMD7JGmNjjDt7Z-tJUIuzKe4_PA','2024-04-05 22:26:56.060609'),('v4v83r3ko9kwg6556vhze1rjb1c14oqz','.eJxVjMsOwiAQRf-FtSEwNDxcuvcbyDADUjWQlHZl_Hdt0oVu7znnvkTEba1xG3mJM4uz0OL0uyWkR2474Du2W5fU27rMSe6KPOiQ1875eTncv4OKo35rQG28scFYQ1CKdgkosSLGHEAFDEhpAl1g8h4SOnCsivHWAXvFXov3B90oN5Y:1rnlxq:kjPHb5fgsbP4VgrXPgfSolYRWswcsOdf-m_c-Lnc7eE','2024-04-05 20:58:10.149176');
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HealthManagementApp_advices`
--

DROP TABLE IF EXISTS `HealthManagementApp_advices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HealthManagementApp_advices` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HealthManagementApp_advices`
--

LOCK TABLES `HealthManagementApp_advices` WRITE;
/*!40000 ALTER TABLE `HealthManagementApp_advices` DISABLE KEYS */;
/*!40000 ALTER TABLE `HealthManagementApp_advices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HealthManagementApp_customuser`
--

DROP TABLE IF EXISTS `HealthManagementApp_customuser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HealthManagementApp_customuser` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `middle_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `role` varchar(50) NOT NULL,
  `doctor_id` bigint DEFAULT NULL,
  `patient_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `doctor_id` (`doctor_id`),
  UNIQUE KEY `patient_id` (`patient_id`),
  CONSTRAINT `HealthManagementApp__doctor_id_c450a0d0_fk_HealthMan` FOREIGN KEY (`doctor_id`) REFERENCES `HealthManagementApp_doctor` (`user_id`),
  CONSTRAINT `HealthManagementApp__patient_id_b4dae0b4_fk_HealthMan` FOREIGN KEY (`patient_id`) REFERENCES `HealthManagementApp_patient` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HealthManagementApp_customuser`
--

LOCK TABLES `HealthManagementApp_customuser` WRITE;
/*!40000 ALTER TABLE `HealthManagementApp_customuser` DISABLE KEYS */;
INSERT INTO `HealthManagementApp_customuser` VALUES (1,'pbkdf2_sha256$600000$hdeEbd0GCIBBSUpfc3523C$3HkFg9rEnF1p3FVO97Pa5UM5N8gNBwHcGhgR1iecVCE=','2024-04-09 11:24:36.569350',1,'2024-03-20 01:38:52.834163','Musa',NULL,'Jibrin','mukhtar162@hotmail.com',NULL,1,1,'admin',NULL,NULL),(2,'pbkdf2_sha256$600000$RVgYGtvNiI7IGRl5KMaIxZ$qHpJEmvBMYKkLgWiqvUGpRKQR9wZSLsn01hTZ2959PM=',NULL,0,'2024-03-20 05:29:59.353671','Mukhtar','','Ali','mukhtar152@aol.com','Doctor',1,0,'patient',NULL,NULL),(8,'pbkdf2_sha256$600000$1MThWph19JNHMNJItZxgAw$c314Pfv3d4RkN5l0Liplyr41hPNpimYvdx3HON8g3Lg=',NULL,0,'2024-03-20 21:09:23.374137','Usman','','Ali','mmjn1@student.le.ac.uk','Patient',1,0,'patient',NULL,NULL),(14,'pbkdf2_sha256$600000$kpYkshG9gYeL6ROY9kFSJY$iMR8UCp94Mft/u7Ox0Yw+Ma0XtYQV2Bt+k4SBt98EtM=',NULL,0,'2024-04-02 15:40:31.938513','Ali','','Mahmoud','ngalahd@gmail.com','Patient',0,0,'patient',NULL,NULL);
/*!40000 ALTER TABLE `HealthManagementApp_customuser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HealthManagementApp_customuser_groups`
--

DROP TABLE IF EXISTS `HealthManagementApp_customuser_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HealthManagementApp_customuser_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `customuser_id` bigint NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `HealthManagementApp_cust_customuser_id_group_id_79f07989_uniq` (`customuser_id`,`group_id`),
  KEY `HealthManagementApp__group_id_bad830ec_fk_auth_grou` (`group_id`),
  CONSTRAINT `HealthManagementApp__customuser_id_af3ce515_fk_HealthMan` FOREIGN KEY (`customuser_id`) REFERENCES `HealthManagementApp_customuser` (`id`),
  CONSTRAINT `HealthManagementApp__group_id_bad830ec_fk_auth_grou` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HealthManagementApp_customuser_groups`
--

LOCK TABLES `HealthManagementApp_customuser_groups` WRITE;
/*!40000 ALTER TABLE `HealthManagementApp_customuser_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `HealthManagementApp_customuser_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HealthManagementApp_customuser_user_permissions`
--

DROP TABLE IF EXISTS `HealthManagementApp_customuser_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HealthManagementApp_customuser_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `customuser_id` bigint NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `HealthManagementApp_cust_customuser_id_permission_11f09c85_uniq` (`customuser_id`,`permission_id`),
  KEY `HealthManagementApp__permission_id_b57eb54b_fk_auth_perm` (`permission_id`),
  CONSTRAINT `HealthManagementApp__customuser_id_7ec2e3a9_fk_HealthMan` FOREIGN KEY (`customuser_id`) REFERENCES `HealthManagementApp_customuser` (`id`),
  CONSTRAINT `HealthManagementApp__permission_id_b57eb54b_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HealthManagementApp_customuser_user_permissions`
--

LOCK TABLES `HealthManagementApp_customuser_user_permissions` WRITE;
/*!40000 ALTER TABLE `HealthManagementApp_customuser_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `HealthManagementApp_customuser_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HealthManagementApp_diagnoses`
--

DROP TABLE IF EXISTS `HealthManagementApp_diagnoses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HealthManagementApp_diagnoses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HealthManagementApp_diagnoses`
--

LOCK TABLES `HealthManagementApp_diagnoses` WRITE;
/*!40000 ALTER TABLE `HealthManagementApp_diagnoses` DISABLE KEYS */;
/*!40000 ALTER TABLE `HealthManagementApp_diagnoses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HealthManagementApp_doctor`
--

DROP TABLE IF EXISTS `HealthManagementApp_doctor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HealthManagementApp_doctor` (
  `user_id` bigint NOT NULL,
  `speciality` varchar(50) DEFAULT NULL,
  `years_of_experience` varchar(50) DEFAULT NULL,
  `year_of_issue` varchar(50) DEFAULT NULL,
  `diabetes_management_experience` longtext,
  `treatment_approach` longtext,
  `contact_hours` varchar(50) DEFAULT NULL,
  `tel_number` varchar(50) DEFAULT NULL,
  `emergency_consultations` varchar(50) DEFAULT NULL,
  `medical_license_id` bigint DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `medical_license_id` (`medical_license_id`),
  CONSTRAINT `HealthManagementApp__medical_license_id_61e87cea_fk_HealthMan` FOREIGN KEY (`medical_license_id`) REFERENCES `HealthManagementApp_medicallicense` (`id`),
  CONSTRAINT `HealthManagementApp__user_id_e4fe1b59_fk_HealthMan` FOREIGN KEY (`user_id`) REFERENCES `HealthManagementApp_customuser` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HealthManagementApp_doctor`
--

LOCK TABLES `HealthManagementApp_doctor` WRITE;
/*!40000 ALTER TABLE `HealthManagementApp_doctor` DISABLE KEYS */;
INSERT INTO `HealthManagementApp_doctor` VALUES (2,'Endocrinology','23','2001','Extensive experience in managing over 35 diabetics','One on one approach','Monday-Friday, 8AM-4PM','0393299999','Yes',8);
/*!40000 ALTER TABLE `HealthManagementApp_doctor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HealthManagementApp_doctorappointment`
--

DROP TABLE IF EXISTS `HealthManagementApp_doctorappointment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HealthManagementApp_doctorappointment` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `appointment_date` date NOT NULL,
  `start_time` time(6) NOT NULL,
  `end_time` time(6) NOT NULL,
  `reason_for_visit` longtext NOT NULL,
  `appointment_type` varchar(20) NOT NULL,
  `patient_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `HealthManagementApp__patient_id_e2031fe1_fk_HealthMan` (`patient_id`),
  CONSTRAINT `HealthManagementApp__patient_id_e2031fe1_fk_HealthMan` FOREIGN KEY (`patient_id`) REFERENCES `HealthManagementApp_patient` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HealthManagementApp_doctorappointment`
--

LOCK TABLES `HealthManagementApp_doctorappointment` WRITE;
/*!40000 ALTER TABLE `HealthManagementApp_doctorappointment` DISABLE KEYS */;
/*!40000 ALTER TABLE `HealthManagementApp_doctorappointment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HealthManagementApp_drugs`
--

DROP TABLE IF EXISTS `HealthManagementApp_drugs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HealthManagementApp_drugs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `frequency` varchar(200) DEFAULT NULL,
  `Time_of_day` varchar(200) DEFAULT NULL,
  `duration` varchar(200) DEFAULT NULL,
  `dosage` varchar(50) NOT NULL,
  `Medical_name_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `HealthManagementApp__Medical_name_id_e7a0e559_fk_HealthMan` (`Medical_name_id`),
  CONSTRAINT `HealthManagementApp__Medical_name_id_e7a0e559_fk_HealthMan` FOREIGN KEY (`Medical_name_id`) REFERENCES `HealthManagementApp_medicine` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HealthManagementApp_drugs`
--

LOCK TABLES `HealthManagementApp_drugs` WRITE;
/*!40000 ALTER TABLE `HealthManagementApp_drugs` DISABLE KEYS */;
/*!40000 ALTER TABLE `HealthManagementApp_drugs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HealthManagementApp_field`
--

DROP TABLE IF EXISTS `HealthManagementApp_field`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HealthManagementApp_field` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `label` varchar(255) NOT NULL,
  `field_type` varchar(50) NOT NULL,
  `section_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `HealthManagementApp__section_id_595b7b67_fk_HealthMan` (`section_id`),
  CONSTRAINT `HealthManagementApp__section_id_595b7b67_fk_HealthMan` FOREIGN KEY (`section_id`) REFERENCES `HealthManagementApp_section` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HealthManagementApp_field`
--

LOCK TABLES `HealthManagementApp_field` WRITE;
/*!40000 ALTER TABLE `HealthManagementApp_field` DISABLE KEYS */;
INSERT INTO `HealthManagementApp_field` VALUES (79,'Fasting Blood Sugar','text',41),(80,'Have you experienced high blood pressure','radio',41);
/*!40000 ALTER TABLE `HealthManagementApp_field` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HealthManagementApp_fieldchoice`
--

DROP TABLE IF EXISTS `HealthManagementApp_fieldchoice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HealthManagementApp_fieldchoice` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `choice_text` varchar(255) NOT NULL,
  `field_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `HealthManagementApp__field_id_e10ddc09_fk_HealthMan` (`field_id`),
  CONSTRAINT `HealthManagementApp__field_id_e10ddc09_fk_HealthMan` FOREIGN KEY (`field_id`) REFERENCES `HealthManagementApp_field` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HealthManagementApp_fieldchoice`
--

LOCK TABLES `HealthManagementApp_fieldchoice` WRITE;
/*!40000 ALTER TABLE `HealthManagementApp_fieldchoice` DISABLE KEYS */;
INSERT INTO `HealthManagementApp_fieldchoice` VALUES (40,'Yes',80),(41,'No',80);
/*!40000 ALTER TABLE `HealthManagementApp_fieldchoice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HealthManagementApp_fieldresponse`
--

DROP TABLE IF EXISTS `HealthManagementApp_fieldresponse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HealthManagementApp_fieldresponse` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `value` longtext NOT NULL,
  `field_id` bigint NOT NULL,
  `form_response_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `HealthManagementApp__field_id_ce58adca_fk_HealthMan` (`field_id`),
  KEY `HealthManagementApp__form_response_id_7da5900e_fk_HealthMan` (`form_response_id`),
  CONSTRAINT `HealthManagementApp__field_id_ce58adca_fk_HealthMan` FOREIGN KEY (`field_id`) REFERENCES `HealthManagementApp_field` (`id`),
  CONSTRAINT `HealthManagementApp__form_response_id_7da5900e_fk_HealthMan` FOREIGN KEY (`form_response_id`) REFERENCES `HealthManagementApp_formresponse` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HealthManagementApp_fieldresponse`
--

LOCK TABLES `HealthManagementApp_fieldresponse` WRITE;
/*!40000 ALTER TABLE `HealthManagementApp_fieldresponse` DISABLE KEYS */;
INSERT INTO `HealthManagementApp_fieldresponse` VALUES (7,'128',79,11),(8,'No',80,11);
/*!40000 ALTER TABLE `HealthManagementApp_fieldresponse` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HealthManagementApp_followups`
--

DROP TABLE IF EXISTS `HealthManagementApp_followups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HealthManagementApp_followups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HealthManagementApp_followups`
--

LOCK TABLES `HealthManagementApp_followups` WRITE;
/*!40000 ALTER TABLE `HealthManagementApp_followups` DISABLE KEYS */;
/*!40000 ALTER TABLE `HealthManagementApp_followups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HealthManagementApp_form`
--

DROP TABLE IF EXISTS `HealthManagementApp_form`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HealthManagementApp_form` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `doctor_id` bigint NOT NULL,
  `patient_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `HealthManagementApp__doctor_id_cfada6e3_fk_HealthMan` (`doctor_id`),
  KEY `HealthManagementApp__patient_id_1054fd97_fk_HealthMan` (`patient_id`),
  CONSTRAINT `HealthManagementApp__doctor_id_cfada6e3_fk_HealthMan` FOREIGN KEY (`doctor_id`) REFERENCES `HealthManagementApp_doctor` (`user_id`),
  CONSTRAINT `HealthManagementApp__patient_id_1054fd97_fk_HealthMan` FOREIGN KEY (`patient_id`) REFERENCES `HealthManagementApp_patient` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HealthManagementApp_form`
--

LOCK TABLES `HealthManagementApp_form` WRITE;
/*!40000 ALTER TABLE `HealthManagementApp_form` DISABLE KEYS */;
INSERT INTO `HealthManagementApp_form` VALUES (18,'Monthly Progress Update for February',2,8);
/*!40000 ALTER TABLE `HealthManagementApp_form` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HealthManagementApp_formresponse`
--

DROP TABLE IF EXISTS `HealthManagementApp_formresponse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HealthManagementApp_formresponse` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `doctor_id` bigint NOT NULL,
  `form_id` bigint NOT NULL,
  `patient_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `HealthManagementApp__doctor_id_b03a91cb_fk_HealthMan` (`doctor_id`),
  KEY `HealthManagementApp__form_id_86e7a1ed_fk_HealthMan` (`form_id`),
  KEY `HealthManagementApp__patient_id_44f707d7_fk_HealthMan` (`patient_id`),
  CONSTRAINT `HealthManagementApp__doctor_id_b03a91cb_fk_HealthMan` FOREIGN KEY (`doctor_id`) REFERENCES `HealthManagementApp_doctor` (`user_id`),
  CONSTRAINT `HealthManagementApp__form_id_86e7a1ed_fk_HealthMan` FOREIGN KEY (`form_id`) REFERENCES `HealthManagementApp_form` (`id`),
  CONSTRAINT `HealthManagementApp__patient_id_44f707d7_fk_HealthMan` FOREIGN KEY (`patient_id`) REFERENCES `HealthManagementApp_patient` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HealthManagementApp_formresponse`
--

LOCK TABLES `HealthManagementApp_formresponse` WRITE;
/*!40000 ALTER TABLE `HealthManagementApp_formresponse` DISABLE KEYS */;
INSERT INTO `HealthManagementApp_formresponse` VALUES (11,'2024-04-04 17:45:49.116712',2,18,8);
/*!40000 ALTER TABLE `HealthManagementApp_formresponse` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HealthManagementApp_histories`
--

DROP TABLE IF EXISTS `HealthManagementApp_histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HealthManagementApp_histories` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HealthManagementApp_histories`
--

LOCK TABLES `HealthManagementApp_histories` WRITE;
/*!40000 ALTER TABLE `HealthManagementApp_histories` DISABLE KEYS */;
/*!40000 ALTER TABLE `HealthManagementApp_histories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HealthManagementApp_medicallicense`
--

DROP TABLE IF EXISTS `HealthManagementApp_medicallicense`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HealthManagementApp_medicallicense` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `license_number` varchar(50) NOT NULL,
  `location` varchar(50) NOT NULL,
  `doctor_initials` varchar(50) NOT NULL,
  `is_valid` tinyint(1) NOT NULL,
  `gmc_registration_date` date DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `complaints_history` longtext,
  `last_review_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `license_number` (`license_number`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HealthManagementApp_medicallicense`
--

LOCK TABLES `HealthManagementApp_medicallicense` WRITE;
/*!40000 ALTER TABLE `HealthManagementApp_medicallicense` DISABLE KEYS */;
INSERT INTO `HealthManagementApp_medicallicense` VALUES (1,'LE4343GL','Leicester','GL',1,'2000-04-09','2023-12-21','','2026-04-22'),(2,'LE4344EM','Leicester','EM',1,'2015-04-19','2028-05-03','','2023-10-21'),(3,'LE4345PN','Leicester','PN',1,'1994-09-25','2025-05-04','','2023-10-21'),(4,'LE4346YM','Leicester','YM',1,'2012-12-08','2028-07-25','','2023-05-15'),(5,'LE4347LX','Leicester','LX',1,'2009-03-08','2026-06-30','','2023-11-20'),(6,'LE4348HW','Leicester','HW',1,'2008-03-18','2026-06-01','','2023-08-10'),(7,'LE4349PS','Leicester','PS',1,'2006-11-10','2025-09-18','','2023-06-06'),(8,'LE4350MA','Leicester','MA',1,'2018-01-25','2025-05-11','','2023-04-14');
/*!40000 ALTER TABLE `HealthManagementApp_medicallicense` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HealthManagementApp_medicine`
--

DROP TABLE IF EXISTS `HealthManagementApp_medicine`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HealthManagementApp_medicine` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `salt_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `HealthManagementApp__salt_id_cef73477_fk_HealthMan` (`salt_id`),
  CONSTRAINT `HealthManagementApp__salt_id_cef73477_fk_HealthMan` FOREIGN KEY (`salt_id`) REFERENCES `HealthManagementApp_salt` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HealthManagementApp_medicine`
--

LOCK TABLES `HealthManagementApp_medicine` WRITE;
/*!40000 ALTER TABLE `HealthManagementApp_medicine` DISABLE KEYS */;
/*!40000 ALTER TABLE `HealthManagementApp_medicine` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HealthManagementApp_patient`
--

DROP TABLE IF EXISTS `HealthManagementApp_patient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HealthManagementApp_patient` (
  `user_id` bigint NOT NULL,
  `current_diabetes_medication` longtext,
  `dietary_habits` longtext,
  `type_of_diabetes` varchar(50) DEFAULT NULL,
  `date_of_diagnosis` date DEFAULT NULL,
  `blood_sugar_level` int DEFAULT NULL,
  `target_blood_sugar_level` int DEFAULT NULL,
  `family_medical_history` longtext,
  `medical_history` longtext,
  `medication_adherence` longtext,
  `physical_activity_level` longtext,
  `smoking_habits` varchar(50) DEFAULT NULL,
  `alcohol_consumption` varchar(50) DEFAULT NULL,
  `Email` varchar(254) DEFAULT NULL,
  `Mobile` varchar(50) DEFAULT NULL,
  `age` int DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` varchar(50) NOT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `HealthManagementApp__user_id_d2721ae6_fk_HealthMan` FOREIGN KEY (`user_id`) REFERENCES `HealthManagementApp_customuser` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HealthManagementApp_patient`
--

LOCK TABLES `HealthManagementApp_patient` WRITE;
/*!40000 ALTER TABLE `HealthManagementApp_patient` DISABLE KEYS */;
INSERT INTO `HealthManagementApp_patient` VALUES (8,'Metformin','Vegetarian','Type 2','2024-02-06',123,150,'No','High blood pressure','Always','Moderate','No','No',NULL,NULL,NULL,NULL,'Other'),(14,'RR','Vegan','Type 2','2022-03-16',122,135,'Uncle had Type 2 Diabetes','High Blood Pressure','Always','Moderate','No','No',NULL,NULL,NULL,NULL,'Other');
/*!40000 ALTER TABLE `HealthManagementApp_patient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HealthManagementApp_patient_doctors`
--

DROP TABLE IF EXISTS `HealthManagementApp_patient_doctors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HealthManagementApp_patient_doctors` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `patient_id` bigint NOT NULL,
  `doctor_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `HealthManagementApp_pati_patient_id_doctor_id_a3bbd68a_uniq` (`patient_id`,`doctor_id`),
  KEY `HealthManagementApp__doctor_id_8220026e_fk_HealthMan` (`doctor_id`),
  CONSTRAINT `HealthManagementApp__doctor_id_8220026e_fk_HealthMan` FOREIGN KEY (`doctor_id`) REFERENCES `HealthManagementApp_doctor` (`user_id`),
  CONSTRAINT `HealthManagementApp__patient_id_96c4cce3_fk_HealthMan` FOREIGN KEY (`patient_id`) REFERENCES `HealthManagementApp_patient` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HealthManagementApp_patient_doctors`
--

LOCK TABLES `HealthManagementApp_patient_doctors` WRITE;
/*!40000 ALTER TABLE `HealthManagementApp_patient_doctors` DISABLE KEYS */;
INSERT INTO `HealthManagementApp_patient_doctors` VALUES (2,8,2),(3,14,2);
/*!40000 ALTER TABLE `HealthManagementApp_patient_doctors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HealthManagementApp_patientappointment`
--

DROP TABLE IF EXISTS `HealthManagementApp_patientappointment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HealthManagementApp_patientappointment` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `appointment_date` date NOT NULL,
  `reason_for_appointment` longtext NOT NULL,
  `appointment_type` varchar(20) NOT NULL,
  `time_slot_id` bigint DEFAULT NULL,
  `doctor_id` bigint NOT NULL,
  `patient_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `HealthManagementApp__time_slot_id_b208f864_fk_HealthMan` (`time_slot_id`),
  KEY `HealthManagementApp__doctor_id_abdd40f5_fk_HealthMan` (`doctor_id`),
  KEY `HealthManagementApp__patient_id_d25db824_fk_HealthMan` (`patient_id`),
  CONSTRAINT `HealthManagementApp__doctor_id_abdd40f5_fk_HealthMan` FOREIGN KEY (`doctor_id`) REFERENCES `HealthManagementApp_doctor` (`user_id`),
  CONSTRAINT `HealthManagementApp__patient_id_d25db824_fk_HealthMan` FOREIGN KEY (`patient_id`) REFERENCES `HealthManagementApp_patient` (`user_id`),
  CONSTRAINT `HealthManagementApp__time_slot_id_b208f864_fk_HealthMan` FOREIGN KEY (`time_slot_id`) REFERENCES `HealthManagementApp_timeslot` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HealthManagementApp_patientappointment`
--

LOCK TABLES `HealthManagementApp_patientappointment` WRITE;
/*!40000 ALTER TABLE `HealthManagementApp_patientappointment` DISABLE KEYS */;
INSERT INTO `HealthManagementApp_patientappointment` VALUES (29,'2024-03-26','e3f3','Follow-up',2,2,8),(30,'2024-04-02','rhrthr','Follow-up',4,2,8),(32,'2024-04-03','jknkjnkj','Initial Consultation',7,2,8);
/*!40000 ALTER TABLE `HealthManagementApp_patientappointment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HealthManagementApp_prescription`
--

DROP TABLE IF EXISTS `HealthManagementApp_prescription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HealthManagementApp_prescription` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `reason_for_medication` longtext,
  `notes` longtext,
  `intake_instructions` varchar(100) DEFAULT NULL,
  `start_date` datetime(6) NOT NULL,
  `end_date` date DEFAULT NULL,
  `refill_count` int DEFAULT NULL,
  `last_refilled_date` date DEFAULT NULL,
  `refill_request_pending` tinyint(1) NOT NULL,
  `prescription_approved` tinyint(1) NOT NULL,
  `refill_requested` tinyint(1) NOT NULL,
  `patient_id` bigint DEFAULT NULL,
  `prescribing_doctor_id` bigint DEFAULT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `HealthManagementApp__patient_id_7ba69535_fk_HealthMan` (`patient_id`),
  KEY `HealthManagementApp__prescribing_doctor_i_c18249ea_fk_HealthMan` (`prescribing_doctor_id`),
  CONSTRAINT `HealthManagementApp__patient_id_7ba69535_fk_HealthMan` FOREIGN KEY (`patient_id`) REFERENCES `HealthManagementApp_patient` (`user_id`),
  CONSTRAINT `HealthManagementApp__prescribing_doctor_i_c18249ea_fk_HealthMan` FOREIGN KEY (`prescribing_doctor_id`) REFERENCES `HealthManagementApp_doctor` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HealthManagementApp_prescription`
--

LOCK TABLES `HealthManagementApp_prescription` WRITE;
/*!40000 ALTER TABLE `HealthManagementApp_prescription` DISABLE KEYS */;
/*!40000 ALTER TABLE `HealthManagementApp_prescription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HealthManagementApp_prescription_Advices`
--

DROP TABLE IF EXISTS `HealthManagementApp_prescription_Advices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HealthManagementApp_prescription_Advices` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `prescription_id` bigint NOT NULL,
  `advices_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `HealthManagementApp_pres_prescription_id_advices__d86198fb_uniq` (`prescription_id`,`advices_id`),
  KEY `HealthManagementApp__advices_id_f5cc2c13_fk_HealthMan` (`advices_id`),
  CONSTRAINT `HealthManagementApp__advices_id_f5cc2c13_fk_HealthMan` FOREIGN KEY (`advices_id`) REFERENCES `HealthManagementApp_advices` (`id`),
  CONSTRAINT `HealthManagementApp__prescription_id_28bf0303_fk_HealthMan` FOREIGN KEY (`prescription_id`) REFERENCES `HealthManagementApp_prescription` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HealthManagementApp_prescription_Advices`
--

LOCK TABLES `HealthManagementApp_prescription_Advices` WRITE;
/*!40000 ALTER TABLE `HealthManagementApp_prescription_Advices` DISABLE KEYS */;
/*!40000 ALTER TABLE `HealthManagementApp_prescription_Advices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HealthManagementApp_prescription_Diagnoses`
--

DROP TABLE IF EXISTS `HealthManagementApp_prescription_Diagnoses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HealthManagementApp_prescription_Diagnoses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `prescription_id` bigint NOT NULL,
  `diagnoses_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `HealthManagementApp_pres_prescription_id_diagnose_c861d9b7_uniq` (`prescription_id`,`diagnoses_id`),
  KEY `HealthManagementApp__diagnoses_id_08d33bda_fk_HealthMan` (`diagnoses_id`),
  CONSTRAINT `HealthManagementApp__diagnoses_id_08d33bda_fk_HealthMan` FOREIGN KEY (`diagnoses_id`) REFERENCES `HealthManagementApp_diagnoses` (`id`),
  CONSTRAINT `HealthManagementApp__prescription_id_cdfc29b8_fk_HealthMan` FOREIGN KEY (`prescription_id`) REFERENCES `HealthManagementApp_prescription` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HealthManagementApp_prescription_Diagnoses`
--

LOCK TABLES `HealthManagementApp_prescription_Diagnoses` WRITE;
/*!40000 ALTER TABLE `HealthManagementApp_prescription_Diagnoses` DISABLE KEYS */;
/*!40000 ALTER TABLE `HealthManagementApp_prescription_Diagnoses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HealthManagementApp_prescription_Drug`
--

DROP TABLE IF EXISTS `HealthManagementApp_prescription_Drug`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HealthManagementApp_prescription_Drug` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `prescription_id` bigint NOT NULL,
  `drugs_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `HealthManagementApp_pres_prescription_id_drugs_id_26d530aa_uniq` (`prescription_id`,`drugs_id`),
  KEY `HealthManagementApp__drugs_id_08046404_fk_HealthMan` (`drugs_id`),
  CONSTRAINT `HealthManagementApp__drugs_id_08046404_fk_HealthMan` FOREIGN KEY (`drugs_id`) REFERENCES `HealthManagementApp_drugs` (`id`),
  CONSTRAINT `HealthManagementApp__prescription_id_984067d7_fk_HealthMan` FOREIGN KEY (`prescription_id`) REFERENCES `HealthManagementApp_prescription` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HealthManagementApp_prescription_Drug`
--

LOCK TABLES `HealthManagementApp_prescription_Drug` WRITE;
/*!40000 ALTER TABLE `HealthManagementApp_prescription_Drug` DISABLE KEYS */;
/*!40000 ALTER TABLE `HealthManagementApp_prescription_Drug` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HealthManagementApp_prescription_FollowUps`
--

DROP TABLE IF EXISTS `HealthManagementApp_prescription_FollowUps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HealthManagementApp_prescription_FollowUps` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `prescription_id` bigint NOT NULL,
  `followups_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `HealthManagementApp_pres_prescription_id_followup_6dc7592e_uniq` (`prescription_id`,`followups_id`),
  KEY `HealthManagementApp__followups_id_791de3db_fk_HealthMan` (`followups_id`),
  CONSTRAINT `HealthManagementApp__followups_id_791de3db_fk_HealthMan` FOREIGN KEY (`followups_id`) REFERENCES `HealthManagementApp_followups` (`id`),
  CONSTRAINT `HealthManagementApp__prescription_id_ddf01d6e_fk_HealthMan` FOREIGN KEY (`prescription_id`) REFERENCES `HealthManagementApp_prescription` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HealthManagementApp_prescription_FollowUps`
--

LOCK TABLES `HealthManagementApp_prescription_FollowUps` WRITE;
/*!40000 ALTER TABLE `HealthManagementApp_prescription_FollowUps` DISABLE KEYS */;
/*!40000 ALTER TABLE `HealthManagementApp_prescription_FollowUps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HealthManagementApp_prescription_Histories`
--

DROP TABLE IF EXISTS `HealthManagementApp_prescription_Histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HealthManagementApp_prescription_Histories` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `prescription_id` bigint NOT NULL,
  `histories_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `HealthManagementApp_pres_prescription_id_historie_d9a5c5f1_uniq` (`prescription_id`,`histories_id`),
  KEY `HealthManagementApp__histories_id_b47c4913_fk_HealthMan` (`histories_id`),
  CONSTRAINT `HealthManagementApp__histories_id_b47c4913_fk_HealthMan` FOREIGN KEY (`histories_id`) REFERENCES `HealthManagementApp_histories` (`id`),
  CONSTRAINT `HealthManagementApp__prescription_id_771a3383_fk_HealthMan` FOREIGN KEY (`prescription_id`) REFERENCES `HealthManagementApp_prescription` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HealthManagementApp_prescription_Histories`
--

LOCK TABLES `HealthManagementApp_prescription_Histories` WRITE;
/*!40000 ALTER TABLE `HealthManagementApp_prescription_Histories` DISABLE KEYS */;
/*!40000 ALTER TABLE `HealthManagementApp_prescription_Histories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HealthManagementApp_prescription_Symptoms`
--

DROP TABLE IF EXISTS `HealthManagementApp_prescription_Symptoms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HealthManagementApp_prescription_Symptoms` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `prescription_id` bigint NOT NULL,
  `symptoms_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `HealthManagementApp_pres_prescription_id_symptoms_ca0e7bef_uniq` (`prescription_id`,`symptoms_id`),
  KEY `HealthManagementApp__symptoms_id_28313f2d_fk_HealthMan` (`symptoms_id`),
  CONSTRAINT `HealthManagementApp__prescription_id_7f17b805_fk_HealthMan` FOREIGN KEY (`prescription_id`) REFERENCES `HealthManagementApp_prescription` (`id`),
  CONSTRAINT `HealthManagementApp__symptoms_id_28313f2d_fk_HealthMan` FOREIGN KEY (`symptoms_id`) REFERENCES `HealthManagementApp_symptoms` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HealthManagementApp_prescription_Symptoms`
--

LOCK TABLES `HealthManagementApp_prescription_Symptoms` WRITE;
/*!40000 ALTER TABLE `HealthManagementApp_prescription_Symptoms` DISABLE KEYS */;
/*!40000 ALTER TABLE `HealthManagementApp_prescription_Symptoms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HealthManagementApp_prescription_Tests`
--

DROP TABLE IF EXISTS `HealthManagementApp_prescription_Tests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HealthManagementApp_prescription_Tests` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `prescription_id` bigint NOT NULL,
  `tests_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `HealthManagementApp_pres_prescription_id_tests_id_0bea013a_uniq` (`prescription_id`,`tests_id`),
  KEY `HealthManagementApp__tests_id_7215c2ba_fk_HealthMan` (`tests_id`),
  CONSTRAINT `HealthManagementApp__prescription_id_212f62de_fk_HealthMan` FOREIGN KEY (`prescription_id`) REFERENCES `HealthManagementApp_prescription` (`id`),
  CONSTRAINT `HealthManagementApp__tests_id_7215c2ba_fk_HealthMan` FOREIGN KEY (`tests_id`) REFERENCES `HealthManagementApp_tests` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HealthManagementApp_prescription_Tests`
--

LOCK TABLES `HealthManagementApp_prescription_Tests` WRITE;
/*!40000 ALTER TABLE `HealthManagementApp_prescription_Tests` DISABLE KEYS */;
/*!40000 ALTER TABLE `HealthManagementApp_prescription_Tests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HealthManagementApp_prescription_Vitals`
--

DROP TABLE IF EXISTS `HealthManagementApp_prescription_Vitals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HealthManagementApp_prescription_Vitals` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `prescription_id` bigint NOT NULL,
  `vitals_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `HealthManagementApp_pres_prescription_id_vitals_i_d0fb6184_uniq` (`prescription_id`,`vitals_id`),
  KEY `HealthManagementApp__vitals_id_9faf647f_fk_HealthMan` (`vitals_id`),
  CONSTRAINT `HealthManagementApp__prescription_id_44307608_fk_HealthMan` FOREIGN KEY (`prescription_id`) REFERENCES `HealthManagementApp_prescription` (`id`),
  CONSTRAINT `HealthManagementApp__vitals_id_9faf647f_fk_HealthMan` FOREIGN KEY (`vitals_id`) REFERENCES `HealthManagementApp_vitals` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HealthManagementApp_prescription_Vitals`
--

LOCK TABLES `HealthManagementApp_prescription_Vitals` WRITE;
/*!40000 ALTER TABLE `HealthManagementApp_prescription_Vitals` DISABLE KEYS */;
/*!40000 ALTER TABLE `HealthManagementApp_prescription_Vitals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HealthManagementApp_role`
--

DROP TABLE IF EXISTS `HealthManagementApp_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HealthManagementApp_role` (
  `role_id` smallint unsigned NOT NULL,
  PRIMARY KEY (`role_id`),
  CONSTRAINT `healthmanagementapp_role_chk_1` CHECK ((`role_id` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HealthManagementApp_role`
--

LOCK TABLES `HealthManagementApp_role` WRITE;
/*!40000 ALTER TABLE `HealthManagementApp_role` DISABLE KEYS */;
/*!40000 ALTER TABLE `HealthManagementApp_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HealthManagementApp_salt`
--

DROP TABLE IF EXISTS `HealthManagementApp_salt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HealthManagementApp_salt` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HealthManagementApp_salt`
--

LOCK TABLES `HealthManagementApp_salt` WRITE;
/*!40000 ALTER TABLE `HealthManagementApp_salt` DISABLE KEYS */;
/*!40000 ALTER TABLE `HealthManagementApp_salt` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HealthManagementApp_section`
--

DROP TABLE IF EXISTS `HealthManagementApp_section`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HealthManagementApp_section` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `form_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `HealthManagementApp__form_id_cd606735_fk_HealthMan` (`form_id`),
  CONSTRAINT `HealthManagementApp__form_id_cd606735_fk_HealthMan` FOREIGN KEY (`form_id`) REFERENCES `HealthManagementApp_form` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HealthManagementApp_section`
--

LOCK TABLES `HealthManagementApp_section` WRITE;
/*!40000 ALTER TABLE `HealthManagementApp_section` DISABLE KEYS */;
INSERT INTO `HealthManagementApp_section` VALUES (41,'Blood Sugar Levels',18);
/*!40000 ALTER TABLE `HealthManagementApp_section` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HealthManagementApp_supportinquiry`
--

DROP TABLE IF EXISTS `HealthManagementApp_supportinquiry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HealthManagementApp_supportinquiry` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(254) NOT NULL,
  `subject` varchar(100) NOT NULL,
  `message` longtext NOT NULL,
  `submitted_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HealthManagementApp_supportinquiry`
--

LOCK TABLES `HealthManagementApp_supportinquiry` WRITE;
/*!40000 ALTER TABLE `HealthManagementApp_supportinquiry` DISABLE KEYS */;
/*!40000 ALTER TABLE `HealthManagementApp_supportinquiry` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HealthManagementApp_symptoms`
--

DROP TABLE IF EXISTS `HealthManagementApp_symptoms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HealthManagementApp_symptoms` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HealthManagementApp_symptoms`
--

LOCK TABLES `HealthManagementApp_symptoms` WRITE;
/*!40000 ALTER TABLE `HealthManagementApp_symptoms` DISABLE KEYS */;
/*!40000 ALTER TABLE `HealthManagementApp_symptoms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HealthManagementApp_tests`
--

DROP TABLE IF EXISTS `HealthManagementApp_tests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HealthManagementApp_tests` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HealthManagementApp_tests`
--

LOCK TABLES `HealthManagementApp_tests` WRITE;
/*!40000 ALTER TABLE `HealthManagementApp_tests` DISABLE KEYS */;
/*!40000 ALTER TABLE `HealthManagementApp_tests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HealthManagementApp_timeslot`
--

DROP TABLE IF EXISTS `HealthManagementApp_timeslot`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HealthManagementApp_timeslot` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `start_time` time(6) NOT NULL,
  `end_time` time(6) NOT NULL,
  `location` varchar(255) NOT NULL,
  `is_available` tinyint(1) NOT NULL,
  `weekly_availability_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `HealthManagementApp_time_weekly_availability_id_s_cbf413c6_uniq` (`weekly_availability_id`,`start_time`,`end_time`,`location`),
  CONSTRAINT `HealthManagementApp__weekly_availability__24e12954_fk_HealthMan` FOREIGN KEY (`weekly_availability_id`) REFERENCES `HealthManagementApp_weeklyavailability` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HealthManagementApp_timeslot`
--

LOCK TABLES `HealthManagementApp_timeslot` WRITE;
/*!40000 ALTER TABLE `HealthManagementApp_timeslot` DISABLE KEYS */;
INSERT INTO `HealthManagementApp_timeslot` VALUES (1,'08:00:00.000000','08:15:00.000000','Victoria Park Health Centre',0,1),(2,'09:00:00.000000','10:00:00.000000','Victoria Park Health Centre',0,2),(4,'12:00:00.000000','12:15:00.000000','Victoria Park Health Centre',0,2),(7,'10:00:00.000000','10:30:00.000000','Victoria Park Health Centre',0,3);
/*!40000 ALTER TABLE `HealthManagementApp_timeslot` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HealthManagementApp_usermealentry`
--

DROP TABLE IF EXISTS `HealthManagementApp_usermealentry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HealthManagementApp_usermealentry` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_input` longtext NOT NULL,
  `ai_advice` longtext NOT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HealthManagementApp_usermealentry`
--

LOCK TABLES `HealthManagementApp_usermealentry` WRITE;
/*!40000 ALTER TABLE `HealthManagementApp_usermealentry` DISABLE KEYS */;
INSERT INTO `HealthManagementApp_usermealentry` VALUES (28,'brown rice with chicken nuggets','Brown rice is a whole grain that can help with blood sugar management. Chicken nuggets can be a good source of protein, but it\'s important to choose baked or grilled options instead of fried. Adding a side of vegetables for fiber and nutrients would make this meal more balanced.','2024-04-12 17:03:01.768259'),(29,'white rice and lentils with pepsi','White rice and lentils provide a good mix of carbohydrates and protein. The white rice may cause a quick rise in blood sugar, but the lentils can help to slow this down. Pepsi is high in sugar and may lead to a rapid increase in blood glucose levels. Consider switching to water or unsweetened tea to better manage blood sugar levels.','2024-04-12 17:20:51.995475');
/*!40000 ALTER TABLE `HealthManagementApp_usermealentry` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HealthManagementApp_vitals`
--

DROP TABLE IF EXISTS `HealthManagementApp_vitals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HealthManagementApp_vitals` (
  `date` date NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(200) DEFAULT NULL,
  `reading` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HealthManagementApp_vitals`
--

LOCK TABLES `HealthManagementApp_vitals` WRITE;
/*!40000 ALTER TABLE `HealthManagementApp_vitals` DISABLE KEYS */;
/*!40000 ALTER TABLE `HealthManagementApp_vitals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HealthManagementApp_weeklyavailability`
--

DROP TABLE IF EXISTS `HealthManagementApp_weeklyavailability`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HealthManagementApp_weeklyavailability` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `day_of_week` varchar(9) NOT NULL,
  `is_working` tinyint(1) NOT NULL,
  `doctor_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `HealthManagementApp_week_doctor_id_day_of_week_6dd3c25d_uniq` (`doctor_id`,`day_of_week`),
  CONSTRAINT `HealthManagementApp__doctor_id_87abb7a7_fk_HealthMan` FOREIGN KEY (`doctor_id`) REFERENCES `HealthManagementApp_doctor` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HealthManagementApp_weeklyavailability`
--

LOCK TABLES `HealthManagementApp_weeklyavailability` WRITE;
/*!40000 ALTER TABLE `HealthManagementApp_weeklyavailability` DISABLE KEYS */;
INSERT INTO `HealthManagementApp_weeklyavailability` VALUES (1,'Monday',1,2),(2,'Tuesday',1,2),(3,'Wednesday',1,2);
/*!40000 ALTER TABLE `HealthManagementApp_weeklyavailability` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-04-17 19:24:49
