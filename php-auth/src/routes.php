<?php

use Slim\Http\Request;
use Slim\Http\Response;
use GuzzleHttp\Client;

// Routes

// generic catch all...

// render the vuejs spa
$app->get('/[{path:.*}]', function (Request $request, Response $response) {
    if ($_ENV['mode'] === 'production') {
        return $this->renderer->render($response, 'index.html');
    } else {
        return $response->withStatus(302)->withHeader('Location', 'http://localhost:8080');
    }
});

// render the vuejs SPA
// call emoncms login script and return response
$app->post('/auth/{user}/{password}', function (Request $request, Response $response, array $args) {
    $http = new GuzzleHttp\Client();
    $http_response = $http->post('https://emoncms.org/user/auth.json', [
        'form_params' => [
            'username' => $args['user'],
            'password' => $args['password']
        ]
    ]);
    return $http_response;
});
