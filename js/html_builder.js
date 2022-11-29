function get_section_card(title, description, section_id){
    var html = `<a href="pages/section.html?section=${section_id}">`;
    html += `<div class="card text-white bg-secondary mb-3"><h5 class="card-header">${title}</h5>`;
    html += `<div class="card-body">`;
    // html += `<h5 class="card-title">${title}</h5>`;
    html += `<p class="card-text">${description}</p></div></div></a><hr />`;

    return html;
}


function get_thread_card(title, description, section_id){
    var html = `<a href="#">`
    html += `<div class="card text-white bg-secondary mb-3"><h5 class="card-header">${title}</h5>`;
    html += `<div class="card-body">`;
    // html += `<h5 class="card-title">${title}</h5>`;
    html += `<p class="card-text">${description}</p></div></div></a><hr />`;

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
