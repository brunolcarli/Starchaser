

function resolve_forum_sections(){
    get_forum_sections().then(sections => {
        let sections_listing = document.getElementById('SECTIONS');
        let card = '';
        for (let i in sections){
            var title = sections[i]['name'];
            var description = sections[i]['description'];
            var section_id = sections[i]['id'];
            card += get_section_card(title, description, section_id);
        }
        sections_listing.innerHTML = card;
    });
}


function get_url_path_param(param_name){
    // Get current URL path
    var curr_path = location['href'];
    // Check if param was informed
    if (!curr_path.includes(param_name)){
        // Redirect to homepage if param was not given
        alert('Invalid param!');
        // window.location.href = '../index.html';
        return;
    }

    // slice the path string starting from first char after the param name
    var param = curr_path.slice(
        curr_path.indexOf(param_name)+param_name.length
    );

    // Validate if the param value is a integer
    var valid_param = param.match('\\d*');

    if (!valid_param){
        // If no value was identified, redirect to homepage
        alert('Invalid page request!');
        window.location.href = '../index.html';
        return;
    }

    // Return the param value is exists
    if (!valid_param[0]){
        alert('Invalid page request!');
        window.location.href = '../index.html';
        return;
    }
    return valid_param[0];
}


function resolve_section(){
    var section_id = get_url_path_param('section=');
    get_section_data(section_id).then(section_data => {
        var section_div = document.getElementById('SECTION_NAME');
        section_div.innerHTML = '';

        var threads_div = document.getElementById('THREADS');
        threads_div.innerHTML = '<hr />';
        var threads = section_data['threads'];

        // Adds section title
        build_new_thread_modal(section_id);
        section_div.innerHTML += build_title_container(section_data['name']);
        section_div.innerHTML += build_caption_container(section_data['description']);
        // section_div.innerHTML += '<div><button type="button" class="btn btn-dark" data-toggle="modal" data-target="#NewThreadModal">New Thread</button></div>';

        // If no threads are open, inform that the section has no threads
        if (!threads.length){
            threads_div.innerHTML = build_title_container(
                "This section has no threads yet..."
            );
            return;
        }

        // otherwise, list this section threads
        for (let i in  threads){
            threads_div.innerHTML += get_thread_card(threads[i]);
        }
    });
}


function resolve_thread(){
    var thread_id = get_url_path_param('thread=');
    get_thread_data(thread_id).then(thread_data => {
        var thread_div = document.getElementById('THREAD_NAME');
        thread_div.innerHTML = '';

        var posts_div = document.getElementById('POSTS');
        posts_div.innerHTML = '<hr />';
        var posts = thread_data['posts'];

        // Adds thread title
        thread_div.innerHTML += build_thread_content_container(thread_data);

        for (let i in  posts){
            posts_div.innerHTML += get_post_card(posts[i]);
        }

    });
}


// TODO: this could be a util module tool
function sanitize_text_input(text){
    // If text contain newlines, should onvert to html format (Graphql issues)
    text = text.replaceAll('\n', '<br />');
    
    // If text contain doublequotes, should switch to single quote (Graphql issues)
    text = text.replaceAll('"', "'");

    // Replace common BBCode usd in combat reports
    text = text.replaceAll('[align=center]', "<div align='center'>");
    text = text.replaceAll('[/align]', '</div>');
    text = text.replaceAll('[color=#ff0000]', "<span style='color:#ff0000'>");
    text = text.replaceAll('[color=#fc850c]', "<span style='color:#fc850c'>");
    text = text.replaceAll('[color=#008000]', "<span style='color:#008000'>");
    text = text.replaceAll('[color=#1c84be]', "<span style='color:#1c84be'>");
    text = text.replaceAll('[color=#3183e7]', "<span style='color:#3183e7'>");
    text = text.replaceAll('[/color]', "</span>");
    text = text.replaceAll('[b]', "<b>");
    text = text.replaceAll('[/b]', "</b>");
    text = text.replaceAll('[i]', "<i>");
    text = text.replaceAll('[/i]', "</i>");
    text = text.replaceAll('[size=14]', "<span style='font-size:14px'>");
    text = text.replaceAll('[size=16]', "<span style='font-size:16px'>");
    text = text.replaceAll('[size=10]', "<span style='font-size:10px'>");
    text = text.replaceAll('[/size]', "</span>");
    text = text.replaceAll('[url=https://ogotcha.universeview.be/en]', "<a href='https://ogotcha.universeview.be/en'>");
    text = text.replaceAll('[/url]', "</a>");

    return text;
}


function resolve_thread_reply(){
    var credentials = JSON.parse(localStorage.getItem('USER_TOKEN'));    
    if (!credentials){
        alert('Log to reply!');
        return;
    }

    var content = document.getElementById('ThreadReplyPostContent').value;
    var modal = document.getElementById('ThreadReplyModal');
    if (!content.trim()){
        alert('Content is required!');
        modal.click('Cancel');
        return;
    }
    var thread_id = modal.getAttribute('thread_id');

    refresh_user_token(credentials['token']).then(response => {
        refresh_session(credentials['username'], response['token']);
        credentials = JSON.parse(localStorage.getItem('USER_TOKEN'));
        var authorization = `Bearer ${credentials['token']}`;
        var input_data = ` { content: \\\"${sanitize_text_input(content)}\\\" `;
        input_data += `threadId: \\\"${thread_id}\\\" `;
        input_data += `username: \\\"${credentials['username']}\\\" }`;
        create_post_mutation(input_data, authorization).then(response => {
            console.log(response);
            if (!response){
                alert('Server request failed!');
                modal.click('Cancel');
                return;
            }
            window.location.href = location;
        });
    });
}

// User resolvers
function resolve_user_signup(){
    var email = document.getElementById('SignUpInputEmail').value;
    var username = document.getElementById('SignUpInputUsername').value;
    var password = document.getElementById('SignUpInputPassword').value;
    var bio = document.getElementById('SignUpInputBio').value;
    var avatar = document.getElementById('SignUpInputAvatar').value;

    if (!email.trim() || !username.trim() || !password.trim()){
        alert('Missing required fields.');
        return;
    }
    if (avatar.trim()) {
        if (!avatar.startsWith('https://') && !avatar.startsWith('http://')){
            alert('Avatar must be a link address to a picture.');
            return;
        }
    }

    if (!bio.trim()){
        bio = '...';
    }

    // build input payload
    var input_data = ` { username: \\\"${username}\\\" `;
    input_data += ` email: \\\"${email}\\\" `;
    input_data += ` password: \\\"${password}\\\" `;
    input_data += ` bio: \\\"${bio}\\\" `;
    if (avatar.trim()){
        input_data += ` avatar: \\\"${avatar}\\\" }`;
    } else {
        input_data += ' } ';
    }

    create_user_mutation(input_data).then(response => {
       if ('errors' in response){
        alert(response['errors'][0]['message']);
        return;
       }
       alert('Registered!');
       window.location.href = '../index.html';
       return;
    });
}


function resolve_users_list(){
    var curr_path = location['href'];
    if (curr_path.includes('user=')){
        var user_id = get_url_path_param('user=');
        if (user_id){
            resolve_user(user_id);
            return;
        }
    }

    get_users().then(response => {
        let users_listing = document.getElementById('USERS_LISTING');
        let card = '';
        for (let i in response){
            card += get_user_card(response[i]);
        }
        users_listing.innerHTML = card;
    });
}


function resolve_user(user_id){
    var user_div = document.getElementById('USER_VIEW');
    user_div.innerHTML = '';
    get_user_data(user_id).then(user_data => {
        if (!user_data){
            alert('Invalid page request!');
            window.location.href = '../index.html';
            return;
        }
        var user_html = build_user_view_container(user_data);
        user_div.innerHTML = user_html;
    });
}


//
function resolve_create_thread(){
    var credentials = JSON.parse(localStorage.getItem('USER_TOKEN'));    
    if (!credentials){
        alert('Log to create thread!');
        return;
    }

    var title = document.getElementById('NewThreadTitle').value;
    var content = document.getElementById('NewThreadContent').value;
    var modal = document.getElementById('NewThreadModal');

    if (!title.trim()){
        alert('Title is required!');
        modal.click('Cancel');
        return;
    }

    if (!content.trim()){
        alert('Content is required!');
        modal.click('Cancel');
        return;
    }
    var section_id = modal.getAttribute('section_id');
    refresh_user_token(credentials['token']).then(response => {
        refresh_session(credentials['username'], response['token']);
        credentials = JSON.parse(localStorage.getItem('USER_TOKEN'));
        var authorization = `Bearer ${credentials['token']}`;
        var input_data = ` { content: \\\"${sanitize_text_input(content)}\\\" `;
        input_data += `title: \\\"${title}\\\" `;
        input_data += `sectionId: \\\"${section_id}\\\" `;
        input_data += `username: \\\"${credentials['username']}\\\" }`;
        create_thread_mutation(input_data, authorization).then(response => {
            console.log(response);
            if ('errors' in response){
                alert(response['errors'][0]['message']);
                modal.click('Cancel');
                return;
            }
            
            window.location.href = location;
        });
    });   
}
