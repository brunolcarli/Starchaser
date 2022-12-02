function get_section_card(title, description, section_id){
    var html = `<a href="pages/section.html?section=${section_id}">`;
    html += `<div class="card text-white bg-info mb-3"><h5 class="card-header">${title}</h5>`;
    html += `<div class="card-body bg-dark">`;
    html += `<p class="card-text">${description}</p></div></div></a><hr />`;

    return html;
}


function get_user_card(user_data){
    var user_id = user_data['id'];
    var username = user_data['username'];
    var user_href = `<a href="users.html?user=${user_id}">${username}</a>`;
    var avatar = user_data['avatar'];
    var bio = user_data['bio'];
    if (!avatar){
        avatar = 'https://www.baxterip.com.au/wp-content/uploads/2019/02/anonymous.jpg';
    }

    var html = `<div class="card text-white bg-secondary mb-3">`;
    html += '<div class="row g-0"><div class="col-md-2">';
    html += `<img src="${avatar}" class="img-thumbnail rounded-start" style="max-width: 100px;"></div>`;
    html += `<div class="col-md-8"><h5 class="card-header">${user_href}</h5>`;
    html += `<div class="card-body"><p class="card-text">${bio}</p>`;
    html += '</div></div></div></div><hr />';

    return html;
}


function get_thread_card(thread_data){
    var thread_creator = thread_data['createdBy'];
    var creator = `<a href="users.html?user=${thread_creator['id']}">${thread_creator['username']}</a>`;
    var avatar = thread_creator['avatar'];
    if (!avatar){
        avatar = 'https://www.baxterip.com.au/wp-content/uploads/2019/02/anonymous.jpg';
    }
    var last_update = thread_data['lastPostDatetime'];
    if (!last_update){
        last_update = thread_data["openDate"];
    }

    var html = `<a href="thread.html?thread=${thread_data['id']}"><div class="card text-white bg-secondary mb-3">`;
    html += '<div class="row g-0"><div class="col-md-4">';
    html += `<img src="${avatar}" class="img-thumbnail rounded-start" style="max-width: 100px;"></div>`;
    html += '<div class="col-md-8"><div class="card-body">';
    html += `<h5 class="card-title">${thread_data["title"]}</h5></a>`;
    html += `<p class="card-text">${thread_data["content"].slice(0, 150)}...</p>`;
    html += `<p class="card-text"><small class="text-white">Created by: ${creator} on ${thread_data["openDate"]}`;
    html += `<hr/> Last updated ${last_update}</small></p>`;
    html += '</div></div></div></div><hr />';

    return html;
}


function get_post_card(post_data){
    var post_creator = post_data['user'];
    var creator = `<a href="users.html?user=${post_creator['id']}">${post_creator['username']}</a>`;
    var avatar = post_creator['avatar'];
    if (!avatar){
        avatar = 'https://www.baxterip.com.au/wp-content/uploads/2019/02/anonymous.jpg';
    }

    var content = markdown.toHTML(post_data['content'].replaceAll('<br />', '\n'));

    var html = `<div class="card text-white bg-secondary mb-3">`;
    html += '<div class="row g-0"><div class="col-md-2">';
    html += `<img src="${avatar}" class="img-thumbnail rounded-start" style="max-width: 100px;"></div>`;
    html += '<div class="col-md-8"><div class="card-body">';
    html += `<p class="card-text">${content}</p>`;
    html += `<p class="card-text"><small class="text-white">Created by: ${creator} on ${post_data["datetime"]}`;
    html += '</small></p></div></div></div></div><hr />';

    return html;
}


function build_title_container(title){
    return `
    <section class="bg-dark py-4">
      <h3 class="text-light" style="text-align: center; margin-bottom: 0">
        ${title}
      </h3>
    </section>
    `;
}


function build_caption_container(text){
    return `
    <figure>
        <figcaption class="blockquote-footer">
            ${text}
        </figcaption>
    </figure>
    `;
}


function build_thread_reply_modal(thread_id){
    var modal_html = document.getElementById('THREAD_REPLY');
    modal_html.innerHTML = `
    <div class="modal fade" id="ThreadReplyModal" thread_id="${thread_id}" tabindex="-1" role="dialog" aria-labelledby="ThreadReplyModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
            <h5 class="modal-title" id="ThreadReplyModalLabel">Post reply</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            </div>
            <div class="modal-body">
                <textarea class="form-control" id="ThreadReplyPostContent" rows="5"></textarea>
            </div>
            <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-dark" onclick="resolve_thread_reply()">Confirm</button>
            </div>
        </div>
        </div>
    </div>
    `
}


function build_new_thread_modal(section_id){
    var modal_html = document.getElementById('NEW_THREAD');
    modal_html.innerHTML = `
    <div class="modal fade" id="NewThreadModal" section_id="${section_id}" tabindex="-1" role="dialog" aria-labelledby="NewThreadModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
            <h5 class="modal-title" id="NewThreadModalLabel">New Thread</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            </div>
            <div class="modal-body">
                <input type="text" class="form-control" id="NewThreadTitle" placeholder="Title" required></text>
            </div>
            <div class="modal-body">
                <textarea class="form-control" id="NewThreadContent" rows="5" placeholder="Content..." required></textarea>
            </div>
            <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-dark" onclick="resolve_create_thread()">Confirm</button>
            </div>
        </div>
        </div>
    </div>
    <div><button type="button" class="btn btn-secondary" data-toggle="modal" data-target="#NewThreadModal">New Thread</button></div>
    `;
}


function build_thread_content_container(thread_data){
    build_thread_reply_modal(thread_data['id']);
    var thread_creator = thread_data['createdBy'];
    var creator = `<a href="users.html?user=${thread_creator['id']}">${thread_creator['username']}</a>`;
    var content = thread_data['content'].replaceAll("'", '"');

    return `
    <div class="card bg-secondary mb-3">
        <h5 class="card-header">${thread_data['title']}</h5>
        <div class="card-body bg-dark mb-3 text-white">
            <h5 class="card-title">By: ${creator}</h5>
            <p class="card-text" id="thread_content_view">${content}</p>
            <p class="card-text"><small class="text-white">${thread_data["openDate"]}</small></p>
            <button type="button" class="btn btn-dark" data-toggle="modal" data-target="#ThreadReplyModal">Reply</button>
        </div>
    </div>
    `;
}
