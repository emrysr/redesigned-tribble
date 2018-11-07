<?php
// Application middleware
// e.g: $app->add(new \Slim\Csrf\Guard);
if ($_ENV['mode'] !== 'production') {
    $app->add(new Tuupola\Middleware\CorsMiddleware([
        "origin" => ["http://localhost:8080"],
        "methods" => ["POST"],
        "credentials" => false,
        "cache" => 0,
        ]));
}