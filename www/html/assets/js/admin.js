function check_score(elm) {
    if (trim_space(elm.value).length == 0) {
        show_error(elm, "Please input this!");
        trun_red(elm);
    } else if (check_number_bad_chars(trim_space(elm.value)) == false) {
        show_error(elm, "Invalid input! Only numbers are allowed!");
        trun_red(elm);
    } else {
        trun_gray(elm);
        hide_tooltip(elm);
    }
}

function check_challenge_name_bad_chars(challenge_name) {
    return check_bad_chars(challenge_name, "");
}

function challenge_keyup(elm, msg) {
    if (trim_space(elm.value).length == 0) {
        show_error(elm, "Please input " + msg + "!");
        trun_red(elm);
    } else if (check_challenge_name_bad_chars(trim_space(elm.value)) == false) {
        show_error(elm, "Invalid " + msg + "!");
        trun_red(elm);
    } else {
        trun_gray(elm);
        hide_tooltip(elm);
    }
}

function challenge_blur(elm, msg) {
    if (trim_space(elm.value).length == 0) {
        show_error(elm, "Please input " + msg + "!");
        trun_red(elm);
    } else if (check_challenge_name_bad_chars(trim_space(elm.value)) == false) {
        show_error(elm, "Invalid " + msg + "!");
        trun_red(elm);
    } else {
        trun_gray(elm);
        hide_tooltip(elm);
    }
    /*else if (msg == 'challenge name') {
            if (elm.id == 'admin-challenge-update-name') {
        elm.oldval = elm.value;
    } else {
        check_challenge_name_existed(trim_space(elm.value));
    }
        } */
}

function disable_challenge_button() {
    $("#create-challenge").css("background-color", "grey").attr("disabled", "disabled");
    $("#update-challenge").css("background-color", "grey").attr("disabled", "disabled");
}

function release_challenge_button() {
    $("#create-challenge").css("background-color", "#2f889a").removeAttr("disabled");
    $("#update-challenge").css("background-color", "#2f889a").removeAttr("disabled");
}

function check_challenge_name_existed(challenge_name) {
    $.ajax({
        type: "POST",
        url: "/admin/challenge/check/name",
        dataType: "json",
        data: {
            "challenge_name": challenge_name
        },
        success: function(msg) {
            if (msg.status == 0) {
                show_error($(".admin-challenge-name"), "Challenge name has existed!");
                trun_red($(".admin-challenge-name"));
            } else {
                trun_gray($(".admin-challenge-name"));
                hide_tooltip($(".admin-challenge-name"));
            }
        }
    });
}

function load_users() {
    var container = $(".content-container");
    container.html('');
    var url = "/admin/user/all";
    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        beforeSend: function() {
            NProgress.start();
        },
        complete: function() {
            NProgress.done();
        },
        success: function(msg) {
            if (msg.status == 1) {
                var available = {
                    'user_id': 'ID',
                    'username': 'Username',
                    'email': 'Email',
                    'phone': 'Phone',
                    'regist_time': 'Registe Time',
                    'regist_ip': 'Registe IP',
                    'actived': 'Actived',
                    'user_type': 'Admin',
                    'ban': 'Ban',
                };
                var available_keys = Object.keys(available);
                var user_info = msg.value;
                var checkbox = ['actived', 'user_type', 'ban'];
                var html = '';
                html += '<nav class="navbar navbar-default" role="navigation">';
                html += '<div class="container-fluid"><div class="navbar-header">';
                html += '<a class="navbar-brand" href="#">Users</a></div></div></nav>';
                html += '<div class="table-responsive admin-users"><table class="table table-hover">';
                html += '<thead><tr>';
                for (var i = 0; i < available_keys.length; i++) {
                    html += '<th><span class="admin-users-key">' + available[available_keys[i]] + '</th>';
                }
                html += '<th><span class="admin-users-key">' + 'Delete' + '</th>';
                html += '</span></tr></thead><tbody>';
                for (var i = 0; i < user_info.length; i++) {
                    html += '<tr>';
                    for (var j = 0; j < available_keys.length; j++) {
                        html += '<td>';
                        if (available_keys.length - j > 3) {
                            html += '<span class="admin-users-value">';
                            if (j == 4) {
                                html += TimeStamp2Date(user_info[i][available_keys[j]]);
                            } else {
                                html += user_info[i][available_keys[j]];
                            }
                            html += '</span>';
                        } else {
                            html += '<input class="admin-users-value-checkbox ';
                            if (j == 6) {
                                html += 'actived-checkbox';
                            } else if (j == 7) {
                                html += 'admin-checkbox';
                            } else if (j == 8) {
                                html += 'ban-checkbox';
                            }
                            html += '" type="checkbox" ';
                            if (user_info[i][available_keys[j]] == 1) {
                                html += 'checked';
                            }
                            html += '/>';
                        }
                        html += '</td>';
                    }
                    html += '<td><input class="admin-users-del" type="button" value="Delete"/></td>';
                    html += '</tr>';
                }
                html += '</tbody></table></div>';
                container.html(html);
                flush_data();
                $('.admin-users-value-checkbox').on('click', function() {
                    var check = 0;
                    var user_id = $(this).parent().parent().children('td:first-child').text();
                    if (this.checked == true) {
                        check = 1;
                    }
                    var type = '';
                    if ($(this).hasClass('actived-checkbox')) {
                        type = 'actived';
                    } else if ($(this).hasClass('admin-checkbox')) {
                        type = 'usertype';
                    } else if ($(this).hasClass('ban-checkbox')) {
                        type = 'ban';
                    }
                    $.ajax({
                        type: 'POST',
                        url: '/admin/user/update/' + user_id,
                        dataType: 'json',
                        data: {
                            'type': type,
                            'value': check
                        },
                        beforeSend: function() {
                            NProgress.start();
                        },
                        complete: function() {
                            NProgress.done();
                        },
                        success: function(msg) {
                            if (msg.status == 1) {
                                show_pnotify("Update success!", msg.message, "success");
                            } else {
                                show_pnotify("Update failed!", msg.message, "error");
                            }
                        }
                    });
                });
                $('.admin-users-del').on('click', function() {
                    var user_id = $(this).parent().parent().children('td:first-child').text();
                    win.confirm(
                        'warrning',
                        'Do you really want to delete this user?',
                        function(r) {
                            if (r == false) return;
                            $.ajax({
                                url: '/admin/user/delete/' + user_id,
                                type: 'GET',
                                dataType: 'json',
                                beforeSend: function() {
                                    NProgress.start();
                                },
                                complete: function() {
                                    NProgress.done();
                                },
                                success: function(msg) {
                                    if (msg.status == 1) {
                                        show_pnotify("Delete success!", msg.message, "success");
                                        load_users();
                                    } else {
                                        show_pnotify("Delete failed!", msg.message, "error");
                                    }
                                }
                            });
                        }
                    );
                });
            }
        }
    });
}

function load_items() {
    var container = $(".content-container");
    container.html('');
    html = '<div class="admin-challenge"><nav class="navbar navbar-default" role="navigation"><div class="container-fluid">';
    html += '<div class="navbar-header"><a class="navbar-brand" href="#">Goods</a></div>';
    html += '<div><button type="button" class="admin-challenge-create btn btn-default navbar-btn">Create</button></div></div></nav></div>';
    var url = '/items';
    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        beforeSend: function() {
            NProgress.start();
        },
        complete: function() {
            NProgress.done();
        },
        success: function(msg) {
            var available = {
                'item_id': 'ID',
                'name': 'Name',
                'description': 'Description',
                'number': 'Number',
                'price': 'Price',
                'amount': 'Amount',
                'type': 'Type',
                'size': 'Size',
                'add_time': 'Add Time',
                'active': 'Online'
            };
            var available_keys = Object.keys(available);
            var challenge_info = msg.items;
            var checkbox = ['active'];
            html += '<div class="table-responsive admin-items"><table class="table table-hover">';
            html += '<thead><tr>';
            for (var i = 0; i < available_keys.length; i++) {
                html += '<th><span class="admin-items-key">' + available[available_keys[i]] + '</th>';
            }
            // html += '<th><span class="admin-items-key">' + 'Edit' + '</th>';
            html += '<th><span class="admin-items-key">' + 'Delete' + '</th>';
            html += '</span></tr></thead><tbody>';
            if (challenge_info != null) {
                for (var i = 0; i < challenge_info.length; i++) {
                    challenge_info[i].add_time = TimeStamp2Date(challenge_info[i].add_time);
                    html += '<tr>';
                    for (var j = 0; j < available_keys.length; j++) {
                        html += '<td>';
                        if (available_keys.length - j > 1) {
                            html += '<span class="admin-items-value">';
                            html += challenge_info[i][available_keys[j]];
                            html += '</span>';
                        } else {
                            html += '<input class="admin-items-value-checkbox online-checkbox" type="checkbox" ';
                            if (challenge_info[i][available_keys[j]] == 1) {
                                html += 'checked';
                            }
                            html += '/>';
                        }
                        html += '</td>';
                    }
                    // html += '<td><input class="admin-items-edit" type="button" value="Edit"/></td>';
                    html += '<td><input class="admin-items-del" type="button" value="Delete"/></td>';
                    html += '</tr>';
                }
            }
            html += '</tbody></table></div>';
            container.html(html);
            flush_data();

            $('.admin-challenge-name').keyup(function() {
                challenge_keyup(this, 'challenge name');
            });
            $('.admin-challenge-name').blur(function() {
                challenge_blur(this, 'challenge name');
            });
            $('.admin-challenge-description').keyup(function() {
                challenge_keyup(this, 'description');
            });
            $('.admin-challenge-description').blur(function() {
                challenge_blur(this, 'description');
            });
            $('.admin-challenge-score').keyup(function() {
                check_score(this);
            });
            $('.admin-challenge-score').blur(function() {
                check_score(this);
            });
            $('.admin-challenge-resource').keyup(function() {
                challenge_keyup(this, 'resource');
            });
            $('.admin-challenge-resource').blur(function() {
                challenge_blur(this, 'resource');
            });
            $('.admin-challenge-flag').keyup(function() {
                challenge_keyup(this, 'flag');
            });
            $('.admin-challenge-flag').blur(function() {
                challenge_blur(this, 'flag');
            });

            $('.admin-items-value-checkbox').on('click', function() {
                var url = '';
                var challenge_id = $(this).parent().parent().children('td:first-child').text();
                if (this.checked == true) {
                    url = '/admin/challenge/online/';
                } else {
                    url = '/admin/challenge/offline/';
                }
                $.ajax({
                    type: 'GET',
                    url: url + challenge_id,
                    dataType: 'json',
                    beforeSend: function() {
                        NProgress.start();
                    },
                    complete: function() {
                        NProgress.done();
                    },
                    success: function(msg) {
                        if (msg.status == 1) {
                            show_pnotify("Update success!", msg.message, "success");
                        } else {
                            show_pnotify("Update failed!", msg.message, "error");
                        }
                    }
                });
            });
            // $('.admin-items-edit').on('click', function() {
            //     var online = $(this).parent().parent().children('td:nth-child(13)').children()[0].checked;
            //     if (online == true) {
            //         show_pnotify("Error!", "Please offline this challenge before update it!", "error");
            //     } else {
            //         var challenge_id = $(this).parent().parent().children('td:first-child').text();
            //         var name = $(this).parent().parent().children('td:nth-child(2)').text();
            //         var description = $(this).parent().parent().children('td:nth-child(3)').text();
            //         var resource = $(this).parent().parent().children('td:nth-child(4)').text();
            //         var flag = $(this).parent().parent().children('td:nth-child(5)').text();
            //         var score = $(this).parent().parent().children('td:nth-child(6)').text();
            //         var type = $(this).parent().parent().children('td:nth-child(7)').text();
            //         $('#admin-challenge-update-name')[0].value = name;
            //         $('#admin-challenge-update-type-select').value = type;
            //         $('#admin-challenge-update-resource')[0].value = resource;
            //         $('#admin-challenge-update-description')[0].value = description;
            //         $('#admin-challenge-update-score')[0].value = score;
            //         $('#admin-challenge-update-flag')[0].value = flag;
            //         $('.admin-items-update-modal').addClass('is-visible');
            //         $('.admin-update-challenge').submit(function(e) {
            //             e.preventDefault();
            //             if ($('.admin-items-update-modal').hasClass('is-visible') == false) return;
            //             var id = challenge_id;
            //             var name_new = e.target.children[0].children[2].value;
            //             var description_new = e.target.children[1].children[1].value;
            //             var type_new = e.target.children[2].children[1].children[2].value;
            //             var score_new = e.target.children[3].children[2].value;
            //             var resource_new = e.target.children[4].children[2].value;
            //             var flag_new = e.target.children[5].children[2].value;
            //             update_item(id, name_new, description_new, type_new, score_new, resource_new, flag_new);
            //         });
            //     }
            // });
            $('.admin-items-del ').on('click', function() {
                var challenge_id = $(this).parent().parent().children('td:first-child').text();
                win.confirm(
                    'Warring',
                    'Do you really want to delete this challenge?',
                    function(r) {
                        if (r == false) return;
                        $.ajax({
                            url: '/admin/challenge/delete/' + challenge_id,
                            type: 'GET',
                            dataType: 'json',
                            beforeSend: function() {
                                NProgress.start();
                            },
                            complete: function() {
                                NProgress.done();
                            },
                            success: function(msg) {
                                if (msg.status == 1) {
                                    show_pnotify("Success!", msg.message, "success");
                                    load_items();
                                } else {
                                    show_pnotify("Failed!", msg.message, "error");
                                }
                            }
                        });
                    }
                );
            });
            $('.admin-challenge-create').on('click', function() {
                $('.admin-items-create-modal').addClass('is-visible');
            });
        }
    });
}

function create_item(name, number, price, amount, type, size, description, active) {
    var formData = new FormData();
    formData.append("name", name);
    formData.append("number", number);
    formData.append("price", price);
    formData.append("amount", amount);
    formData.append("type", type);
    formData.append("size", size);
    formData.append("description", description);
    formData.append("active", active);
    formData.append('avatar', $('#item-avatar')[0].files[0]);
    console.log(formData);
    $.ajax({
        type: "POST",
        url: "/items/set_item",
        cache: false,
        processData: false,
        contentType: false,
        data: formData,
        beforeSend: function() {
            $('.admin-items-create-modal').removeClass('is-visible');
            NProgress.start();
        },
        complete: function() {
            NProgress.done();
        },
        success: function(msg) {
            msg = JSON.parse(msg);
            if (msg.status == 1) {
                show_pnotify("Success!", msg.message, "success");
                load_items();
            } else {
                show_pnotify("Failed!", msg.message, "error");
            }
        }
    });
}

function update_item(id, name, description, type, score, resource, flag) {
    $.ajax({
        url: '/admin/items/update/' + id,
        type: 'POST',
        dataType: 'json',
        data: {
            'name': name,
            'description': description,
            'type': type,
            'score': score,
            'resource': resource,
            'flag': flag
        },
        beforeSend: function() {
            $('.admin-items-update-modal').removeClass('is-visible');
            NProgress.start();
        },
        complete: function() {
            NProgress.done();
        },
        success: function(msg) {
            if (msg.status == 1) {
                show_pnotify("Success!", msg.message, "success");
                load_items();
            } else {
                show_pnotify("Failed!", msg.message, "error");
            }
        }
    });
}

$(document).ready(function() {
    $(".admin-create-challenge").submit(function(e) {
        e.preventDefault();
        var name = e.target.children[0].children[2].value;
        var description = e.target.children[1].children[1].value;
        var type = e.target.children[2].children[1].children[2].value;
        var number = e.target.children[3].children[2].value;
        var amount = e.target.children[4].children[2].value;
        var price = e.target.children[5].children[2].value;
        var size = e.target.children[7].children[2].value;
        var active = 0;
        if (e.target.children[8].children[1].checked == true) {
            active = 1;
        }
        create_item(name, number, price, amount, type, size, description, active);
    });
});

function get_username_by_user_id(user_id) {
    var url = '/admin/user/get_name/' + user_id;
    var username = '';
    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        async: false,
        beforeSend: function() {
            NProgress.start();
        },
        complete: function() {
            NProgress.done();
        },
        success: function(msg) {
            if(msg.status == 1) {
                username = msg.value;
                console.log(username);
            }
        }
    });
    return username;
}

function load_orders(){
    var container = $(".content-container");
    container.html('');
    html = '<div class="admin-challenge"><nav class="navbar navbar-default" role="navigation"><div class="container-fluid">';
    html += '<div class="navbar-header"><a class="navbar-brand" href="#">Orders</a></div>';
    html += '</div></nav></div>';
    var url = '/admin/order/all';
    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        beforeSend: function() {
            NProgress.start();
        },
        complete: function() {
            NProgress.done();
        },
        success: function(msg) {
            var available = {
                'order_id': 'ID',
                'user_id': 'User',
                'item_id': 'Item',
                'amount': 'Amount',
                'rcv_name': 'Receiver',
                'rcv_address': 'Address',
                'rcv_phone': 'Phone',
                'status': 'Status',
                'time': 'Add Time'
            };
            var available_keys = Object.keys(available);
            var order_info = msg.items;
            html += '<div class="table-responsive admin-items"><table class="table table-hover">';
            html += '<thead><tr>';
            for (var i = 0; i < available_keys.length; i++) {
                html += '<th><span class="admin-items-key">' + available[available_keys[i]] + '</th>';
            }
            html += '<th><span class="admin-items-key">' + 'Confirm' + '</th>';
            html += '<th><span class="admin-items-key">' + 'Delete' + '</th>';
            html += '</span></tr></thead><tbody>';
            if (order_info != null) {
                for (var i = 0; i < order_info.length; i++) {
                    order_info[i].time = TimeStamp2Date(order_info[i].time);
                    order_info[i].user_id = get_username_by_user_id(order_info[i].user_id );
                    order_info[i].item_id = get_item_number_by_item_id(order_info[i].item_id);
                    if (order_info[i].status == 0) {
                        order_info[i].status = '待发货'
                    } else {
                        order_info[i].status = '已发货'
                    }
                    html += '<tr>';
                    for (var j = 0; j < available_keys.length; j++) {
                        html += '<td>';
                        html += '<span class="admin-items-value">';
                        html += order_info[i][available_keys[j]];
                        html += '</span>';
                        html += '</td>';
                    }
                    html += '<td><input class="admin-orders-cfm admin-items-edit" type="button" value="Confirm"/></td>';
                    html += '<td><input class="admin-orders-del admin-items-del" type="button" value="Delete"/></td>';
                    html += '</tr>';
                }
            }
            html += '</tbody></table></div>';
            container.html(html);
            flush_data();

            $('.admin-orders-cfm').on('click', function() {
                var order_id = $(this).parent().parent().children('td:first-child').text();
                win.confirm(
                    'Warring',
                    'Confirm this order?',
                    function(r) {
                        if (r == false) return;
                        $.ajax({
                            url: '/admin/order/confirm/' + order_id,
                            type: 'GET',
                            dataType: 'json',
                            beforeSend: function() {
                                NProgress.start();
                            },
                            complete: function() {
                                NProgress.done();
                            },
                            success: function(msg) {
                                if (msg.status == 1) {
                                    show_pnotify("Success!", msg.message, "success");
                                    load_orders();
                                } else {
                                    show_pnotify("Failed!", msg.message, "error");
                                }
                            }
                        });
                    }
                );
            });

            $('.admin-orders-del').on('click', function() {
                var order_id = $(this).parent().parent().children('td:first-child').text();
                win.confirm(
                    'Warring',
                    'Do you really want to delete this order?',
                    function(r) {
                        if (r == false) return;
                        $.ajax({
                            url: '/admin/order/delete/' + order_id,
                            type: 'GET',
                            dataType: 'json',
                            beforeSend: function() {
                                NProgress.start();
                            },
                            complete: function() {
                                NProgress.done();
                            },
                            success: function(msg) {
                                if (msg.status == 1) {
                                    show_pnotify("Success!", msg.message, "success");
                                    load_orders();
                                } else {
                                    show_pnotify("Failed!", msg.message, "error");
                                }
                            }
                        });
                    }
                );
            });
        }
    });
}