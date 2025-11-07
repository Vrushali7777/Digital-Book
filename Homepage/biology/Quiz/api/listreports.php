<?php
header('Content-Type: application/json');

$root = dirname(__DIR__);
$dir = $root . "/reports/quiz/";

if(!is_dir($dir)){
    echo json_encode([]);
    exit;
}

$files = array_values(array_filter(scandir($dir), function($f){
    return strtolower(pathinfo($f, PATHINFO_EXTENSION)) === "pdf";
}));

usort($files, function($a,$b) use($dir){
    return filemtime($dir.$b) <=> filemtime($dir.$a);
});

echo json_encode($files);
