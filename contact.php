<?php

if (isset($_POST['submit'])) {
    $to = "whatsapp:+919660551808"; // Replace with the recipient's phone number
    $name = $_POST['name'];
    $email = $_POST['email'];
    $subject = $_POST['subject'];
    $message = $_POST['message'];

    $url = "https://api.whatsapp.com/send?phone=" . $to . "&text=" . rawurlencode("Name: $name\nEmail: $email\nSubject: $subject\nMessage: $message");

    header("Location: $url");
    exit();
}

?>


