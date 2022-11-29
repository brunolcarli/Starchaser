function get_section_card(title, description, section_id){
    var html = `<a href="pages/section.html?section=${section_id}">`;
    html += `<div class="card text-white bg-secondary mb-3"><h5 class="card-header">${title}</h5>`;
    html += `<div class="card-body">`;
    html += `<p class="card-text">${description}</p></div></div></a><hr />`;

    return html;
}


function get_thread_card(thread_data){
    var thread_creator = thread_data['createdBy'];
    var creator = `<a href="users.html?user=${thread_creator['id']}">${thread_creator['username']}</a>`;

    var last_update = thread_data['lastPostDatetime'];
    if (!last_update){
        last_update = thread_data["openDate"];
    }

    var html = `<a href="thread.html?thread=${thread_data['id']}"><div class="card text-white bg-secondary mb-3">`;
    html += '<div class="row g-0"><div class="col-md-4">';
    html += `<img src="..." class="img-fluid rounded-start" alt="..."></div>`;
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

    var html = `<div class="card text-white bg-secondary mb-3">`;
    html += '<div class="row g-0"><div class="col-md-4">';
    html += `<img src="..." class="img-fluid rounded-start" alt="..."></div>`;
    html += '<div class="col-md-8"><div class="card-body">';
    html += `<p class="card-text">${post_data["content"]}</p>`;
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


function build_thread_content_container(thread_data){
    var thread_creator = thread_data['createdBy'];
    var creator = `<a href="users.html?user=${thread_creator['id']}">${thread_creator['username']}</a>`;
    return `
    <div class="card bg-secondary mb-3">
        <h5 class="card-header">${thread_data['title']}</h5>
        <div class="card-body">
            <h5 class="card-title">By: ${creator}</h5>
            <p class="card-text">${thread_data['content']}</p>
            <p class="card-text"><small class="text-white">${thread_data["openDate"]}</small></p>
            <a class="btn btn-dark">Reply</a>
        </div>
    </div> 
    `;
}
