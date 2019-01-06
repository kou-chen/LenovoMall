<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
| -------------------------------------------------------------------------
| URI ROUTING
| -------------------------------------------------------------------------
| This file lets you re-map URI requests to specific controller functions.
|
| Typically there is a one-to-one relationship between a URL string
| and its corresponding controller class/method. The segments in a
| URL normally follow this pattern:
|
|	example.com/class/method/id/
|
| In some instances, however, you may want to remap this relationship
| so that a different class/function is called than the one
| corresponding to the URL.
|
| Please see the user guide for complete details:
|
|	https://codeigniter.com/user_guide/general/routing.html
|
| -------------------------------------------------------------------------
| RESERVED ROUTES
| -------------------------------------------------------------------------
|
| There are three reserved routes:
|
|	$route['default_controller'] = 'welcome';
|
| This route indicates which controller class should be loaded if the
| URI contains no data. In the above example, the "welcome" class
| would be loaded.
|
|	$route['404_override'] = 'errors/page_missing';
|
| This route will tell the Router which controller/method to use if those
| provided in the URL cannot be matched to a valid route.
|
|	$route['translate_uri_dashes'] = FALSE;
|
| This is not exactly a route, but allows you to automatically route
| controller and method names that contain dashes. '-' isn't a valid
| class or method name character, so it requires translation.
| When you set this option to TRUE, it will replace ALL dashes in the
| controller and method URI segments.
|
| Examples:	my-controller/index	-> my_controller/index
|		my-controller/my-method	-> my_controller/my_method
*/


/* Users */
$route['user'] = 'page/index';
$route['user/login'] = 'user/login';
$route['user/register'] = 'user/register';
$route['user/logout'] = 'user/logout';

$route['user/update'] = 'user/update_user_info';
$route['user/info'] = 'user/get_personal_information';

$route['user/check/username'] = 'user/check_username_existed';
$route['user/check/email'] = 'user/check_email_existed';
$route['user/check/captcha'] = 'user/check_captcha_current';

$route['user/get_captcha'] = 'user/get_captcha';

$route['user/active/(:any)'] = 'user/active';

//$route['user/(:any)'] = 'page/index';

/* Admin */
$route['admin/user/all'] = 'user/get_all_user_info';
$route['admin/user/update/(:num)'] = 'user/update_status';
$route['admin/user/delete/(:num)'] = 'user/delete_user';

/*Items*/
$route['items'] = 'item/items';
$route['items/(:num)']='item/finditemById/$1';
$route['items/deleteItemById/(:num)']='item/deleteItemById/$1';
$route['items/set_item']='item/set_item';
$route['items/update_itemNameById/(:num)']='item/update_itemNameById/$1';
$route['items/surplusDecrease/(:num)']='item/surplusDecrease/$1';
$route['items/get_itemsInCart']='item/get_itemsInCart';

/* Index */

$route['(:any)'] = 'page/index';
$route['default_controller'] = 'page/index';
$route['404_override'] = '';
$route['translate_uri_dashes'] = FALSE;
