<?php



$username = $_POST['Name'];

$email = $_POST['E-mail'];

$article = $_POST['Contents'];


//the data

$data = "$username | $email |$article\n";



//open the file and choose the mode

$tosarthak = "sarthak12088@iiitd.ac.in";
$tomohit = "mohit13063@iiitd.ac.in";
$subject = "Site Reach Us | Esya'14";
$message = $data;
$from = $email;
$headers = "From:" . $from;
mail($tosarthak,$subject,$message,$headers);
mail($tomohit,$subject,$message,$headers);

$fh = fopen("./users.txt", "a");

file_put_contents($fh, $data);
//close the file

fclose($fh);



echo "User Submitted";



?>