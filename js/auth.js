function refresh_session(username, token){
    localStorage.setItem(
        'USER_TOKEN',
        JSON.stringify({username: username, token: token})
    );
}


function is_logged(){
    var user_data = JSON.parse(localStorage.getItem('USER_TOKEN'));
    if (!user_data){
        alert('Session expired or not logged!');
        localStorage.clear();
        window.location.href = '../index.html';
        return
    }
    refresh_user_token(user_data['token']).then(response => {
        refresh_session(user_data['username'], response['token']);
    });
}


function log_in(){
    let username = document.getElementById('username_login_input').value;
    let password = document.getElementById('password_login_input').value;
    return login_mutation(username, password).then(data => {
        let token = data['token'];
        if (!token){
            alert('Wrong username or password!');
            localStorage.clear();
            window.location.href = 'index.html';
            return
        }
        refresh_session(username, token);
        alert(`Authenticated for user ${username}`);
    });
}