// use this file to populate content in the html.
var bookmarks = new Set()
var oldtags = []
 
function log(userevent,data){
  fetch('/log',{
    method:'POST',
    headers: {
    'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "id": userdetails.id ? userdetails.id: null,
      'log':{
        "time": Date.now(),
        "event": userevent,
        "data": data,
        "id": userdetails.id ? userdetails.id: null
      }
    })
  }).catch((error) => {
    console.error("Error:", error)
  })
}
//populate the div for the examples cards with the examples
function createExampleCards(examples){
  var exampleCards = document.getElementById("examplecards")
  while(exampleCards.firstChild){
    exampleCards.removeChild(exampleCards.firstChild);
  }

  if (examples.length ==0){
    exampleCards.innerHTML = "No results returned for search parameters"
  }
  //generate the html for each imagecard and append to the examplecards
  i=0
  var div =div = document.createElement('div')
  div.className ="row"
  while (i < examples.length){
    shortDesc = examples[i].description.split(" ").slice(0,10).join(" ")
    tags = examples[i].tag
    altimg = "/static/images/sample-1.jpeg"

    var subdiv = document.createElement('div')
    source = ""
    subdiv.className = "col s12 m6 l3"
    subdiv.innerHTML += '<div class="card sticky-action">'+
        '<div class="card-image-pop">'+
          '<div class="card-image waves-effect waves-block waves-light"  id="wholeCard">'+
            '<img class="activator" id="'+examples[i].filename+'" src="/static/examples_png/'+examples[i].filename+'" alt="missing image">'+
          '</div>'+
          '<div class="card-content">'+
            // '<span class="card-title activator grey-text text-darken-4"><i class="material-icons right extext" id="'+examples[i].filename+'">more_vert</i></span>'+
            // '<p><a id="'+examples[i].filename+'" href="/static/ExampleFiles/'+examples[i].filename+'" target="_blank">Example source</a></p>'+
            // '<p><a id="'+examples[i].filename+'" onclick=expandExample("'+String(examples[i].filename)+'") target="_blank">Example source</a></p>'+
            '<p><a class ="modal-trigger" id="'+examples[i].filename+'" href="#bookmarkModal" data-id="'+examples[i].filename+'">'+examples[i].filename.slice(0, -4)+'</a></p>'+
            // '<p><a id="'+examples[i].filename+'" onclick=expandExample("'+String(examples[i].filename)+'","'+String(examples[i].source)+'")>' +examples[i].filename.slice(0, -4)+ '</a></p>'+
          '</div>'+
        '</div>'+
          // '<div class="card-reveal">'+
          //   '<span class="card-title grey-text text-darken-4"><i class="material-icons right extext">close</i></span>'+
          //   '<p>'+examples[i].description+'</p>'+
          // '</div>'+
          '<div class="card-action">'+
            // '<a href="javascript:void(0)"><i class="material-icons bk" id="bk_'+examples[i].filename+'">bookmark_border</i></a>'+
            '<div class="search-chip">'+
                tags
              +'<i class=" material-icons"></i>'+
            '</div>'
          '</div>'+        
        '</div>'
      
    div.appendChild(subdiv)
  
    //if fourth element in div then append to examplecards div and then reset.
    if (div.childElementCount == 4 || i==examples.length-1){
      exampleCards.appendChild(div)
      div = document.createElement('div')
      div.className ="row"
    }
    i++;
  }
   //add logging for viewed examples
  //  logImageViews()
}


function clearEndContent(){
  document.getElementById("wiz").style.display = "block"
  document.getElementById("thanks").style.display = "none"
  setTimeout((d) =>{
    window.location ="https://umdsurvey.umd.edu/jfe/form/SV_9QE1EIwCCXCcsQe"
  }, 0.2*60000)
  
}

function readMore(element){
  id = element.id.slice(-1)
  paragraph = document.getElementById("desc"+id)
  text = document.getElementById("more"+id)
  readless = document.getElementById("readlessBtn"+id)
  if (paragraph.style.display != "none"){
    paragraph.style.display = "none"
    text.style.display="inline"
    readless.style.display="inline"
  }else{
    text.style.display="none"
    readless.style.display="none"
    paragraph.style.display = "inline"
  }
}

function expandExample(filename, link){
  log("clicked on example source", filename);
  console.log('clicked on example source', filename)
  // window.open("/scratch/"+filename+"/", "_blank");
  window.open(link, "_blank")
}

function initiateChips(data){
  //fetch tags for autocomplete
  var tags = [];
    fetch('/tags')
    .then((response) => response.json())
    .then((d) => {
      tags = d
       // set inital placeholder values for chips
      $('.chips-initial').chips({
        data: data,
        autocompleteOptions:{
          data: d,
          limit: Infinity,
          minLength: 1
        },
        onChipDelete: (e,d) =>{
          chip =d.childNodes[0].textContent
          log("removing tag", chip)
          var selectedtags = Array()
          $("input:checkbox[type=checkbox]:checked").each(function(){
            selectedtags.push($(this).val());
            //uncheck item
            if ($(this).val() == chip){
              $(this).prop("checked", false);
            }
            
          });
          var chipsData = M.Chips.getInstance($('.chips')).chipsData;
          chipsData.forEach(e =>{
            selectedtags.push(e.tag)
          })
          selectedtags = selectedtags.filter(function(value, index, arr){
            return value != chip;
          })
          
          //set chips
          chips = Array();
            i=0 
            while (i < selectedtags.length){
              chips.push(
                {
                  tag:selectedtags[i]
                }
              )
              i++
            }
          oldtags = selectedtags
          fetchExamples(selectedtags)
        },
        onChipAdd: (e,d) =>{
          var selectedtags = Array()
          var chipsData = M.Chips.getInstance($('.chips')).chipsData;
          chipsData.forEach(e =>{
            selectedtags.push(e.tag)
          })

          $("input:checkbox[type=checkbox]").each(function(){
            //check item
            if (selectedtags.includes($(this).val())){
              $(this).prop("checked", true);
            }
            
          });
          
          log('adding tag', getDifference(oldtags, selectedtags)[0])
          
          oldtags = selectedtags
          fetchExamples(selectedtags)
        }
      });
    })
    .catch((error) => {
      console.error("Error:", error)
    })
}
function fetchExamples(selectedtags){
  log("fetching example set", Array(selectedtags).join(","))
   //get images that match tags form backend
   fetch('/examples', {
    method:'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'tags': selectedtags
    })
  })
  .then((response) => response.json())
  .then((data) => {
    createExampleCards(data)
  })
  .catch((error) => {
    console.error("Error:", error)
  })
}

function formSubmission(){
  var selectedtags
  var form = document.querySelector("form")
  form.addEventListener('change', (e) =>{
    selectedtags = Array();
    $("input:checkbox[type=checkbox]:checked").each(function(){
      selectedtags.push($(this).val());
    });
    var deletedTag
    if (oldtags.length > selectedtags.length){
      deletedTag = getDifference(selectedtags, oldtags)[0]
    }
    if (oldtags.length < selectedtags.length){
      log('adding tag', getDifference(oldtags, selectedtags)[0])
    }
    var chipsData = M.Chips.getInstance($('.chips')).chipsData;
    chipsData.forEach(e =>{ 
      if (e.tag == deletedTag){
        log('removing tag', e.tag)
      }else{
        if (!selectedtags.includes(e.tag)){
          selectedtags.push(e.tag)
        }
      }
       
    })
    //set chips
    chips = Array();
      i=0 
      while (i < selectedtags.length){
        chips.push(
          {
            tag:selectedtags[i]
          }
        )
        i++
      }
    console.log('selected chips', chips)
    oldtags = selectedtags
    initiateChips(chips)
    fetchExamples(selectedtags)
  })
}

function getDifference(setA, setB) {
  return setB.filter(x => !setA.includes(x));
}

function initializeModal(){
  $(document).ready(function(){
    $('.modal').modal();
  });

  $(document).ready(function(){
    $('#bookmarkModal').modal({
      onOpenStart: function(modal, trigger){
        log("opened bookmarks", "")
        
        bookmarkModal(trigger.id)
      }
    });
  });
       
}
function bookmarkModal(id){
  var exampleCards = document.getElementById("bkModalContentsvg")
  // clear previous  content
  while(exampleCards.firstChild){
    exampleCards.removeChild(exampleCards.firstChild);
  }

  fetch("/static/examples/"+id.replace("png", "svg"))
  .then(r=> r.text())
  .then((text)=>{
    displaySVG(text)
    // console.log("svg retrieved")
  } )
  
  fetch("/static/annotations/"+id.replace("png", "json"))
  .then(r=> r.text())
  .then((text)=>{
    try {
      $('#json-display').jsonViewer(JSON.parse(text))
    } catch (error) {
      j = '{"file": "missing"}'
      $('#json-display').jsonViewer(JSON.parse(j), {collasped: false})
    }
    // $('#json-display').jsonViewer(JSON.parse(text), {collasped: false}) //https://github.com/abodelot/jquery.json-viewer
  } )

}

function addBookmark(d){
  id = d.split("_")[1]
  if (bookmarks.has(id)){
    bookmarks.delete(id)
    document.getElementById(d).innerText="bookmark_border"
    log("removing bookmark", id)
  }else{
    bookmarks.add(id)
    document.getElementById(d).innerText="bookmark"
    log("adding bookmark", id)
  }
}

// function logImageViews(){
//   //log hover over image
//   document.querySelectorAll(".activator").forEach(item =>{
//     item.addEventListener("mouseover", (d)=>{
//       log("hover over example", d.target.id)
//     })
//   })
  
//   // //log click on example source
//   // document.addEventListener('click', e =>{
//   //   const origin = e.target.closest('a');
//   //   if (origin.id)
//   //     console.log("expand example", origin.id)
//   //     log("clicked on example source", origin.id);
//   // })

//   //log click on example description
//   document.querySelectorAll(".extext").forEach(item =>{
//     item.addEventListener("click", (d)=>{
//       if (d.target.id)
//       log("viewed example description", d.target.id);
//     })
//   })

//   // add onclick for bookmarks
//   document.querySelectorAll('i[class*="bk"]').forEach(item =>{
//     item.addEventListener("click", (d)=>{
//       if (d.target.id)
//        addBookmark(d.target.id)
//     })
//   })
// }

//main function that initializes the main page. 
function init (){
 
    // $(document).ready(function(){
    //   $('.collapsible').collapsible();
    // });

    document.addEventListener('DOMContentLoaded', function () {
      var elems = document.querySelector('.collapsible');
      var instances = M.Collapsible.init(elems);
      instances.open();

      //load all the tags and initialize chips
    });

  //initialize modal
  initializeModal()

  //create placeholder chips
  formSubmission()
  
  //add all examples
  fetchExamples('all')
  initiateChips([])

 
}

init()

//  TODO: 
// 1) add a timer for participants in the timing condition. The example set navigation and screen will be disabled for the first 5 minutes. After which the example button will be made available for them.
  // questions: should the experimenter interrupt and then explain the next step of instructions? should they be made aware of the example (and interface) at all or until this point of the experiment
