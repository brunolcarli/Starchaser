

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
        window.location.href = '../index.html';
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
        section_div.innerHTML += build_title_container(section_data['name']);
        section_div.innerHTML += build_caption_container(section_data['description']);

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


function sanitize_text_input(text){
    // If text contain newlines, should onvert to html format (Graphql issues)
    text = text.replaceAll('\n', '<br />');
    
    // If text contain doublequotes, should switch to single quote (Graphql issues)
    text = text.replaceAll('"', "'");

    return text;
}


function resolve_thread_reply(){
    var content = document.getElementById('ThreadReplyPostContent').value;
    var modal = document.getElementById('ThreadReplyModal');
    if (!content.trim()){
        alert('Content is required!');
        modal.click('Cancel');
        return;
    }
    var thread_id = modal.getAttribute('thread_id');
    var credentials = JSON.parse(localStorage.getItem('USER_TOKEN'));
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
