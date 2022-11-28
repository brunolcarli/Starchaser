function get_section_card(title, description, section_id){
    var html = `<a href="#">`
    html += `<div class="card text-white bg-secondary mb-3"><h5 class="card-header">${title}</h5>`;
    html += `<div class="card-body">`;
    // html += `<h5 class="card-title">${title}</h5>`;
    html += `<p class="card-text">${description}</p></div></div></a><hr />`;

    return html;
}



function resolve_forum_sections(){
    get_forum_sections().then(sections => {
        console.log(sections);
        let sections_listing = document.getElementById('SECTIONS');
        let card = '<hr /><h3 align="center">Sections</h3><hr />';
        for (let i in sections){
            var title = sections[i]['name'];
            var description = sections[i]['description'];
            var section_id = sections[i]['id'];
            card += get_section_card(title, description, section_id);
        }
        sections_listing.innerHTML = card;
    });
}
