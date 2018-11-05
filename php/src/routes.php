<?php

use Slim\Http\Request;
use Slim\Http\Response;
use GuzzleHttp\Client;

// Routes
$app->post('/auth/{user}/{password}', function (Request $request, Response $response, array $args) {
    $http = new GuzzleHttp\Client();
    $http_response = $http->post('https://emoncms.org/user/login.json', [
        'form_params' => [
            'username' => $args['user'],
            'password' => $args['password']
        ]
    ]);
    return $http_response;
});
