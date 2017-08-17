<?php
    $json = $_POST['json'];
    $fp = fopen("weaponData.json", "w+"); // overwrite file, or create if it does not exist
    fwrite($fp, $json);
    fclose($fp);
?>