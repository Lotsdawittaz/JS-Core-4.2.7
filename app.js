// PREREQUISITES


// setting up selectors
const repos = document.querySelectorAll('.repo-item');
const repoTexts = document.querySelectorAll('.text');
const searchField = document.querySelector('.search-field');
const searchResults = document.querySelectorAll('.search-value');
const searchValueTexts = document.querySelectorAll('.search-value__text');
const repoList = document.querySelector('.repo-list');
const button = document.querySelector('.button');
// search bar text
let fieldValue = '';
// set of results and repos
let list = [];
let repo = [];
// debounce
const debounce = (fn, debounceTime) => {
    let debouncing;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(debouncing);
      debouncing = setTimeout(() => fn.apply(context, args), debounceTime);
    }
};

// FUNCTIONS

// actual searching
async function search(value, cb) {
    let result = []
    try {
        result = await fetch(`https://api.github.com/search/repositories?q=${value}&per_page=5`)
                        .then((res) => res.json());
        repo = result.items;
        list = repo.map((el) => el.name);
        cb(list);
    } catch (err) {
        console.log(err.message);
    }
}
// show results
function showResults(list) {
    searchResults.forEach((block, i) => {
        block.style.display = "block";
        searchValueTexts[i].innerHTML = list[i];
    });
}
// clear search bar
function clearField() {
    searchResults.forEach((block) => {
        block.style.display = "none";
    })
    fieldValue = '';
    searchField.value = '';
}
// push results to the list on click
searchResults.forEach((e, i) => {
    searchValueTexts[i].innerHTML = list[i];
    searchResults[i].addEventListener('click', function(e) {
        e.preventDefault();
        const elem = document.createElement('div');
        const textElem = document.createElement('div');
        const deleteElem = document.createElement('div');
        elem.classList.add('repo-item');
        textElem.classList.add('text');
        deleteElem.classList.add('exit');
        elem.appendChild(textElem);
        elem.appendChild(deleteElem);
        repoList.appendChild(elem);
        deleteElem.innerHTML = `<img src="./cross.svg" onclick="this.parentNode.parentNode.remove()">`
        textElem.innerHTML = `
            <p>Name: <a href="${repo[i].html_url}">${repo[i].name}</a></p>
            <p>Owner: ${repo[i].owner.login}</p>
            <p>Stars: ${repo[i].watchers}</p>
        `;
        clearField();
    })
})
// run search on input change
const debFn = debounce(async () => await search(fieldValue, showResults), 1000);
searchField.addEventListener('input', (e) => {
    fieldValue = e.target.value;
    if (fieldValue) {
        debFn();
    } else {
        clearField();
    }
})