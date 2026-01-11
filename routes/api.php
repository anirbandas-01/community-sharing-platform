Route::post('/register','AuthController@register');

Route::post('/tools', [ToolController::class, 'index']);
Route::post('/tools', [ToolController::class, 'store']);