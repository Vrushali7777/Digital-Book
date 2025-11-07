<?php
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);
if(!isset($data['file'])){
    echo json_encode(["status"=>"error","message"=>"No file"]);
    exit;
}

// Go up one directory (from /api/ to /Quiz1/)
$root = dirname(__DIR__); 

// Final path: Quiz1/reports/quiz/
$dir = $root . "/reports/quiz/";

if(!file_exists($dir)){
    mkdir($dir, 0777, true);
}

$filename = "Report_" . date("Ymd_His") . ".pdf";
$path = $dir . $filename;

file_put_contents($path, base64_decode($data['file']));

if(file_exists($path)){
    echo json_encode(["status"=>"success","file"=>$filename]);
} else {
    echo json_encode(["status"=>"error","message"=>"Failed to write file","path"=>$path]);
}
