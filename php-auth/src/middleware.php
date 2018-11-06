<?php
// Application middleware

// e.g: $app->add(new \Slim\Csrf\Guard);
$app->add(new Tuupola\Middleware\CorsMiddleware([
    "origin" => ["http://localhost:8080"],
    "methods" => ["POST"],
    "credentials" => false,
    "cache" => 0,
]));