/*############################################################

                   Requests module

This module contain the http requests to necessary backend(s)
to collect the required data that will be structured into
correct formats to be displayed in this website.

@beelzebruno (2022)

############################################################*/

///////////////////////////////////
//
//           Endpoints
//
///////////////////////////////////


const URL = 'https://ogamepvtforum.brunolcarli.repl.co/graphql/';


///////////////////////////////////
//
//   General request support tools
//
///////////////////////////////////


function json(response) {
    /*Convert response into json format */
    return response.json();
}


function get_request_options(payload){
  /* Returns the request method, headers, content... */
  return {
    method: 'POST',
    headers: {
      cookie: 'csrftoken=pgrjljBkHdbd9hySxmJaFUlewPM1IdYJ09nZstz9N6bCf8pfuctT4ftl2girhj6t',
      'Content-Type': 'application/json'
    },
    body: payload
  };
}


///////////////////////////////////
//
//      Query requests
//
///////////////////////////////////

function get_forum_sections(){
    const payload = '{"query": "query { sections { id name description } }"}';
    const options = get_request_options(payload);
    return fetch(URL, options)
    .then(json)
    .then(response => {
        return response['data']['sections'];
    })
    .catch(err => {
        console.error(err);
    });
}


function get_section_data(section_id){
    const payload = `{"query": "query { section(id: ${section_id}){ name description threads { id title content createdBy{ id username } openDate lastPostDatetime closed  } } }"}`;
    const options = get_request_options(payload);
    return fetch(URL, options)
    .then(json)
    .then(response => {
        return response['data']['section'];
    })
    .catch(err => {
        console.error(err);
    });
}

