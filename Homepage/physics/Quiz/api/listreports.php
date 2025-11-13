<?php
header('Content-Type: application/json');

// ✅ Physics directory (not biology)
$root = $_SERVER['DOCUMENT_ROOT'] . "/DIGITAL_BOOK/Homepage/physics/Quiz";
$dir  = $root . "/reports/quiz/";

if (!is_dir($dir)) {
    echo json_encode([]);
    exit;
}

$files = array_values(array_filter(scandir($dir), function($f) use ($dir) {
    $ext = strtolower(pathinfo($f, PATHINFO_EXTENSION));
    return $ext === "pdf" && is_file($dir . $f);
}));

// Sort by number inside filename
usort($files, function ($a, $b) {
    preg_match('/(\d+)/', $a, $numA);
    preg_match('/(\d+)/', $b, $numB);
    $nA = $numA[1] ?? 999999;
    $nB = $numB[1] ?? 999999;
    return $nA <=> $nB;
});

echo json_encode($files);
