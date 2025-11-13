<?php
header('Content-Type: application/json');

try {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['file'])) {
        echo json_encode(["status" => "error", "message" => "No file payload"]);
        exit;
    }

    // ✅ Physics directory
    $root = $_SERVER['DOCUMENT_ROOT'] . "/DIGITAL_BOOK/Homepage/physics/Quiz";
    $dir  = $root . "/reports/quiz/";

    if (!is_dir($dir)) {
        mkdir($dir, 0777, true);
    }

    // find next index
    $files = array_values(array_filter(scandir($dir), function($f) use ($dir) {
        return preg_match('/^quiz_[0-9]+_report\.pdf$/', $f);
    }));

    $maxIndex = 0;
    foreach ($files as $f) {
        if (preg_match('/^quiz_([0-9]+)_report\.pdf$/', $f, $m)) {
            $idx = intval($m[1]);
            if ($idx > $maxIndex) $maxIndex = $idx;
        }
    }

    $nextIndex = $maxIndex + 1;
    $filename = "quiz_" . $nextIndex . "_report.pdf";
    $path = $dir . $filename;

    // Save file
    $raw = $data['file'];
    if (strpos($raw, ',') !== false) $raw = explode(',', $raw, 2)[1];
    $bytes = base64_decode($raw);

    file_put_contents($path, $bytes);

    echo json_encode(["status" => "success", "file" => $filename]);

} catch (Throwable $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
